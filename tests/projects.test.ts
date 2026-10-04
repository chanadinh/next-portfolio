import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ADMIN_COOKIE, createAdminToken, verifyAdminToken } from '../lib/admin-auth';

let mongo: MongoMemoryServer;
let list: typeof import('../app/api/projects/route');
let detail: typeof import('../app/api/projects/[id]/route');
let importer: typeof import('../app/api/admin/github/import/route');
let discovery: typeof import('../app/api/admin/github/repositories/route');
let Project: typeof import('../models/Project').default;
const originalFetch = globalThis.fetch;
let repoName = 'sample-repo';
let githubStatus = 200;
let readmeMissing = false;
let owner = 'test-owner';
let privateRepo = false;

function request(path: string, method = 'GET', body?: unknown, authenticated = false, extra: Record<string,string> = {}) {
  return new NextRequest(`https://chandinh.dev${path}`, {
    method, headers: { ...(authenticated ? { cookie: `${ADMIN_COOKIE}=${createAdminToken()}` } : {}), ...extra },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
const context = (id: string) => ({ params: Promise.resolve({ id }) });

before(async () => {
  process.env.ADMIN_USERNAME = 'test-admin';
  process.env.ADMIN_PASSWORD = 'a-strong-test-password';
  process.env.JWT_SECRET = 'test-only-secret-at-least-thirty-two-characters-long';
  process.env.GITHUB_USERNAME = 'test-owner';
  process.env.APP_ORIGIN = 'https://chandinh.dev';
  mongo = await MongoMemoryServer.create({ instance: { dbName: 'portfolio_import_tests' } });
  process.env.MONGODB_URI = mongo.getUri();
  list = await import('../app/api/projects/route');
  detail = await import('../app/api/projects/[id]/route');
  importer = await import('../app/api/admin/github/import/route');
  discovery = await import('../app/api/admin/github/repositories/route');
  Project = (await import('../models/Project')).default;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.ok(url.startsWith('https://api.github.com/'), `Unexpected network access: ${url}`);
    assert.equal(init?.redirect, 'error');
    if (githubStatus !== 200) return new Response('{}', { status: githubStatus, headers: { 'x-ratelimit-remaining': '0', 'retry-after': '60' } });
    if (url.includes('/readme')) return readmeMissing ? new Response('{}', { status: 404 }) : Response.json({ encoding: 'base64', content: Buffer.from('# README\n<script>untrusted()</script>').toString('base64') });
    if (url.includes('/languages')) return Response.json({ TypeScript: 800, Python: 200 });
    const repository = { id: 12345, name: repoName, full_name: `${owner}/${repoName}`, description: 'Source description', html_url: `https://github.com/${owner}/${repoName}`, homepage: 'https://example.com/demo', language: 'TypeScript', topics: ['ai'], stargazers_count: 12, fork: false, archived: false, private: privateRepo, pushed_at: '2026-07-01T00:00:00Z', owner: { login: owner } };
    return url.includes('/users/') ? Response.json([repository], { headers: { link: '<https://api.github.com/users/test-owner/repos?page=2>; rel="next"' } }) : Response.json(repository);
  };
});
after(async () => { globalThis.fetch = originalFetch; await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('admin login verifies credentials, uses HttpOnly cookies, and rejects cross-origin writes', async () => {
  const login = await import('../app/api/admin/login/route');
  const credentials = { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD };
  assert.equal((await login.POST(request('/api/admin/login', 'POST', credentials, false, { origin: 'https://evil.example' }))).status, 403);
  assert.equal((await login.POST(request('/api/admin/login', 'POST', { ...credentials, password: 'wrong' }))).status, 401);
  const response = await login.POST(request('/api/admin/login', 'POST', credentials));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie')!, /HttpOnly/i);
  assert.match(response.headers.get('set-cookie')!, /SameSite=strict/i);
  assert.equal((await response.json()).token, undefined);
  assert.ok(verifyAdminToken(createAdminToken()));
  assert.equal(verifyAdminToken(jwt.sign({ role: 'admin' }, 'wrong-key')), false);
  assert.equal(verifyAdminToken(jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { issuer: 'portfolio-admin', audience: 'portfolio-dashboard', subject: 'test-admin', expiresIn: -1 })), false);
  const session = await import('../app/api/admin/session/route');
  assert.equal((await session.GET(request('/api/admin/session', 'GET', undefined, true))).status, 200);
  const logout = await import('../app/api/admin/logout/route');
  assert.match((await logout.POST(request('/api/admin/logout', 'POST', undefined, true))).headers.get('set-cookie')!, /Max-Age=0/i);
  const password = process.env.ADMIN_PASSWORD; delete process.env.ADMIN_PASSWORD;
  assert.equal((await login.POST(request('/api/admin/login', 'POST', credentials))).status, 503);
  process.env.ADMIN_PASSWORD = password;
});

test('project writes, admin discovery, and private lists require a signed session', async () => {
  assert.equal((await list.GET(request('/api/projects?view=admin'))).status, 401);
  assert.equal((await list.POST(request('/api/projects', 'POST', { title: 'No' }))).status, 401);
  assert.equal((await detail.PUT(request('/api/projects/invalid', 'PUT', {}), context('invalid'))).status, 401);
  assert.equal((await detail.DELETE(request('/api/projects/invalid', 'DELETE'), context('invalid'))).status, 401);
  assert.equal((await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345 }))).status, 401);
  assert.equal((await discovery.GET(request('/api/admin/github/repositories'))).status, 401);
  assert.equal((await list.POST(request('/api/projects', 'POST', {}, true, { origin: 'https://evil.example' }))).status, 403);
  const upload = await import('../app/api/upload/route');
  assert.equal((await upload.POST(request('/api/upload', 'POST'))).status, 401);
});

