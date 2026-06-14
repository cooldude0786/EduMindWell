import { CheckCircle2, MessagesSquare, LibraryBig } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CAREER_STEPS } from '@/lib/landing-constants'

export function CareerGuidance() {
  return (
    <section id="career" className="py-xl px-6 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-[42rem] min-w-0">
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-primary-fixed-dim font-label-bold">
              Career
            </p>
            <h2 className="mb-4 max-w-[36rem] font-h2 text-h2">
              Clarity starts with the right career support.
              <br />
              <span className="text-secondary">Assess. Counsel. Explore.</span>
            </h2>
            <p className="w-full max-w-[32rem] text-body-lg leading-relaxed text-primary-fixed-dim text-pretty">
              Students can begin with assessments, review their report with expert
              counsellors, and use the library to compare pathways with confidence.
            </p>
          </div>
          <Button className="h-auto self-start rounded-xl bg-white px-8 py-4 text-button font-button whitespace-nowrap !text-primary transition-colors hover:bg-slate-100 md:self-auto">
            Start Your Roadmap
          </Button>
        </div>

        <div className="mb-14 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <CheckCircle2 className="mb-4 h-5 w-5 text-secondary" />
            <h3 className="font-h3 text-lg">Career Assessments</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-fixed-dim">
              Discover strengths, interests, and direction with a structured
              assessment flow.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <MessagesSquare className="mb-4 h-5 w-5 text-secondary" />
            <h3 className="font-h3 text-lg">Career Counselling</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-fixed-dim">
              Expert counsellors interpret the report and help map practical next
              steps.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <LibraryBig className="mb-4 h-5 w-5 text-secondary" />
            <h3 className="font-h3 text-lg">Career Library</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-fixed-dim">
              Compare careers, colleges, and pathways in one place.
            </p>
          </div>
        </div>

        {/* 6 Steps Timeline */}
        <div className="relative grid gap-8 md:grid-cols-6">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-white/10 z-0"></div>

          {/* Steps */}
          {CAREER_STEPS.map((step) => (
            <div key={step.number} className="relative z-10 space-y-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step.isActive
                    ? 'bg-white text-primary shadow-lg'
                    : 'bg-white/20 text-white'
                }`}
              >
                {step.number}
              </div>
              <h4 className="font-bold text-sm">{step.title}</h4>
              <p className="text-xs text-primary-fixed-dim">{step.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
