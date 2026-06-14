import type { ReactNode } from 'react'

type FeatureCard = {
  title: string
  description: string
}

type PublicPageShellProps = {
  eyebrow: string
  title: string
  description: string
  features?: FeatureCard[]
  children?: ReactNode
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  features = [],
  children,
}: PublicPageShellProps) {
  return (
    <div className="bg-background text-on-background">
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-secondary font-label-bold">
                {eyebrow}
              </p>
              <h1 className="font-h1 text-h1 text-primary">{title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
                {description}
              </p>
            </div>

            {features.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-indigo-50 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]"
                  >
                    <h2 className="font-h3 text-lg text-primary">
                      {feature.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {children}
    </div>
  )
}