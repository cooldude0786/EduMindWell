import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/LegalPage'
import { refundPolicySections } from '@/lib/legal-content'

export const metadata: Metadata = {
  title: 'Refund Policy | EduMindWell',
  description: 'Refund policy for EduMindWell services.',
}

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Policy"
      title="Refund Policy"
      description="Please review the refund terms applicable to EduMindWell services before making a payment."
      sections={refundPolicySections}
    />
  )
}