test('GitHub discovery paginates and import creates a private draft with languages and README', async () => {
  const repositories = await discovery.GET(request('/api/admin/github/repositories', 'GET', undefined, true));
  assert.equal(repositories.status, 200);
  assert.equal((await repositories.json()).hasNext, true);
  const response = await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345, status: 'published' }, true));
  assert.equal(response.status, 200);
  const draft = await response.json();
  assert.equal(draft.status, 'draft');
  assert.deepEqual(draft.technologies, ['TypeScript','Python']);
  assert.match(draft.github.readme, /<script>/);
  assert.deepEqual(await (await list.GET(request('/api/projects'))).json(), []);
  assert.equal((await detail.GET(request(`/api/projects/${draft._id}`), context(draft._id))).status, 404);
  assert.equal((await detail.GET(request(`/api/projects/${draft._id}?view=admin`, 'GET', undefined, true), context(draft._id))).status, 200);
});

test('publication validates content; updates cannot change server-owned import identity', async () => {
  const draft = await Project.findOne({ githubRepoId: 12345 }).lean();
  const id = String(draft!._id);
  assert.equal((await detail.PUT(request(`/api/projects/${id}`, 'PUT', { status: 'published' }, true), context(id))).status, 400);
  assert.equal((await detail.PUT(request(`/api/projects/${id}`, 'PUT', { liveUrl: 'javascript:alert(1)' }, true), context(id))).status, 400);
  assert.equal((await detail.PUT(request(`/api/projects/${id}`, 'PUT', { liveUrl: '//evil.example' }, true), context(id))).status, 400);
  assert.equal((await detail.PUT(request(`/api/projects/${id}`, 'PUT', { liveUrl: '/\t/evil.example' }, true), context(id))).status, 400);
  const response = await detail.PUT(request(`/api/projects/${id}`, 'PUT', { title: 'Curated title', description: 'My own story', imageUrl: '/images/digit.png', role: 'Built the model', outcomes: 'Measured on a held-out test set.', technicalDecisions: 'Chose a simple baseline.', technologies: ['Custom stack'], status: 'published', featured: true, order: 5, githubRepoId: 999, github: { readme: 'forged' } }, true), context(id));
  assert.equal(response.status, 200);
  const edited = await response.json();
  assert.equal(edited.githubRepoId, 12345);
  assert.notEqual(edited.github.readme, 'forged');
  const visible = await (await list.GET(request('/api/projects?placement=work'))).json();
  assert.equal(visible.length, 1);
  assert.equal(visible[0].github, undefined);
});

