'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => {
    setPhone('')
    setEmail('')
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

    if (!trimmedPhone) {
      setError('Phone number is required')
      return
    }

    if (!phoneRegex.test(trimmedPhone)) {
      setError('Enter a valid phone number')
      return
    }

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError('Enter a valid email address')
      return
    }

    setLoading(true)

    const res = await fetch('/api/free-consultations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: trimmedPhone,
        email: trimmedEmail,
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
      <DialogContent className="sm:max-w-[460px] rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">
            Book a Free Consulting Session
          </DialogTitle>
          <DialogDescription className="text-left text-sm leading-relaxed text-slate-600">
            Share your phone number and email and we&apos;ll save your request in the dashboard so we can follow up with a free consulting session and consultation-related guidance.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="consult-phone">
              Phone number
            </label>
            <Input
              id="consult-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              inputMode="tel"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="consult-email">
              Email address
            </label>
            <Input
              id="consult-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
