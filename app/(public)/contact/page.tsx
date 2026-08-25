'use client'

import { CTABanner } from '@/components/landing/CTABanner'
import { PublicPageShell } from '@/components/landing/PublicPageShell'
import { useContactDetails } from '@/components/landing/useContactDetails'

export default function ContactPage() {
  const { contactDetails } = useContactDetails()
  const contactFeatures = contactDetails ? [
    { title: 'Address', description: contactDetails.address },
    { title: 'Email', description: contactDetails.email },
    { title: 'Phone', description: [contactDetails.phone, contactDetails.secondaryPhone].filter(Boolean).join(', ') },
  ] : []

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