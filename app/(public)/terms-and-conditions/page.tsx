import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/LegalPage'
import { termsAndConditionsSections } from '@/lib/legal-content'

export const metadata: Metadata = {
  title: 'Terms and Conditions | EduMindWell',
  description: 'Terms and conditions for accessing and using EduMindWell.',
}

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      description="These terms govern access to and use of the EduMindWell website, products, and services."
      sections={termsAndConditionsSections}
    />
  )
}
