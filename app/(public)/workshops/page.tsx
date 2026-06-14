import { AudienceSection } from '@/components/landing/AudienceSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { PublicPageShell } from '@/components/landing/PublicPageShell'

const workshopFeatures = [
  {
    title: 'Students',
    description:
      'Goal setting, time management, resilience, confidence, and emotional balance for daily life.',
  },
  {
    title: 'Parents',
    description:
      'Programs that help parents support children through every stage with more clarity and less friction.',
  },
  {
    title: 'Teachers / Professionals',
    description:
      'Workshop formats for classroom confidence, emotional intelligence, and team growth.',
  },
]

export default function WorkshopsPage() {
  return (
    <PublicPageShell
      eyebrow="Mindset Workshops"
      title="Practical workshops for students, parents, and professionals."
      description="Use this page to explore the workshop offering as a standalone destination, with the same tone and structure as the main site."
      features={workshopFeatures}
    >
      <AudienceSection />
      <ProblemSection />
    </PublicPageShell>
  )
}