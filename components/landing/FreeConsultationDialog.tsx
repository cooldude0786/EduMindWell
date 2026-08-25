'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CalendarCheck2, Mail, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/contact-details'
import { useContactDetails } from './useContactDetails'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-()\s]{7,20}$/

type FreeConsultationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FreeConsultationDialog({
  open,
  onOpenChange,
}: FreeConsultationDialogProps) {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [whatToDiscuss, setWhatToDiscuss] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { contactDetails } = useContactDetails()
  const whatsappUrl = contactDetails ? getWhatsAppUrl(contactDetails, whatToDiscuss) : null

  const resetForm = () => {
    setPhone('')
    setEmail('')
    setWhatToDiscuss('')
    setError('')
    setSuccess('')
    setLoading(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const trimmedPhone = phone.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedWhatToDiscuss = whatToDiscuss.trim()

    if (!trimmedPhone && !trimmedEmail) {
      setError('Please provide either a phone number or an email address')
      return
    }

    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      setError('Enter a valid phone number')
      return
    }

    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      setError('Enter a valid email address')
      return
    }

    if (!trimmedWhatToDiscuss) {
      setError('Tell us briefly what you would like to discuss')
      return
    }

    if (trimmedWhatToDiscuss.length > 1000) {
      setError('Keep your message under 1000 characters')
      return
    }

    setLoading(true)

    const res = await fetch('/api/free-consultations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: trimmedPhone || undefined,
        email: trimmedEmail || undefined,
        whatToDiscuss: trimmedWhatToDiscuss,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Failed to save consultation request')
      return
    }

    setSuccess('Your consultation request has been saved successfully.')
    setTimeout(() => {
      resetForm()
      onOpenChange(false)
    }, 900)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="modal-scrollbar max-h-[88dvh] gap-0 overflow-y-auto rounded-[24px] border border-white/40 bg-surface-container-lowest p-0 text-on-surface shadow-[0_30px_90px_rgba(15,23,42,0.34)] sm:max-h-[92dvh] sm:max-w-[520px] sm:rounded-[32px]"
      >
        <div className="relative bg-primary px-5 pb-5 pt-5 text-white sm:px-8 sm:pb-7 sm:pt-8">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background:
                'radial-gradient(circle at 18% 20%, #10b981 0%, transparent 34%), radial-gradient(circle at 88% 12%, #ffffff 0%, transparent 26%)',
            }}
          />
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close consultation form"
              className="absolute right-4 top-4 z-10 h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>

          <DialogHeader className="relative z-10 max-w-[25rem] space-y-2 pr-8 sm:space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase text-primary-fixed-dim font-label-bold max-[380px]:hidden">
              <CalendarCheck2 className="h-3.5 w-3.5" />
              Free 30-minute session
            </div>
            <DialogTitle className="text-left font-h2 text-[25px] leading-tight text-white sm:text-[32px]">
              Book a Free Consulting Session
            </DialogTitle>
            <DialogDescription className="text-left text-[13px] leading-relaxed text-primary-fixed-dim sm:text-[15px]">
              Share your details and our team will follow up with consultation-related guidance for your next step.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-4 px-5 pb-6 pt-5 sm:space-y-5 sm:px-8 sm:pb-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold text-on-surface"
                htmlFor="consult-phone"
              >
                <Phone className="h-4 w-4 text-primary" />
                Phone number
              </label>
              <Input
                id="consult-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                inputMode="tel"
                className="h-11 rounded-2xl border-outline-variant bg-white px-4 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 sm:h-12"
              />
            </div>

            <div className="space-y-2">
              <label
                className="flex items-center gap-2 text-sm font-semibold text-on-surface"
                htmlFor="consult-email"
              >
                <Mail className="h-4 w-4 text-primary" />
                Email address
              </label>
              <Input
                id="consult-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="h-11 rounded-2xl border-outline-variant bg-white px-4 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 sm:h-12"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-y border-outline-variant/70 py-2.5 text-xs text-on-surface-variant sm:py-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/45 px-3 py-1.5 text-on-secondary-container">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure details
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/60 px-3 py-1.5 text-on-primary-container">
              No commitment required
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface" htmlFor="consult-topic">
              What would you like help with?
            </label>
            <Textarea
              id="consult-topic"
              value={whatToDiscuss}
              onChange={(event) => setWhatToDiscuss(event.target.value)}
              placeholder="Tell us briefly what you'd like to discuss..."
              maxLength={1000}
              className="min-h-24 rounded-2xl border-outline-variant bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-error-container bg-error-container/55 px-4 py-3 text-sm font-medium text-on-error-container">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-secondary/20 bg-secondary-container/65 px-4 py-3 text-sm font-medium text-on-secondary-container">
              {success}
            </div>
          ) : null}

          <div className="grid gap-3 pt-1 sm:grid-cols-[0.9fr_1.1fr]">
            {whatsappUrl && <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-secondary bg-white px-5 text-sm font-semibold text-secondary hover:bg-secondary-container sm:col-span-2 sm:h-12 sm:px-6"
            >
              <MessageCircle className="h-4 w-4" />
              Connect on WhatsApp
            </a>}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-full border-outline-variant bg-white px-5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container sm:h-12 sm:px-6"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] hover:bg-on-primary-fixed-variant sm:h-12 sm:px-7"
            >
              {loading ? 'Saving...' : 'Save Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
