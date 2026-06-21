"use client"

import { useState } from 'react'

type FreeConsultationLead = {
  id: string
  phone: string
  email: string
  status: 'NEW' | 'CONTACTED' | 'BOOKED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

const statusOptions: FreeConsultationLead['status'][] = [
  'NEW',
  'CONTACTED',
  'BOOKED',
  'CLOSED',
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function FreeConsultationsList({
  initialLeads,
}: {
  initialLeads: FreeConsultationLead[]
}) {
  const [leads, setLeads] = useState<FreeConsultationLead[]>(initialLeads)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const updateStatus = async (id: string, status: FreeConsultationLead['status']) => {
    setLoadingId(id)
    setError('')

    const res = await fetch('/api/free-consultations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status }),
    })

    setLoadingId(null)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to update consultation lead')
      return
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status,
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
    )
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete consultation request from ${email}?`)) {
      return
    }

    setLoadingId(id)
    setError('')

    const res = await fetch(`/api/free-consultations?id=${id}`, {
      method: 'DELETE',
    })

    setLoadingId(null)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to delete consultation lead')
      return
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id))
  }

  return (
    <div className="rounded border bg-white p-4 space-y-4">
      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {leads.length === 0 ? (
        <p className="text-sm text-gray-500">No consultation requests yet.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded border p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div>
                    <h2 className="font-semibold text-gray-900">{lead.email}</h2>
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  </div>

                  <p className="text-xs text-gray-500">
                    Created: {formatDate(lead.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {formatDate(lead.updatedAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:min-w-[220px]">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(
                        lead.id,
                        e.target.value as FreeConsultationLead['status'],
                      )
                    }
                    className="rounded border px-3 py-2 text-sm"
                    disabled={loadingId === lead.id}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(lead.id, lead.email)}
                    disabled={loadingId === lead.id}
                    className="rounded bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
