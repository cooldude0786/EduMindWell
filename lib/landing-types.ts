/**
 * Type definitions for EduMindWell Landing Page
 */

export interface NavigationLink {
  label: string
  href: string
  id?: string
}

export interface Stat {
  label: string
  sublabel: string
}

export interface ProblemBubble {
  speaker: string
  role: string
  message: string
  color: 'primary' | 'secondary'
}

export interface PillarCard {
  icon: string
  title: string
  color: 'primary' | 'secondary' | 'on-tertiary-container'
  description: string
  linkText: string
  href?: string
}

export interface CareerStep {
  number: string
  title: string
  subtitle: string
  isActive?: boolean
}

export interface AudienceCard {
  title: string
  icon: string
  description: string
  linkText: string
  gradient: string
  overlayColor: string
  bgColor: string
  image?: string
}

export interface Story {
  id: string
  beforeText: string
  afterText: string
  quote: string
  attribution: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FooterColumn {
  title?: string
  items: Array<{
    label: string
    href?: string
  }>
}

export interface BrandInfo {
  name: string
  tagline: string
  subTagline: string
  description: string
}
