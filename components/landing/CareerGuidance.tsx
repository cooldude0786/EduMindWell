import { Button } from '@/components/ui/button'
import { CAREER_STEPS } from '@/lib/landing-constants'

export function CareerGuidance() {
  return (
    <section id="career" className="py-xl px-6 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-[42rem] min-w-0">
            <h2 className="mb-4 max-w-[36rem] font-h2 text-h2">
              Most platforms give a result.
              <br />
              <span className="text-secondary">We give a 30-page roadmap.</span>
            </h2>
            <p className="w-full max-w-[32rem] text-body-lg leading-relaxed text-primary-fixed-dim text-pretty">
              A data-driven journey from uncertainty to clarity through 6 structured
              milestones.
            </p>
          </div>
          <Button className="h-auto self-start bg-white !text-primary px-8 py-4 rounded-xl text-button font-button hover:bg-slate-100 transition-colors whitespace-nowrap md:self-auto">
            Start Your Roadmap
          </Button>
        </div>

        {/* 6 Steps Timeline */}
        <div className="grid md:grid-cols-6 gap-8 relative">
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
