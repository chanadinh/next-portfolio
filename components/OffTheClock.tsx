import { ArrowUpRight, Flag } from 'lucide-react';
import { portfolio } from '../content/portfolio';

export default function OffTheClock() {
  const interest = portfolio.offTheClock;

  return (
    <section aria-labelledby="off-the-clock-title" className="relative overflow-hidden rounded-xl bg-zinc-950 text-zinc-100">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-orange-400" />
      <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
        <div>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
            <Flag size={16} className="text-orange-300" aria-hidden="true" />
            {interest.eyebrow}
          </p>
          <h3 id="off-the-clock-title" className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">{interest.title}</h3>
          <div
            aria-hidden="true"
            className="mt-6 h-3 w-24 opacity-40"
            style={{ backgroundImage: 'conic-gradient(#f4f4f5 25%, transparent 0 50%, #f4f4f5 0 75%, transparent 0)', backgroundSize: '12px 12px' }}
          />
        </div>
        <div>
          <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">{interest.description}</p>
          <a
            href={`mailto:${portfolio.email}?subject=${encodeURIComponent('Let’s talk F1')}`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-orange-300 underline underline-offset-4 hover:text-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
          >
            {interest.invitation}<ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
