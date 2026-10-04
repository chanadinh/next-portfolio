import assert from 'node:assert/strict';
import { after, before, test, mock } from 'node:test';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NextRequest } from 'next/server';
import { ADMIN_COOKIE, createAdminToken } from '../lib/admin-auth';
import { DEFAULT_LINKEDIN_URL, MAX_RESUME_BYTES } from '../lib/profile-types';

let mongo: MongoMemoryServer;
let profile: typeof import('../app/api/admin/profile/route');
let upload: typeof import('../app/api/admin/profile/resume/route');
let resume: typeof import('../app/resume/route');
let linkedin: typeof import('../app/linkedin/route');
let Profile: typeof import('../models/ProfileSettings').default;
let pdf: Buffer;
const origin = 'https://chandinh.dev';

function request(path: string, method = 'GET', body?: BodyInit, authenticated = true, extra: Record<string, string> = {}) {
  return new NextRequest(origin + path, { method, headers: { ...(authenticated ? { cookie: `${ADMIN_COOKIE}=${createAdminToken()}` } : {}), ...extra }, body });
}
function patch(body: unknown, extra = {}) { return profile.PATCH(request('/api/admin/profile', 'PATCH', JSON.stringify(body), true, extra)); }
function uploadRequest(bytes: Uint8Array, name = 'resume.pdf', type = 'application/pdf') {
  const form = new FormData(); form.set('file', new File([new Uint8Array(bytes)], name, { type }));
  return request('/api/admin/profile/resume', 'POST', form);
}
const currentPdf = async () => Buffer.from(await (await resume.GET(request('/resume', 'GET', undefined, false))).arrayBuffer());

before(async () => {
  process.env.ADMIN_USERNAME = 'profile-test-admin';
  process.env.ADMIN_PASSWORD = 'a-strong-test-password';
  process.env.JWT_SECRET = 'test-only-secret-at-least-thirty-two-characters-long';
  process.env.APP_ORIGIN = origin;
  mongo = await MongoMemoryServer.create({ instance: { dbName: 'portfolio_profile_tests' } });
  process.env.MONGODB_URI = mongo.getUri();
  profile = await import('../app/api/admin/profile/route');
  upload = await import('../app/api/admin/profile/resume/route');
  resume = await import('../app/resume/route');
  linkedin = await import('../app/linkedin/route');
  Profile = (await import('../models/ProfileSettings')).default;
  pdf = await readFile(new URL('../public/resume.pdf', import.meta.url));
});
after(async () => { mock.restoreAll(); await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('profile reads and writes require a signed session and reject cross-origin changes', async () => {
  assert.equal((await profile.GET(request('/api/admin/profile', 'GET', undefined, false))).status, 401);
  assert.equal((await profile.PATCH(request('/api/admin/profile', 'PATCH', '{}', false))).status, 401);
  assert.equal((await upload.POST(request('/api/admin/profile/resume', 'POST', undefined, false))).status, 401);
  assert.equal((await patch({ linkedinUrl: DEFAULT_LINKEDIN_URL }, { origin: 'https://evil.example' })).status, 403);
  assert.equal((await upload.POST(request('/api/admin/profile/resume', 'POST', undefined, true, { origin: 'https://evil.example' }))).status, 403);
});

test('a fresh installation exposes the existing PDF and LinkedIn defaults', async () => {
  const response = await profile.GET(request('/api/admin/profile'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { linkedinUrl: DEFAULT_LINKEDIN_URL, resumeUrl: '/resume', resume: null });
  const fallback = await resume.GET(request('/resume'));
  assert.equal(fallback.status, 307); assert.equal(fallback.headers.get('location'), origin + '/resume.pdf');
  assert.equal(fallback.headers.get('cache-control'), 'no-store');
  assert.equal((await linkedin.GET()).headers.get('location'), DEFAULT_LINKEDIN_URL);
});

test('LinkedIn saves canonical profile links and rejects unrelated hosts, paths and fields', async () => {
  const saved = await patch({ linkedinUrl: 'linkedin.com/in/chan-dinh-updated/?trk=profile#about' });
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).linkedinUrl, 'https://www.linkedin.com/in/chan-dinh-updated');
  const redirect = await linkedin.GET();
  assert.equal(redirect.headers.get('location'), 'https://www.linkedin.com/in/chan-dinh-updated');
  assert.equal(redirect.headers.get('cache-control'), 'no-store');
  for (const value of ['', 'javascript:alert(1)', 'https://linkedin.com.evil.example/in/chan', 'https://linkedin.com@evil.example/in/chan', 'https://www.linkedin.com/company/example', 'https://linkedin.com/in/a%2fb', 'https://linkedin.com:444/in/chan', null]) assert.equal((await patch({ linkedinUrl: value })).status, 400, String(value));
  assert.equal((await patch({ linkedinUrl: DEFAULT_LINKEDIN_URL, resumeData: 'injected' })).status, 400);
  assert.equal((await profile.PATCH(request('/api/admin/profile', 'PATCH', '{broken'))).status, 400);
  assert.equal((await linkedin.GET()).headers.get('location'), 'https://www.linkedin.com/in/chan-dinh-updated');
});

test('PDF upload persists exact bytes, keeps LinkedIn, and replaces the public download immediately', async () => {
  const result = await upload.POST(uploadRequest(pdf, 'July résumé.pdf'));
  assert.equal(result.status, 200);
  const metadata = await result.json();
  assert.equal(metadata.resume.filename, 'July résumé.pdf');
  assert.equal(metadata.resume.size, pdf.length);
  assert.equal(metadata.linkedinUrl, 'https://www.linkedin.com/in/chan-dinh-updated');
  assert.equal(metadata.resumeData, undefined);
  assert.deepEqual(await currentPdf(), pdf);
  const secondPdf = Buffer.concat([pdf, Buffer.from('\n')]);
  assert.equal((await upload.POST(uploadRequest(secondPdf, 'new-resume.pdf'))).status, 200);
  const download = await resume.GET(request('/resume'));
  assert.equal(download.status, 200);
  assert.equal(download.headers.get('content-type'), 'application/pdf');
  assert.equal(download.headers.get('cache-control'), 'no-store');
  assert.equal(download.headers.get('x-content-type-options'), 'nosniff');
  assert.match(download.headers.get('content-disposition')!, /Chan-Dinh-Resume.pdf/);
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), secondPdf);
  assert.equal((await Profile.findById('portfolio'))?.resumeData, undefined);
});

