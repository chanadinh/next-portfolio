import { ReactNode } from 'react';
import Link from 'next/link';
import { displayFont, labelFont } from '../../lib/portfolio-fonts';
import PortfolioHeader from './PortfolioHeader';
import styles from './editorial.module.css';

export default function EditorialShell({ children }: { children: ReactNode }) {
  return <div className={`${styles.shell} ${displayFont.variable} ${labelFont.variable}`}>
    <a href="#page-content" className={styles.skipLink}>Skip to content</a>
    <PortfolioHeader />
    {children}
    <footer className={styles.footer}><span>Chan Dinh / Always in progress.</span><Link href="/">Back to the story ↗</Link></footer>
  </div>;
}

export function PageIntro({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return <div className={styles.intro}>
    <p className={styles.eyebrow}>{label}</p>
    <h1>{title}<span aria-hidden="true">/</span></h1>
    {children && <p className={styles.description}>{children}</p>}
  </div>;
}
