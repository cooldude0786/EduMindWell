import type { LegalSection } from '@/lib/legal-content'

type LegalPageProps = {
  eyebrow: string
  title: string
  description: string
  sections: LegalSection[]
}

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: LegalPageProps) {
  return (
    <div className="bg-background px-6 py-16 text-on-background sm:py-20">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-indigo-100 pb-8">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
            {eyebrow}
          </p>
          <h1 className="font-h1 text-4xl font-bold leading-tight text-primary sm:text-h1">
            {title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </header>

        <div className="space-y-10 py-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-h3 text-2xl text-primary">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}