test('repeat import and repo rename preserve all editorial fields without duplicates', async () => {
  repoName = 'renamed-repo';
  const response = await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345 }, true));
  const refreshed = await response.json();
  assert.equal(refreshed.github.name, 'renamed-repo');
  assert.equal(refreshed.title, 'Curated title');
  assert.equal(refreshed.description, 'My own story');
  assert.equal(refreshed.imageUrl, '/images/digit.png');
  assert.equal(refreshed.role, 'Built the model');
  assert.equal(refreshed.technicalDecisions, 'Chose a simple baseline.');
  assert.equal(refreshed.outcomes, 'Measured on a held-out test set.');
  assert.deepEqual(refreshed.technologies, ['Custom stack']);
  assert.equal(refreshed.status, 'published'); assert.equal(refreshed.order, 5); assert.equal(refreshed.featured, true);
  assert.equal(await Project.countDocuments({ githubRepoId: 12345 }), 1);
});

test('concurrent imports deduplicate by repository ID; legacy links attach without replacing copy', async () => {
  const { importRepository } = await import('../lib/github-import');
  const existing = await Project.findOne({ githubRepoId: 12345 }).lean();
  const snapshot = { ...existing!.github!, repoId: 54321, htmlUrl: 'https://github.com/test-owner/concurrent' };
  await Promise.all(Array.from({ length: 4 }, () => importRepository(snapshot)));
  assert.equal(await Project.countDocuments({ githubRepoId: 54321 }), 1);
  const legacy = await Project.collection.insertOne({ title: 'Legacy story', description: 'Keep me', imageUrl: '/images/digit.png', technologies: [], githubUrl: 'https://github.com/test-owner/legacy.git', featured: true, order: 8 });
  const attached = await importRepository({ ...snapshot, repoId: 65432, htmlUrl: 'https://github.com/test-owner/legacy' });
  assert.equal(String(attached!._id), String(legacy.insertedId));
  assert.equal(attached!.title, 'Legacy story');
  assert.equal(attached!.status, undefined);
  const publicProjects = await (await list.GET(request('/api/projects'))).json();
  assert.ok(publicProjects.some((p: { title: string }) => p.title === 'Legacy story'));
});

test('hidden projects disappear from list and direct URL; published playground has its own collection', async () => {
  const project = await Project.findOne({ githubRepoId: 12345 }).lean(); const id = String(project!._id);
  await detail.PUT(request(`/api/projects/${id}`, 'PUT', { status: 'hidden' }, true), context(id));
  assert.equal((await detail.GET(request(`/api/projects/${id}`), context(id))).status, 404);
  const visible = await (await list.GET(request('/api/projects'))).json();
  assert.ok(!visible.some((p: { _id: string }) => p._id === id));
  await detail.PUT(request(`/api/projects/${id}`, 'PUT', { status: 'published', placement: 'playground' }, true), context(id));
  assert.equal((await (await list.GET(request('/api/projects?placement=playground'))).json()).length, 1);
  const work = await (await list.GET(request('/api/projects?placement=work'))).json();
  assert.ok(!work.some((p: { _id: string }) => p._id === id));
});

test('GitHub failure, missing README, and private or foreign repositories behave safely', async () => {
  githubStatus = 429;
  const limited = await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345 }, true));
  assert.equal(limited.status, 429); assert.equal(limited.headers.get('retry-after'), '60');
  githubStatus = 200; owner = 'someone-else';
  assert.equal((await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345 }, true))).status, 403);
  owner = 'test-owner'; privateRepo = true;
  assert.equal((await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345 }, true))).status, 403);
  privateRepo = false; readmeMissing = true;
  const result = await importer.POST(request('/api/admin/github/import', 'POST', { repoId: 12345 }, true));
  assert.equal(result.status, 200); assert.equal((await result.json()).github.readme, '');
  assert.equal((await importer.POST(request('/api/admin/github/import', 'POST', { repoId: '12345' }, true))).status, 400);
});
