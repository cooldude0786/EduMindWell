'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Engineering & Technology': { bg: '#E7EEF3', color: '#3E6B8A' },
  'Medicine & Healthcare': { bg: '#FBE7DA', color: '#B8632E' },
  'Commerce & Finance': { bg: '#E4F1EE', color: '#1F6F63' },
  'Design & Creative Arts': { bg: '#EFEAF6', color: '#6E4FA0' },
  'Law & Government': { bg: '#E7EEF3', color: '#3E6B8A' },
  'Media & Communication': { bg: '#FBE7DA', color: '#B8632E' },
  'Science & Research': { bg: '#E1F2EF', color: '#1B8577' },
  Education: { bg: '#E4F1EE', color: '#1F6F63' },
}

type CareerItem = {
  name: string
  category: string
  oneLiner: string
  stream: string
  exam: string
  degree: string
  bright?: boolean
}

const careers: CareerItem[] = [
  {
    name: 'Software Developer',
    category: 'Engineering & Technology',
    oneLiner: 'Designs and builds applications, tools and systems used across every industry.',
    stream: 'Science (PCM)',
    exam: 'JEE Main',
    degree: 'B.Tech / B.E. (CS/IT)',
    bright: true,
  },
  {
    name: 'Data Scientist',
    category: 'Engineering & Technology',
    oneLiner: 'Turns large datasets into insights and predictions that guide business decisions.',
    stream: 'Science (PCM)',
    exam: 'JEE Main',
    degree: 'B.Tech / B.Sc. + Data Science',
    bright: true,
  },
  {
    name: 'Civil Engineer',
    category: 'Engineering & Technology',
    oneLiner: 'Plans and oversees construction of infrastructure like roads, bridges and buildings.',
    stream: 'Science (PCM)',
    exam: 'JEE Main',
    degree: 'B.Tech / B.E. (Civil)',
  },
  {
    name: 'Mechanical Engineer',
    category: 'Engineering & Technology',
    oneLiner: 'Designs and maintains machines, engines and mechanical systems.',
    stream: 'Science (PCM)',
    exam: 'JEE Main',
    degree: 'B.Tech / B.E. (Mech)',
  },
  {
    name: 'Electronics Engineer',
    category: 'Engineering & Technology',
    oneLiner: 'Works on circuits, devices and communication systems.',
    stream: 'Science (PCM)',
    exam: 'JEE Main',
    degree: 'B.Tech / B.E. (ECE)',
  },
  {
    name: 'Robotics Engineer',
    category: 'Engineering & Technology',
    oneLiner: 'Builds automated machines and intelligent systems for industry and research.',
    stream: 'Science (PCM)',
    exam: 'JEE Main',
    degree: 'B.Tech + Robotics specialization',
    bright: true,
  },
  {
    name: 'Doctor (MBBS)',
    category: 'Medicine & Healthcare',
    oneLiner: 'Diagnoses and treats patients across general or specialized medicine.',
    stream: 'Science (PCB)',
    exam: 'NEET',
    degree: 'MBBS',
    bright: true,
  },
  {
    name: 'Dentist',
    category: 'Medicine & Healthcare',
    oneLiner: 'Treats oral health issues and performs dental procedures.',
    stream: 'Science (PCB)',
    exam: 'NEET',
    degree: 'BDS',
  },
  {
    name: 'Physiotherapist',
    category: 'Medicine & Healthcare',
    oneLiner: 'Helps patients recover movement and manage pain through physical therapy.',
    stream: 'Science (PCB)',
    exam: 'State entrance exams',
    degree: 'BPT',
    bright: true,
  },
  {
    name: 'Pharmacist',
    category: 'Medicine & Healthcare',
    oneLiner: 'Prepares and dispenses medication, and advises on safe drug use.',
    stream: 'Science (PCB/PCM)',
    exam: 'State entrance exams',
    degree: 'B.Pharm',
  },
  {
    name: 'Nutritionist',
    category: 'Medicine & Healthcare',
    oneLiner: 'Advises individuals and organizations on diet and nutritional health.',
    stream: 'Science (PCB)',
    exam: 'University-specific',
    degree: 'B.Sc. Nutrition & Dietetics',
    bright: true,
  },
  {
    name: 'Psychologist',
    category: 'Medicine & Healthcare',
    oneLiner: 'Studies behavior and mental processes to support emotional wellbeing.',
    stream: 'Any (Science/Arts)',
    exam: 'University-specific',
    degree: 'B.A./B.Sc. Psychology',
    bright: true,
  },
  {
    name: 'Chartered Accountant',
    category: 'Commerce & Finance',
    oneLiner: 'Manages accounts, audits, and financial compliance for businesses.',
    stream: 'Commerce',
    exam: 'CA Foundation',
    degree: 'CA + B.Com (optional)',
  },
  {
    name: 'Investment Banker',
    category: 'Commerce & Finance',
    oneLiner: 'Advises companies on raising capital, mergers and financial strategy.',
    stream: 'Commerce',
    exam: 'CAT / university-specific',
    degree: 'B.Com / BBA + MBA (Finance)',
  },
  {
    name: 'Financial Analyst',
    category: 'Commerce & Finance',
    oneLiner: 'Evaluates investments and financial data to guide business decisions.',
    stream: 'Commerce',
    exam: 'University-specific',
    degree: 'B.Com / BBA + Finance certification',
  },
  {
    name: 'Actuary',
    category: 'Commerce & Finance',
    oneLiner: 'Uses statistics and risk analysis to guide insurance and financial decisions.',
    stream: 'Commerce / Science',
    exam: 'Actuarial exams (IAI)',
    degree: 'B.Sc. / B.Com + Actuarial Science',
    bright: true,
  },
  {
    name: 'Entrepreneur / Business Owner',
    category: 'Commerce & Finance',
    oneLiner: 'Builds and runs an independent business venture.',
    stream: 'Any stream',
    exam: 'Not applicable',
    degree: 'BBA or any relevant degree',
  },
  {
    name: 'UX/UI Designer',
    category: 'Design & Creative Arts',
    oneLiner: 'Designs how digital products look, feel, and function for users.',
    stream: 'Any stream',
    exam: 'UCEED / portfolio-based',
    degree: 'B.Des. or design bootcamp',
    bright: true,
  },
  {
    name: 'Graphic Designer',
    category: 'Design & Creative Arts',
    oneLiner: 'Creates visual content for brands, media and digital platforms.',
    stream: 'Any stream',
    exam: 'Portfolio-based',
    degree: 'B.Des. / Fine Arts',
  },
  {
    name: 'Fashion Designer',
    category: 'Design & Creative Arts',
    oneLiner: 'Designs clothing and accessories, from concept to production.',
    stream: 'Any stream',
    exam: 'NIFT entrance exam',
    degree: 'B.Des. (Fashion)',
  },
  {
    name: 'Architect',
    category: 'Design & Creative Arts',
    oneLiner: 'Designs buildings and spaces, balancing form, function and safety.',
    stream: 'Science (PCM)',
    exam: 'NATA / JEE (Paper 2)',
    degree: 'B.Arch',
  },
  {
    name: 'Animator',
    category: 'Design & Creative Arts',
    oneLiner: 'Creates moving visuals for films, games and digital media.',
    stream: 'Any stream',
    exam: 'Portfolio-based',
    degree: 'B.Des./Animation diploma',
    bright: true,
  },
  {
    name: 'Lawyer',
    category: 'Law & Government',
    oneLiner: 'Advises and represents clients on legal matters across specializations.',
    stream: 'Any stream',
    exam: 'CLAT',
    degree: 'BA LLB / LLB',
  },
  {
    name: 'Civil Services Officer (IAS/IPS)',
    category: 'Law & Government',
    oneLiner: 'Administers government policy and public services at scale.',
    stream: 'Any stream',
    exam: 'UPSC CSE',
    degree: "Any bachelor's degree",
  },
  {
    name: 'Policy Analyst',
    category: 'Law & Government',
    oneLiner: 'Researches and advises on public policy decisions.',
    stream: 'Any stream',
    exam: 'University-specific',
    degree: 'BA Political Science / Economics',
  },
  {
    name: 'Journalist',
    category: 'Media & Communication',
    oneLiner: 'Researches and reports news and stories across print, digital or broadcast media.',
    stream: 'Any stream',
    exam: 'University-specific',
    degree: 'BA Journalism & Mass Comm',
  },
  {
    name: 'Content Strategist',
    category: 'Media & Communication',
    oneLiner: 'Plans and shapes content across digital platforms for brands.',
    stream: 'Any stream',
    exam: 'Not applicable',
    degree: 'BA / BMS + relevant experience',
    bright: true,
  },
  {
    name: 'Film Director',
    category: 'Media & Communication',
    oneLiner: 'Oversees the creative vision and production of films or video content.',
    stream: 'Any stream',
    exam: 'Portfolio / institute-specific',
    degree: 'Film school diploma or degree',
  },
  {
    name: 'Public Relations Specialist',
    category: 'Media & Communication',
    oneLiner: 'Manages public image and communication strategy for brands or people.',
    stream: 'Any stream',
    exam: 'University-specific',
    degree: 'BA Mass Comm / PR',
  },
  {
    name: 'Research Scientist',
    category: 'Science & Research',
    oneLiner: 'Conducts experiments and studies to advance scientific knowledge.',
    stream: 'Science (PCM / PCB)',
    exam: 'JEST / university-specific',
    degree: 'B.Sc. + M.Sc. / Ph.D.',
  },
  {
    name: 'Environmental Scientist',
    category: 'Science & Research',
    oneLiner: 'Studies environmental issues and develops solutions for sustainability.',
    stream: 'Science (PCB)',
    exam: 'University-specific',
    degree: 'B.Sc. Environmental Science',
    bright: true,
  },
  {
    name: 'Astrophysicist',
    category: 'Science & Research',
    oneLiner: 'Studies celestial objects and the physics of the universe.',
    stream: 'Science (PCM)',
    exam: 'IISER / university-specific',
    degree: 'B.Sc. Physics + M.Sc. / Ph.D.',
  },
  {
    name: 'School Teacher',
    category: 'Education',
    oneLiner: 'Educates students in a specific subject at the school level.',
    stream: 'Any stream',
    exam: 'CTET / State TET',
    degree: 'B.Ed. + relevant subject degree',
  },
  {
    name: 'Ed-Tech Instructional Designer',
    category: 'Education',
    oneLiner: 'Designs learning experiences and curricula for digital education platforms.',
    stream: 'Any stream',
    exam: 'Not applicable',
    degree: 'BA / B.Ed. + instructional design',
    bright: true,
  },
]

