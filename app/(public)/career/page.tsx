import { CareerGuidance } from '@/components/landing/CareerGuidance'
import { PublicPageShell } from '@/components/landing/PublicPageShell'
import { ThreePillars } from '@/components/landing/ThreePillars'

const careerFeatures = [
  {
    title: 'Career Assessments',
    description:
      'Structured discovery that connects strengths, interests, and aptitude before choices are made.',
  },
  {
    title: 'Career Counselling',
    description:
      'Human guidance to interpret the report, compare options, and move forward with confidence.',
  },
  {
    title: 'Career Library',
    description:
      'Reference material for pathways, roles, and planning support across stages.',
  },
]

export default function CareerPage() {
  return (
    <PublicPageShell
      eyebrow="Career"
      title="Build a path that fits the student, not just the marks."
      description="This page brings together the assessment, counselling, and planning tools behind the career guidance offer so it is easy to explore on its own."
      features={careerFeatures}
    >
      <CareerGuidance />
      <ThreePillars />
    </PublicPageShell>
  )
}