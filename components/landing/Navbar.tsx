'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X } from 'lucide-react'
import { BRAND } from '@/lib/landing-constants'

type AnchorNavItem = {
  kind: 'anchor'
  label: string
  href: string
  id: string
}

type DropdownItem = {
  title: string
  description: string
}

type DropdownNavItem = {
  kind: 'dropdown'
  label: string
  items: DropdownItem[]
}

type NavItem = AnchorNavItem | DropdownNavItem

const NAV_ITEMS: NavItem[] = [
  { kind: 'anchor', label: 'Home', href: '#hero', id: 'hero' },
  {
    kind: 'dropdown',
    label: 'Career',
    items: [
      {
        title: 'Career Assessments',
        description: 'Assessment-led discovery inspired by the Edumilestones flow.',
      },
      {
        title: 'Career Counselling',
        description:
          'Expert counsellors review the report and guide students through the dashboard.',
      },
      {
        title: 'Career Library',
        description: 'A growing reference library for careers, pathways, and planning.',
      },
    ],
  },
  {
    kind: 'dropdown',
    label: 'Mindset Workshops',
    items: [
      {
        title: 'Students',
        description:
          'Time management, goal setting, personality growth, stress control, and resilience.',
      },
      {
        title: 'Parents',
        description:
          'Programs for parenting children from toddler age through teenage years.',
      },
      {
        title: 'Teachers / Professionals',
        description:
          'Classroom confidence, emotional intelligence, team bonding, and growth mindset.',
      },
    ],
  },
  {
    kind: 'dropdown',
    label: 'Wellness',
    items: [
      {
        title: 'Customized Therapeutic Meditation',
        description:
          'Personalized meditation experiences for stress, confidence, health, money, and relationships.',
      },
      {
        title: 'Individual Wellness Coaching',
        description:
          'One-on-one coaching for health, relationships, finances, career, and life balance.',
      },
      {
        title: 'Group Meditation Programs',
        description:
          'Online, offline, and hybrid programs for schools, parents, students, corporates, and more.',
      },
      {
        title: 'MiracleX App',
        description:
          'A daily wellness companion with guided meditation, gratitude, affirmations, goals, and tracking.',
      },
      {
        title: 'Learning Videos',
        description:
          'Supportive learning content from the YouTube channel for ongoing wellness practice.',
      },
    ],
  },
  { kind: 'anchor', label: 'Testimonials', href: '#stories', id: 'stories' },
  { kind: 'anchor', label: 'Gallery', href: '#gallery', id: 'gallery' },
  { kind: 'anchor', label: 'Contact', href: '#contact', id: 'contact' },
]

export function Navbar() {
  const [hasScroll, setHasScroll] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [desktopMenu, setDesktopMenu] = useState<DropdownNavItem | null>(null)
  const navbarRef = useRef<HTMLElement>(null)
  const closeTimerRef = useRef<number | null>(null)

  function closeDesktopDropdown() {
    setActiveDropdown(null)

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
    }

    closeTimerRef.current = window.setTimeout(() => {
      setDesktopMenu(null)
    }, 260)
  }

  function openDesktopDropdown(label: string) {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    const nextMenu = NAV_ITEMS.find(
      (item): item is DropdownNavItem =>
        item.kind === 'dropdown' && item.label === label,
    )

    if (nextMenu) {
      setDesktopMenu(nextMenu)
      setActiveDropdown(label)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setHasScroll(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        closeDesktopDropdown()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDesktopDropdown()
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    closeDesktopDropdown()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCtaClick = () => {
    setMobileMenuOpen(false)
    closeDesktopDropdown()

    const ctaTarget =
      document.querySelector('#cta') || document.querySelector('#contact')

    if (ctaTarget) {
      ctaTarget.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleDropdown = (label: string) => {
    setMobileMenuOpen(false)
    if (activeDropdown === label) {
      closeDesktopDropdown()
      return
    }

    openDesktopDropdown(label)
  }

  return (
    <nav
      ref={navbarRef}
      className={`glass-navbar ${
        hasScroll ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6" tabIndex={-1}>
        <div className="flex items-center justify-between py-4">
          {/* Brand */}
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none">
              <span className="text-black">Edu</span>
              <span className="text-primary">Mind</span>
              <span className="text-black">Well</span>
            </span>
            <span className="font-slogan text-[10px] tracking-widest text-primary">
              Aligning Career, Mind and Well-being
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 font-h3 font-medium text-sm md:flex">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'anchor') {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`rounded-full px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 ${
                      item.id === 'hero'
                        ? 'text-primary'
                        : 'text-slate-600 hover:bg-white/60 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              }

              const isActive = activeDropdown === item.label

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={isActive}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-white/70 text-primary shadow-sm'
                        : 'text-slate-600 hover:bg-white/60 hover:text-primary'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isActive ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>

          {activeDropdown && desktopMenu && (
            <div className="fixed left-0 right-0 top-19.5 z-40 hidden md:block">
              <div className="w-full border-t border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <div className="mx-auto max-w-7xl px-6 py-6">
                  <div className="rounded-[28px] border border-slate-200/80 bg-white px-8 py-7 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
                      {desktopMenu.label}
                    </p>

                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {desktopMenu.items.map((menuItem) => (
                        <div
                          key={menuItem.title}
                          className="min-h-45 rounded-[22px] border border-slate-100 bg-[#fafafa] p-6 shadow-[0_6px_16px_rgba(15,23,42,0.03)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(15,23,42,0.05)]"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                            <ChevronDown className="h-4 w-4 -rotate-90" />
                          </div>
                          <h4 className="mt-10 font-h3 text-[15px] text-primary">
                            {menuItem.title}
                          </h4>
                          <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                            {menuItem.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleCtaClick}
              className="hidden md:inline-flex h-auto bg-on-tertiary-container rounded-full px-6 py-2.5 text-button font-button shadow-sm hover:scale-95 hover:bg-primary transition-all duration-150"
              style={{ color: '#ffffff' }}
            >
              Book a Consultation
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className=" md:hidden p-4">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'anchor') {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary"
                  >
                    {item.label}
                  </button>
                )
              }

              const isActive = activeDropdown === item.label

              return (
                <div key={item.label} className="rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setActiveDropdown(isActive ? null : item.label)}
                    aria-expanded={isActive}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-slate-700"
                  >
                    <span className="font-medium">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isActive ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isActive && (
                    <div className="border-t border-slate-200 p-3">
                      <div className="space-y-3">
                        {item.items.map((dropdownItem) => (
                          <div
                            key={dropdownItem.title}
                            className="rounded-xl bg-slate-50 p-3"
                          >
                            <div className="font-semibold text-primary">
                              {dropdownItem.title}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                              {dropdownItem.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <Button
            onClick={handleCtaClick}
            className="mt-4 w-full h-auto bg-on-tertiary-container text-white rounded-full px-6 py-3 text-button font-button transition-transform duration-200 hover:scale-[0.99] hover:bg-primary"
          >
            Book a Consultation
          </Button>
        </div>
      )}
    </nav>
  )
}
