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
import { TESTIMONIAL_MEDIA } from '@/lib/landing-constants'

type TestimonialSlide = {
  type: 'image' | 'video'
  src: string
  alt: string
}

const testimonialGroups: TestimonialSlide[][] = [
  TESTIMONIAL_MEDIA.slice(0, 3).map((src, index) => ({
    type: src.endsWith('.mp4') ? 'video' : 'image',
    src,
    alt: `Testimonial media ${index + 1}`,
  })),
  TESTIMONIAL_MEDIA.slice(3, 5).map((src, index) => ({
    type: src.endsWith('.mp4') ? 'video' : 'image',
    src,
    alt: `Testimonial media ${index + 4}`,
  })),
  TESTIMONIAL_MEDIA.slice(5).map((src, index) => ({
    type: src.endsWith('.mp4') ? 'video' : 'image',
    src,
    alt: `Testimonial media ${index + 6}`,
  })),
]

function TestimonialMediaCard({ slides }: { slides: TestimonialSlide[] }) {
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
  }, [api, slides])

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="border-b border-white/10 px-4 py-3 md:px-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary-fixed-dim font-label-bold">
          Story highlights
        </p>
      </div>

      <div className="p-4 md:p-5">
        <Carousel opts={{ loop: true, align: 'start' }} setApi={setApi} className="w-full">
          <CarouselContent className="ml-0">
            {slides.map((item, index) => (
              <CarouselItem key={`${item.src}-${index}`} className="basis-full pl-0">
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-slate-950 md:aspect-16/10">
                  {item.type === 'image' ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-contain object-center"
                      sizes="(min-width: 768px) 33vw, 100vw"
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
                      className="h-full w-full object-contain object-center bg-slate-950"
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-slate-950/45 px-3 py-2 backdrop-blur-sm">
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {item.type === 'image' ? 'Photo moment' : 'Video moment'}
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
          <CarouselPrevious className="-left-2 hidden md:flex" />
          <CarouselNext className="-right-2 hidden md:flex" />
        </Carousel>
      </div>
    </article>
  )
}

export function StoriesSection() {
  return (
    <section id="stories" className="bg-primary px-6 py-xl text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-center text-[10px] uppercase tracking-[0.35em] text-primary-fixed-dim font-label-bold">
          Testimonials
        </p>
        <h2 className="mb-8 text-center font-h2 text-h2">
          Real stories from students, parents, and guides.
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonialGroups.map((slides, index) => (
            <TestimonialMediaCard key={`testimonial-card-${index}`} slides={slides} />
          ))}
        </div>
      </div>
    </section>
  )
}
