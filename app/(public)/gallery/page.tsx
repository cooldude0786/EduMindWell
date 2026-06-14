import { GallerySection } from '@/components/landing/GallerySection'
import { PublicPageShell } from '@/components/landing/PublicPageShell'

const galleryFeatures = [
  {
    title: 'Career assessment',
    description:
      'Visual snapshots from assessment sessions and report reviews.',
  },
  {
    title: 'Counselling',
    description:
      'Moments from one-on-one guidance and planning conversations.',
  },
  {
    title: 'Mindset workshops',
    description:
      'Interactive session photos that show the workshop energy and format.',
  },
  {
    title: 'Wellness',
    description:
      'Meditation circles, app demos, and group experiences in practice.',
  },
]

export default function GalleryPage() {
  return (
    <PublicPageShell
      eyebrow="Gallery"
      title="See the work in context across career, mindset, and wellness."
      description="Use this page to give the visual archive a dedicated home, with enough breathing room to scan the different moments clearly."
      features={galleryFeatures}
    >
      <GallerySection />
    </PublicPageShell>
  )
}