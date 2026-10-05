'use client';
import { useEffect, useState } from 'react';
import { PortfolioProject } from '../lib/project-types';
import ProjectArticle from './ProjectArticle';
import styles from './portfolio/project-article.module.css';
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
  return <section id="projects" className={styles.collection}><div className={styles.collectionInner}>
    <div className={styles.collectionHeader}><div><p className={styles.kicker}>{placement === 'work' ? 'Applications / AI / Systems' : 'Experiments / Play / Interfaces'}</p><h2>{placement === 'work' ? 'Selected work' : 'From the workbench.'}</h2></div><a href={placement === 'work' ? '/play' : '/#work'}>{placement === 'work' ? 'Explore the playground ↗' : 'Back to selected work ↗'}</a></div>
    {loading ? <p role="status" className={styles.status}>Loading project stories…</p> : error ? <div role="status" className={styles.status}><p>Projects are temporarily unavailable. You can still explore my work on <a href="https://github.com/chanadinh">GitHub</a>.</p><button onClick={() => setAttempt(n => n + 1)}>Try again ↗</button></div> : projects.length ? <div className={styles.grid}>{projects.map(project => <ProjectArticle key={project._id} project={project} compact />)}</div> : <p className={styles.status}>Project stories are being prepared. Explore my <a href="https://github.com/chanadinh">GitHub repositories</a> in the meantime.</p>}
  </div></section>;
}
