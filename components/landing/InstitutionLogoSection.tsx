'use client'

import { type CSSProperties, useEffect, useState } from 'react'

type InstitutionLogo = {
  id: string
  title: string | null
  altText: string | null
  publicUrl: string
}

export function InstitutionLogoSection() {
  const [logos, setLogos] = useState<InstitutionLogo[]>([])
  const [showTitles, setShowTitles] = useState(false)

  const visibleLogoCount = Math.min(6, logos.length)
  const hasQueue = logos.length > visibleLogoCount

  useEffect(() => {
    Promise.all([
      fetch('/api/media?mediaGroup=INSTITUTIONS'),
      fetch('/api/media/settings?mediaGroup=INSTITUTIONS'),
    ])
      .then(async ([mediaResponse, settingResponse]) => {
        const assets: InstitutionLogo[] = mediaResponse.ok ? await mediaResponse.json() : []
        const setting = settingResponse.ok ? await settingResponse.json() : { showTitles: false }
        setLogos(assets.filter((asset) => asset.publicUrl))
        setShowTitles(setting.showTitles === true)
      })
      .catch((error) => console.error('Failed to fetch institution logos:', error))
  }, [])

  if (logos.length === 0) return null

  // Repeat the complete sequence so the animation can reset at an identical frame.
  const displayLogos = hasQueue ? [...logos, ...logos] : logos

  return (
    <section
      aria-labelledby="institution-logos-heading"
      className="border-y border-outline-variant bg-surface-container-low px-6 py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          {/* <p className="text-label-bold uppercase tracking-[0.28em] text-secondary">
            Proof of work
          </p> */}
          <h2 id="institution-logos-heading" className="font-h2 text-h2 text-primary">
            Trusted by institutions
          </h2>
          <p className="mt-4 text-body-md leading-relaxed text-on-surface-variant">
            Our Career Assessment and counselling along with wellbeing workshops are being used by These schools.
          </p>
        </div>

        <div
          className="institution-logo-viewport relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-outline-variant bg-white shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
          role="region"
          aria-label="Institutions that trust EduMindWell"
        >
          <div aria-hidden="true" className="institution-logo-fade institution-logo-fade-left" />
          <div
            className={`flex min-h-28 items-stretch sm:min-h-32 ${hasQueue ? 'institution-logo-track' : ''}`}
            style={{
              animationDuration: `${logos.length * 1.8}s`,
              '--institution-visible-count': visibleLogoCount,
            } as CSSProperties}
          >
            {displayLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="institution-logo-item flex shrink-0 flex-col items-center justify-center gap-2 border-r border-outline-variant/60 px-5 py-5 sm:px-7 sm:py-6"
              >
                <img
                  src={logo.publicUrl}
                  alt={logo.altText || logo.title || 'Institution logo'}
                  className="h-14 w-full max-w-45 object-contain sm:h-16"
                />
                <span className="min-h-5 w-full whitespace-normal break-words text-center text-xs font-medium text-on-surface-variant">
                  {showTitles ? logo.title || '' : ''}
                </span>
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="institution-logo-fade institution-logo-fade-right" />
        </div>

       {/* <p className="mt-4 text-center text-sm font-medium text-on-surface-variant">
          Trusted by {logos.length}+ associations and growing
        </p> */}
      </div>
    </section>
  )
}
