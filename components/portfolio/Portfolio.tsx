import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Flag } from 'lucide-react';
import { portfolio } from '../../content/portfolio';
import { story } from '../../content/story';
import { displayFont, labelFont } from '../../lib/portfolio-fonts';
import PortfolioHeader from './PortfolioHeader';
import ContactForm from './ContactForm';
import ProjectLibrary from './ProjectLibrary';
import SkillsWorkbench from './SkillsWorkbench';
import styles from './portfolio.module.css';

function Chapter({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className={styles.chapter}><span>{number}</span>{children}</p>;
}

export default function Portfolio() {
  return <div className={`${styles.page} ${displayFont.variable} ${labelFont.variable}`}>
    <a className={styles.skipLink} href="#main-content">Skip to content</a>
    <PortfolioHeader />
    <main id="main-content">
      <section className={styles.hero} aria-labelledby="portfolio-name">
        <div className={styles.container}>
          <div className={styles.heroTop}><span className={styles.label}>AI / Software / Cybersecurity</span><span className={styles.label}>Independent mind. Collaborative work.</span></div>
          <h1 id="portfolio-name" className={styles.heroName}>CHAN DINH<span aria-hidden="true">.</span></h1>
          <div className={styles.heroMain}>
            <div><p className={styles.overline}>The person behind the projects</p><h2 className={styles.heroHeading}>Driven by<br /><em>curiosity.</em></h2><p className={styles.heroCopy}>{story.introduction}</p>
              <div className={styles.actions}><a href="#work" className={styles.solidButton}>Explore my work <ArrowUpRight size={18} aria-hidden="true" /></a><a href="#story" className={styles.plainLink}>Read the story <ArrowDown size={17} aria-hidden="true" /></a></div>
            </div>
            <figure className={styles.portraitStage}>
              <div className={styles.portraitArtwork}>
                <div className={styles.speedLines} aria-hidden="true"><i /><i /><i /></div>
                <div className={styles.portraitFrame}><Image src="/images/chan-editorial.png" alt="Chan Dinh" width={1122} height={1402} sizes="(max-width: 950px) 220px, 260px" priority /><span className={styles.portraitCorner} aria-hidden="true">CD / 01</span></div>
              </div>
              <figcaption><span>CS at UCF</span><span>Cybersecurity team at Siemens Energy</span><span>F1 enthusiast, through and through.</span></figcaption>
            </figure>
          </div>
          <div className={styles.heroBottom}><span>From mathematics to systems.<br />From ideas to things people use.</span><a href="#story" aria-label="Continue to the first chapter"><ArrowDown size={22} aria-hidden="true" /></a><span>Scroll to follow the story<br /><span className={styles.accent}>01 — 04</span></span></div>
        </div>
      </section>

      <section id="story" className={`${styles.lightSection} ${styles.section}`} aria-labelledby="foundation-title">
        <div className={styles.container}><Chapter number="01">Understand it. Then explain it.</Chapter><div className={styles.foundation}>
          <h2 id="foundation-title" className={styles.sectionHeading}>Before the code,<br />there’s a <em>question.</em></h2>
          <div className={styles.prose}>{story.foundation.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className={styles.foundationDates}><span>2024–25 / Mathematical data annotation</span><span>2025 / Mathematics tutoring</span><span>Now / Computer Science at UCF</span></div></div>
        </div></div>
      </section>

      <section id="experience" className={`${styles.darkSection} ${styles.section}`} aria-labelledby="experience-title">
        <div className={styles.container}><Chapter number="02">Build for the people doing the work.</Chapter>
          <div className={styles.sectionIntro}><h2 id="experience-title" className={styles.sectionHeading}>The theory meets<br /><em>the real world.</em></h2><p>At Siemens Energy, my work has grown from finding information with AI to building tools for cybersecurity workflows.</p></div>
          <div className={styles.experienceList}>{story.experience.map((item, index) => <article className={styles.experience} key={item.role}>
            <div><span className={styles.label}>{item.date}</span><p className={styles.role}>{item.role}<br /><span>Siemens Energy</span></p></div>
            <div><p className={styles.itemNumber}>0{index + 1} /</p><h3>{item.title}</h3><p className={styles.experienceBody}>{item.body}</p><ul className={styles.tags} aria-label="Technologies and focus">{item.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>
          </article>)}</div>
          <p className={styles.bridge}>The work changes. The thread stays the same:<br /><strong>make complex systems useful to people.</strong></p>
        </div>
      </section>

      <section id="work" className={`${styles.lightSection} ${styles.section}`} aria-labelledby="work-title">
        <div className={styles.container}><Chapter number="03">Put it in people’s hands.</Chapter><div className={styles.sectionIntro}><h2 id="work-title" className={styles.sectionHeading}>Made to work.<br /><em>Made to be used.</em></h2><p>Alongside my internship work, I build projects that connect people, interfaces, and the systems behind them.</p></div>
          <div className={styles.projectStories}>{story.projects.map(project => <article id={project.id} className={styles.projectStory} key={project.id}>
            <figure className={styles.projectVisual}>
              <a className={styles.projectImageFrame} href={project.images[0].src} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} image at full size (opens a new tab)`}>
                <Image src={project.images[0].src} alt={project.images[0].alt} width={project.images[0].width} height={project.images[0].height} sizes="(max-width: 680px) calc(100vw - 44px), (max-width: 1240px) 46vw, 558px" />
                <span className={styles.imageExpand} aria-hidden="true"><ArrowUpRight size={16} /></span>
              </a>
              <figcaption className={styles.projectCaption}><span className={styles.label}>{project.index} / {project.images[0].caption}</span><a href={project.source.href} target="_blank" rel="noopener noreferrer">{project.source.label} <ArrowUpRight size={13} aria-hidden="true" /></a></figcaption>
            </figure>
            <div className={styles.projectStoryCopy}><div className={styles.projectMeta}><span>{project.name}</span><span>{project.date}</span></div><h3>{project.title}</h3><p>{project.summary}</p><details><summary>Inside the build <span aria-hidden="true">+</span></summary><p>{project.contribution}</p><ul className={styles.tags} aria-label="Project technologies">{project.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>{project.images.slice(1).map(photo => <figure className={styles.projectDetailPhoto} key={photo.src}><a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`View ${photo.caption.toLowerCase()} at full size (opens a new tab)`}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 680px) calc(100vw - 44px), 46vw" /></a><figcaption>{photo.caption}</figcaption></figure>)}</details><p className={styles.evidence}>{project.evidence}</p></div>
          </article>)}</div>
          <ProjectLibrary />
          <SkillsWorkbench />
          <Link className={styles.plainLink} href="/play">Small experiments live in the playground <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section id="off-duty" className={`${styles.racingSection} ${styles.section}`} aria-labelledby="racing-title">
        <div className={styles.container}><Chapter number="04">There’s a person behind all of this.</Chapter><div className={styles.racingLayout}>
          <div className={styles.racingPoster} aria-hidden="true"><div className={styles.startLights}><i /><i /><i /><i /><i /></div><span>OFF<br />DUTY<span className={styles.racingSlash}>/</span></span><div className={styles.checkered} /><small>RACING. ENGINEERING. STRATEGY. PEOPLE.</small></div>
          <div className={styles.racingCopy}><Flag size={28} aria-hidden="true" /><h2 id="racing-title">Formula 1.<br /><em>All of it.</em></h2><p>{portfolio.offTheClock.description}</p><a className={styles.plainLink} href={`mailto:${portfolio.email}?subject=${encodeURIComponent('Let’s talk F1')}`}>Talk F1 with me <ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </div></div>
      </section>

      <section id="contact" className={`${styles.darkSection} ${styles.section} ${styles.contactSection}`} aria-labelledby="contact-title">
        <div className={styles.container}><p className={styles.label}>The next chapter</p><div className={styles.contactGrid}><div><h2 id="contact-title" className={styles.sectionHeading}>What should<br />we <em>build next?</em></h2><p>Have an AI, software, or cybersecurity problem to work on? I’d like to hear about it.</p><a className={styles.emailLink} href={`mailto:${portfolio.email}`}>{portfolio.email}<ArrowUpRight size={18} aria-hidden="true" /></a><div className={styles.socialLinks}><a href="https://github.com/chanadinh" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="/linkedin" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="/resume" target="_blank" rel="noopener noreferrer">Résumé ↗</a></div></div><ContactForm /></div></div>
      </section>
    </main>
    <footer className={styles.footer}><Link href="/" className={styles.wordmark}>CD<span>/</span></Link><span>AI. Software. Cybersecurity. A little F1.</span><a href="https://github.com/chanadinh/next-portfolio" target="_blank" rel="noopener noreferrer">Built by Chan Dinh ↗</a></footer>
  </div>;
}
