'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioProject } from '../../lib/project-types';
import styles from './portfolio.module.css';

export default function ProjectLibrary() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setState('loading');
    fetch('/api/projects?placement=work', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!controller.signal.aborted) { setProjects(data); setState('ready'); }
    }).catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, [attempt]);
  return <div className={styles.library} data-reveal>
    <div className={styles.libraryTitle}><h3>From the project library</h3><a href="https://github.com/chanadinh" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a></div>
    {state === 'loading' ? <p role="status" className={styles.muted}>Loading the latest published stories…</p> : state === 'error' ? <p role="status" className={styles.muted}>The library is temporarily unavailable. <button onClick={() => setAttempt(value => value + 1)} className={styles.textButton}>Try again</button> or explore my GitHub above.</p> : projects.length ?
      <ul className={styles.libraryList}>{projects.map(project => <li key={project._id}><Link href={`/work/${project._id}`}><div><span className={styles.label}>{project.featured ? 'Featured project' : project.technologies.slice(0, 3).join(' / ') || 'Software project'}</span><h4>{project.title}</h4><p>{project.description}</p></div><ArrowUpRight size={22} aria-hidden="true" /></Link></li>)}</ul> : <p className={styles.muted}>More project stories are on the way. My repositories are open to explore.</p>}
  </div>;
}
