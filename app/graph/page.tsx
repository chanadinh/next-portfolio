'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calculator, BarChart3, Zap } from 'lucide-react'
import Navigation from '../../components/Navigation'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Interactive <span className="text-gradient">Graphing Calculator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore mathematical functions, create beautiful graphs, and visualize complex equations with Desmos-powered interactive graphing
            </p>
          </motion.div>

          {/* Calculator Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="card shadow-2xl overflow-hidden">
              {/* Calculator Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Desmos Graphing Calculator</h2>
                    <p className="text-blue-100">Powered by Desmos API v1.11</p>
                  </div>
                </div>
              </div>

              {/* Calculator */}
              <div className="bg-white p-6">
                <div 
                  ref={calculatorRef} 
                  className="w-full h-[600px] border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Quick Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Try These Examples
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => addExampleFunction('y=\\sin(x)', '#d62728')}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary"
                >
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Sine Wave</p>
                  <p className="text-sm text-gray-600">y = sin(x)</p>
                </button>

                <button
                  onClick={() => addExampleFunction('y=e^x', '#ff7f0e')}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary"
                >
                  <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Exponential</p>
                  <p className="text-sm text-gray-600">y = e^x</p>
                </button>

                <button
                  onClick={() => addExampleFunction('y=\\frac{1}{x}', '#2ca02c')}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary"
                >
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Hyperbola</p>
                  <p className="text-sm text-gray-600">y = 1/x</p>
                </button>

                <button
                  onClick={() => addExampleFunction('y=\\sqrt{x}', '#9467bd')}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary"
                >
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Square Root</p>
                  <p className="text-sm text-gray-600">y = √x</p>
                </button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 grid md:grid-cols-3 gap-8"
            >
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Full Graphing Calculator</h4>
                <p className="text-gray-600">Complete Desmos graphing calculator with all features including sliders, tables, and advanced functions</p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Interactive Graphs</h4>
                <p className="text-gray-600">Create, manipulate, and explore mathematical functions with real-time updates and visual feedback</p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Professional API</h4>
                <p className="text-gray-600">Powered by the official Desmos API v1.11, ensuring reliability and full feature compatibility</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
