'use client';
/* eslint-disable @next/next/no-img-element -- Covers can be local or admin-selected remote images. */
import { useState } from 'react';
import { PortfolioProject, safeProjectUrl } from '../lib/project-types';

export default function ProjectArticle({ project, compact = false }: { project: PortfolioProject; compact?: boolean }) {
  const [failedImage, setFailedImage] = useState('');
  const cover = project.imageUrl && safeProjectUrl(project.imageUrl) && failedImage !== project.imageUrl;
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900">
      <div className="aspect-video bg-gray-100">
        {cover ? <img src={project.imageUrl} alt={`${project.title} project preview`} className="h-full w-full object-cover" loading="lazy" onError={() => setFailedImage(project.imageUrl)} /> :
          <div className="flex h-full items-center justify-center p-8 text-center text-gray-600">{project.title || 'Project preview'}</div>}
      </div>
      <div className="space-y-5 p-6 sm:p-8">
        <div>
          {project.featured && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600">Featured work</p>}
          <h2 className="text-2xl font-semibold tracking-tight">{project.title || 'Untitled project'}</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">{project.description || 'Add a short project description.'}</p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.technologies.map(tech => <li key={tech} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{tech}</li>)}
        </ul>
        {!compact && <>
          {([['My contribution', project.role], ['Technical decisions', project.technicalDecisions], ['Results & lessons', project.outcomes]] as const).map(([label, value]) => value &&
            <section key={label}><h3 className="font-semibold">{label}</h3><p className="mt-2 whitespace-pre-line leading-relaxed text-gray-600">{value}</p></section>)}
        </>}
        <div className="flex flex-wrap gap-5 text-sm font-medium">
          {compact && project._id && <a href={`/work/${project._id}`} className="underline underline-offset-4">Read project story →</a>}
          {project.githubUrl && safeProjectUrl(project.githubUrl) && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Source code ↗</a>}
          {project.liveUrl && safeProjectUrl(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open project ↗</a>}
        </div>
      </div>
    </article>
  );
}
