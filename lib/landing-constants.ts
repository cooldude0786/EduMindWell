/**
 * Landing Page Constants
 * All hardcoded text, data, and configuration
 */

import type {
  NavigationLink,
  Stat,
  PillarCard,
  CareerStep,
  AudienceCard,
  Story,
  FAQItem,
  BrandInfo,
} from './landing-types'

export const BRAND: BrandInfo = {
  name: 'EduMindWell',
  tagline: 'Career. Mind. Wellbeing. All Aligned',
  subTagline: 'Career. Mind. Wellbeing. All Aligned.',
  description:
    'Empowering the next generation to excel academically while maintaining emotional equilibrium. We don\'t just build careers; we nurture minds.',
}

export const NAV_LINKS: NavigationLink[] = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'Approach', href: '#approach', id: 'approach' },
  // { label: 'Career', href: '#career', id: 'career' },
  // { label: 'Workshops', href: '#workshops', id: 'workshops' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'testimonial', href: '#stories', id: 'stories' },
  { label: 'experts', href: '#wellness', id: 'wellness' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

// HERO SECTION
export const HERO_STATS: Stat[] = [
  {
    label: '5000+',
    sublabel: 'Students Guided',
  },
  {
    label: '30+',
    sublabel: 'Page Reports',
  },
  {
    label: '7L+',
    sublabel: 'Colleges Listed',
  },
]

// PROBLEM SECTION
export const STUDENT_DIALOGUE = [
  {
    speaker: 'Student',
    role: 'Class 11 Student',
    message:
      'I have so many interests, but I don\'t know which one translates into a secure future.',
    color: 'primary' as const,
  },
  {
    speaker: 'EduMindWell',
    role: 'EduMindWell Guide',
    message:
      'We map your innate strengths to high-growth industries before you pick a stream or college.',
    color: 'primary' as const,
  },
]

export const PARENT_DIALOGUE = [
  {
    speaker: 'Parent',
    role: 'Concerned Parent',
    message:
      'I want them to succeed, but I\'m worried about their stress levels and burnout.',
    color: 'secondary' as const,
  },
  {
    speaker: 'EduMindWell',
    role: 'Wellness Coach',
    message:
      'Our emotional resilience training ensures high performance without the psychological cost.',
    color: 'secondary' as const,
  },
]

// THREE PILLARS SECTION
export const MIRACLE_X_APP_URL =
  'https://play.google.com/store/apps/details?id=com.miraclesx.app&pcampaignid=web_share'

export const PILLARS: PillarCard[] = [
  {
    icon: 'route',
    title: 'Career Guidance',
    color: 'primary',
    description:
      'AI-powered psychometric assessments, personalized 30+ page career reports, one-on-one counselling, and 7 lakh+ college database access.',
    linkText: 'Explore Career Guidance',
  },
  {
    icon: 'groups',
    title: 'Workshops',
    color: 'secondary',
    description:
      'Mindset, emotional intelligence and wellness workshops for students, parents and professionals. Online and in-person.',
    linkText: 'See Workshops',
  },
  {
    icon: 'spa',
    title: 'Wellness & MiraclesX',
    color: 'on-tertiary-container',
    description:
      'Holistic wellness programs and the MiraclesX App — your daily companion for focus, calm, and subconscious transformation.',
    linkText: 'Discover MiraclesX',
    href: MIRACLE_X_APP_URL,
  },
]

// CAREER GUIDANCE SECTION
export const CAREER_STEPS: CareerStep[] = [
  {
    number: '01',
    title: '5D Assessment',
    subtitle: 'AI psychometric evaluation',
    isActive: true,
  },
  {
    number: '02',
    title: 'Career Report',
    subtitle: '30+ page personal roadmap',
  },
  {
    number: '03',
    title: '1-on-1 Session',
    subtitle: '30 min counsellor call',
  },
  {
    number: '04',
    title: 'Stream Guidance',
    subtitle: 'For Class 8, 9 and 10',
  },
  {
    number: '05',
    title: 'Roadmapping',
    subtitle: 'For Class 11 and 12',
  },
  {
    number: '06',
    title: 'Dashboard Access',
    subtitle: '7L+ colleges, career library',
    isActive: true,
  },
]

// AUDIENCE SECTION
export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    title: 'Students',
    icon: 'BookOpen',
    description:
      'Time management, goal setting, personality development, exam stress, confidence, emotional intelligence, and resilience.',
    linkText: "I'm a Student",
    gradient: 'from-blue-400 to-indigo-600',
    overlayColor: 'bg-primary/40 group-hover:bg-primary/50',
    bgColor: 'text-primary',
    image: '/StudentMindset.jpeg',
  },
  {
    title: 'Parents',
    icon: 'Users',
    description:
      'Parenting guidance for toddler age 2 to 6, young minds 7 to 12, and the new-age child 13 to 17.',
    linkText: "I'm a Parent",
    gradient: 'from-emerald-400 to-teal-600',
    overlayColor: 'bg-secondary/40 group-hover:bg-secondary/50',
    bgColor: 'text-secondary',
    image: '/ParentMindset.jpeg',
  },
  {
    title: 'Teachers / Professionals',
    icon: 'Briefcase',
    description:
      'Classroom management without stress, emotional intelligence, relationship skills, team bonding, resilience, limiting beliefs, and goal achievement.',
    linkText: "I'm a Teacher / Professional",
    gradient: 'from-orange-400 to-red-600',
    overlayColor: 'bg-on-tertiary-container/40 group-hover:bg-on-tertiary-container/50',
    bgColor: 'text-on-tertiary-container',
    image: '/ProMindset.jpeg',
  },
]

