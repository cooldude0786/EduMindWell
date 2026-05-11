import Link from 'next/link'
import { Mail, Share2 } from 'lucide-react'
import { BRAND, FOOTER_COLUMNS, SOCIAL_LINKS } from '@/lib/landing-constants'

const socialIconMap = {
  Facebook: Share2,
  Mail,
  Link2: Share2,
}

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-50 border-t border-indigo-100 pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 mb-12 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div>
            <div className="mb-2">
              <span className="text-xl font-bold text-primary">{BRAND.name}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-label-bold mb-6">
              {BRAND.tagline}
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent =
                  socialIconMap[social.icon as keyof typeof socialIconMap]
                return (
                  <button
                    key={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary transition-all hover:bg-primary hover:text-white"
                  >
                    <IconComponent className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Columns 2 & 3: Links */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold text-primary mb-4">{column.title}</h4>
              <ul className="space-y-3 text-body-sm text-slate-500">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href || '#'}
                      className="hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-indigo-100 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-label-bold gap-4">
          <p>&copy; 2025 EduMindWell. All rights reserved.</p>
          <div className="flex gap-6">
            <span>MADE WITH PURPOSE & CARE</span>
            <span>GDPR COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
