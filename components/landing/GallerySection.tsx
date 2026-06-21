import Image from 'next/image'
import { Camera, PlayCircle, Sparkles, Users } from 'lucide-react'

const galleryItems = [
  {
    title: 'Career Assessment',
    subtitle: 'Photos and clips from assessment sessions',
    icon: Sparkles,
    accent: 'from-primary/90 to-primary/60',
    image: '/CA.jpeg',
    statement:
      'A visual record of discovery sessions, student mapping, and report-led career clarity.',
  },
  {
    title: 'Counselling',
    subtitle: 'Report reviews and one-on-one guidance',
    icon: Users,
    accent: 'from-secondary/90 to-secondary/60',
    image: '/CC.jpeg',
    statement:
      'A visual archive of personal guidance, report interpretation, and next-step planning.',
  },
  {
    title: 'Mindset Workshops',
    subtitle: 'Interactive learning and experiential sessions',
    icon: Camera,
    accent: 'from-tertiary-container/90 to-tertiary-container/60',
    image: '/StudentMindset.jpeg',
    statement:
      'A visual look at student, parent, and professional mindset sessions in action.',
  },
  {
    title: 'Wellness',
    subtitle: 'Meditation circles, app demos, and group programs',
    icon: PlayCircle,
    accent: 'from-surface-tint/90 to-surface-tint/60',
    image: '/MiracleX.jpeg',
    statement:
      'A visual collection of wellness practices, app demos, and guided group experiences.',
  },
]

export function GallerySection() {
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
          {galleryItems.map((item) => {
            const IconComponent = item.icon

            return (
              <div
                key={item.title}
                className="group overflow-hidden rounded-[28px] border border-indigo-50 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              >
                <div
                  className={`relative flex h-72 items-end overflow-hidden bg-gradient-to-br ${item.accent} p-6`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-900/25 to-slate-800/55" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)]" />
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
          })}
        </div>
      </div>
    </section>
  )
}
