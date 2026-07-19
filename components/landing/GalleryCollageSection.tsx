'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, PlayCircle } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

type GalleryMediaItem = {
  type: 'image' | 'video'
  src: string
  title: string
  alt: string
}

type GalleryProgram = {
  title: string
  description: string
  media: GalleryMediaItem[]
}

const assessmentMedia: GalleryMediaItem[] = [
  {
    type: 'image',
    src: '/assessments/IMG-20260718-WA0008.jpg',
    title: 'Assessment Session 1',
    alt: 'Career assessment session with the student and counselor',
  },
  {
    type: 'image',
    src: '/assessments/IMG-20260718-WA0009.jpg',
    title: 'Assessment Session 2',
    alt: 'Career assessment session in progress',
  },
  {
    type: 'image',
    src: '/assessments/IMG-20260718-WA0010.jpg',
    title: 'Assessment Session 3',
    alt: 'Career assessment discussion and guidance',
  },
  {
    type: 'image',
    src: '/assessments/IMG-20260718-WA0011.jpg',
    title: 'Assessment Session 4',
    alt: 'Career assessment gallery moment',
  },
  {
    type: 'video',
    src: '/assessments/VID-20260718-WA0012.mp4',
    title: 'Assessment Clip 1',
    alt: 'Career assessment clip preview',
  },
  {
    type: 'video',
    src: '/assessments/VID-20260718-WA0013.mp4',
    title: 'Assessment Clip 2',
    alt: 'Career assessment clip preview',
  },
  {
    type: 'video',
    src: '/assessments/VID-20260718-WA0014.mp4',
    title: 'Assessment Clip 3',
    alt: 'Career assessment video preview',
  },
  {
    type: 'video',
    src: '/assessments/VID-20260718-WA0015.mp4',
    title: 'Assessment Clip 4',
    alt: 'Career assessment video preview',
  },
]

const wellnessMedia: GalleryMediaItem[] = [
  {
    type: 'image',
    src: '/Wellness/WhatsApp Image 2026-07-12 at 11.59.22 (1).jpeg',
    title: 'Wellness Moment 1',
    alt: 'Wellness group moment',
  },
  {
    type: 'image',
    src: '/Wellness/WhatsApp Image 2026-07-12 at 11.59.22 (2).jpeg',
    title: 'Wellness Moment 2',
    alt: 'Wellness program snapshot',
  },
  {
    type: 'image',
    src: '/Wellness/WhatsApp Image 2026-07-12 at 11.59.22.jpeg',
    title: 'Wellness Moment 3',
    alt: 'Wellness session community experience',
  },
  {
    type: 'image',
    src: '/Wellness/WhatsApp Image 2026-07-12 at 11.59.23 (1).jpeg',
    title: 'Wellness Moment 4',
    alt: 'Wellness group interaction',
  },
  {
    type: 'image',
    src: '/Wellness/WhatsApp Image 2026-07-12 at 11.59.23 (2).jpeg',
    title: 'Wellness Moment 5',
    alt: 'Wellness event moment',
  },
  {
    type: 'image',
    src: '/Wellness/WhatsApp Image 2026-07-12 at 11.59.23.jpeg',
    title: 'Wellness Moment 6',
    alt: 'Wellness activity and participant engagement',
  },
  {
    type: 'video',
    src: '/Wellness/WhatsApp Video 2026-07-12 at 11.59.22.mp4',
    title: 'Wellness Clip 1',
    alt: 'Wellness session video preview',
  },
  {
    type: 'video',
    src: '/Wellness/WhatsApp Video 2026-07-12 at 11.59.24.mp4',
    title: 'Wellness Clip 2',
    alt: 'Wellness session video preview',
  },
]

const galleryPrograms: GalleryProgram[] = [
  {
    title: 'Career Assessment',
    description:
      'A public-facing look at discovery sessions, assessment conversations, and outcome-led career clarity moments.',
    media: assessmentMedia,
  },
  {
    title: 'Counselling',
    description:
      'One-on-one guidance moments and reflective planning conversations that shape the next steps students actually take.',
    media: assessmentMedia,
  },
  {
    title: 'Mindset Workshops',
    description:
      'Workshop energy, participation, and practical exercises from sessions designed to shift confidence and clarity.',
    media: wellnessMedia,
  },
]

