'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Quote, Volume2, VolumeX } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'

type TestimonialRecord = {
  id: string
  contentType?: 'TEXT' | 'VIDEO'
  title?: string | null
  quote?: string | null
  beforeText?: string | null
  afterText?: string | null
  attribution: string
  videoUrl?: string | null
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function TextTestimonialCard({ story }: { story: TestimonialRecord }) {
  return (
    <article className="flex min-h-[270px] flex-col rounded-2xl bg-white p-4 text-slate-800 shadow-[0_12px_24px_rgba(8,42,120,0.18)] lg:h-[330px] lg:min-h-0 lg:overflow-hidden">
      <Quote className="h-8 w-8 fill-blue-100 text-blue-200" aria-hidden="true" />

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-red-50 p-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wide text-red-600">Before</p>
          <p className="mt-1 line-clamp-4 text-[11px] leading-relaxed text-slate-700">
            {story.beforeText || 'Looking for the right direction'}
          </p>
        </div>
        <div className="rounded-md bg-emerald-50 p-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">After</p>
          <p className="mt-1 line-clamp-4 text-[11px] leading-relaxed text-slate-700">
            {story.afterText || 'Moving ahead with confidence'}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-4 flex-1 text-xs italic leading-relaxed text-slate-600">
        “{story.quote || 'The guidance helped me take my next step with confidence.'}”
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
          {initials(story.attribution)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-slate-800">{story.attribution}</p>
          <p className="text-[10px] text-slate-500">Student / Parent</p>
        </div>
      </div>
    </article>
  )
}

function VideoTestimonialSlide({
  story,
  active,
}: {
  story: TestimonialRecord
  active: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (active) {
      video.play().catch(() => undefined)
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [active])

  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40 shadow-2xl sm:h-[340px] lg:h-[330px]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        autoPlay={active}
        muted={muted}
        loop
        playsInline
        preload={active ? 'auto' : 'metadata'}
        src={story.videoUrl ?? undefined}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{story.title || story.attribution}</p>
          <p className="text-xs text-blue-100">{story.attribution}</p>
        </div>
        <button
          type="button"
          aria-label={muted ? 'Unmute student video' : 'Mute student video'}
          onClick={() => setMuted((current) => !current)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded bg-black/55 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  )
}

function SectionControl({
  label,
  onClick,
  direction,
}: {
  label: string
  onClick: () => void
  direction: 'previous' | 'next'
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

export function StoriesSection() {
  const [stories, setStories] = useState<TestimonialRecord[]>([])
  const [videoApi, setVideoApi] = useState<CarouselApi>()
  const [videoIndex, setVideoIndex] = useState(0)
  const [textMarqueeDirection, setTextMarqueeDirection] = useState<'normal' | 'reverse'>('normal')
  const [isVideoCarouselPaused, setIsVideoCarouselPaused] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadStories = async () => {
      try {
        const response = await fetch('/api/testimonials?scope=home', { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to load testimonials')

        const data = (await response.json()) as TestimonialRecord[]
        if (isMounted && Array.isArray(data)) setStories(data)
      } catch {
        if (isMounted) setStories([])
      }
    }

    void loadStories()

    return () => {
      isMounted = false
    }
  }, [])

  const videoStories = useMemo(
    () => stories.filter((story) => story.contentType === 'VIDEO' && story.videoUrl),
    [stories],
  )
  const textStories = useMemo(
    () => stories.filter((story) => story.contentType !== 'VIDEO'),
    [stories],
  )

  useEffect(() => {
    if (!videoApi || videoStories.length < 2 || isVideoCarouselPaused) return

    const timer = window.setInterval(() => {
      videoApi.scrollNext()
    }, 5000)

    return () => window.clearInterval(timer)
  }, [isVideoCarouselPaused, videoApi, videoStories.length])

  useEffect(() => {
    if (!videoApi) return

    const syncVideoIndex = () => setVideoIndex(videoApi.selectedScrollSnap())
    syncVideoIndex()
    videoApi.on('select', syncVideoIndex)

    return () => {
      videoApi.off('select', syncVideoIndex)
    }
  }, [videoApi])

  const moveVideo = (direction: -1 | 1) => {
    if (videoStories.length < 2) return
    if (direction === 1) videoApi?.scrollNext()
    else videoApi?.scrollPrev()
  }

  return (
    <section id="stories" className="relative isolate overflow-hidden bg-gradient-to-br from-[#1e56d7] via-[#1548bb] to-[#0c348e] px-4 py-10 text-white sm:px-6 sm:py-12 lg:py-14">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-cyan-300">Student stories</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Real Students. Real Decisions. <span className="text-cyan-300">Real Results.</span>
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Hear from students and parents who found clarity, confidence and the right career path with EduMindWell.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.5fr] lg:gap-10">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-300/80 text-white">
                  <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold">Student Videos</h3>
                  <p className="text-xs text-blue-100">Watch real stories from our students</p>
                </div>
              </div>
              <div className="flex gap-2">
                <SectionControl label="Previous student video" direction="previous" onClick={() => moveVideo(-1)} />
                <SectionControl label="Next student video" direction="next" onClick={() => moveVideo(1)} />
              </div>
            </div>

            <div
              className="mx-auto mt-4 max-w-md"
              onMouseEnter={() => setIsVideoCarouselPaused(true)}
              onMouseLeave={() => setIsVideoCarouselPaused(false)}
            >
              {videoStories.length ? (
                <Carousel
                  setApi={setVideoApi}
                  opts={{ loop: videoStories.length > 1 }}
                  aria-label="Student video carousel"
                >
                  <CarouselContent>
                    {videoStories.map((story, index) => (
                      <CarouselItem key={story.id}>
                        <VideoTestimonialSlide story={story} active={index === videoIndex} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-blue-100">
                  Video stories will appear here soon.
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-center gap-2" aria-label="Student video slides">
              {videoStories.map((story, index) => (
                <button
                  key={story.id}
                  type="button"
                  aria-label={`Show student video ${index + 1}`}
                  aria-current={index === videoIndex}
                  onClick={() => videoApi?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all ${index === videoIndex ? 'w-5 bg-cyan-300' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-300/80 text-xl font-bold text-white">“</span>
                <div>
                  <h3 className="font-semibold">What Students &amp; Parents Say</h3>
                  <p className="text-xs text-blue-100">Real experiences. Real impact.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <SectionControl label="Move text testimonials left" direction="previous" onClick={() => setTextMarqueeDirection('normal')} />
                <SectionControl label="Move text testimonials right" direction="next" onClick={() => setTextMarqueeDirection('reverse')} />
              </div>
            </div>

            {textStories.length ? (
              <div className="testimonial-text-viewport mt-4 overflow-hidden" aria-label="Continuously rotating text testimonials">
                <div
                  className={`testimonial-text-track flex ${textStories.length > 1 ? 'testimonial-text-track--animated' : ''}`}
                  style={{
                    animationDuration: `${Math.max(textStories.length, 4)}s`,
                    animationDirection: textMarqueeDirection,
                  }}
                >
                  {[0, 1].slice(0, textStories.length > 1 ? 2 : 1).map((copy) => (
                    <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-3 pr-3">
                      {textStories.map((story) => (
                        <div key={`${story.id}-${copy}`} className="w-[min(78vw,260px)] shrink-0">
                          <TextTestimonialCard story={story} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-white/10 p-6 text-sm text-blue-100">
                Text testimonials will appear here soon.
              </div>
            )}
          </div>
        </div>

      </div>

      <div aria-hidden="true" className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl" />
      <div aria-hidden="true" className="absolute -left-20 bottom-0 h-40 w-80 rounded-[50%] bg-slate-200/80 blur-[1px]" />
    </section>
  )
}
