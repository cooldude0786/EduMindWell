'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { STORIES } from '@/lib/landing-constants'

export function StoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollStories = (direction: number) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.firstElementChild?.getBoundingClientRect().width || 400
      const gap = 32 // tailwind gap-8 = 2rem = 32px
      containerRef.current.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: 'smooth',
      })
    }
  }

  return (
    <section id="stories" className="py-xl px-6 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <p className="mb-3 text-center text-[10px] uppercase tracking-[0.35em] text-primary-fixed-dim font-label-bold">
          Testimonials
        </p>
        <h2 className="font-h2 text-h2 mb-16 text-center">
          Real stories from students, parents, and guides.
        </h2>

        {/* Stories Scroll Container */}
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {STORIES.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 w-full md:w-96 bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors snap-center"
              >
                {/* Before/After Panels */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 p-4 bg-red-500/10 border border-red-300/20 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-red-300 mb-1">
                      Before
                    </p>
                    <p className="text-sm text-white/90">{story.beforeText}</p>
                  </div>
                  <div className="flex-1 p-4 bg-green-500/10 border border-green-300/20 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-green-300 mb-1">
                      After
                    </p>
                    <p className="text-sm text-white/90">{story.afterText}</p>
                  </div>
                </div>

                {/* Quote */}
                <p className="italic text-primary-fixed-dim text-sm mb-4">
                  &ldquo;{story.quote}&rdquo;
                </p>

                {/* Attribution */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20"></div>
                  <span className="text-sm font-bold">{story.attribution}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scrollStories(-1)}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scrollStories(1)}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
