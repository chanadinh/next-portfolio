import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './portfolio.module.css';

export default function PortfolioHeader() {
  return <header className={styles.header}>
    <Link href="/" className={styles.wordmark} aria-label="Chan Dinh, home">CD<span aria-hidden="true">/</span></Link>
    <nav aria-label="Portfolio navigation" className={styles.navigation}>
      <Link href="/#story">The story</Link><Link href="/#work">Selected work</Link><Link href="/#off-duty">Off duty</Link>
    </nav>
    <a href="/resume" target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>Résumé <ArrowUpRight size={14} aria-hidden="true" /></a>
  </header>;
}