test('invalid or oversized uploads preserve the previous résumé, including without Content-Length', async () => {
  const before = await currentPdf();
  assert.equal((await upload.POST(uploadRequest(Buffer.from('<html>not a pdf</html>')))).status, 400);
  assert.equal((await upload.POST(uploadRequest(pdf, 'resume.html', 'text/html'))).status, 400);
  assert.equal((await upload.POST(uploadRequest(Buffer.alloc(MAX_RESUME_BYTES + 1), 'large.pdf'))).status, 413);
  const hugeBody = new Uint8Array(MAX_RESUME_BYTES + 64 * 1024 + 1);
  const chunked = request('/api/admin/profile/resume', 'POST', hugeBody, true, { 'content-type': 'multipart/form-data; boundary=test' });
  assert.equal(chunked.headers.get('content-length'), null);
  assert.equal((await upload.POST(chunked)).status, 413);
  assert.equal((await upload.POST(request('/api/admin/profile/resume', 'POST', 'broken', true, { 'content-type': 'multipart/form-data; boundary=test' }))).status, 400);
  assert.deepEqual(await currentPdf(), before);
});

test('concurrent link and résumé saves preserve both fields in one profile', async () => {
  const results = await Promise.all([patch({ linkedinUrl: 'https://www.linkedin.com/in/latest-chan' }), upload.POST(uploadRequest(pdf, 'latest.pdf'))]);
  assert.ok(results.every(response => response.status === 200));
  const saved = await (await profile.GET(request('/api/admin/profile'))).json();
  assert.equal(saved.linkedinUrl, 'https://www.linkedin.com/in/latest-chan');
  assert.equal(saved.resume.filename, 'latest.pdf');
  assert.equal(await Profile.countDocuments(), 1);
  assert.deepEqual(await currentPdf(), pdf);
});

test('missing storage has public defaults and explicit admin errors; database failures do not silently serve stale files', async () => {
  const uri = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;
  try {
    assert.equal((await profile.GET(request('/api/admin/profile'))).status, 503);
    assert.equal((await patch({ linkedinUrl: DEFAULT_LINKEDIN_URL })).status, 503);
    assert.equal((await upload.POST(uploadRequest(pdf))).status, 503);
    assert.equal((await resume.GET(request('/resume'))).headers.get('location'), origin + '/resume.pdf');
    assert.equal((await linkedin.GET()).headers.get('location'), DEFAULT_LINKEDIN_URL);
  } finally { process.env.MONGODB_URI = uri; }
  const failure = mock.method(Profile, 'findById', () => { throw new Error('Storage unavailable'); });
  try {
    assert.equal((await profile.GET(request('/api/admin/profile'))).status, 503);
    assert.equal((await resume.GET(request('/resume'))).status, 503);
    assert.equal((await linkedin.GET()).status, 503);
  } finally { failure.mock.restore(); }
  assert.deepEqual(await currentPdf(), pdf);
});
