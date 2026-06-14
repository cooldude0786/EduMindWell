import { ArrowRight, BookOpen, Users, Briefcase } from 'lucide-react'
import { AUDIENCE_CARDS } from '@/lib/landing-constants'

const iconMap = {
  BookOpen,
  Users,
  Briefcase,
}

export function AudienceSection() {
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
                  <div className="w-full h-full bg-cover bg-center"></div>
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
