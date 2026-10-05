import { ReactNode } from 'react';
import Link from 'next/link';
import EditorialShell from './EditorialShell';
import styles from './editorial.module.css';
import './game-fonts.css';

export default function GameFrame({ children, title }: { children: ReactNode; title: string }) {
  return <EditorialShell><div className={styles.gameBar}><Link href="/play">← Back to playground</Link><span>Off duty / {title}</span></div><div id="page-content" className={styles.gameStage}>{children}</div></EditorialShell>;
}
