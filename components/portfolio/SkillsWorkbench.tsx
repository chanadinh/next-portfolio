import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { story } from '../../content/story';
import SkillLogo from './SkillLogo';
import { MotionToggle } from './PortfolioMotion';
import styles from './skills-workbench.module.css';

export default function SkillsWorkbench() {
  const ribbonTools = ['Python', 'React', 'PyTorch', 'TypeScript', 'Docker', 'Kubernetes', 'MongoDB', 'Git/GitHub'];
  return <section id="skills" className={styles.workbench} aria-labelledby="skills-title" data-motion-zone>
    <div className={styles.heading} data-reveal>
      <div><p className={styles.eyebrow}>Under the hood / The toolkit</p><h3 id="skills-title">Different tools.<br /><em>Connected thinking.</em></h3></div>
      <p className={styles.intro}>The interesting part is how they work together. Choose a discipline to explore the tools and the work behind it.</p>
    </div>

    <div className={styles.ribbon} aria-hidden="true"><div className={styles.ribbonTrack}>
      {[0, 1].map(copy => <div className={styles.ribbonGroup} key={copy}>{ribbonTools.map(tool => <span className={styles.ribbonTool} key={tool}><SkillLogo name={tool} /><span>{tool}</span><i /></span>)}</div>)}
    </div></div>
    <div className={styles.explorerTop}><span><i aria-hidden="true" />Follow the connections</span><MotionToggle /></div>

    <fieldset className={styles.explorer}>
      <legend className={styles.srOnly}>Choose a skill discipline. Use the arrow keys to move between disciplines.</legend>
      {story.toolkit.map((discipline, index) => <input key={discipline.id} id={`skill-${discipline.id}`} className={styles.choice} type="radio" name="skill-discipline" value={discipline.id} defaultChecked={index === 0} aria-controls={`skill-panel-${discipline.id}`} />)}

      <div className={styles.choices}>
        {story.toolkit.map((discipline, index) => <label key={discipline.id} htmlFor={`skill-${discipline.id}`} className={styles.selector}>
          <span className={styles.stop}><span className={styles.number}>0{index + 1}</span><span className={styles.connector} aria-hidden="true" /></span>
          <span className={styles.discipline}>{discipline.name}</span>
          <span className={styles.verb}>{discipline.verb}</span>
        </label>)}
        <span className={styles.selectionLine} aria-hidden="true" />
      </div>

      <div className={styles.panels}>
        {story.toolkit.map((discipline, index) => <div key={discipline.id} id={`skill-panel-${discipline.id}`} data-discipline={discipline.id} className={styles.panel} role="region" aria-labelledby={`skill-title-${discipline.id}`} tabIndex={0}>
          <div className={styles.story}>
            <div className={styles.panelTop}><span className={styles.eyebrow}>In my toolkit / {discipline.name}</span><span className={styles.index} aria-hidden="true">0{index + 1}<span>/</span></span></div>
            <h4 id={`skill-title-${discipline.id}`}>{discipline.title}</h4>
            <p className={styles.description}>{discipline.description}</p>
            <div className={styles.evidence}>
              <span className={styles.eyebrow}>A connection to my work</span>
              <p>{discipline.evidence}</p>
              <a href={discipline.href} target={discipline.href.startsWith('https://') ? '_blank' : undefined} rel={discipline.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>{discipline.linkLabel}<ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>

          <figure className={styles.diagram}>
            <figcaption><span className={styles.eyebrow}>A system, sketched</span><span className={styles.diagramName}>{discipline.diagram}</span></figcaption>
            <div className={styles.circuit}>
              <svg className={styles.wires} viewBox="0 0 400 244" preserveAspectRatio="none" aria-hidden="true"><path d="M104 51H296V193H104" className={styles.baseWire} /><path d="M104 51H296V193H104" pathLength="100" className={styles.signal} /><path d="m190 46 7 5-7 5m101 60 5 7 5-7m-91 72-7 5 7 5" className={styles.arrows} /></svg>
              <ol className={styles.nodes}>{discipline.flow.map((step, stepIndex) => <li key={step} style={{ '--node-index': stepIndex } as CSSProperties}><span>0{stepIndex + 1}</span><strong>{step}</strong><i className={styles.nodeLight} aria-hidden="true" /></li>)}</ol>
              <span className={styles.circuitNote} aria-hidden="true">{discipline.diagramNote}</span>
            </div>
            <p className={styles.diagramFoot}>Tools connect. Context matters.</p>
          </figure>

          <div className={styles.inventory}>
            {discipline.groups.map((group, groupIndex) => <div className={styles.toolGroup} key={group.label}>
              <h5>{group.label}</h5><ul>{group.tools.map((tool, toolIndex) => <li key={tool} data-tilt style={{ '--tool-index': groupIndex * 3 + toolIndex } as CSSProperties}><SkillLogo name={tool} /><span>{tool}</span></li>)}</ul>
            </div>)}
          </div>
        </div>)}
      </div>
    </fieldset>
  </section>;
}
