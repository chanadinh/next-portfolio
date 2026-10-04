import mongoose from 'mongoose';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Project from '../../../models/Project';
import connectDB from '../../../lib/mongodb';
import { publishedFilter, publicProjection } from '../../../lib/project-editor';
import { PortfolioProject } from '../../../lib/project-types';
import ProjectArticle from '../../../components/ProjectArticle';
import PortfolioHeader from '../../../components/portfolio/PortfolioHeader';
import styles from '../../../components/portfolio/portfolio.module.css';
import { displayFont, labelFont } from '../../../lib/portfolio-fonts';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ id: string }> };
async function readProject(id: string) {
  if (!mongoose.isObjectIdOrHexString(id)) return null;
  await connectDB();
  return Project.findOne({ _id: id, ...publishedFilter }).select(publicProjection).lean();
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await readProject(id);
  return project ? { title: `${project.title} | Chan Dinh`, description: project.description, alternates: { canonical: `/work/${id}` } } : { title: 'Project unavailable | Chan Dinh', robots: { index: false } };
}
export default async function ProjectPage({ params }: Props) {
  const project = await readProject((await params).id);
  if (!project) notFound();
  return <div className={`${styles.page} ${styles.casePage} ${displayFont.variable} ${labelFont.variable}`}><PortfolioHeader /><main className={styles.caseContainer}><Link href={project.placement === 'playground' ? '/play' : '/#work'} className={styles.plainLink}>← Back to projects</Link><ProjectArticle project={JSON.parse(JSON.stringify(project)) as PortfolioProject} /></main></div>;
}
