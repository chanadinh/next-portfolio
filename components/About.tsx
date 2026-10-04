import { portfolio } from '../content/portfolio';
import OffTheClock from './OffTheClock';
export default function About() {
  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="container mx-auto space-y-12 px-5">
        <div className="grid gap-10 md:grid-cols-2">
          <div><p className="mb-4 text-sm uppercase tracking-widest text-gray-500">A little about me</p><h2 className="text-4xl font-semibold tracking-tight">{portfolio.headline}</h2></div>
          <div><p className="text-lg leading-relaxed text-gray-700">{portfolio.about}</p><p className="mt-5 leading-relaxed text-gray-600">My background in mathematics and tutoring shapes how I approach engineering: understand the problem, make the reasoning clear, and build something people can use.</p><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-medium underline underline-offset-4">Read my résumé ↗</a></div>
        </div>
        <OffTheClock />
      </div>
    </section>
  );
}
