'use client';
/* eslint-disable @next/next/no-img-element -- Covers can be local or admin-selected remote images. */
import { useState } from 'react';
import { PortfolioProject, safeProjectUrl } from '../lib/project-types';
import { displayFont, labelFont } from '../lib/portfolio-fonts';
import styles from './portfolio/project-article.module.css';

export default function ProjectArticle({ project, compact = false, headingLevel }: { project: PortfolioProject; compact?: boolean; headingLevel?: 'h1' | 'h2' | 'h3' }) {
  const Heading = headingLevel || (compact ? 'h3' : 'h2');
  const [failedImage, setFailedImage] = useState('');
  const cover = project.imageUrl && safeProjectUrl(project.imageUrl) && failedImage !== project.imageUrl;
  return (
    <article className={`${styles.article} ${compact ? styles.compact : ''} ${displayFont.variable} ${labelFont.variable}`}>
      <div className={styles.cover}>
        {cover ? <img src={project.imageUrl} alt={`${project.title} project preview`} loading="lazy" onError={() => setFailedImage(project.imageUrl)} /> :
          <div className={styles.fallback}>{project.title || 'Project preview'}<span aria-hidden="true"> /</span></div>}
      </div>
      <div className={styles.body}>
        <div>
          <p className={styles.kicker}>{project.featured ? 'Selected work' : project.placement === 'playground' ? 'Playground' : 'Project story'} / {compact ? 'Field notes' : 'Behind the build'}</p>
          <Heading className={styles.title}>{project.title || 'Untitled project'}</Heading>
          <p className={styles.description}>{project.description || 'Add a short project description.'}</p>
        </div>
        <ul className={styles.tags} aria-label="Technologies">
          {project.technologies.map(tech => <li key={tech}>{tech}</li>)}
        </ul>
        {!compact && <>
          {([['My contribution', project.role], ['Technical decisions', project.technicalDecisions], ['Results & lessons', project.outcomes]] as const).map(([label, value], index) => value &&
            <section key={label} className={styles.chapter}><h3><span>0{index + 1} /</span>{label}</h3><p>{value}</p></section>)}
        </>}
        <div className={styles.links}>
          {compact && project._id && <a href={`/work/${project._id}`} className="underline underline-offset-4">Read project story →</a>}
          {project.githubUrl && safeProjectUrl(project.githubUrl) && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Source code ↗</a>}
          {project.liveUrl && safeProjectUrl(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open project ↗</a>}
        </div>
      </div>
    </article>
  );
}