function GalleryMediaPreview({ item }: { item: GalleryMediaItem }) {
  if (item.type === 'image') {
    return (
      <div className="relative h-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>
    )
  }

  return (
    <div className="relative h-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
      <video
        src={item.src}
        muted
        playsInline
        controls
        className="h-full w-full object-cover"
      />
    </div>
  )
}

function GalleryProgramCard({ program }: { program: GalleryProgram }) {
  const [api, setApi] = useState<CarouselApi>()
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  useEffect(() => {
    if (!api) {
      return
    }

    const timer = window.setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => window.clearInterval(timer)
  }, [api])

  useEffect(() => {
    if (!api) {
      return
    }

    const syncVideoPlayback = () => {
      const activeIndex = api.selectedScrollSnap()

      videoRefs.current.forEach((video, index) => {
        if (!video) {
          return
        }

        if (index === activeIndex) {
          if (video.readyState >= 1) {
            video.play().catch(() => undefined)
          } else {
            video.onloadeddata = () => {
              video.play().catch(() => undefined)
            }
          }
          return
        }

        video.pause()
        video.currentTime = 0
      })
    }

    syncVideoPlayback()
    api.on('select', syncVideoPlayback)

    return () => {
      api.off('select', syncVideoPlayback)
    }
  }, [api, program.media])

  const photoCount = program.media.filter((item) => item.type === 'image').length
  const videoCount = program.media.length - photoCount

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
              Public program gallery
            </p>
            <h3 className="font-h3 text-h3 text-primary">{program.title}</h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            <span>{photoCount} photos</span>
            <span className="text-slate-300">+</span>
            <span>{videoCount} videos</span>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{program.description}</p>
      </div>

      <div className="flex flex-col gap-5 p-4 lg:flex-row lg:items-start lg:p-6">
        <div className="relative w-full lg:w-[68%]">
          <Carousel opts={{ loop: true, align: 'start' }} setApi={setApi} className="w-full">
            <CarouselContent className="-ml-0">
              {program.media.map((item, index) => (
                <CarouselItem key={`${program.title}-${item.title}`} className="basis-full pl-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white md:aspect-[16/10]">
                    {item.type === 'image' ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        priority={item.src.includes('WA0008')}
                        className="object-contain"
                        sizes="(min-width: 1280px) 60vw, (min-width: 768px) 55vw, 100vw"
                      />
                    ) : (
                      <video
                        ref={(element) => {
                          videoRefs.current[index] = element
                        }}
                        src={item.src}
                        muted
                        playsInline
                        controls
                        autoPlay
                        loop
                        preload="auto"
                        className="h-full w-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/20 to-slate-900/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-slate-950/40 px-3 py-2 backdrop-blur-sm">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/80">
                            {item.type === 'image' ? 'Photo' : 'Video'}
                          </p>
                        </div>
                        <div className="rounded-full bg-white/15 p-2 text-white">
                          {item.type === 'image' ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 hidden md:flex" />
            <CarouselNext className="-right-3 hidden md:flex" />
          </Carousel>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-[32%]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.32em] text-secondary font-label-bold">
              Preview strip
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {program.media.slice(0, 4).map((item) => (
                <GalleryMediaPreview key={`${program.title}-${item.title}-strip`} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
            Each program now presents its own media story so visitors can understand the work in context rather than as one mixed archive.
          </div>
        </div>
      </div>
    </article>
  )
}

export function GalleryCollageSection() {
  return (
    <section className="mt-10 bg-surface-container-lowest px-6 py-xl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
            Program Moments
          </p>
          <h2 className="font-h2 text-h2 text-primary">
            Gallery moments across career guidance, counselling, and workshops.
          </h2>
        </div>

        {galleryPrograms.map((program) => (
          <GalleryProgramCard key={program.title} program={program} />
        ))}
      </div>
    </section>
  )
}
