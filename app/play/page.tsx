import Link from 'next/link';
import Projects from '../../components/Projects';
import PortfolioHeader from '../../components/portfolio/PortfolioHeader';
import styles from '../../components/portfolio/portfolio.module.css';
import { displayFont, labelFont } from '../../lib/portfolio-fonts';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Playground | Chan Dinh', alternates: { canonical: '/play' } };
export default function Playground() {
  return <div className={`${styles.page} ${displayFont.variable} ${labelFont.variable}`}><PortfolioHeader /><main><section className={styles.section}><div className={styles.container}><p className={styles.overline}>The playground</p><h1 className={styles.sectionHeading}>Where curiosity<br />takes a <em>detour.</em></h1><p className={styles.heroCopy}>Small experiments in interfaces, games, and making things work.</p><div className={styles.actions}><Link className={styles.plainLink} href="/graph">Graphing calculator ↗</Link><Link className={styles.plainLink} href="/flappyado">Flappy Ado ↗</Link></div></div></section><Projects placement="playground" /></main></div>;
}
