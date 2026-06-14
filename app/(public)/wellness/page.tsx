import { PublicPageShell } from '@/components/landing/PublicPageShell'
import { WellnessSection } from '@/components/landing/WellnessSection'

const wellnessFeatures = [
  {
    title: 'Customized Therapeutic Meditation',
    description:
      'Personalized support designed around stress, confidence, relationships, health, and clarity.',
  },
  {
    title: 'Individual Wellness Coaching',
    description:
      'One-on-one coaching that keeps the focus on practical growth and steady support.',
  },
  {
    title: 'Group Meditation Programs',
    description:
      'Flexible programs for schools, parents, students, corporates, and community groups.',
  },
  {
    title: 'MiracleX App',
    description:
      'A daily companion with guided meditation, gratitude, affirmations, goals, and tracking.',
  },
  {
    title: 'Learning Videos',
    description:
      'Supportive video content for ongoing wellness habits and low-friction learning.',
  },
]

export default function WellnessPage() {
  return (
    <PublicPageShell
      eyebrow="Wellness"
      title="A calmer path to focus, balance, and daily consistency."
      description="The wellness page collects the meditation, coaching, group program, and app offerings into one place so they can stand on their own."
      features={wellnessFeatures}
    >
      <WellnessSection variant="1" />
    </PublicPageShell>
  )
}