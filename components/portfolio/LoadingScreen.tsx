import { displayFont, labelFont } from '../../lib/portfolio-fonts';
import styles from './loading-screen.module.css';

type LoadingContext = 'portfolio' | 'dashboard' | 'session';

const status: Record<LoadingContext, string> = {
  portfolio: 'Loading portfolio…',
  dashboard: 'Opening your dashboard…',
  session: 'Checking your session…',
};

export default function LoadingScreen({ context = 'portfolio' }: { context?: LoadingContext }) {
  return (
    <section className={`${styles.screen} ${displayFont.variable} ${labelFont.variable}`} aria-label={status[context]}>
      <div className={styles.topline} aria-hidden="true">
        <span>Chan Dinh <span className={styles.slash}>/</span> {context === 'portfolio' ? 'Portfolio' : 'Dashboard'}</span>
        <span>chandinh.dev</span>
      </div>
      <div className={styles.center}>
        <div className={styles.monogram} aria-hidden="true">CD<span>/</span></div>
        <p className={styles.eyebrow}>Driven by curiosity.</p>
        <h1 className={styles.title}>The next <span>chapter.</span></h1>
        <div className={styles.track} aria-hidden="true"><span /></div>
        <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{status[context]}</p>
      </div>
      <div className={styles.bottomline} aria-hidden="true">
        <span>AI / Software / Cybersecurity</span>
        <span className={styles.gridMarks}><i /><i /><i /><i /><i /></span>
      </div>
    </section>
  );
}
