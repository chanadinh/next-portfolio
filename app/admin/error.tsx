'use client';
import SiteState from '../../components/portfolio/SiteState';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SiteState code="PAUSE" title="The workspace needs a moment." message="The dashboard could not load. Try again, or sign in if your session has ended." reset={reset} error={error} admin />;
}
