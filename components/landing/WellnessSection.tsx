"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Heart, PlayCircle, QrCode, Sparkles, Users } from 'lucide-react'
import { MIRACLE_X_APP_URL } from '@/lib/landing-constants'

type WellnessVariant = '1' | '2' | '3' | '4'

type WellnessCard = {
  title: string
  icon: LucideIcon
  description: string
  image: string
}

type WellnessVariantConfig = {
  eyebrow: string
  heading: string
  intro: string
  cards: WellnessCard[]
  sideLabel: string
  sideHeading: string
  sideCopy: string
  sideHighlights: [string, string]
}

const wellnessVariantMap: Record<WellnessVariant, WellnessVariantConfig> = {
  '1': {
    eyebrow: 'Wellness',
    heading: 'Practical wellness support for everyday life.',
    intro:
      'Wellness is the inner support system that helps people stay grounded, focused, and emotionally steady in daily life. Our programs are designed to bring calm, clarity, and practical support to individuals and groups.',
    cards: [
      {
        title: 'MiraclesX App',
        icon: QrCode,
        description:
          'A daily wellness companion with guided meditation, gratitude, affirmations, and progress tracking.',
        image: '/MiracleX.jpeg',
      },
      {
        title: 'Customized Therapeutic Meditation',
        icon: Sparkles,
        description:
          'Personalized meditation sessions that support calm, balance, and better emotional awareness.',
        image: '/Therapeutic.jpeg',
      },
      {
        title: 'Individual Wellness Coaching',
        icon: Heart,
        description:
          'One-on-one guidance for health, relationships, career, and life decisions.',
        image: '/oneToOne.jpeg',
      },
      {
        title: 'Group Meditation and Wellness Programs',
        icon: Users,
        description:
          'Tailored sessions for schools, parents, students, teachers, corporates, and communities.',
        image: '/groupMed.jpeg',
      },
      {
        title: 'Learning Videos',
        icon: PlayCircle,
        description:
          'Short learning content to support ongoing wellness practice and consistency.',
        image: '/LearningVideo.jpeg',
      },
    ],
    sideLabel: 'MiraclesX App',
    sideHeading: 'Your daily wellness companion in your pocket.',
    sideCopy:
      'Scan the QR code to explore guided meditation, gratitude journaling, affirmations, mood tracking, and learning videos.',
    sideHighlights: [
      'Included in roadmap and full journey plans',
      'Supported by guided videos from YouTube',
    ],
  },
  '2': {
    eyebrow: 'Holistic Wellness',
    heading: 'Support that feels gentle, personal, and real.',
    intro:
      'Sometimes what people need most is not more pressure, but more peace, presence, and support. This version of Wellness is written to feel warm, human, and easy to connect with.',
    cards: [
      {
        title: 'MiraclesX App',
        icon: QrCode,
        description:
          'Simple daily tools that help wellness feel accessible and easy to return to.',
        image: '/MiracleX.jpeg',
      },
      {
        title: 'Customized Therapeutic Meditation',
        icon: Sparkles,
        description:
          'A personalized practice to help settle the mind and support emotional ease.',
        image: '/Therapeutic.jpeg',
      },
      {
        title: 'Individual Wellness Coaching',
        icon: Heart,
        description:
          'Supportive one-on-one coaching for life, relationships, health, or career concerns.',
        image: '/oneToOne.jpeg',
      },
      {
        title: 'Group Meditation and Wellness Programs',
        icon: Users,
        description:
          'Thoughtful sessions for schools, families, teams, and community groups.',
        image: '/groupMed.jpeg',
      },
      {
        title: 'Learning Videos',
        icon: PlayCircle,
        description:
          'Short learning content that supports ongoing wellness practice and consistency.',
        image: '/LearningVideo.jpeg',
      },
    ],
    sideLabel: 'Support that fits life',
    sideHeading: 'Wellness that feels calm, accessible, and steady.',
    sideCopy:
      'The app keeps small daily practices visible, so support is easy to use and easy to sustain.',
    sideHighlights: [
      'Meditation, gratitude, affirmations, and progress tracking',
      'A gentle routine that fits into everyday life',
    ],
  },
  '3': {
    eyebrow: 'Wellness for Every Day',
    heading: 'Clear, practical wellness for busy routines.',
    intro:
      'We create wellness experiences that are easy to understand and simple to continue. The aim is to help people feel more steady, aware, and supported in real life.',
    cards: [
      {
        title: 'MiracleX App',
        icon: QrCode,
        description:
          'Wellness support in your pocket with guided tools and daily practices.',
        image: '/MiracleX.jpeg',
      },
      {
        title: 'Customized Therapeutic Meditation',
        icon: Sparkles,
        description:
          'A focused meditation approach designed to reduce stress and improve clarity.',
        image: '/Therapeutic.jpeg',
      },
      {
        title: 'Individual Wellness Coaching',
        icon: Heart,
        description:
          'Personal coaching to support balance, direction, and day-to-day decisions.',
        image: '/oneToOne.jpeg',
      },
      {
        title: 'Group Meditation and Wellness Programs',
        icon: Users,
        description:
          'Flexible sessions for schools, colleges, teams, and community settings.',
        image: '/groupMed.jpeg',
      },
      {
        title: 'Learning Videos',
        icon: PlayCircle,
        description:
          'Short learning content that supports ongoing wellness practice and consistency.',
        image: '/LearningVideo.jpeg',
      },
    ],
    sideLabel: 'Built for routines',
    sideHeading: 'Small practices that can fit into a busy day.',
    sideCopy:
      'The app helps keep meditation and self-care visible, lightweight, and repeatable.',
    sideHighlights: [
      'Guided meditations, mood tracking, and learning videos',
      'A simple path to consistent wellness habits',
    ],
  },
  '4': {
    eyebrow: 'A Calmer Way to Grow',
    heading: 'Wellness as a steady source of inner strength.',
    intro:
      'From a marketing point of view, this section should feel like relief and reassurance. It should tell the visitor that support can be personal, practical, and sustainable.',
    cards: [
      {
        title: 'MiracleX App',
        icon: QrCode,
        description:
          'A daily companion that makes steady wellness feel simple and personal.',
        image: '/MiracleX.jpeg',
      },
      {
        title: 'Customized Therapeutic Meditation',
        icon: Sparkles,
        description:
          'Personalized sessions that help create calm, clarity, and inner balance.',
        image: '/Therapeutic.jpeg',
      },
      {
        title: 'Individual Wellness Coaching',
        icon: Heart,
        description:
          'One-on-one support for moments when more clarity and care are needed.',
        image: '/oneToOne.jpeg',
      },
      {
        title: 'Group Meditation and Wellness Programs',
        icon: Users,
        description:
          'Shared experiences designed for schools, families, teams, and communities.',
        image: '/groupMed.jpeg',
      },
      {
        title: 'Learning Videos',
        icon: PlayCircle,
        description:
          'Short learning content that supports ongoing wellness practice and consistency.',
        image: '/LearningVideo.jpeg',
      },
    ],
    sideLabel: 'Support that lasts',
    sideHeading: 'Simple practices. Personal support. Meaningful change.',
    sideCopy:
      'When wellness feels personal, it becomes easier to continue and more meaningful over time.',
    sideHighlights: [
      'Designed for calm, clarity, and emotional steadiness',
      'A gentle way to support growth every day',
    ],
  },
}

