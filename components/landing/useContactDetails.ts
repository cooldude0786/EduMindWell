'use client'

import { useEffect, useState } from 'react'
import type { ContactDetails } from '@/lib/contact-details'

export function useContactDetails() {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/contact-details')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ContactDetails | null) => setContactDetails(data))
      .catch(() => setContactDetails(null))
      .finally(() => setLoading(false))
  }, [])

  return { contactDetails, loading }
}
