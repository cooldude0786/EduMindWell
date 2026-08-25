'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/contact-details'
import { useContactDetails } from './useContactDetails'

const assessments = [
  {
    stage: 'Class 2 to 7',
    title: 'Career Analysis for 2nd to 7th Class',
    description: 'It will help you to find out Multiple Intelligence of the Student.',
    accent: 'bg-primary/10 text-primary',
    icon: '◈',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as11',
  },
  {
    stage: 'Class 8, 9 & 10',
    title: 'Career Analysis for 8th, 9th & 10th Class',
    description: 'It will help you to find out most suitable career path and subjects.',
    accent: 'bg-primary/10 text-primary',
    icon: '▤',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as12',
  },
  {
    stage: 'Class 11 & 12',
    title: 'Career Analysis for 11th & 12th Class',
    description: 'It will help you to find out most suitable career path and career road map with detailed execution plan.',
    accent: 'bg-secondary/10 text-secondary',
    icon: '➜',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as13',
  },
  {
    stage: 'Graduates',
    title: 'Career Analysis for Graduates',
    description: 'It will help you to find out most suitable career path and career road map with detailed execution plan.',
    accent: 'bg-secondary/10 text-secondary',
    icon: '◆',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as14',
  },
  {
    stage: 'Professionals',
    title: 'Career Analysis for Professionals',
    description: 'Early and mid career counselling for professionals with detailed execution plan.',
    accent: 'bg-tertiary-container/70 text-on-tertiary-container',
    icon: '●',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as204',
  },
  {
    stage: 'Professionals',
    title: 'Career Assessment for Professionals (Industry specific - recommended)',
    description: 'A multi-dimensional, industry-specific assessment designed for working professionals to discover the best career opportunities within their current industry, while also exploring career transition possibilities across other industries.',
    accent: 'bg-primary/10 text-primary',
    icon: '✦',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/pt15',
  },
  {
    stage: 'School Students',
    title: 'Global Subject Selector (School Students)',
    description: 'It will help you to find out most suitable subjects & career path.',
    accent: 'bg-primary/10 text-primary',
    icon: '◌',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/gss11',
  },
  {
    stage: 'School Students',
    title: 'Global Career Explorer (School Students)',
    description: 'It will help you to find out most suitable career path.',
    accent: 'bg-secondary/10 text-secondary',
    icon: '◍',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/gss12',
  },
  {
    stage: 'Engineering Aspirants',
    title: 'Engineering Assessment',
    description: 'It will help you to select most suitable engineering branch before engineering college admission.',
    accent: 'bg-primary/10 text-primary',
    icon: '◐',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as16',
  },
  {
    stage: 'Secondary School',
    title: 'Secondary School (IB MYP/IGCSE)',
    description: 'Career Planning for Secondary School.',
    accent: 'bg-primary/10 text-primary',
    icon: '◑',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as71',
  },
  {
    stage: 'High School',
    title: 'High school (IBDP/A-level)',
    description: 'Career Planning for High School.',
    accent: 'bg-secondary/10 text-secondary',
    icon: '◒',
    link: 'https://careertest.edumilestones.com/student-dashboard/suitability-registration/login/NDYyMw==/as72',
  },
]

const dimensions = [
  {
    title: 'Personality',
    description: 'Maps how you think, decide and relate to people.',
    accent: 'bg-primary/10 text-primary',
    icon: '◆',
  },
  {
    title: 'Career Interest',
    description: 'Identifies the fields and activities that hold your attention naturally.',
    accent: 'bg-primary/10 text-primary',
    icon: '✦',
  },
  {
    title: 'Career Motivators',
    description: 'Surfaces what you actually want from work such as impact, autonomy or growth.',
    accent: 'bg-secondary/10 text-secondary',
    icon: '▲',
  },
  {
    title: 'Learning Style',
    description: 'Shows how you absorb new skills fastest, so the plan fits your study rhythm.',
    accent: 'bg-tertiary-container/70 text-on-tertiary-container',
    icon: '●',
  },
  {
    title: 'Skills & Abilities',
    description: 'An objective check of verbal, numerical and spatial reasoning where you are strong today.',
    accent: 'bg-primary/10 text-primary',
    icon: '■',
  },
]

