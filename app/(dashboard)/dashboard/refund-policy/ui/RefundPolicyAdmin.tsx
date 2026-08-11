'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Edit3, Save, Trash2, X, Plus } from 'lucide-react'

type Paragraph = {
  id: string
  sectionId: string
  order: number
  text: string
}

type Section = {
  id: string
  title: string | null
  order: number
  status: 'ACTIVE' | 'ARCHIVED'
  paragraphs: Paragraph[]
}

const getErrorMessage = (err: unknown, fallback: string) => {
  return err instanceof Error ? err.message : fallback
}

export default function RefundPolicyAdmin() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [draftSectionTitle, setDraftSectionTitle] = useState('')

  const [editingParagraphId, setEditingParagraphId] = useState<string | null>(null)
  const [draftParagraphText, setDraftParagraphText] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/refund-policy')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setSections(data)
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Failed to load'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections])

  const isTemp = (id: string) => id.startsWith('temp-')

  // Scroll new edited paragraph into view
  useEffect(() => {
    if (!editingParagraphId) return
    const el = document.getElementById(`p-${editingParagraphId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [editingParagraphId])

  const normalizeSectionOrders = (items: Section[]) => {
    return [...items]
      .sort((a, b) => a.order - b.order)
      .map((section, index) => ({ ...section, order: index + 1 }))
  }

  const addSection = (order = sections.length + 1) => {
    const tempOrder = Math.max(1, order)
    const temp: Section = { id: `temp-${Date.now()}`, title: null, order: tempOrder, status: 'ACTIVE', paragraphs: [] }
    setSections((prev) => normalizeSectionOrders([
      ...prev.map((section) => section.order >= tempOrder ? { ...section, order: section.order + 1 } : section),
      temp,
    ]))
    setEditingSectionId(temp.id)
    setDraftSectionTitle('')
  }

  const cancelSectionEdit = (sectionId: string) => {
    if (isTemp(sectionId)) {
      setSections((prev) => normalizeSectionOrders(prev.filter((section) => section.id !== sectionId)))
    }

    setEditingSectionId(null)
    setDraftSectionTitle('')
  }

  const saveSection = async (sectionId: string) => {
    const title = draftSectionTitle.trim() || null
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    try {
      if (isTemp(sectionId)) {
        const res = await fetch('/api/refund-policy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'section', title, order: section.order }),
        })
        if (!res.ok) throw new Error('Failed to create section')
        const created = await res.json()
        setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...created, paragraphs: [] } as Section : s)))
      } else {
        const res = await fetch('/api/refund-policy', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'section', id: sectionId, title }),
        })
        if (!res.ok) throw new Error('Failed to update section')
        const updated = await res.json()
        setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title: updated.title } : s)))
      }
      setEditingSectionId(null)
      setDraftSectionTitle('')
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to save section'))
    }
  }

  const deleteSection = async (sectionId: string) => {
    if (isTemp(sectionId)) {
      setSections((s) => s.filter((x) => x.id !== sectionId))
      return
    }
    try {
      const res = await fetch(`/api/refund-policy?id=${sectionId}&type=section`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete section')
      setSections((s) => s.filter((x) => x.id !== sectionId))
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to delete section'))
    }
  }

  const addParagraph = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return
    const nextOrder = section.paragraphs.length + 1
    const temp: Paragraph = { id: `temp-${Date.now()}`, sectionId, order: nextOrder, text: '' }
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, paragraphs: [...s.paragraphs, temp] } : s)))
    setEditingParagraphId(temp.id)
    setDraftParagraphText('')
  }

  const saveParagraph = async (paragraphId: string) => {
    const text = draftParagraphText.trim()
    if (!text) {
      setError('Paragraph cannot be empty')
      return
    }
    // find paragraph
    const sec = sections.find((s) => s.paragraphs.find((p) => p.id === paragraphId))
    if (!sec) return
    const paragraph = sec.paragraphs.find((p) => p.id === paragraphId)!

    try {
      if (isTemp(paragraphId)) {
        const res = await fetch('/api/refund-policy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'paragraph', sectionId: sec.id, order: paragraph.order, text }),
        })
        if (!res.ok) throw new Error('Failed to create paragraph')
        const created = await res.json()
        setSections((prev) => prev.map((s) => (s.id === sec.id ? { ...s, paragraphs: s.paragraphs.map((p) => (p.id === paragraphId ? created : p)) } : s)))
      } else {
        const res = await fetch('/api/refund-policy', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'paragraph', id: paragraphId, text }),
        })
        if (!res.ok) throw new Error('Failed to update paragraph')
        const updated = await res.json()
        setSections((prev) => prev.map((s) => (s.id === sec.id ? { ...s, paragraphs: s.paragraphs.map((p) => (p.id === paragraphId ? { ...p, text: updated.text } : p)) } : s)))
      }
      setEditingParagraphId(null)
      setDraftParagraphText('')
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to save paragraph'))
    }
  }

  const deleteParagraph = async (paragraphId: string) => {
    // if temp just remove
    if (isTemp(paragraphId)) {
      setSections((prev) => prev.map((s) => ({ ...s, paragraphs: s.paragraphs.filter((p) => p.id !== paragraphId) })))
      return
    }
    try {
      const res = await fetch(`/api/refund-policy?id=${paragraphId}&type=paragraph`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete paragraph')
      setSections((prev) => prev.map((s) => ({ ...s, paragraphs: s.paragraphs.filter((p) => p.id !== paragraphId) })))
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to delete paragraph'))
    }
  }

  const moveParagraph = async (sectionId: string, paragraphId: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      return prev.map((s) => {
        if (s.id !== sectionId) return s
        const items = [...s.paragraphs].sort((a, b) => a.order - b.order)
        const idx = items.findIndex((p) => p.id === paragraphId)
        if (idx === -1) return s
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= items.length) return s
        const next = [...items]
        const a = next[idx]
        const b = next[swapIdx]
        next[idx] = { ...b, order: a.order }
        next[swapIdx] = { ...a, order: b.order }
        return { ...s, paragraphs: next }
      })
    })

    // persist changed orders for non-temp
    const s = sections.find((x) => x.id === sectionId)
    if (!s) return
    const items = s.paragraphs.sort((a, b) => a.order - b.order)
    const idx = items.findIndex((p) => p.id === paragraphId)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (idx === -1 || swapIdx < 0 || swapIdx >= items.length) return
    const a = items[idx]
    const b = items[swapIdx]
    if (!isTemp(a.id)) {
      fetch('/api/refund-policy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'paragraph', id: a.id, order: a.order + (direction === 'up' ? -1 : 1) }) })
    }
    if (!isTemp(b.id)) {
      fetch('/api/refund-policy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'paragraph', id: b.id, order: b.order + (direction === 'up' ? 1 : -1) }) })
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading refund policy editor...</div>

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Website content</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Refund Policy</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep the public refund policy current by editing sections in the same order visitors will read them.</p>
        </div>
        <button onClick={addSection} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
          <Plus className="h-5 w-5" />
          Add section
        </button>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {sortedSections.map((section, sIndex) => (
          <Fragment key={section.id}>
          <section className="group/section rounded-xl border border-transparent bg-white transition hover:border-slate-200 hover:bg-slate-50/60">
            <div className="grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-center gap-3">
                <div className="flex w-10 flex-col items-center rounded-full bg-slate-100 py-1 text-slate-400 transition group-hover/section:bg-white group-hover/section:text-slate-500">
                  <button type="button" onClick={() => {
                    // move section up
                    const idx = sortedSections.findIndex((x) => x.id === section.id)
                    if (idx > 0) {
                      const above = sortedSections[idx - 1]
                      setSections((prev) => {
                        const copy = [...prev]
                        const a = copy.find((x) => x.id === section.id)!
                        const b = copy.find((x) => x.id === above.id)!
                        const oa = a.order
                        a.order = b.order
                        b.order = oa
                        return copy
                      })
                      if (!isTemp(section.id)) fetch('/api/refund-policy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'section', id: section.id, order: section.order - 1 }) })
                      if (!isTemp(above.id)) fetch('/api/refund-policy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'section', id: above.id, order: above.order + 1 }) })
                    }
                  }} className="rounded-md p-1 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Move section up" disabled={sIndex === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700">{section.order}</span>
                  <button type="button" onClick={() => {
                    const idx = sortedSections.findIndex((x) => x.id === section.id)
                    if (idx < sortedSections.length - 1) {
                      const below = sortedSections[idx + 1]
                      setSections((prev) => {
                        const copy = [...prev]
                        const a = copy.find((x) => x.id === section.id)!
                        const b = copy.find((x) => x.id === below.id)!
                        const oa = a.order
                        a.order = b.order
                        b.order = oa
                        return copy
                      })
                      if (!isTemp(section.id)) fetch('/api/refund-policy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'section', id: section.id, order: section.order + 1 }) })
                      if (!isTemp(below.id)) fetch('/api/refund-policy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'section', id: below.id, order: below.order - 1 }) })
                    }
                  }} className="rounded-md p-1 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Move section down" disabled={sIndex === sortedSections.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="min-w-0 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Section</p>
                  <p className="truncate text-sm font-semibold text-slate-900">{section.title || 'Untitled section'}</p>
                </div>
              </div>

              <div className="min-w-0">
                {editingSectionId === section.id ? (
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                      <input value={draftSectionTitle} onChange={(e) => setDraftSectionTitle(e.target.value)} className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100" placeholder="Section title (optional)" />
                    <button onClick={() => saveSection(section.id)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button onClick={() => cancelSectionEdit(section.id)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="hidden min-w-0 lg:block">
                    <div className="flex items-center gap-3">
                      <h2 className="truncate text-xl font-semibold text-slate-950">{section.title || 'Untitled section'}</h2>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">{section.status.toLowerCase()}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{section.paragraphs.length} paragraph{section.paragraphs.length === 1 ? '' : 's'}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button onClick={() => { if (editingSectionId === section.id) { cancelSectionEdit(section.id) } else { setEditingSectionId(section.id); setDraftSectionTitle(section.title || '') } }} className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950">
                  {editingSectionId===section.id? <X className="h-4 w-4" />:<Edit3 className="h-4 w-4" />}
                  {editingSectionId===section.id? 'Cancel':'Edit'}
                </button>
                <button onClick={() => deleteSection(section.id)} className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2 px-4 pb-4 pl-16">
              {section.paragraphs.sort((a,b)=>a.order-b.order).map((p, pIndex) => (
                <article key={p.id} id={`p-${p.id}`} className="group/paragraph grid gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-slate-200 hover:bg-white hover:shadow-sm sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <div className="flex w-10 flex-row items-center justify-center gap-1 text-slate-400 transition group-hover/paragraph:text-slate-600 sm:flex-col">
                    <button onClick={() => moveParagraph(section.id, p.id, 'up')} className="rounded-md p-1 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" disabled={pIndex===0} aria-label="Move paragraph up"><ArrowUp className="h-4 w-4"/></button>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">{p.order}</span>
                    <button onClick={() => moveParagraph(section.id, p.id, 'down')} className="rounded-md p-1 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" disabled={pIndex===section.paragraphs.length-1} aria-label="Move paragraph down"><ArrowDown className="h-4 w-4"/></button>
                  </div>

                  <div className="min-w-0 border-l border-slate-200 pl-4">
                    {editingParagraphId===p.id? (
                      <div className="space-y-3">
                        <textarea value={draftParagraphText} onChange={(e)=>setDraftParagraphText(e.target.value)} rows={5} className="min-h-32 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100" placeholder="Write paragraph text..." />
                        <div className="flex flex-wrap gap-2">
                          <button onClick={()=>saveParagraph(p.id)} className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"><Save className="h-4 w-4"/> Save</button>
                          <button onClick={()=>{ setEditingParagraphId(null); setDraftParagraphText('') }} className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"><X className="h-4 w-4"/> Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-700">{p.text}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                    <button onClick={()=>{ if(editingParagraphId===p.id){ setEditingParagraphId(null); setDraftParagraphText('') } else { setEditingParagraphId(p.id); setDraftParagraphText(p.text) } }} className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950">
                      {editingParagraphId===p.id ? <X className="h-4 w-4"/> : <Edit3 className="h-4 w-4"/>}
                      {editingParagraphId===p.id? 'Close' : 'Edit'}
                    </button>
                    <button onClick={()=>deleteParagraph(p.id)} className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100">
                      <Trash2 className="h-4 w-4"/>
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              <div className="flex justify-start pt-1">
                <button onClick={()=>addParagraph(section.id)} className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-slate-100 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-950">
                  <Plus className="h-4 w-4"/>
                  Add paragraph
                </button>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3 px-4 py-1">
            <div className="h-px flex-1 bg-slate-200" />
            <button
              type="button"
              onClick={() => addSection(section.order + 1)}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              <Plus className="h-3.5 w-3.5" />
              Add section here
            </button>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
