'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Home, User, Code, Briefcase, MessageCircle, Calculator, Settings, CloudRain } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isOverHero, setIsOverHero] = useState(true)

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: Briefcase },
    { name: 'Contact', href: '#contact', icon: MessageCircle },
    { name: 'Graphing Calculator', href: '/graph', icon: Calculator },
    { name: 'Storm Tracker', href: '/weather', icon: CloudRain },
    { name: 'Admin', href: '/login', icon: Settings },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setScrolled(scrollTop > 50)
      
      // Check if we're over the hero section (first 100vh)
      const heroHeight = window.innerHeight
      setIsOverHero(scrollTop < heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Chan Dinh Logo"
              width={60}
              height={60}
              className={`transition-all duration-300 hover:scale-105 ${
                isOverHero && !scrolled ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const linkColor = isOverHero && !scrolled ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-primary'
              
              if (item.href.startsWith('/')) {
                // External page link
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 transition-colors duration-300 ${linkColor}`}
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
                    className={`flex items-center gap-2 transition-colors duration-300 ${linkColor}`}
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
            className={`md:hidden p-2 rounded-md transition-colors duration-300 ${
              isOverHero && !scrolled 
                ? 'text-white hover:text-gray-200 hover:bg-white/20' 
                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
            }`}
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
            className={`md:hidden border-t backdrop-blur-md ${
              isOverHero && !scrolled 
                ? 'border-white/20 bg-black/20' 
                : 'border-gray-200 bg-white/95'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const mobileLinkColor = isOverHero && !scrolled 
                  ? 'text-white hover:text-gray-200 hover:bg-white/20' 
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                
                if (item.href.startsWith('/')) {
                  // External page link
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-300 ${mobileLinkColor}`}
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-300 ${mobileLinkColor}`}
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