// STORIES SECTION
export const STORIES: Story[] = [
  {
    id: 'rohan',
    beforeText:
      'About to choose Science by default because all friends were',
    afterText:
      'Discovered Commerce + Law fit. Now preparing for CLAT, top of class',
    quote:
      'I had no idea Law was even an option for me. The report changed everything.',
    attribution: '— Rohan V., Class 12',
  },
  {
    id: 'ananya',
    beforeText:
      'Loved psychology but thought it wasn\'t a real career option',
    afterText:
      'Mapped to 12 psychology career paths. Targeting clinical psychology',
    quote:
      'Seeing salary data and real career paths for psychology made my parents finally say yes.',
    attribution: '— Ananya S., Class 11',
  },
  {
    id: 'parent',
    beforeText:
      'Pushing child toward engineering despite resistance',
    afterText:
      'Parent session revealed Design as stronger match. Family aligned',
    quote:
      'We were the obstacle. EduMindWell helped us become our daughter\'s support system.',
    attribution: '— Parent, Mumbai',
  },
]

// FAQ SECTION
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'q1',
    question: 'How is EduMindWell different from my school counselor?',
    answer:
      'School counselors advise based on marks and general options. We use a 5-dimensional AI psychometric assessment to map your personality, aptitude, interests, emotional quotient, and learning style — then build a 30-page execution plan specific to you.',
  },
  {
    id: 'q2',
    question: 'What exactly is the 5-Dimensional Assessment?',
    answer:
      'It measures five areas — personality type, academic aptitude, career interest, emotional quotient, and learning style. Together these give a complete picture of who you are and which careers you will genuinely thrive in.',
  },
  {
    id: 'q3',
    question: 'My child is in Class 8. Is it too early?',
    answer:
      'Not at all. Class 8 and 9 are the ideal time for stream awareness. Early guidance prevents the most common mistake — choosing a stream by default rather than by fit.',
  },
  {
    id: 'q4',
    question: 'My child is already in Class 12. Is it too late?',
    answer:
      'Never too late. For Class 12 students we focus on college selection, entrance exam strategy, profile building, and application support — everything needed for the next step.',
  },
  {
    id: 'q5',
    question: 'What is the MiraclesX App and is it free?',
    answer:
      'MiraclesX is our proprietary daily wellness app with guided practices for focus, calm, and habit formation. It is included in the Roadmap and Full Journey plans.',
  },
  {
    id: 'q6',
    question: 'Are sessions online or in-person?',
    answer:
      'Both options are available. Most students prefer online for convenience. In-person sessions can be arranged in select cities.',
  },
  {
    id: 'q7',
    question: 'Will my parents be involved in my sessions?',
    answer:
      'You choose. We offer student-only sessions, parent-only sessions, and joint family sessions depending on what works best for your situation.',
  },
  {
    id: 'q8',
    question: 'Is the first consulting session really free?',
    answer:
      'Yes. The first 30-minute consulting session is completely free with no commitment required. It is meant to give you consultation-related guidance, understand your situation, and see if EduMindWell is the right fit.',
  },
]

// CTA BANNER SECTION
export const CTA_BANNER = {
  headline: 'Your Future Deserves More',
  subheadline: 'Than Guesswork.',
  description:
    "Stop worrying about what's next. Let's build it together — with precision and peace.",
  primaryBtn: 'Book a Free Consulting Session',
  secondaryBtn: 'Join Whatsapp Group',
  trustSignals: [
    { icon: 'CheckCircle', text: 'Certified Counsellors' },
    { icon: 'Lock', text: 'Secure & Confidential' },
    { icon: 'Star', text: 'No Commitment Required' },
  ],
}

// FOOTER SECTION
export const FOOTER_COLUMNS = [
  {   
    title: 'Resources',
    items: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Career Library', href: '#' },
      { label: 'Refund Policy', href: '#' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'WhatsApp Support', href: '#' },
      { label: 'Associate', href: '#' },
    ],
  },
]

export const SOCIAL_LINKS = [
  { icon: 'Facebook', label: 'Facebook' },
  { icon: 'Mail', label: 'Email' },
  { icon: 'Link2', label: 'LinkedIn' },
]

export const APP_STORES = [
  { icon: 'Apple', label: 'App Store' },
  { icon: 'Play', label: 'Play Store' },
]
