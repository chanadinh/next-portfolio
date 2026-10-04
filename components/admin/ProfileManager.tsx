'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Linkedin, Upload } from 'lucide-react';
import { MAX_RESUME_BYTES, ProfileSettings } from '../../lib/profile-types';

async function profileRequest(path: string, init?: RequestInit): Promise<ProfileSettings> {
  const response = await fetch(path, { cache: 'no-store', ...init });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'The change could not be saved. Please try again.');
  return body;
}

export default function ProfileManager() {
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<'linkedin' | 'resume' | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true); setError('');
    try {
      const data = await profileRequest('/api/admin/profile');
      setSettings(data); setLinkedinUrl(data.linkedinUrl);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not load your profile settings.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!file) { setPreviewUrl(''); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function saveLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy('linkedin'); setError(''); setNotice('');
    try {
      const data = await profileRequest('/api/admin/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkedinUrl }) });
      setSettings(data); setLinkedinUrl(data.linkedinUrl); setNotice('LinkedIn link updated. Visitors can use it now.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save your LinkedIn link.'); }
    finally { setBusy(null); }
  }

  async function uploadResume(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!file) return;
    setBusy('resume'); setError(''); setNotice('');
    try {
      const body = new FormData(); body.set('file', file);
      setSettings(await profileRequest('/api/admin/profile/resume', { method: 'POST', body }));
      setFile(null); if (fileInput.current) fileInput.current.value = '';
      setNotice('Résumé updated. Every résumé button now opens the new PDF.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not upload your résumé.'); }
    finally { setBusy(null); }
  }

  const buttonClass = 'rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  return <section aria-labelledby="profile-heading" aria-busy={loading || Boolean(busy)} className="max-w-3xl text-gray-900">
    <h2 id="profile-heading" className="text-2xl font-semibold">Profile</h2>
    <p className="mt-2 mb-6 text-gray-600">Keep your résumé and LinkedIn profile current. Saved changes apply across your portfolio.</p>
    {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
    {notice && <p role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{notice}</p>}
    {loading ? <p role="status">Loading profile settings…</p> : !settings ? <button type="button" className={buttonClass} onClick={load}>Try again</button> : <div className="grid gap-6">
      <form onSubmit={uploadResume} className="rounded-xl border border-gray-200 p-5 sm:p-6">
        <fieldset disabled={Boolean(busy)}>
          <legend className="flex items-center gap-2 text-lg font-semibold"><FileText size={20} aria-hidden="true" /> Résumé</legend>
          <div className="my-4 rounded-lg bg-gray-50 p-4 text-sm">
            <p className="break-words font-medium">{settings.resume?.filename || 'Current portfolio résumé'}</p>
            {settings.resume && <p className="mt-1 text-gray-600">{Math.ceil(settings.resume.size / 1024)} KB · Updated {new Date(settings.resume.uploadedAt).toLocaleDateString()}</p>}
            <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline underline-offset-4">View current résumé ↗</a>
          </div>
          <label htmlFor="resume-file" className="block text-sm font-medium">Choose a new résumé</label>
          <input ref={fileInput} id="resume-file" type="file" accept="application/pdf,.pdf" aria-describedby="resume-help" className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:p-2" onChange={event => {
            setNotice(''); setError('');
            const next = event.target.files?.[0] || null;
            if (next && (!/\.pdf$/i.test(next.name) || next.size > MAX_RESUME_BYTES)) {
              setFile(null); event.target.value = ''; setError('Choose a PDF no larger than 3 MB.'); return;
            }
            setFile(next);
          }} />
          <p id="resume-help" className="mt-2 text-sm text-gray-600">PDF, up to 3 MB. Uploading replaces the file opened by your résumé buttons. Your homepage story stays as written.</p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <button type="submit" disabled={!file || Boolean(busy)} className={`${buttonClass} inline-flex items-center gap-2`}><Upload size={16} aria-hidden="true" />{busy === 'resume' ? 'Uploading…' : 'Upload résumé'}</button>
            {previewUrl && <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">Preview selected PDF ↗</a>}
          </div>
        </fieldset>
      </form>
      <form onSubmit={saveLink} className="rounded-xl border border-gray-200 p-5 sm:p-6">
        <fieldset disabled={Boolean(busy)}>
          <legend className="flex items-center gap-2 text-lg font-semibold"><Linkedin size={20} aria-hidden="true" /> LinkedIn</legend>
          <label htmlFor="linkedin-url" className="mt-4 block text-sm font-medium">Profile URL</label>
          <input id="linkedin-url" type="text" inputMode="url" autoComplete="url" required maxLength={2048} value={linkedinUrl} onChange={event => { setLinkedinUrl(event.target.value); setNotice(''); }} aria-describedby="linkedin-help" placeholder="https://www.linkedin.com/in/your-name" className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800" />
          <p id="linkedin-help" className="mt-2 text-sm text-gray-600">Paste your personal LinkedIn profile link. Tracking parameters are removed when you save.</p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <button type="submit" disabled={Boolean(busy) || linkedinUrl === settings.linkedinUrl} className={buttonClass}>{busy === 'linkedin' ? 'Saving…' : 'Save LinkedIn link'}</button>
            <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">Open saved profile ↗</a>
          </div>
        </fieldset>
      </form>
    </div>}
  </section>;
}
