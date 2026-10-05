import { ArrowUpRight } from 'lucide-react';
import { story } from '../../content/story';
import styles from './skills-workbench.module.css';

export default function SkillsWorkbench() {
  return <section id="skills" className={styles.workbench} aria-labelledby="skills-title">
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>Under the hood / The toolkit</p><h3 id="skills-title">Different tools.<br /><em>Connected thinking.</em></h3></div>
      <p className={styles.intro}>The interesting part is how they work together. Choose a discipline to explore the tools and the work behind it.</p>
    </div>

    <fieldset className={styles.explorer}>
      <legend className={styles.srOnly}>Choose a skill discipline. Use the arrow keys to move between disciplines.</legend>
      {story.toolkit.map((discipline, index) => <input key={discipline.id} id={`skill-${discipline.id}`} className={styles.choice} type="radio" name="skill-discipline" value={discipline.id} defaultChecked={index === 0} aria-controls={`skill-panel-${discipline.id}`} />)}

      <div className={styles.choices}>
        {story.toolkit.map((discipline, index) => <label key={discipline.id} htmlFor={`skill-${discipline.id}`} className={styles.selector}>
          <span className={styles.stop}><span className={styles.number}>0{index + 1}</span><span className={styles.connector} aria-hidden="true" /></span>
          <span className={styles.discipline}>{discipline.name}</span>
          <span className={styles.verb}>{discipline.verb}</span>
        </label>)}
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
              <a href={discipline.href}>{discipline.linkLabel}<ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>

          <figure className={styles.diagram}>
            <figcaption><span className={styles.eyebrow}>A system, sketched</span><span className={styles.diagramName}>{discipline.diagram}</span></figcaption>
            <div className={styles.circuit}>
              <svg className={styles.wires} viewBox="0 0 400 244" preserveAspectRatio="none" aria-hidden="true"><path d="M104 51H296V193H104" /><path d="m190 46 7 5-7 5m101 60 5 7 5-7m-91 72-7 5 7 5" className={styles.arrows} /></svg>
              <ol className={styles.nodes}>{discipline.flow.map((step, stepIndex) => <li key={step}><span>0{stepIndex + 1}</span><strong>{step}</strong></li>)}</ol>
              <span className={styles.circuitNote} aria-hidden="true">{discipline.diagramNote}</span>
            </div>
            <p className={styles.diagramFoot}>Tools connect. Context matters.</p>
          </figure>

          <div className={styles.inventory}>
            {discipline.groups.map(group => <div className={styles.toolGroup} key={group.label}>
              <h5>{group.label}</h5><ul>{group.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
            </div>)}
          </div>
        </div>)}
      </div>
    </fieldset>
  </section>;
}
