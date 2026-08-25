'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, PlayCircle, Sparkles, Users } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

type GalleryCardProps = {
  title: string
  subtitle: string
  icon: any
  accent: string
  images: string[]
  statement: string
  onNearEnd?: () => void
}

function GalleryCard({ item }: { item: GalleryCardProps }) {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }

    const timer = window.setInterval(() => {
      api.scrollNext()
    }, 3200)

    return () => window.clearInterval(timer)
  }, [api])

  useEffect(() => {
    if (!api || !item.onNearEnd) return
    const loadAhead = () => {
      if (api.selectedScrollSnap() >= item.images.length - 3) item.onNearEnd?.()
    }
    api.on('select', loadAhead)
    return () => {
      api.off('select', loadAhead)
    }
  }, [api, item.images.length, item.onNearEnd])

  const IconComponent = item.icon

  return (
    <div className="group overflow-hidden rounded-[28px] border border-indigo-50 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
      <div className="relative">
        <Carousel
          opts={{ loop: true, align: 'start' }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {item.images.length === 0 ? (
              <CarouselItem className="basis-full pl-0">
                <div className="flex h-72 items-center justify-center bg-slate-100 text-sm text-slate-500">
                  No media available yet.
                </div>
              </CarouselItem>
            ) : item.images.map((image) => (
              <CarouselItem key={image} className="basis-full pl-0">
                <div className="relative flex h-72 items-end overflow-hidden p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-900/25 to-slate-800/55" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)]" />
                  <Image
                    src={image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-white backdrop-blur">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-h3 text-2xl text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-3 hidden md:flex" />
          <CarouselNext className="-right-3 hidden md:flex" />
        </Carousel>
      </div>

      <div className="border-t border-indigo-50 bg-surface-container-lowest p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary font-label-bold">
          Photos + Videos
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {item.statement}
        </p>
      </div>
    </div>
  )
}

export function GallerySection() {
  const [assessmentMedia, setAssessmentMedia] = useState<string[]>([])
  const [counsellingMedia, setCounsellingMedia] = useState<string[]>([])
  const [wellnessMedia, setWellnessMedia] = useState<string[]>([])
  const [workshopMedia, setWorkshopMedia] = useState<string[]>([])
  const [offsets, setOffsets] = useState({ ASSESSMENT: 0, COUNSELLING: 0, WELLNESS: 0, WORKSHOPS: 0 })
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({})

  const loadGroup = async (group: 'ASSESSMENT' | 'COUNSELLING' | 'WELLNESS' | 'WORKSHOPS', offset: number, append: boolean) => {
    if (loadingMore[group]) return
    setLoadingMore((current) => ({ ...current, [group]: true }))
    try {
      const response = await fetch(`/api/media?mediaGroup=${group}&limit=10&offset=${offset}`)
      if (!response.ok) return
      const result = await response.json()
      const urls = result.assets.filter((asset: any) => asset.type === 'IMAGE').map((asset: any) => asset.publicUrl)
      const setter = group === 'ASSESSMENT' ? setAssessmentMedia : group === 'COUNSELLING' ? setCounsellingMedia : group === 'WELLNESS' ? setWellnessMedia : setWorkshopMedia
      setter((current) => append ? [...current, ...urls] : urls)
      setOffsets((current) => ({ ...current, [group]: offset + result.assets.length }))
    } finally {
      setLoadingMore((current) => ({ ...current, [group]: false }))
    }
  }

  useEffect(() => {
    async function loadMedia() {
      try {
        const [assessmentRes, counsellingRes, wellnessRes, workshopRes] = await Promise.all([
          loadGroup('ASSESSMENT', 0, false),
          loadGroup('COUNSELLING', 0, false),
          loadGroup('WELLNESS', 0, false),
          loadGroup('WORKSHOPS', 0, false),
        ])
      } catch (err) {
        console.error('Failed to fetch gallery media:', err)
      }
    }
    loadMedia()
  }, [])

  const galleryItems: GalleryCardProps[] = [
    {
      title: 'Career Assessment',
      subtitle: 'Photos and clips from assessment sessions',
      icon: Sparkles,
      accent: 'from-primary/90 to-primary/60',
      images: assessmentMedia,
      onNearEnd: () => loadGroup('ASSESSMENT', offsets.ASSESSMENT, true),
      statement:
        'A visual record of discovery sessions, student mapping, and report-led career clarity.',
    },
    {
      title: 'Counselling',
      subtitle: 'Report reviews and one-on-one guidance',
      icon: Users,
      accent: 'from-secondary/90 to-secondary/60',
      images: counsellingMedia,
      onNearEnd: () => loadGroup('COUNSELLING', offsets.COUNSELLING, true),
      statement:
        'A visual archive of personal guidance, report interpretation, and next-step planning.',
    },
    {
      title: 'Mindset Workshops',
      subtitle: 'Interactive learning and experiential sessions',
      icon: Camera,
      accent: 'from-tertiary-container/90 to-tertiary-container/60',
      images: workshopMedia,
      onNearEnd: () => loadGroup('WORKSHOPS', offsets.WORKSHOPS, true),
      statement:
        'A visual look at student, parent, and professional mindset sessions in action.',
    },
    {
      title: 'Wellness',
      subtitle: 'Meditation circles, app demos, and group programs',
      icon: PlayCircle,
      accent: 'from-surface-tint/90 to-surface-tint/60',
      images: wellnessMedia,
      onNearEnd: () => loadGroup('WELLNESS', offsets.WELLNESS, true),
      statement:
        'A visual collection of wellness practices, app demos, and guided group experiences.',
    },
  ]

  return (
    <section id="gallery" className="py-xl px-6 bg-surface-container-lowest">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
            Gallery
          </p>
          <h2 className="font-h2 text-h2 text-primary">
            Real moments from our work across career, mindset, and wellness.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((item) => (
            <GalleryCard key={item.title} item={item} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Explore more
          </Link>
        </div>
      </div>
    </section>
  )
}
