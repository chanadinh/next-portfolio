'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { mountPortfolioMotion } from '../../lib/portfolio-motion';
import styles from './portfolio.module.css';

export default function PortfolioMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (root.current) return mountPortfolioMotion(root.current);
  }, []);
  return <div ref={root} className={className} data-portfolio-motion data-motion="paused">
    <div className={styles.scrollProgress} data-scroll-progress aria-hidden="true" />
    {children}
  </div>;
}

export function MotionToggle() {
  return <button className={styles.motionToggle} type="button" data-motion-toggle aria-label="Pause animations" aria-pressed="false" hidden>
    <span className={styles.motionGlyph} aria-hidden="true"><i /><i /><i /></span><span data-motion-label>Pause motion</span>
  </button>;
}