const processSteps = [
  {
    title: '5D Assessment',
    description: 'A guided, AI-scored psychometric evaluation covering all five dimensions.',
  },
  {
    title: 'Career Report',
    description: 'A 30+ page personal roadmap with strengths, suited career clusters and a realistic path.',
  },
  {
    title: '1-on-1 Session',
    description: 'A 30-minute call with a certified counsellor to walk through the report.',
  },
  {
    title: 'Stream Guidance',
    description: 'For Class 8, 9 and 10, turning early results into a confident stream decision.',
  },
  {
    title: 'Roadmapping',
    description: 'For Class 11 and 12, narrowing the report into shortlisted courses and colleges.',
  },
  {
    title: 'Dashboard Access',
    description: 'Ongoing access to the career library and pathway comparisons whenever you need them.',
  },
]

const roadmapCards = [
  {
    label: 'Class 8, 9 & 10',
    title: 'Choosing a stream with confidence',
    description:
      'Early signal on natural strengths and interests, translated into a clear Science / Commerce / Arts recommendation.',
    bullets: ['Early aptitude and interest mapping', 'Plain-language stream recommendation', 'Parent-included counselling session'],
    tone: 'bg-primary/10 text-primary',
  },
  {
    label: 'Class 11 & 12',
    title: 'Turning results into a roadmap',
    description:
      'Stream is already chosen. Now it is about narrowing 3000+ occupations into a shortlist of courses and entrance exams.',
    bullets: ['Ranked career and course shortlist', 'College predictor against a target list', 'Entrance-exam and timeline planning'],
    tone: 'bg-secondary/10 text-secondary',
  },
]

const roadmapPoints = [
  {
    title: 'Dimension-by-dimension breakdown',
    description: 'Where you scored and what it means in plain language, not just a label.',
  },
  {
    title: 'Ranked career and course matches',
    description: 'Not one answer but a ranked shortlist you can compare and discuss.',
  },
  {
    title: 'An execution plan',
    description: 'Concrete next steps, subjects, exams, skills and timelines to act on.',
  },
  {
    title: 'Counsellor-reviewed, not just generated',
    description: 'Your session walks through the report so nothing is left to interpret alone.',
  },
]

const faqs = [
  {
    question: 'What exactly is the 5-dimensional assessment?',
    answer:
      'It is a structured evaluation covering personality, career interest, career motivators, learning style and skills & abilities, combined into one report rather than five separate tests.',
  },
  {
    question: 'My child is in Class 8. Is it too early?',
    answer:
      'No. At this stage the assessment focuses on early strengths and interest signals to guide the upcoming stream choice, not a final career decision.',
  },
  {
    question: 'My child is already in Class 12. Is it too late?',
    answer:
      'Not at all. The report shifts into a focused roadmap of shortlisted courses, colleges and entrance exams that fit the results.',
  },
  {
    question: 'Is the first consulting session really free?',
    answer:
      'Yes. The first session with a certified counsellor is free and is used to walk through the results and answer initial questions.',
  },
  {
    question: 'Are sessions online or in-person?',
    answer: 'Both are available, so you can choose whichever is more convenient when you book your session.',
  },
]

