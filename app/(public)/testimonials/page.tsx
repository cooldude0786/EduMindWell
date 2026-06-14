import { FAQ } from '@/components/landing/FAQ'
import { PublicPageShell } from '@/components/landing/PublicPageShell'
import { StoriesSection } from '@/components/landing/StoriesSection'

const testimonialFeatures = [
  {
    title: 'Student stories',
    description:
      'Before and after snapshots from learners who needed clearer direction.',
  },
  {
    title: 'Parent stories',
    description:
      'Examples of how families moved from tension to shared understanding.',
  },
  {
    title: 'Guidance outcomes',
    description:
      'How assessment, counselling, and planning changed the next step.',
  },
]

export default function TestimonialsPage() {
  return (
    <PublicPageShell
      eyebrow="Testimonials"
      title="Real stories from students, parents, and guides."
      description="This page keeps the social proof separate so visitors can read the outcome stories without distractions."
      features={testimonialFeatures}
    >
      <StoriesSection />
      <FAQ />
    </PublicPageShell>
  )
}