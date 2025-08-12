'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Home, User, Code, Briefcase, MessageCircle, Calculator } from 'lucide-react'
import Link from 'next/link'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: Briefcase },
    { name: 'Contact', href: '#contact', icon: MessageCircle },
    { name: 'Graphing Calculator', href: '/graph', icon: Calculator },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            Chan Dinh
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              if (item.href.startsWith('/')) {
                // External page link
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              } else {
                // Anchor link
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </a>
                )
              }
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                if (item.href.startsWith('/')) {
                  // External page link
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                } else {
                  // Anchor link
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </a>
                  )
                }
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