type WellnessSectionProps = {
  variant?: WellnessVariant
}

export function WellnessSection({ variant = '1' }: WellnessSectionProps) {
  const config = wellnessVariantMap[variant] ?? wellnessVariantMap['1']
  const [cardImages, setCardImages] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/media?section=WELLNESS')
      .then((response) => (response.ok ? response.json() : []))
      .then((assets) => {
        const next = Object.fromEntries(
          assets.filter((asset: { title?: string | null; publicUrl?: string | null; type?: string }) => asset.title && asset.publicUrl && asset.type === 'IMAGE')
            .map((asset: { title: string; publicUrl: string }) => [asset.title, asset.publicUrl]),
        )
        if (Object.keys(next).length) setCardImages(next)
      })
      .catch((error) => console.error('Failed to fetch wellness media:', error))
  }, [])

  return (
    <section id="wellness" className="py-xl px-6 bg-surface">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
            {config.eyebrow}
          </p>
          <h2 className="font-h2 text-h2 text-primary">{config.heading}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            {config.intro}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
          <div className="grid gap-4 md:grid-cols-2">
            {config.cards.map((card) => {
              const IconComponent = card.icon
              const spanFullWidth = card.title === 'Learning Videos'

              return (
                <div
                  key={card.title}
                  className={`overflow-hidden rounded-3xl border border-indigo-50 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1 ${
                    spanFullWidth ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={cardImages[card.title] ?? card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/18 via-slate-900/10 to-slate-800/45" />
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-sm">
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-h3 text-lg text-primary">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-[32px] border border-primary/10 bg-primary p-8 text-white shadow-[0_18px_45px_rgba(2,16,100,0.18)] lg:min-h-[38rem] lg:self-start">
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary-fixed-dim font-label-bold">
              {config.sideLabel}
            </p>
            <h3 className="mt-3 max-w-[16rem] font-h2 text-[2.15rem] leading-[1.05] tracking-[-0.03em] md:text-[2.45rem]">
              {config.sideHeading}
            </h3>
            <p className="mt-4 max-w-[20rem] text-[0.95rem] leading-7 text-primary-fixed-dim">
              {config.sideCopy}
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-32 w-full items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-white/10 sm:h-40 sm:w-40">
                    <QrCode className="h-14 w-14 text-white/80" />
                  </div>

                  <div className="grid flex-1 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-secondary-fixed-dim">
                        Highlight
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {config.sideHighlights[0]}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-secondary-fixed-dim">
                        Support
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {config.sideHighlights[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-secondary-fixed-dim">
                  Learn More
                </p>
                <p className="mt-1 text-sm text-white">
                  Scan the QR code to explore the MiracleX app experience.
                </p>
                <a
                  href={MIRACLE_X_APP_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Open MiraclesX in Play Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
