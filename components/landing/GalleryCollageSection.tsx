'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Pause, Play, Volume2, VolumeX } from 'lucide-react'
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

const defaultAssessmentMedia: GalleryMediaItem[] = [
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

const defaultCounsellingMedia: GalleryMediaItem[] = []

const defaultWellnessMedia: GalleryMediaItem[] = [
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
  const [isHovered, setIsHovered] = useState(false)
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [muted, setMuted] = useState(true)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  useEffect(() => {
    if (!api) {
      return
    }

    const timer = window.setInterval(() => {
      if (!isHovered) api.scrollNext()
    }, 4000)

    return () => window.clearInterval(timer)
  }, [api, isHovered])

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

      <div
        className="flex flex-col gap-5 p-4 lg:flex-row lg:items-start lg:p-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full lg:w-[68%]">
          <Carousel opts={{ loop: true, align: 'start' }} setApi={setApi} className="w-full">
            <CarouselContent className="-ml-0">
              {program.media.length === 0 ? (
                <CarouselItem className="basis-full pl-0">
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] bg-slate-100 text-sm text-slate-500 md:aspect-[16/10]">
                    Counselling media coming soon.
                  </div>
                </CarouselItem>
              ) : Array.from({ length: Math.ceil(program.media.length / 3) }).map((_, slideIndex) => (
                <CarouselItem key={`${program.title}-collage-${slideIndex}`} className="basis-full pl-0">
                  <div className="grid aspect-[4/3] grid-cols-2 gap-2 overflow-hidden rounded-[24px] bg-white p-2 md:aspect-[16/10] md:gap-3 md:p-3">
                    {program.media.slice(slideIndex * 3, slideIndex * 3 + 3).map((item, itemIndex) => (
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-slate-100 ${itemIndex === 0 ? 'row-span-2' : ''}`}
                      key={`${program.title}-${item.title}-${slideIndex}-${itemIndex}`}
                      onClick={() => {
                        const video = videoRefs.current[slideIndex * 3 + itemIndex]
                        if (item.type === 'video' && video) {
                          if (video.paused) {
                            video.play().catch(() => undefined)
                            setPlayingKey(`${slideIndex}-${itemIndex}`)
                          } else {
                            video.pause()
                            setPlayingKey(null)
                          }
                        }
                      }}
                    >
                    {item.type === 'image' ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        priority={slideIndex === 0 && itemIndex === 0}
                        className="object-cover"
                        sizes="(min-width: 1280px) 60vw, (min-width: 768px) 55vw, 100vw"
                      />
                    ) : (
                      <video
                        ref={(element) => {
                          videoRefs.current[slideIndex * 3 + itemIndex] = element
                        }}
                        src={item.src}
                        playsInline
                        controls={false}
                        muted={muted}
                        onPlay={() => setPlayingKey(`${slideIndex}-${itemIndex}`)}
                        onPause={() => setPlayingKey(null)}
                        loop
                        preload="auto"
                        className="h-full w-full object-cover"
                      />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/20 to-slate-900/10" />
                    <div className="pointer-events-none absolute bottom-0 right-0 p-3">
                        {item.type === 'image' ? (
                          <div className="rounded-full bg-slate-950/50 p-2 text-white"><ImageIcon className="h-4 w-4" /></div>
                        ) : (
                          <div className="pointer-events-auto flex items-center gap-1">
                            <button
                              type="button"
                              aria-label={playingKey === `${slideIndex}-${itemIndex}` ? 'Pause video' : 'Play video'}
                              className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/35"
                              onClick={(event) => {
                                event.stopPropagation()
                                const video = videoRefs.current[slideIndex * 3 + itemIndex]
                                if (!video) return
                                if (video.paused) {
                                  video.play().catch(() => undefined)
                                } else {
                                  video.pause()
                                }
                              }}
                            >
                              {playingKey === `${slideIndex}-${itemIndex}` ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </button>
                            <button
                              type="button"
                              aria-label={muted ? 'Unmute video' : 'Mute video'}
                              className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/35"
                              onClick={(event) => {
                                event.stopPropagation()
                                setMuted((current) => !current)
                              }}
                            >
                              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </button>
                          </div>
                        )}
                    </div>
                    </div>
                    ))}
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
              {program.media.slice(0, 4).map((item, index) => (
                <GalleryMediaPreview key={`${program.title}-${item.title}-${index}-strip`} item={item} />
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
  const [assessmentMedia, setAssessmentMedia] = useState<GalleryMediaItem[]>([])
  const [counsellingMedia, setCounsellingMedia] = useState<GalleryMediaItem[]>(defaultCounsellingMedia)
  const [wellnessMedia, setWellnessMedia] = useState<GalleryMediaItem[]>([])

  useEffect(() => {
    async function loadMedia() {
      try {
        const [assessmentRes, counsellingRes, wellnessRes] = await Promise.all([
          fetch('/api/media?mediaGroup=ASSESSMENT'),
          fetch('/api/media?mediaGroup=COUNSELLING'),
          fetch('/api/media?section=WELLNESS'),
        ])

        if (assessmentRes.ok) {
          const galleryData = await assessmentRes.json()
          if (galleryData.length > 0) {
            setAssessmentMedia(
              galleryData.map((asset: any) => ({
                type: asset.type.toLowerCase() as 'image' | 'video',
                src: asset.publicUrl,
                title: asset.title || 'Career Assessment Moment',
                alt: asset.altText || 'Career assessment moment',
              }))
            )
          }
        }

        if (counsellingRes.ok) {
          const counsellingData = await counsellingRes.json()
          if (counsellingData.length > 0) {
            setCounsellingMedia(counsellingData.map((asset: any) => ({
              type: asset.type.toLowerCase() as 'image' | 'video',
              src: asset.publicUrl,
              title: asset.title || 'Counselling Moment',
              alt: asset.altText || 'Counselling moment',
            })))
          }
        }

        if (wellnessRes.ok) {
          const wellnessData = await wellnessRes.json()
          if (wellnessData.length > 0) {
            setWellnessMedia(
              wellnessData.map((asset: any) => ({
                type: asset.type.toLowerCase() as 'image' | 'video',
                src: asset.publicUrl,
                title: asset.title || 'Wellness Moment',
                alt: asset.altText || 'Wellness session moment',
              }))
            )
          }
        }
      } catch (err) {
        console.error('Failed to load collage gallery media:', err)
      }
    }
    loadMedia()
  }, [])

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
      media: counsellingMedia,
    },
    {
      title: 'Mindset Workshops',
      description:
        'Workshop energy, participation, and practical exercises from sessions designed to shift confidence and clarity.',
      media: wellnessMedia,
    },
  ]

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
