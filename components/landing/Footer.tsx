'use client'

import Link from 'next/link'
import {
  InstagramIcon,
  Linkedin01Icon,
  Mail01Icon,
  MapPinIcon,
  TelephoneIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FOOTER_COLUMNS } from '@/lib/landing-constants'
import { useContactDetails } from './useContactDetails'

export function Footer() {
  const { contactDetails } = useContactDetails()
  const contactItems = contactDetails ? [
    { icon: MapPinIcon, label: 'Address', value: contactDetails.address },
    { icon: Mail01Icon, label: 'Email', value: contactDetails.email, href: `mailto:${contactDetails.email}` },
    { icon: TelephoneIcon, label: 'Phone', value: [contactDetails.phone, contactDetails.secondaryPhone].filter(Boolean).join(', '), href: `tel:${contactDetails.phone}` },
  ] : []
  const socialLinks = contactDetails ? [
    { icon: Linkedin01Icon, label: 'LinkedIn', href: contactDetails.linkedinUrl },
    { icon: InstagramIcon, label: 'Instagram', href: contactDetails.instagramUrl },
    { icon: YoutubeIcon, label: 'YouTube', href: contactDetails.youtubeUrl },
  ].filter((social) => social.href) : []

  return (
    <footer id="contact" className="border-t border-indigo-100 bg-slate-50 px-6 pt-20 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-10 md:grid-cols-3">
        

          {contactDetails && <div>
            <h4 className="mb-4 font-bold text-primary">Contact</h4>
            <ul className="space-y-4">
              {contactItems.map((item) => {
                const IconComponent = item.icon

                return (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary">
                      <HugeiconsIcon icon={IconComponent} strokeWidth={2} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-secondary font-label-bold">
                        {item.label}
                      </p>
                      {item.href ? <a href={item.href} className="mt-1 block text-sm text-slate-600 hover:text-primary">{item.value}</a> : <p className="mt-1 text-sm text-slate-600">{item.value}</p>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>}

          {socialLinks.length > 0 && <div>
            <h4 className="mb-4 font-bold text-primary">Social</h4>
            <ul className="space-y-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon

                return (
                  <li key={social.label}>
                    <a
                      href={social.href ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-primary"
                    >
                      <HugeiconsIcon icon={IconComponent} strokeWidth={2} className="h-4 w-4" />
                      {social.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>}

          <div>
            <h4 className="mb-4 font-bold text-primary">Resources</h4>
            <ul className="space-y-3 text-body-sm text-slate-500">
              {FOOTER_COLUMNS.flatMap((column) => column.items).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href || '#'}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-indigo-100 pt-8 text-center text-xs font-label-bold text-slate-400 md:flex-row md:text-left">
          <p>&copy; 2025 EduMindWell. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span>MADE WITH PURPOSE & CARE</span>
            <span>GDPR COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
