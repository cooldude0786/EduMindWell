import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { ThreePillars } from '@/components/landing/ThreePillars'
import { CareerGuidance } from '@/components/landing/CareerGuidance'
import { AudienceSection } from '@/components/landing/AudienceSection'
import { StoriesSection } from '@/components/landing/StoriesSection'
import { FAQ } from '@/components/landing/FAQ'
import { CTABanner } from '@/components/landing/CTABanner'
import { Footer } from '@/components/landing/Footer'

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

export default function Home() {
  return (
    <main className="bg-background text-on-background font-body-md overflow-x-hidden">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Sections */}
      <HeroSection />
      <ProblemSection />
      <ThreePillars />
      {/* <CareerGuidance /> */}
      {/* <AudienceSection />   */}
      <StoriesSection />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  )
}