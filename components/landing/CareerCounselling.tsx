import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Globe2,
  Sparkles,
  Trophy,
} from 'lucide-react'

const counsellingBenefits = [
  {
    icon: GraduationCap,
    title: 'India Colleges Database',
    description:
      'Access to 10,000+ colleges across India and over 1.5 lakh courses with fee structures, admission predictions, and shortlisting support.',
  },
  {
    icon: Globe2,
    title: 'Abroad Universities Explorer',
    description:
      'Explore 8,000+ international universities across 22+ countries with rankings, courses, fees, and admission requirements.',
  },
  {
    icon: BookOpenCheck,
    title: 'Entrance Exams Information',
    description:
      'Get comprehensive guidance on 1,400+ entrance examinations for undergraduate, postgraduate, and professional programs.',
  },
  {
    icon: Compass,
    title: 'Online Courses & Skill Development',
    description:
      'Unlock unlimited access to learning and personal-development programs built to strengthen academic and career skills.',
  },
  {
    icon: Trophy,
    title: 'Scholarships Information',
    description:
      'Explore scholarship opportunities for school and college education, including options that can cover up to 100% of costs.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Virtual Internships',
    description:
      'Experience 150+ virtual internships with global organizations to build real-world confidence and career-ready skills.',
  },
]

const supportSteps = [
  {
    title: 'Review the report with an expert',
    description:
      'Our career counsellors interpret the assessment report, explain the findings, and help students understand what it means for future choices.',
  },
  {
    title: 'Explore the dashboard together',
    description:
      'Students and parents can navigate colleges, universities, entrance exams, scholarships, and internship options in one guided experience.',
  },
  {
    title: 'Turn insight into action',
    description:
      'The counselling session turns exploration into a clear roadmap with next steps, priorities, and realistic planning for the academic journey ahead.',
  },
]

const guidingStarTopics = [
  'Create a 15-year career plan',
  'Build a strong portfolio',
  'Predict salary for different career paths',
  'Have meaningful career conversations with AI',
  'Discover skills in demand',
]

export function CareerCounselling() {
  return (
    <section id="career-counselling" className="bg-background px-6 py-16 text-on-background md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <div className="rounded-[32px] border border-outline/60 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              Career Counselling
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary">
              Expert-led guidance
            </span>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h2 className="max-w-3xl font-h2 text-h2 text-primary">
                Expert counsellors help students understand the report and explore their next best step with confidence.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                From college discovery and scholarship planning to internships and AI-guided career conversations, the counselling experience brings together the full dashboard into one personalised support journey.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/career/assessment"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
                >
                  Explore assessments
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/career/library"
                  className="rounded-full border border-outline bg-surface-container px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface"
                >
                  View career library
                </a>
              </div>
            </div>

            <div className="rounded-[24px] border border-outline/50 bg-surface-container/70 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Your Guiding Star</p>
                  <p className="text-sm text-slate-600">20 complimentary AI-guided career attempts</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {guidingStarTopics.map((topic) => (
                  <div key={topic} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="mt-0.5 text-primary">✦</span>
                    <p className="text-sm leading-relaxed text-slate-700">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {counsellingBenefits.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="rounded-[24px] border border-outline/50 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary inline-flex">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-h3 text-lg text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-outline/60 bg-surface-container/70 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">How the support works</p>
            <h3 className="mt-4 font-h3 text-2xl text-primary">A guided experience that turns discovery into action.</h3>
            <div className="mt-6 space-y-4">
              {supportSteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-on-surface">{step.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-outline/60 bg-primary/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why this matters</p>
            <h3 className="mt-4 font-h3 text-2xl text-primary">Continuous career discovery, long-term planning, and better decisions.</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Students receive personalised support that helps them choose courses, compare institutions, understand entrance exams, and prepare for opportunities with confidence.
            </p>
            <div className="mt-6 rounded-[24px] border border-primary/20 bg-white p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">
                The counselling experience is designed to help learners move from uncertainty to clarity, whether they are exploring careers for the first time or planning the next academic milestone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
