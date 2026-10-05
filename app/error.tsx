'use client';
import SiteState from '../components/portfolio/SiteState';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SiteState code="PAUSE" title="A pause in the story." message="This page could not load. Try again, or return to the portfolio to keep exploring." reset={reset} error={error}  />;
}
