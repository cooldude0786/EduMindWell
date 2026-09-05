import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/LegalPage'
import { termsAndConditionsSections } from '@/lib/legal-content'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Terms and Conditions | EduMindWell',
  description: 'Terms and conditions for accessing and using EduMindWell.',
}

export default async function TermsAndConditionsPage() {
  const sections = await prisma.termsAndConditionsSection.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { order: 'asc' },
    include: { paragraphs: { orderBy: { order: 'asc' } } },
  })

  const formatted = sections.length > 0
    ? sections.map((section) => ({ title: section.title || 'Terms', paragraphs: section.paragraphs.map((paragraph) => paragraph.text) }))
    : termsAndConditionsSections

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      description="These terms govern access to and use of the EduMindWell website, products, and services."
      sections={formatted}
    />
  )
}
