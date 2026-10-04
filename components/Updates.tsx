import { experiences } from '../content/portfolio';
export default function Updates() {
  return <section id="updates" className="bg-white py-20"><div className="container mx-auto max-w-5xl px-5">
    <p className="mb-3 text-sm uppercase tracking-widest text-gray-500">Experience</p><h2 className="mb-10 text-4xl font-semibold tracking-tight">From ideas to working systems.</h2>
    <div>{experiences.map(item => <article key={item.title} className="grid gap-4 border-t border-gray-200 py-7 md:grid-cols-[1fr_2fr]"><p className="text-sm text-gray-500">{item.dates}</p><div><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-1 text-gray-500">{item.organization}</p><p className="mt-4 leading-relaxed text-gray-700">{item.description}</p></div></article>)}</div>
  </div></section>;
}
