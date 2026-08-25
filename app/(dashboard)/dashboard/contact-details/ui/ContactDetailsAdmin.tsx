'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ContactDetails } from '@/lib/contact-details'

type ContactForm = {
  address: string
  email: string
  phone: string
  secondaryPhone: string
  whatsappCountryCode: string
  whatsappNumber: string
  linkedinUrl: string
  instagramUrl: string
  youtubeUrl: string
  isPublished: boolean
}

const emptyForm: ContactForm = {
  address: '', email: '', phone: '', secondaryPhone: '', whatsappCountryCode: '+91', whatsappNumber: '',
  linkedinUrl: '', instagramUrl: '', youtubeUrl: '', isPublished: true,
}

export default function ContactDetailsAdmin() {
  const [form, setForm] = useState<ContactForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/contact-details')
      .then(async (response) => {
        if (response.status === 404) return null
        if (!response.ok) throw new Error('Failed to load contact details')
        return response.json() as Promise<ContactDetails>
      })
      .then((data) => data && setForm({ ...data, secondaryPhone: data.secondaryPhone ?? '', whatsappCountryCode: data.whatsappCountryCode ?? '', whatsappNumber: data.whatsappNumber ?? '', linkedinUrl: data.linkedinUrl ?? '', instagramUrl: data.instagramUrl ?? '', youtubeUrl: data.youtubeUrl ?? '' }))
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Failed to load contact details'))
      .finally(() => setLoading(false))
  }, [])

  const updateField = (field: keyof ContactForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage(null)
    setError(null)
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/contact-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save contact details')
      setForm({ ...data, secondaryPhone: data.secondaryPhone ?? '', whatsappCountryCode: data.whatsappCountryCode ?? '', whatsappNumber: data.whatsappNumber ?? '', linkedinUrl: data.linkedinUrl ?? '', instagramUrl: data.instagramUrl ?? '', youtubeUrl: data.youtubeUrl ?? '' })
      setMessage('Contact details saved')
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save contact details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading contact details...</div>

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Website content</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Contact Details</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Manage the contact information and social links shown on the public website.</p>
      </div>

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2"><Label htmlFor="address">Address</Label><Textarea id="address" required value={form.address} onChange={(event) => updateField('address', event.target.value)} /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="phone">Primary phone</Label><Input id="phone" required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="secondaryPhone">Secondary phone</Label><Input id="secondaryPhone" value={form.secondaryPhone} onChange={(event) => updateField('secondaryPhone', event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="whatsappCountryCode">WhatsApp country code</Label><Input id="whatsappCountryCode" placeholder="+91" value={form.whatsappCountryCode} onChange={(event) => updateField('whatsappCountryCode', event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number</Label><Input id="whatsappNumber" value={form.whatsappNumber} onChange={(event) => updateField('whatsappNumber', event.target.value)} /></div>
        </div>
      </div>

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Social links</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {([['linkedinUrl', 'LinkedIn URL'], ['instagramUrl', 'Instagram URL'], ['youtubeUrl', 'YouTube URL']] as const).map(([field, label]) => (
            <div key={field} className="space-y-2"><Label htmlFor={field}>{label}</Label><Input id={field} type="url" placeholder="https://" value={form[field]} onChange={(event) => updateField(field, event.target.value)} /></div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={form.isPublished} onChange={(event) => updateField('isPublished', event.target.checked)} /> Show contact details publicly</label>
      </div>

      <div className="flex items-center gap-4"><Button type="submit" disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? 'Saving...' : 'Save contact details'}</Button>{message && <span className="text-sm text-emerald-600">{message}</span>}{error && <span className="text-sm text-red-600">{error}</span>}</div>
    </form>
  )
}
