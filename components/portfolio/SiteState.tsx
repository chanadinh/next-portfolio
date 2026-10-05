import Link from 'next/link';
import EditorialShell from './EditorialShell';
import styles from './editorial.module.css';

export default function SiteState({ code, title, message, reset, admin = false, error }: {
  code: string; title: string; message: string; reset?: () => void; admin?: boolean; error?: Error;
}) {
  return <EditorialShell><main id="page-content" className={styles.state}>
    <p className={styles.eyebrow}>{admin ? 'Behind the portfolio' : 'A brief detour'}</p>
    <p className={styles.stateCode} aria-hidden="true">{code}<span>/</span></p>
    <h1>{title}</h1><p className={styles.description}>{message}</p>
    <div className={styles.actions}>
      {reset && <button onClick={reset} className={styles.button}>Try again ↗</button>}
      <Link href={admin ? '/admin' : '/'} className={reset ? styles.secondary : styles.button}>{admin ? 'Back to dashboard' : 'Back to the story'} ↗</Link>
      {admin ? <Link href="/login" className={styles.secondary}>Sign in</Link> : <Link href="/play" className={styles.secondary}>Explore the playground</Link>}
    </div>
    {error && process.env.NODE_ENV === 'development' && <details className={styles.details}><summary>Error details (development)</summary><pre>{error.message}</pre></details>}
  </main></EditorialShell>;
}