const categories = [
  'All Fields',
  'Engineering & Technology',
  'Medicine & Healthcare',
  'Commerce & Finance',
  'Design & Creative Arts',
  'Law & Government',
  'Media & Communication',
  'Science & Research',
  'Education',
]

export function CareerLibrary() {
  const [activeCategory, setActiveCategory] = useState('All Fields')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMode, setSortMode] = useState<'az' | 'bright'>('az')
  const [visibleCount, setVisibleCount] = useState(12)

  const filteredCareers = useMemo(() => {
    let list = careers.filter((career) => {
      const matchesCategory =
        activeCategory === 'All Fields' || career.category === activeCategory
      const query = searchTerm.toLowerCase()
      const matchesSearch =
        career.name.toLowerCase().includes(query) ||
        career.category.toLowerCase().includes(query) ||
        career.oneLiner.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })

    if (sortMode === 'az') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else {
      list = [...list].sort((a, b) => Number(b.bright) - Number(a.bright))
    }

    return list
  }, [activeCategory, searchTerm, sortMode])

  const shownCareers = filteredCareers.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCareers.length

  return (
    <section className="bg-background px-6 py-10 text-on-background md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col">
        <div className="rounded-4xl border border-outline/50 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] md:p-8">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              Career Library
            </p>
            <h1 className="font-h2 text-h2 text-primary">Explore careers, not just categories</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Search or filter by field to see what a career actually involves — the stream it needs, the entrance exams that matter, and the degree path to get there.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-outline/50 bg-surface-container p-3 shadow-sm md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setVisibleCount(12)
                }}
                placeholder="Search careers — e.g. design, doctor, data"
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
              {careers.length} careers
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category)
                    setVisibleCount(12)
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : 'border-outline/60 bg-white text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-on-surface">{shownCareers.length}</span> of{' '}
              <span className="font-semibold text-on-surface">{filteredCareers.length}</span> careers
            </p>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as 'az' | 'bright')}
              className="rounded-2xl border border-outline/60 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="az">Sort: A–Z</option>
              <option value="bright">Sort: Growing Fields First</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shownCareers.map((career) => {
              const colors = CATEGORY_COLORS[career.category] || { bg: '#EEE', color: '#555' }
              return (
                <div key={career.name} className="flex h-full flex-col rounded-3xl border border-outline/50 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-primary">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ background: colors.bg, color: colors.color }}>
                      {career.category}
                    </span>
                    {career.bright ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">Growing Field</span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-on-surface">{career.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{career.oneLiner}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-surface-container px-2.5 py-1 text-[11px] text-slate-600">{career.stream}</span>
                    <span className="rounded-full border border-slate-200 bg-surface-container px-2.5 py-1 text-[11px] text-slate-600">{career.exam}</span>
                    <span className="rounded-full border border-slate-200 bg-surface-container px-2.5 py-1 text-[11px] text-slate-600">{career.degree}</span>
                  </div>
                  <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    View Details <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )
            })}
          </div>

          {filteredCareers.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-outline/60 bg-surface-container p-10 text-center">
              <p className="text-lg font-semibold text-on-surface">No careers match your search</p>
              <p className="mt-2 text-sm text-slate-600">Try a different keyword or clear the filter.</p>
            </div>
          ) : null}

          {hasMore ? (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((current) => current + 12)}
                className="rounded-full border border-outline/60 bg-white px-5 py-3 text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary"
              >
                Show more careers ↓
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-4xl bg-primary px-8 py-10 text-center text-white">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold">Not sure which of these actually fits you?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-container">
            Take the Career Roadmap Assessment — it ranks careers like these against your own results.
          </p>
          <a href="/career/assessment#assessments" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary">
            Take the Assessment
          </a>
        </div>
      </div>
    </section>
  )
}
