import { Card } from '@/components/ui/card'
import { ArrowRight, Route, Users2, Sparkles } from 'lucide-react'
import { PILLARS } from '@/lib/landing-constants'

const iconMap = {
  route: Route,
  groups: Users2,
  spa: Sparkles,
}

interface PillarCardProps {
  icon: keyof typeof iconMap
  title: string
  color: 'primary' | 'secondary' | 'on-tertiary-container'
  description: string
  linkText: string
  href?: string
}

function PillarCard({
  icon,
  title,
  color,
  description,
  linkText,
  href,
}: PillarCardProps) {
  const IconComponent = iconMap[icon]
  const colorClasses = {
    primary: 'bg-primary/5 group-hover:bg-primary group-hover:text-white',
    secondary: 'bg-secondary/5 group-hover:bg-secondary group-hover:text-white',
    'on-tertiary-container':
      'bg-on-tertiary-container/5 group-hover:bg-on-tertiary-container group-hover:text-white',
  }

  const textColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    'on-tertiary-container': 'text-on-tertiary-container',
  }

  return (
    <Card className="bg-white p-10 rounded-[32px] shadow-sm border border-indigo-50 hover:shadow-xl transition-all group">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all ${colorClasses[color]}`}
      >
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className={`font-h3 text-h3 ${textColors[color]} mb-4`}>{title}</h3>
      <p className="text-body-md text-on-surface-variant mb-6">{description}</p>
      <a
        href={href ?? '#'}
        target={href ? '_blank' : undefined}
        rel={href ? 'noreferrer noopener' : undefined}
        className={`${textColors[color]} font-bold inline-flex items-center gap-2 hover:gap-3 transition-all`}
      >
        {linkText} <ArrowRight className="w-4 h-4" />
      </a>
    </Card>
  )
}

export function ThreePillars() {
  return (
    <section id="pillars" className="py-xl px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-h2 text-h2 text-primary mb-4">
            One Platform. Three Pillars. Complete Transformation.
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Most guidance stops at career advice. We go further.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, index) => (
            <PillarCard
              key={index}
              icon={pillar.icon as keyof typeof iconMap}
              title={pillar.title}
              color={pillar.color}
              description={pillar.description}
              linkText={pillar.linkText}
              href={pillar.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
