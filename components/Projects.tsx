'use client';
import { useEffect, useState } from 'react';
import { PortfolioProject } from '../lib/project-types';
import ProjectArticle from './ProjectArticle';
export default function Projects({ placement = 'work' }: { placement?: 'work' | 'playground' }) {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(false);
    fetch(`/api/projects?placement=${placement}`, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Unavailable');
      setProjects(await response.json());
    }).catch(() => { if (!controller.signal.aborted) setError(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [placement, attempt]);
  return <section id="projects" className="bg-white py-20"><div className="container mx-auto px-5">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 text-sm uppercase tracking-widest text-gray-500">{placement === 'work' ? 'Applications / AI / Systems' : 'Experiments / Play / Interfaces'}</p><h2 className="text-4xl font-semibold tracking-tight">{placement === 'work' ? 'Selected work' : 'Playground'}</h2></div><a href={placement === 'work' ? '/play' : '/#work'} className="underline underline-offset-4">{placement === 'work' ? 'Explore the playground ↗' : 'Back to selected work'}</a></div>
    {loading ? <p role="status" className="py-10 text-gray-600">Loading projects…</p> : error ? <div role="status" className="py-10 text-gray-600"><p>Projects are temporarily unavailable. You can still explore my work on <a className="underline" href="https://github.com/chanadinh">GitHub</a>.</p><button className="mt-4 rounded-lg border px-4 py-2" onClick={() => setAttempt(n => n + 1)}>Try again</button></div> : projects.length ? <div className="grid items-start gap-8 lg:grid-cols-2">{projects.map(project => <ProjectArticle key={project._id} project={project} compact />)}</div> : <p className="py-10 text-gray-600">Project stories are being prepared. Explore my <a className="underline" href="https://github.com/chanadinh">GitHub repositories</a> in the meantime.</p>}
  </div></section>;
}
