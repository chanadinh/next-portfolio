'use client';
import { useCallback, useEffect, useState } from 'react';
import { Github, RefreshCw, Plus, ArrowLeft, Eye, Upload } from 'lucide-react';
import { PortfolioProject, ProjectStatus } from '../../lib/project-types';
import type { GitHubRepository } from '../../lib/github';
import ProjectArticle from '../ProjectArticle';

const blank = (): PortfolioProject => ({ _id: '', title: '', description: '', technologies: [], imageUrl: '', githubUrl: '', liveUrl: '', featured: false, order: 0, status: 'draft', placement: 'work', role: '', technicalDecisions: '', outcomes: '' });
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-none border border-[#a5a29b] bg-[#f8f5ef] px-4 py-2 text-sm font-medium text-[#303431] hover:bg-[#eeeae2] disabled:cursor-wait disabled:opacity-50';
const primary = `${button} !border-[#ff6248] !bg-[#ff6248] !text-[#101214] hover:!bg-[#ff806a]`;
const inputClass = 'mt-2 block w-full rounded-none border border-[#a5a29b] bg-[#f8f5ef] p-3 text-base text-[#101214] focus:border-[#b53523] focus:ring-2 focus:ring-[#b53523]';

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
  return data;
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<PortfolioProject | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [techText, setTechText] = useState('');
  const [filter, setFilter] = useState('all');
  const [showGithub, setShowGithub] = useState(false);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [account, setAccount] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [forks, setForks] = useState(false);
  const [archived, setArchived] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try { setProjects(await api<PortfolioProject[]>('/api/projects?view=admin')); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function openEditor(project: PortfolioProject) {
    setEditor({ ...blank(), ...project, status: project.status || 'published' });
    setTechText(project.technologies.join(', ')); setPreview(false); setDirty(false); setError(''); setNotice('');
  }
  function edit<K extends keyof PortfolioProject>(key: K, value: PortfolioProject[K]) {
    setEditor(current => current ? { ...current, [key]: value } : current); setDirty(true);
  }
  async function discover(nextPage = 1) {
    setBusy(true); setError(''); setNotice(''); setShowGithub(true);
    try {
      const data = await api<{ username: string; repos: GitHubRepository[]; hasNext: boolean }>(`/api/admin/github/repositories?page=${nextPage}`);
      setRepos(data.repos); setHasNext(data.hasNext); setPage(nextPage); setAccount(data.username);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function sync(repoId: number) {
    setBusy(true); setError(''); setNotice('');
    try {
      const project = await api<PortfolioProject>('/api/admin/github/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repoId }) });
      const existed = projects.some(p => p._id === project._id);
      setProjects(current => [project, ...current.filter(p => p._id !== project._id)]);
      setNotice(existed ? 'GitHub metadata refreshed. Your editorial content and publication settings are preserved.' : 'Imported as a draft. Add your images and project story, then preview it before publishing.');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function save(status: ProjectStatus) {
    if (!editor) return;
    setBusy(true); setError(''); setNotice('');
    const payload = { ...editor, status, technologies: techText.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      const saved = await api<PortfolioProject>(editor._id ? `/api/projects/${editor._id}` : '/api/projects', {
        method: editor._id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      setProjects(current => [saved, ...current.filter(p => p._id !== saved._id)]);
      setEditor(saved); setDirty(false); setNotice(status === 'published' ? 'Published. The project is now visible on your portfolio.' : status === 'hidden' ? 'Hidden from the public portfolio.' : 'Draft saved. It is only visible in the dashboard.');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setError('');
    try {
      const body = new FormData(); body.append('file', file);
      const result = await api<{ imageUrl: string }>('/api/upload', { method: 'POST', body });
      edit('imageUrl', result.imageUrl);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function remove(project: PortfolioProject) {
    if (!window.confirm(`Delete “${project.title}” from the portfolio? Its GitHub repository and images will remain unchanged.`)) return;
    setBusy(true); setError('');
    try { await api(`/api/projects/${project._id}`, { method: 'DELETE' }); setProjects(current => current.filter(p => p._id !== project._id)); setNotice('Project removed.'); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  const visibleRepos = repos.filter(repo => (forks || !repo.fork) && (archived || !repo.archived) && repo.name.toLowerCase().includes(search.toLowerCase()));
  const visibleProjects = projects.filter(p => filter === 'all' || (p.status || 'published') === filter).sort((a,b) => a.order - b.order);
  return <section aria-labelledby="project-manager-heading" className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 id="project-manager-heading" className="text-2xl font-semibold text-[#101214]">{editor ? 'Edit project' : 'Your project library'}</h2><p className="mt-1 text-sm text-[#626663]">Import, shape the story, preview, and publish.</p></div>
      {editor ? <button className={button} disabled={busy} onClick={() => { if (!dirty || window.confirm('Leave without saving these edits?')) { setEditor(null); setError(''); } }}><ArrowLeft size={16} />Back to projects</button> :
        <div className="flex flex-wrap gap-2"><button className={button} disabled={busy} onClick={() => void discover()}><Github size={16} />Import from GitHub</button><button className={primary} disabled={busy} onClick={() => openEditor(blank())}><Plus size={16} />Add manually</button></div>}
    </div>
    {error && <p role="alert" className="rounded-none border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error} <a className="underline" href="/login">Sign in</a></p>}
    {notice && <p role="status" className="rounded-none border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
    {editor ? <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#c9c5be] py-4"><span className="text-sm text-[#626663]">Status: <strong>{editor.status}</strong>{dirty ? ' · Unsaved changes' : ''}</span><button className={button} onClick={() => setPreview(p => !p)}><Eye size={16} />{preview ? 'Show editor' : 'Preview project'}</button></div>
      {preview ? <div className="mx-auto max-w-3xl"><p className="mb-4 text-sm text-[#626663]">Preview of your current edits. Publishing is a separate action below.</p><ProjectArticle project={{ ...editor, technologies: techText.split(',').map(t => t.trim()).filter(Boolean) }} /></div> :
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <fieldset disabled={busy} className="min-w-0 space-y-5">
            <legend className="sr-only">Portfolio content</legend>
            <label className="block text-sm font-medium">Project title<input className={inputClass} value={editor.title} maxLength={180} onChange={e => edit('title', e.target.value)} /></label>
            <label className="block text-sm font-medium">Short description<textarea className={inputClass} rows={3} value={editor.description} maxLength={2000} onChange={e => edit('description', e.target.value)} /></label>
            <label className="block text-sm font-medium">My contribution<textarea className={inputClass} rows={3} value={editor.role || ''} maxLength={2000} onChange={e => edit('role', e.target.value)} placeholder="What did you personally design or build?" /></label>
            <label className="block text-sm font-medium">Technical decisions<textarea className={inputClass} rows={4} value={editor.technicalDecisions || ''} maxLength={10000} onChange={e => edit('technicalDecisions', e.target.value)} placeholder="Architecture, constraints, and tradeoffs." /></label>
            <label className="block text-sm font-medium">Results & lessons<textarea className={inputClass} rows={4} value={editor.outcomes || ''} maxLength={5000} onChange={e => edit('outcomes', e.target.value)} placeholder="Measured results, limitations, and what you learned. Label estimates." /></label>
            <label className="block text-sm font-medium">Technologies, separated by commas<input className={inputClass} value={techText} onChange={e => { setTechText(e.target.value); setDirty(true); }} /></label>
          </fieldset>
          <div className="min-w-0 space-y-6">
            <fieldset disabled={busy} className="space-y-4 rounded-none border border-[#c9c5be] p-5"><legend className="px-1 text-sm font-semibold">Presentation</legend>
              <label className="block text-sm font-medium">Cover image URL or local path<input className={inputClass} value={editor.imageUrl} maxLength={2048} onChange={e => edit('imageUrl', e.target.value)} placeholder="/images/my-project.webp" /></label>
              <label className="block text-sm font-medium"><span className="flex items-center gap-2"><Upload size={15} />Or upload a cover</span><input className="mt-2 block w-full text-sm" type="file" accept="image/*" onChange={e => void upload(e.target.files?.[0])} /></label>
              <label className="block text-sm font-medium">GitHub link<input className={inputClass} value={editor.githubUrl || ''} maxLength={2048} onChange={e => edit('githubUrl', e.target.value)} /></label>
              <label className="block text-sm font-medium">Demo link<input className={inputClass} value={editor.liveUrl || ''} maxLength={2048} onChange={e => edit('liveUrl', e.target.value)} /></label>
              <label className="block text-sm font-medium">Collection<select className={inputClass} value={editor.placement || 'work'} onChange={e => edit('placement', e.target.value as 'work' | 'playground')}><option value="work">Selected work</option><option value="playground">Playground</option></select></label>
              <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={editor.featured} onChange={e => edit('featured', e.target.checked)} />Feature this project</label>
              <label className="block text-sm font-medium">Display order<input type="number" min={-100000} max={100000} className={inputClass} value={Number.isNaN(editor.order) ? '' : editor.order} onChange={e => edit('order', e.target.valueAsNumber)} /></label>
            </fieldset>
            {editor.github && <div className="space-y-3 rounded-none bg-[#e2ded6] p-5 text-sm text-[#444843]"><h3 className="font-semibold">GitHub source</h3><p className="break-words">{editor.github.fullName}</p><p>Last synced: {new Date(editor.github.syncedAt).toLocaleString()}</p><p>Languages: {editor.github.languages.join(', ') || 'Not listed'}</p><p>Topics: {editor.github.topics.join(', ') || 'Not listed'}</p><p>{editor.github.description || 'No repository description.'}</p><p className="text-xs">Refreshes update this source record. Your portfolio copy stays under your control.</p><details><summary className="min-h-11 cursor-pointer py-2 font-medium">Read README source</summary><pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-none bg-[#f8f5ef] p-3 text-xs">{editor.github.readme || 'No README available.'}</pre>{editor.github.readmeTruncated && <p>README shortened for this preview.</p>}</details></div>}
          </div>
        </div>}
      <div className="flex flex-wrap gap-3 border-t border-[#c9c5be] pt-5">
        <button className={button} disabled={busy} onClick={() => void save('draft')}>{editor.status === 'published' ? 'Move to draft' : 'Save draft'}</button>
        <button className={primary} disabled={busy || !preview} onClick={() => void save('published')}>{editor.status === 'published' ? 'Publish changes' : 'Publish project'}</button>
        {editor._id && <button className={button} disabled={busy} onClick={() => void save('hidden')}>Hide project</button>}
        {!preview && <p className="self-center text-sm text-[#626663]">Preview the project to enable publishing.</p>}
        {busy && <span role="status" className="self-center text-sm">Saving…</span>}
      </div>
    </> : <>
      {showGithub && <div className="space-y-4 rounded-none border border-[#c9c5be] bg-[#eeeae2] p-4 sm:p-6" aria-label="GitHub repositories">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">{account ? `${account} on GitHub` : 'Discover repositories'}</h3><p className="text-sm text-[#626663]">Public repositories · discovery refreshes every five minutes</p></div><button className={button} disabled={busy} onClick={() => void discover(page)}><RefreshCw size={15} />Sync now</button></div>
        <div className="flex flex-wrap items-center gap-4"><label className="min-w-0 flex-1 text-sm">Search this page<input className={inputClass} value={search} onChange={e => setSearch(e.target.value)} placeholder="Repository name" /></label><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={forks} onChange={e => setForks(e.target.checked)} />Include forks</label><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={archived} onChange={e => setArchived(e.target.checked)} />Include archived</label></div>
        {busy && <p role="status" className="text-sm">Working with GitHub…</p>}
        {!busy && visibleRepos.length === 0 && <p className="py-4 text-sm text-[#626663]">No matching repositories on this page. Adjust the filters or try another page.</p>}
        <ul className="divide-y divide-gray-200">{visibleRepos.map(repo => {
          const existing = projects.find(p => p.githubRepoId === repo.id || p.githubUrl?.replace(/\.git\/?$|\/$/g, '').toLowerCase() === repo.html_url.toLowerCase());
          return <li key={repo.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="min-w-0 flex-1"><a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="break-words font-medium underline underline-offset-4">{repo.name} ↗</a><p className="mt-1 text-sm text-[#626663]">{repo.description || 'No description yet.'}</p><p className="mt-2 text-xs text-[#626663]">{repo.language || 'Language not listed'}{repo.fork ? ' · Fork' : ''}{repo.archived ? ' · Archived' : ''}{existing ? ' · Already in your portfolio' : ''}</p></div><button className={button} disabled={busy} onClick={() => void sync(repo.id)}>{existing ? 'Refresh metadata' : 'Import draft'}</button></li>;
        })}</ul>
        <div className="flex items-center justify-between gap-3"><button className={button} disabled={busy || page <= 1} onClick={() => void discover(page - 1)}>Previous</button><span className="text-sm">Page {page}</span><button className={button} disabled={busy || !hasNext} onClick={() => void discover(page + 1)}>Next</button></div>
      </div>}
      <label className="block max-w-xs text-sm font-medium">Show projects<select className={inputClass} value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All projects ({projects.length})</option><option value="draft">Drafts</option><option value="published">Published</option><option value="hidden">Hidden</option></select></label>
      {loading ? <p role="status">Loading projects…</p> : visibleProjects.length === 0 ? <p className="py-8 text-[#626663]">No projects here yet. Import from GitHub or add one manually.</p> :
        <ul className="space-y-4">{visibleProjects.map(project => <li key={project._id} className="flex flex-wrap items-start justify-between gap-4 rounded-none border border-[#c9c5be] p-5"><div className="min-w-0 flex-1"><p className="text-xs font-medium uppercase tracking-wide text-[#626663]">{project.status || 'published'} · {project.placement || 'work'}{project.featured ? ' · Featured' : ''}</p><h3 className="mt-2 break-words text-lg font-semibold">{project.title}</h3><p className="mt-2 text-sm text-[#626663]">{project.description || 'Add your project story.'}</p></div><div className="flex flex-wrap gap-2"><button className={button} disabled={busy} onClick={() => openEditor(project)}>Edit & preview</button>{project.githubRepoId && <button className={button} disabled={busy} onClick={() => void sync(project.githubRepoId!)}>Refresh metadata</button>}<button className={`${button} !text-red-700`} disabled={busy} onClick={() => void remove(project)}>Delete</button></div></li>)}</ul>}
    </>}
  </section>;
}