export function CareerGuidance() {
  const { contactDetails } = useContactDetails()
  const whatsappUrl = contactDetails ? getWhatsAppUrl(contactDetails) : null
  return (
    <section id="career" className="bg-background px-6 py-16 text-on-background md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              5D Career Assessment
            </p>
            <h2 className="max-w-3xl font-h2 text-h2 text-primary">
              Understand your child&apos;s career fit, backed by science, not guesswork.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              A structured, AI-assisted psychometric assessment across five dimensions, turned into a 30+ page roadmap and explained by a real counsellor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#assessments"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Choose Your Assessment
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-outline bg-white px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-outline/50 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Your report includes</p>
            </div>
            <div className="space-y-3">
              {[
                ['Personality', 'How you naturally think, work and relate', 'bg-primary'],
                ['Career Interest', 'Fields that genuinely pull your attention', 'bg-secondary'],
                ['Career Motivators', 'What you want a career to give you', 'bg-tertiary'],
                ['Learning Style', 'How new skills stick fastest for you', 'bg-primary/70'],
                ['Skills & Abilities', 'Where your aptitude is strongest today', 'bg-secondary/70'],
              ].map(([title, subtitle, color]) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${color}`} />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{title}</p>
                    <p className="text-sm text-slate-600">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-outline/50 bg-surface-container p-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary">5000+</p>
            <p className="mt-2 text-sm text-slate-600">Students guided</p>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary">30+</p>
            <p className="mt-2 text-sm text-slate-600">Page personal reports</p>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary">7L+</p>
            <p className="mt-2 text-sm text-slate-600">Colleges in our library</p>
          </div>
        </div>

        <section id="assessments" className="space-y-6">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              Choose Your Assessment
            </p>
            <h3 className="font-h2 text-h2 text-primary">A full range of career assessments, built for every stage</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Every assessment below draws on the same 5-dimensional science, but we read the results differently depending on your class, career stage, or professional goal.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assessments.map((item) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-outline/50 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-primary"
              >
                <div className={`inline-flex rounded-2xl px-3 py-2 text-sm font-semibold ${item.accent}`}>{item.icon}</div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">{item.stage}</p>
                <h4 className="mt-2 text-lg font-semibold text-on-surface">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Open Assessment <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-secondary">
              The Science
            </p>
            <h3 className="font-h2 text-h2 text-primary">Why we call it a 5-dimensional assessment</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Most career quizzes measure one thing. Ours combines five separately studied areas of psychology into a single sitting, so the recommendation is not based on interest alone or aptitude alone.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dimensions.map((item) => (
              <div key={item.title} className="rounded-[20px] border border-outline/50 bg-white p-4 shadow-sm">
                <div className={`inline-flex rounded-2xl px-3 py-2 text-sm font-semibold ${item.accent}`}>{item.icon}</div>
                <h4 className="mt-4 text-base font-semibold text-on-surface">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="rounded-4xl bg-primary px-6 py-10 text-white md:px-10">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary-container">
              Assess → Counsel → Explore
            </p>
            <h3 className="font-h2 text-h2">How the assessment becomes a plan</h3>
            <p className="mt-3 text-base leading-relaxed text-primary-container">
              Six steps, start to finish, whether your child is choosing a stream or mapping the years ahead.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-[20px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-container">0{index + 1}</p>
                <h4 className="mt-3 text-lg font-semibold">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-primary-container">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-secondary">
              Built for Your Stage
            </p>
            <h3 className="font-h2 text-h2 text-primary">The same assessment, read differently by age</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              The five dimensions do not change, but what you do with the results does. We tailor the report reading to where your child actually stands right now.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {roadmapCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-outline/50 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${card.tone}`}>{card.label}</span>
                <h4 className="mt-4 text-xl font-semibold text-on-surface">{card.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
                <ul className="mt-4 space-y-3">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 border-t border-slate-100 pt-3 text-sm text-on-surface">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-4xl border border-outline/50 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.07)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-3xl border border-outline/50 bg-surface-container p-6">
            <div className="h-2.5 w-2/5 rounded-full bg-primary" />
            <div className="mt-4 h-2.5 w-full rounded-full bg-slate-200" />
            <div className="mt-3 h-2.5 w-3/5 rounded-full bg-slate-200" />
            <div className="mt-6 flex h-24 items-end gap-2 rounded-2xl bg-white p-3">
              {[40, 70, 55, 90, 35, 65].map((height, index) => (
                <div key={height + index} className="flex-1 rounded-t-lg bg-primary" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-secondary">
              What You Actually Receive
            </p>
            <h3 className="font-h2 text-h2 text-primary">Inside the 30+ page roadmap</h3>
            <ul className="mt-6 space-y-4">
              {roadmapPoints.map((point, index) => (
                <li key={point.title} className="flex gap-3 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{point.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl">
          <div className="text-center">
            <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              Questions We Hear Every Day
            </p>
            <h3 className="font-h2 text-h2 text-primary">About the assessment</h3>
          </div>
          <div className="mt-6 space-y-3 rounded-3xl border border-outline/50 bg-white p-4 shadow-sm">
            {faqs.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-slate-100 px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-on-surface">
                  {item.question}
                  <span className="text-xl text-primary transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="cta" className="rounded-4xl bg-primary px-6 py-10 text-center text-white md:px-10">
          <h3 className="mx-auto max-w-2xl font-h2 text-h2">Your child&apos;s future deserves more than guesswork.</h3>
          <p className="mx-auto mt-3 text-base leading-relaxed text-primary-container">
            Start with the assessment. We will take it from there together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5">
              Book a Free Consulting Session
            </a>
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Connect on WhatsApp
            </a>}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-primary-container">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Certified Counsellors</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Secure & Confidential</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No Commitment Required</span>
          </div>
        </section>
      </div>
    </section>
  )
}
