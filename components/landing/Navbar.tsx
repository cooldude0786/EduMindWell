'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X } from 'lucide-react'
import { FreeConsultationDialog } from '@/components/landing/FreeConsultationDialog'
import { AUDIENCE_CARDS } from '@/lib/landing-constants'

type AnchorNavItem = {
  kind: 'anchor'
  label: string
  href: string
  id: string
}

type DropdownItem = {
  title: string
  description: string
  image?: string | string[]
  href?: string
}

type DropdownNavItem = {
  kind: 'dropdown'
  label: string
  id: string
  items: DropdownItem[]
}

type NavItem = AnchorNavItem | DropdownNavItem

const NAV_ITEMS: NavItem[] = [
  { kind: 'anchor', label: 'Home', href: '#hero', id: 'hero' },
  {
    kind: 'dropdown',
    label: 'Career',
    id: 'career',
    items: [
      {
        title: 'Career Assessments',
        description: 'Assessment-led discovery inspired by the Edumilestones flow.',
        image: '/CA.jpeg',
      },
      {
        title: 'Career Counselling',
        description:
          'Expert counsellors review the report and guide students through the dashboard.',
        image: '/CC.jpeg',
      },
      {
        title: 'Career Library',
        description: 'A growing reference library for careers, pathways, and planning.',
        image: '/CL.jpeg',
      },
    ],
  },
  {
    kind: 'dropdown',
    label: 'Mindset Workshops',
    id: 'workshops',
    items: AUDIENCE_CARDS.map((card) => ({
      title: card.title,
      description: card.description,
      image: card.image,
    })),
  },
  {
    kind: 'dropdown',
    label: 'Wellness',
    id: 'wellness',
    items: [
      {
        title: 'Customized Therapeutic Meditation',
        description:
          'Personalized meditation sessions that support calm, balance, and better emotional awareness.',
        image: '/Therapeutic.jpeg',
      },
      {
        title: 'Individual Wellness Coaching',
        description:
          'One-on-one guidance for health, relationships, career, and life decisions.',
        image: '/oneToOne.jpeg',
      },
      {
        title: 'Group Meditation and Wellness Programs',
        description:
          'Tailored sessions for schools, parents, students, teachers, corporates, and communities.',
        image: '/groupMed.jpeg',
      },
      {
        title: 'Learning Videos',
        description:
          'Short learning content to support ongoing wellness practice and consistency.',
        image: '/LearningVideo.jpeg',
      },
    ],
  },
  { kind: 'anchor', label: 'Testimonials', href: '#stories', id: 'stories' },
  { kind: 'anchor', label: 'Gallery', href: '#gallery', id: 'gallery' },
  { kind: 'anchor', label: 'Contact', href: '#contact', id: 'contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [hasScroll, setHasScroll] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [desktopMenu, setDesktopMenu] = useState<DropdownNavItem | null>(null)
  const [consultationOpen, setConsultationOpen] = useState(false)
  const [rotationIndex, setRotationIndex] = useState(0)
  const [activeAnchorId, setActiveAnchorId] = useState('hero')
  const navbarRef = useRef<HTMLElement>(null)
  const closeTimerRef = useRef<number | null>(null)

  const getRotatingImage = (
    image: string | string[] | undefined,
    offset = 0,
  ) => {
    if (!image) {
      return undefined
    }

    return Array.isArray(image)
      ? image[(rotationIndex + offset) % image.length]
      : image
  }

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
    if (pathname !== '/') {
      return
    }

    const sectionIds = NAV_ITEMS.map((item) => item.id)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target?.id) {
          setActiveAnchorId(visibleEntry.target.id)
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: '-20% 0px -40% 0px',
      },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRotationIndex((current) => current + 1)
    }, 2000)

    return () => window.clearInterval(timer)
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

  const isActiveNavItem = (item: NavItem) => {
    if (pathname === '/gallery') {
      return item.id === 'gallery'
    }

    if (pathname === '/') {
      return activeAnchorId === item.id
    }

    return false
  }

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    closeDesktopDropdown()

    if (href.startsWith('#')) {
      if (pathname === '/') {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }

      if (href === '#gallery') {
        window.location.assign('/gallery')
        return
      }

      window.location.assign(`/${href}`)
      return
    }

    window.location.assign(href)
  }

  const handleConsultationClick = () => {
    setMobileMenuOpen(false)
    closeDesktopDropdown()
    setConsultationOpen(true)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    closeDesktopDropdown()
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
          <div className="flex items-center gap-4">
            <Image
              src="/brandLogo.png"
              alt="EduMindWell logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
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
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 font-h3 font-medium text-sm md:flex">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'anchor') {
                const isActive = isActiveNavItem(item)

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`cursor-pointer rounded-full px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 ${
                      isActive
                        ? 'text-primary'
                        : 'text-slate-600 hover:bg-white/60 hover:text-primary'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                )
              }

              const isOpen = activeDropdown === item.label
              const isActive = isOpen || isActiveNavItem(item)

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={isOpen}
                    className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-white/70 text-primary shadow-sm'
                        : 'text-slate-600 hover:bg-white/60 hover:text-primary'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
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
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
                        {desktopMenu.label}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={closeDesktopDropdown}
                        aria-label="Close dropdown menu"
                        className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-900"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {desktopMenu.items.map((menuItem, index) => {
                        const currentImage = getRotatingImage(menuItem.image, index)
                        const cardClass = `group relative min-h-45 overflow-hidden rounded-[22px] border p-6 shadow-[0_6px_16px_rgba(15,23,42,0.03)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(15,23,42,0.05)] ${
                          currentImage
                            ? 'border-slate-100 bg-slate-950/20'
                            : 'border-slate-100 bg-[#fafafa]'
                        }`
                        const cardContent = (
                          <>
                            {currentImage && (
                              <Image
                                src={currentImage}
                                alt=""
                                fill
                                className="absolute inset-0 object-cover  duration-200 group-hover:scale-105"
                                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                priority={menuItem.title === 'Career Assessments'}
                              />
                            )}
                            {currentImage ? (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/68 via-slate-900/48 to-slate-800/30" />
                                <div className="relative z-10">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                    <ChevronDown className="h-4 w-4 -rotate-90" />
                                  </div>
                                  <h4 className="mt-10 font-h3 text-[15px] text-white">
                                    {menuItem.title}
                                  </h4>
                                  <p className="mt-3 text-[14px] leading-relaxed text-white/85">
                                    {menuItem.description}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                                  <ChevronDown className="h-4 w-4 -rotate-90" />
                                </div>
                                <h4 className="mt-10 font-h3 text-[15px] text-primary">
                                  {menuItem.title}
                                </h4>
                                <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                                  {menuItem.description}
                                </p>
                              </>
                            )}
                          </>
                        )

                        return menuItem.href ? (
                          <a
                            key={menuItem.title}
                            href={menuItem.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={cardClass}
                          >
                            {cardContent}
                          </a>
                        ) : (
                          <div key={menuItem.title} className={cardClass}>
                            {cardContent}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleConsultationClick}
              className="hidden md:inline-flex h-auto cursor-pointer bg-on-tertiary-container rounded-full px-6 py-2.5 text-button font-button shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:scale-[0.98] hover:bg-primary"
              style={{ color: '#ffffff' }}
            >
              Book a Free Consulting Session
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden cursor-pointer transition-transform duration-200 hover:scale-105"
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
          <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">Menu</span>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="cursor-pointer rounded-full border border-slate-200 p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'anchor') {
                const isActive = isActiveNavItem(item)

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full cursor-pointer rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-primary ${
                      isActive ? 'text-primary' : 'text-slate-600'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                )
              }

              const isOpen = activeDropdown === item.label
              const isActive = isOpen || isActiveNavItem(item)

              return (
                <div key={item.label} className="rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-left text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200 p-3">
                      <div className="space-y-3">
                        {item.items.map((dropdownItem, index) => {
                          const currentImage = getRotatingImage(dropdownItem.image, index)
                          const cardClass = `relative block overflow-hidden rounded-xl border p-3 ${
                            currentImage
                              ? 'border-slate-200 text-white'
                              : 'border-slate-200 bg-slate-50'
                          }`
                          const cardContent = (
                            <>
                              {currentImage && (
                                <Image
                                  src={currentImage}
                                  alt=""
                                  fill
                                  className="absolute inset-0 object-cover transition-[opacity,transform,filter] duration-700 ease-in-out"
                                  sizes="100vw"
                                />
                              )}
                              {currentImage ? (
                                <>
                                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/55 to-slate-800/35" />
                                  <div className="relative z-10">
                                    <div className="font-semibold text-white">
                                      {dropdownItem.title}
                                    </div>
                                    <p className="mt-1 text-sm leading-relaxed text-white/85">
                                      {dropdownItem.description}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="font-semibold text-primary">
                                    {dropdownItem.title}
                                  </div>
                                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                    {dropdownItem.description}
                                  </p>
                                </>
                              )}
                            </>
                          )

                          return dropdownItem.href ? (
                            <a
                              key={dropdownItem.title}
                              href={dropdownItem.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className={cardClass}
                            >
                              {cardContent}
                            </a>
                          ) : (
                            <div key={dropdownItem.title} className={cardClass}>
                              {cardContent}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <Button
            onClick={handleConsultationClick}
            className="mt-4 w-full h-auto rounded-full bg-on-tertiary-container px-6 py-3 text-button font-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[0.99] hover:bg-primary"
          >
            Book a Free Consulting Session
          </Button>
        </div>
      )}

      <FreeConsultationDialog
        open={consultationOpen}
        onOpenChange={setConsultationOpen}
      />
    </nav>
  )
}
