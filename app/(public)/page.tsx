import { HeroSection } from '@/components/landing/HeroSection'
import { InstitutionLogoSection } from '@/components/landing/InstitutionLogoSection'
import { AudienceSection } from '@/components/landing/AudienceSection'
import { WellnessSection } from '@/components/landing/WellnessSection'
import { StoriesSection } from '@/components/landing/StoriesSection'
import { GallerySection } from '@/components/landing/GallerySection'
import { FAQ } from '@/components/landing/FAQ'
import { CTABanner } from '@/components/landing/CTABanner'

export const metadata = {
  title: 'EduMindWell | Career. Mind. Wellbeing. All Aligned.',
  description:
    'Empowering students from Class 8 to 12 to build confident careers without sacrificing their mental wellbeing. Structured. Scientific. Personal.',
  keywords: [
    'career guidance',
    'student counseling',
    'mental wellness',
    'college selection',
    'career planning',
  ],
  openGraph: {
    title: 'EduMindWell | Career. Mind. Wellbeing. All Aligned.',
    description:
      'Empowering students with AI-driven career guidance and holistic wellness programs.',
    type: 'website',
    locale: 'en_US',
  },
}

type HomePageProps = {
  searchParams: Promise<{
    wellness?: string | string[]
  }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const wellnessParam = resolvedSearchParams.wellness
  const wellnessChoiceRaw = Array.isArray(wellnessParam)
    ? wellnessParam[0]
    : wellnessParam
  const wellnessChoice =
    wellnessChoiceRaw === '2' ||
    wellnessChoiceRaw === '3' ||
    wellnessChoiceRaw === '4'
      ? wellnessChoiceRaw
      : '1'

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <HeroSection />
      <InstitutionLogoSection />
      <AudienceSection />
      <WellnessSection variant={wellnessChoice} />
      <StoriesSection />
      <GallerySection />
      <FAQ />
      <CTABanner />
    </div>
  )
}
