'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, BookOpen, Users, Briefcase } from 'lucide-react'
import { AUDIENCE_CARDS, WORKSHOP_MEDIA } from '@/lib/landing-constants'

const iconMap = {
  BookOpen,
  Users,
  Briefcase,
}

type MediaAssetResponse = { publicUrl: string; description: string | null }

export function AudienceSection() {
  const [workshopMedia, setWorkshopMedia] = useState<string[]>(WORKSHOP_MEDIA)
  const [audienceImages, setAudienceImages] = useState<Record<string, string>>(
    Object.fromEntries(AUDIENCE_CARDS.map((card) => [card.title, card.image ?? ''])),
  )

  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch('/api/media?section=WORKSHOPS')
        if (res.ok) {
          const data: MediaAssetResponse[] = await res.json()
          const urls = data.map((asset) => asset.publicUrl)
          if (urls.length > 0) {
            setWorkshopMedia(urls)
          }
          const covers = data.filter((asset) => asset.description?.startsWith('COVER:'))
          if (covers.length > 0) {
            setAudienceImages((current) => ({
              ...current,
              ...Object.fromEntries(covers.map((asset) => [asset.description!.slice(6), asset.publicUrl])),
            }))
          }
        }
      } catch (err) {
        console.error('Failed to fetch workshop media:', err)
      }
    }
    loadMedia()
  }, [])

  return (
    <section id="workshops" className="py-xl px-6 bg-surface-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
            Mindset Workshops
          </p>
          <h2 className="font-h2 text-h2 text-primary">
            Interactive workshops for students, parents, and teachers.
          </h2>
        </div>

        

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {AUDIENCE_CARDS.map((card) => {
            const IconComponent = iconMap[card.icon as keyof typeof iconMap]

            return (
              <div key={card.title} className="group cursor-pointer">
                {/* Image/Gradient Card */}
                <div
                  className={`relative h-64 rounded-3xl overflow-hidden mb-6 bg-gradient-to-br ${card.gradient}`}
                >
                  {audienceImages[card.title] && (
                    <Image
                      src={audienceImages[card.title]}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/15" />
                  <div
                    className={`absolute inset-0 ${card.overlayColor} flex items-end p-8 transition-colors`}
                  >
                    <div className="flex items-end justify-between w-full">
                      <div>
                        <h4 className="text-white text-2xl font-bold">{card.title}</h4>
                        <div className="mt-3 flex items-center gap-2 text-white/80 text-xs uppercase tracking-[0.25em]">
                          <IconComponent className="h-4 w-4" />
                          Workshop track
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & Link */}
                <p className="text-body-md text-on-surface-variant px-2">
                  {card.description}
                </p>
                <a
                  href="#"
                  className={`${card.bgColor} font-bold inline-flex items-center gap-2 mt-4 hover:gap-3 transition-all`}
                >
                  {card.linkText} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
