import { CloudSun } from 'lucide-react';
import Link from 'next/link';
import EditorialShell, { PageIntro } from '../../components/portfolio/EditorialShell';
import styles from '../../components/portfolio/editorial.module.css';

export default function WeatherPage() {
  return <EditorialShell><main id="page-content" className={styles.container}>
    <PageIntro label="Playground / Work in progress" title="A change in the air.">A weather experiment, still taking shape.</PageIntro>
    <section className={`${styles.paper} ${styles.weather}`} aria-labelledby="weather-heading">
      <div className={styles.weatherSymbol} aria-hidden="true"><CloudSun /></div>
      <div><p className={styles.eyebrow}>On the drawing board</p><h2 id="weather-heading">Forecast: more to come.</h2><p>This dashboard is a work in progress. Live conditions and forecasts are not available yet.</p><div className={styles.actions}><Link href="/play" className={styles.button}>Explore other experiments ↗</Link></div></div>
    </section>
  </main></EditorialShell>;
}
