'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { BRAND, NAV_LINKS } from '@/lib/landing-constants'

export function Navbar() {
  const [hasScroll, setHasScroll] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScroll(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-indigo-50 transition-shadow duration-300 ${
        hasScroll ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand */}
        <div className="flex flex-col">
          <span className="text-xl font-bold text-primary leading-none">
            {BRAND.name}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-label-bold">
            {BRAND.tagline}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center font-h3 font-medium text-sm">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.href)}
              className={`transition-colors pb-1 ${
                link.id === 'hero'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => handleNavClick('#cta')}
            className="hidden md:inline-flex h-auto bg-on-tertiary-container text-white rounded-full px-6 py-2.5 text-button font-button shadow-sm hover:scale-95 hover:bg-[#c8744d] transition-all duration-150"
          >
            Book a Free Session
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-indigo-50 p-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left text-slate-600 hover:text-primary transition-colors py-2"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => handleNavClick('#cta')}
            className="w-full h-auto bg-on-tertiary-container text-white rounded-full px-6 py-3 text-button font-button"
          >
            Book a Free Session
          </Button>
        </div>
      )}
    </nav>
  )
}
