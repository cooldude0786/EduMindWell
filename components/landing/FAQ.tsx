'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/landing-constants'

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="py-xl px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-h2 text-h2 text-primary text-center mb-12">
          Questions We Hear Every Day
        </h2>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.id} className="border-b border-indigo-100 pb-4">
              <button
                onClick={() => toggleFaq(item.id)}
                className="flex justify-between items-center w-full text-left font-bold text-primary py-4 group"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openId === item.id && (
                <p className="text-on-surface-variant text-sm pr-12 pb-4">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
