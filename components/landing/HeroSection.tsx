"use client"

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { BRAND, HERO_STATS } from '@/lib/landing-constants'

export function HeroSection() {
  const [heroMedia, setHeroMedia] = useState<{ type: 'IMAGE' | 'VIDEO'; publicUrl: string } | null>(null)

  useEffect(() => {
    fetch('/api/media?section=HERO')
      .then((response) => (response.ok ? response.json() : []))
      .then((assets) => assets[0] && setHeroMedia(assets[0]))
      .catch((error) => console.error('Failed to fetch hero media:', error))
  }, [])
  return (
    <header id="hero" className="overflow-hidden bg-surface px-6 pb-20 pt-28 md:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        {/* Left Column */}
        <div className="order-2 w-full space-y-8 md:order-1" style={{ maxWidth: '36rem' }}>
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary-container/30 rounded-full animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-on-secondary-container" />
            <span className="text-label-bold text-on-secondary-container uppercase">
              Trusted by 5000+ Students
            </span>
          </div>

          {/* H1 Headline */}
          <h1 className="font-h1 text-h1 text-primary" style={{ maxWidth: '34rem' }}>
            <span className="font-slogan text-primary">{BRAND.tagline}</span>
          </h1>

          {/* Body Text */}
          <p
            className="w-full text-body-lg leading-relaxed text-on-surface-variant text-pretty"
            style={{ maxWidth: '32rem' }}
          >
            Empowering students from Class 8 to 12 to build confident careers without
            sacrificing their mental wellbeing. Structured. Scientific. Personal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button
              className="h-auto bg-primary px-8 py-4 rounded-xl text-button font-button shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow"
              style={{ color: '#fff' }}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              className="h-auto border border-primary bg-transparent text-primary px-8 py-4 rounded-xl text-button font-button hover:bg-primary/5 transition-colors"
            >
              Watch a Student Story
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-outline-variant pt-8 sm:gap-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary">{stat.label}</div>
                <div className="text-xs text-on-surface-variant">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Animated Circles + Cards */}
        <div className="order-1 md:order-2">
          <div
            className="relative flex justify-center md:justify-end"
            style={{ height: 'clamp(360px, 45vw, 500px)' }}
          >
          {heroMedia && (
            heroMedia.type === 'VIDEO' ? (
              <video src={heroMedia.publicUrl} autoPlay muted loop playsInline controls className="absolute inset-0 z-30 h-full w-full rounded-3xl object-cover" />
            ) : (
              <img src={heroMedia.publicUrl} alt="EduMindWell hero" className="absolute inset-0 z-30 h-full w-full rounded-3xl object-cover" />
            )
          )}
          {/* Background Glow */}
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl"></div>

          {/* Three Animated Circles */}
            <div
              className="absolute left-1/2 top-0 flex h-40 w-40 -translate-x-1/2 items-center justify-center rounded-full border-4 border-primary bg-white shadow-xl animate-bounce sm:h-44 sm:w-44 md:left-1/4 md:h-48 md:w-48 md:translate-x-0"
              style={{ animationDuration: '4s' }}
            >
              <span className="font-bold text-primary">Career</span>
            </div>
            <div
              className="absolute bottom-6 right-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-secondary bg-white shadow-xl animate-bounce sm:h-36 sm:w-36 md:bottom-0 md:right-1/4 md:h-48 md:w-48"
              style={{ animationDuration: '5s' }}
            >
              <span className="font-bold text-secondary">Mindset</span>
            </div>
            <div
              className="absolute bottom-0 left-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-on-tertiary-container bg-white shadow-xl animate-bounce sm:h-36 sm:w-36 md:left-auto md:right-0 md:top-1/3 md:h-48 md:w-48"
              style={{ animationDuration: '6s' }}
            >
              <span className="font-bold text-on-tertiary-container">Wellbeing</span>
            </div>

          {/* SVG Connector Lines */}
            <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400">
              <path
                className="text-primary"
                d="M150,100 Q200,200 300,150"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-secondary"
                d="M300,150 Q250,300 200,350"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-on-tertiary-container"
                d="M200,350 Q100,250 150,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

          {/* Floating Card 1 */}
            <div className="absolute bottom-20 left-0 z-20 hidden w-56 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl transition-shadow hover:shadow-xl md:block">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-label-bold text-on-surface">30-Page Roadmap</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Personalized career path with action steps
              </p>
            </div>

          {/* Floating Card 2 */}
            <div className="absolute right-8 top-12 z-20 hidden w-56 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl transition-shadow hover:shadow-xl md:block lg:right-10 lg:top-16">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-label-bold text-on-surface">Wellness Tracker</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Daily mental health & focus metrics
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:hidden">
            <div className="rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-label-bold text-on-surface">Wellness Tracker</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Daily mental health & focus metrics
              </p>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-label-bold text-on-surface">30-Page Roadmap</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Personalized career path with action steps
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
