'use client'

import React, { useEffect, useRef } from 'react'
import EditorialShell, { PageIntro } from '../../components/portfolio/EditorialShell'
import styles from '../../components/portfolio/editorial.module.css'

declare global {
  interface Window {
    Desmos: any
  }
}

export default function GraphPage() {
  const calculatorRef = useRef<HTMLDivElement>(null)
  const calculatorInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Check if Desmos is already loaded
    if (window.Desmos) {
      initializeCalculator()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="desmos.com/api"]')
    if (existingScript) {
      existingScript.addEventListener('load', initializeCalculator)
      return
    }

    // Load Desmos API script
    const script = document.createElement('script')
    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${process.env.NEXT_PUBLIC_DESMOS_API_KEY || '144fc33916824be095e03149c2675f61'}`
    script.async = true
    
    script.onload = initializeCalculator
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (calculatorInstanceRef.current) {
        calculatorInstanceRef.current.destroy()
        calculatorInstanceRef.current = null
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const initializeCalculator = () => {
    if (calculatorRef.current && window.Desmos && !calculatorInstanceRef.current) {
      // Initialize the calculator
      calculatorInstanceRef.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
        keypad: true,
        graphpaper: true,
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        pointsOfInterest: true,
        trace: true,
        border: true,
        lockViewport: false,
        expressionsCollapsed: false,
        authorFeatures: false,
        images: true,
        folders: true,
        notes: true,
        sliders: true,
        actions: 'auto',
        substitutions: true,
        links: true,
        qwertyKeyboard: true,
        distributions: true,
        restrictedFunctions: false,
        forceEnableGeometryFunctions: false,
        pasteGraphLink: false,
        pasteTableData: true,
        clearIntoDegreeMode: false
      })

      // Set some initial expressions to demonstrate functionality
      calculatorInstanceRef.current.setExpression({
        id: 'welcome',
        latex: 'y=x^2',
        color: '#2d70b3'
      })

      calculatorInstanceRef.current.setExpression({
        id: 'line',
        latex: 'y=2x+1',
        color: '#388c46'
      })

      calculatorInstanceRef.current.setExpression({
        id: 'circle',
        latex: '(x-2)^2+(y-1)^2=4',
        color: '#6042a6'
      })
    }
  }

  const addExampleFunction = (latex: string, color: string) => {
    if (calculatorInstanceRef.current) {
      calculatorInstanceRef.current.setExpression({
        id: `example_${Date.now()}`,
        latex,
        color
      })
    }
  }

  return <EditorialShell><main id="page-content" className={styles.container}>
    <PageIntro label="Playground / Mathematics in motion" title="Follow the curve.">My background in mathematics started with questions like these. Plot a function, change a variable, and see where it takes you.</PageIntro>
    <section className={styles.paper} aria-label="Interactive graphing calculator">
      <div className={styles.calculatorBar}><span>01 / Graphing canvas</span><span>Powered by Desmos</span></div>
      <div ref={calculatorRef} className={styles.calculator} />
      <div className={styles.examples}>
        <h2>Start with a little curiosity.</h2>
        <div className={styles.exampleGrid}>
          {[
            { title: 'Sine wave', formula: 'y = sin(x)', latex: 'y=\sin(x)', color: '#d62728' },
            { title: 'Exponential', formula: 'y = eˣ', latex: 'y=e^x', color: '#ff7f0e' },
            { title: 'Hyperbola', formula: 'y = 1/x', latex: 'y=\frac{1}{x}', color: '#2ca02c' },
            { title: 'Square root', formula: 'y = √x', latex: 'y=\sqrt{x}', color: '#9467bd' },
          ].map(example => <button key={example.title} type="button" onClick={() => addExampleFunction(example.latex, example.color)}><span>{example.title} ↗</span><small>{example.formula}</small></button>)}
        </div>
      </div>
    </section>
  </main></EditorialShell>
}
