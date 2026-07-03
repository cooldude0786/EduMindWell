import { CTABanner } from '@/components/landing/CTABanner'
import { PublicPageShell } from '@/components/landing/PublicPageShell'

const contactFeatures = [
  {
    title: 'Address',
    description: '401, Vishal, Janki kutir, Juhu church road, Juhu 400049',
  },
  {
    title: 'Email',
    description: 'hello@edumindwell.com',
  },
  {
    title: 'Phone',
    description: '+91 98199 90361, +91 77188 92677',
  },
]

export default function ContactPage() {
  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Reach out when you are ready to plan the next step."
      description="The contact page keeps the practical ways to get in touch in one place, while the shared footer still stays available across the site."
      features={contactFeatures}
    >
      <CTABanner />
    </PublicPageShell>
  )
}