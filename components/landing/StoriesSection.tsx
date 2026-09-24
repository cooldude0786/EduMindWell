'use client'

import { STORIES } from '@/lib/landing-constants'

export function StoriesSection() {
  return (
    <section id="stories" className="overflow-x-clip bg-primary px-6 py-xl text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-h2 text-h2 mb-16 text-center">
          Real Students. Real Decisions. Real Results.
        </h2>

        <div className="stories-carousel overflow-hidden pb-4">
          <div className="stories-track flex w-max gap-8">
            {[...STORIES, ...STORIES].map((story, index) => (
              <div
                key={`${story.id}-${index}`}
                className="flex min-h-[470px] w-[calc(100vw-3rem)] shrink-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-7 transition-colors hover:bg-white/10 md:w-96"
              >
                <div className="mb-5 flex min-h-[155px] gap-4">
                  <div className="flex flex-1 flex-col rounded-xl border border-red-300/20 bg-red-500/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-red-300 mb-1">
                      Before
                    </p>
                    <p className="text-sm leading-relaxed text-white/90">{story.beforeText}</p>
                  </div>
                  <div className="flex flex-1 flex-col rounded-xl border border-green-300/20 bg-green-500/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-green-300 mb-1">
                      After
                    </p>
                    <p className="text-sm leading-relaxed text-white/90">{story.afterText}</p>
                  </div>
                </div>

                <p className="mb-4 min-h-[90px] text-sm italic leading-relaxed text-primary-fixed-dim">
                  "{story.quote}"
                </p>

                <div className="mt-auto flex min-h-10 items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-white/20" aria-hidden="true" />
                  <span className="text-sm font-bold leading-tight">{story.attribution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
