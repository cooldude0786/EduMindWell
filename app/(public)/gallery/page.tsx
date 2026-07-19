import { GalleryCollageSection } from '@/components/landing/GalleryCollageSection'
import { PublicPageShell } from '@/components/landing/PublicPageShell'

const galleryFeatures = [
  {
    title: 'Career assessment',
    description:
      'Program moments from assessment sessions and outcome-focused conversations.',
  },
  {
    title: 'Counselling',
    description:
      'Guidance moments that show the personal support behind each next step.',
  },
  {
    title: 'Mindset workshops',
    description:
      'Interactive workshop scenes that capture energy, participation, and reflection.',
  },
]

export default function GalleryPage() {
  return (
    <PublicPageShell
      eyebrow="Gallery"
      title="Program moments across career, counselling, and workshops."
      description="This gallery now presents the work by program so visitors can understand each experience in context rather than as one undifferentiated media wall."
      features={galleryFeatures}
      className="mt-10"
    >
      <GalleryCollageSection />
    </PublicPageShell>
  )
}