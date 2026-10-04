import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import Profile from '../models/ProfileSettings';
import { DEFAULT_LINKEDIN_URL, MAX_RESUME_BYTES, ProfileSettings, RESUME_PATH } from './profile-types';

export class ProfileInputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function normalizeLinkedinUrl(value: unknown) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048) throw new ProfileInputError('Enter your LinkedIn profile URL.');
  const input = value.trim();
  try {
    if (/[\\\s\u0000-\u001f]/.test(input)) throw new Error();
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port || !/^(www\.|[a-z]{2}\.)?linkedin\.com$/.test(url.hostname)) throw new Error();
    if (!/^\/in\/[^/]+\/?$/.test(url.pathname)) throw new Error();
    const slug = decodeURIComponent(url.pathname.replace(/^\/in\//, '').replace(/\/$/, ''));
    if (!slug || /[\\/\s?#\u0000-\u001f]/.test(slug)) throw new Error();
    return `https://www.linkedin.com/in/${encodeURIComponent(slug)}`;
  } catch { throw new ProfileInputError('Use a LinkedIn profile URL such as https://www.linkedin.com/in/your-name.'); }
}

export async function profileDatabase() {
  if (!process.env.MONGODB_URI) throw new Error('Profile storage is not configured.');
  await connectDB();
}

export async function getProfileSettings(): Promise<ProfileSettings> {
  await profileDatabase();
  const profile = await Profile.findById('portfolio').lean();
  return {
    linkedinUrl: profile?.linkedinUrl || DEFAULT_LINKEDIN_URL,
    resumeUrl: RESUME_PATH,
    resume: profile?.resumeUploadedAt ? { filename: profile.resumeFilename!, size: profile.resumeSize!, uploadedAt: profile.resumeUploadedAt.toISOString() } : null,
  };
}

export async function saveLinkedinUrl(value: unknown) {
  const linkedinUrl = normalizeLinkedinUrl(value);
  await profileDatabase();
  await Profile.findByIdAndUpdate('portfolio', { $set: { linkedinUrl } }, { upsert: true, runValidators: true });
  return getProfileSettings();
}

// Bound the entire multipart body, including requests without Content-Length.
export async function readResumeUpload(request: NextRequest) {
  const maxBody = MAX_RESUME_BYTES + 64 * 1024;
  const tooLarge = () => new ProfileInputError('Choose a PDF no larger than 3 MB.', 413);
  if (Number(request.headers.get('content-length')) > maxBody) throw tooLarge();
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('multipart/form-data;')) throw new ProfileInputError('Choose a PDF file to upload.');
  const reader = request.body?.getReader();
  if (!reader) throw new ProfileInputError('Choose a PDF file to upload.');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBody) { await reader.cancel(); throw tooLarge(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  let form: FormData;
  try { form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } }).formData(); }
  catch { throw new ProfileInputError('The upload could not be read. Choose the PDF again.'); }
  const file = form.get('file');
  if (!(file instanceof File) || form.getAll('file').length !== 1) throw new ProfileInputError('Choose one PDF file.');
  if (file.size > MAX_RESUME_BYTES) throw tooLarge();
  if (!/\.pdf$/i.test(file.name) || !['application/pdf', 'application/octet-stream', ''].includes(file.type)) throw new ProfileInputError('Only PDF résumés are accepted.');
  const data = Buffer.from(await file.arrayBuffer());
  if (!/^%PDF-\d\.\d/.test(data.subarray(0, 8).toString('ascii')) || !/%%EOF\s*$/.test(data.subarray(-1024).toString('ascii'))) throw new ProfileInputError('This file does not appear to be a complete PDF.');
  const filename = file.name.replace(/[\\/\u0000-\u001f\u007f]/g, '-').slice(0, 180);
  return { data, filename, size: data.length };
}

export async function saveResume(upload: Awaited<ReturnType<typeof readResumeUpload>>) {
  await profileDatabase();
  // One atomic update: a failed upload never replaces the current résumé.
  await Profile.findByIdAndUpdate('portfolio', { $set: { resumeData: upload.data, resumeFilename: upload.filename, resumeSize: upload.size, resumeUploadedAt: new Date() } }, { upsert: true, runValidators: true });
  return getProfileSettings();
}
