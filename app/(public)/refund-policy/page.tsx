import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/LegalPage'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Refund Policy | EduMindWell',
  description: 'Refund policy for EduMindWell services.',
}

export default async function RefundPolicyPage() {
  const sections = await prisma.refundPolicySection.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { order: 'asc' },
    include: { paragraphs: { orderBy: { order: 'asc' } } },
  })

  const formatted = sections.map((s) => ({
    title: s.title || 'Policy',
    paragraphs: s.paragraphs.map((p) => p.text),
  }))

  return (
    <LegalPage
      eyebrow="Policy"
      title="Refund Policy"
      description="Please review the refund terms applicable to EduMindWell services before making a payment."
      sections={formatted}
    />
  )
}
