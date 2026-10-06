'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

type TestimonialContentType = 'TEXT' | 'VIDEO'
type TestimonialPlacement = 'HOME' | 'TESTIMONIALS' | 'BOTH'
type TestimonialDisplaySettings = { showText: boolean; showVideo: boolean }
type TestimonialPageResult = {
  items: Testimonial[]
  total: number
  page: number
  totalPages: number
  counts: { text: number; video: number }
}

const pageSize = 8

type Testimonial = {
  id: string
  contentType: TestimonialContentType
  placement: TestimonialPlacement
  title?: string | null
  quote?: string | null
  beforeText?: string | null
  afterText?: string | null
  attribution: string
  videoUrl?: string | null
  isPublished: boolean
  sortOrder: number
}

const emptyForm: Omit<Testimonial, 'id'> = {
  contentType: 'TEXT',
  placement: 'BOTH',
  title: '',
  quote: '',
  beforeText: '',
  afterText: '',
  attribution: '',
  videoUrl: '',
  isPublished: true,
  sortOrder: 0,
}

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [form, setForm] = useState<Testimonial | Omit<Testimonial, 'id'>>(emptyForm)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkActionPending, setBulkActionPending] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingItems, setLoadingItems] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({ text: 0, video: 0 })
  const [displaySettings, setDisplaySettings] = useState<TestimonialDisplaySettings>({ showText: true, showVideo: true })
  const [savingSettings, setSavingSettings] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const loadItems = async (page: number) => {
    setLoadingItems(true)
    try {
      const response = await fetch(`/api/testimonials?all=true&page=${page}&pageSize=${pageSize}`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to load testimonials')
      }

      const result = (await response.json()) as TestimonialPageResult
      setItems(result.items)
      setTotal(result.total)
      setCurrentPage(result.page)
      setTotalPages(result.totalPages)
      setCounts(result.counts)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load testimonials')
    } finally {
      setLoadingItems(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    fetch(`/api/testimonials?all=true&page=1&pageSize=${pageSize}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load testimonials')
        return (await response.json()) as TestimonialPageResult
      })
      .then((result) => {
        if (!isMounted) return
        setItems(result.items)
        setTotal(result.total)
        setCurrentPage(result.page)
        setTotalPages(result.totalPages)
        setCounts(result.counts)
      })
      .catch((error: unknown) => {
        if (isMounted) setMessage(error instanceof Error ? error.message : 'Failed to load testimonials')
      })
      .finally(() => {
        if (isMounted) setLoadingItems(false)
      })

    fetch('/api/testimonials/settings', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load display settings')
        return (await response.json()) as TestimonialDisplaySettings
      })
      .then((settings) => {
        if (isMounted) setDisplaySettings(settings)
      })
      .catch((error: unknown) => {
        if (isMounted) setMessage(error instanceof Error ? error.message : 'Failed to load display settings')
      })

    return () => {
      isMounted = false
    }
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setVideoFile(null)
    if (videoInputRef.current) videoInputRef.current.value = ''
    setEditingId(null)
    setDialogOpen(false)
  }

  const openCreateDialog = (contentType: TestimonialContentType) => {
    setForm({ ...emptyForm, contentType })
    setEditingId(null)
    setVideoFile(null)
    if (videoInputRef.current) videoInputRef.current.value = ''
    setDialogOpen(true)
  }

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id)
    setForm(item)
    setVideoFile(null)
    if (videoInputRef.current) videoInputRef.current.value = ''
    setDialogOpen(true)
  }

  const currentPageSelectedCount = items.filter((item) => selectedIds.includes(item.id)).length
  const allCurrentPageSelected = items.length > 0 && currentPageSelectedCount === items.length

  const togglePageSelection = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      for (const item of items) {
        if (checked) next.add(item.id)
        else next.delete(item.id)
      }
      return [...next]
    })
  }

  const toggleItemSelection = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return [...next]
    })
  }

  const handleBulkAction = async (action: 'ACTIVATE' | 'DEACTIVATE' | 'DELETE') => {
    if (!selectedIds.length) return
    if (action === 'DELETE' && !window.confirm(`Delete ${selectedIds.length} selected testimonial(s)? This cannot be undone.`)) {
      return
    }

    setBulkActionPending(true)
    setMessage(null)
    try {
      const response = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action }),
      })
      const result = (await response.json()) as { count?: number; error?: string }
      if (!response.ok) throw new Error(result.error ?? 'Failed to update selected testimonials')

      setSelectedIds([])
      await loadItems(currentPage)
      setMessage(`${result.count ?? 0} testimonial(s) ${action === 'DELETE' ? 'deleted' : action === 'ACTIVATE' ? 'activated' : 'deactivated'}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update selected testimonials')
    } finally {
      setBulkActionPending(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      let videoUrl = form.videoUrl

      if (form.contentType === 'VIDEO' && videoFile) {
        const uploadForm = new FormData()
        uploadForm.append('file', videoFile)
        uploadForm.append('section', 'TESTIMONIALS')
        uploadForm.append('title', form.title || form.attribution)
        uploadForm.append('altText', form.attribution)

        const uploadResponse = await fetch('/api/media/upload', {
          method: 'POST',
          body: uploadForm,
        })
        const uploadResult = (await uploadResponse.json()) as { publicUrl?: string; error?: string }

        if (!uploadResponse.ok || !uploadResult.publicUrl) {
          throw new Error(uploadResult.error ?? 'Failed to upload video')
        }

        videoUrl = uploadResult.publicUrl
        setForm((current) => ({ ...current, videoUrl }))
        setVideoFile(null)
        if (videoInputRef.current) videoInputRef.current.value = ''
      }

      const payload = {
        ...form,
        videoUrl,
        id: editingId ?? undefined,
      }

      const response = await fetch('/api/testimonials', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(errorData?.error ?? 'Failed to save testimonial')
      }

      await loadItems(editingId ? currentPage : 1)
      resetForm()
      setMessage('Testimonial saved successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDisplaySettings = async () => {
    setSavingSettings(true)
    setMessage(null)

    try {
      const response = await fetch('/api/testimonials/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(displaySettings),
      })
      const result = (await response.json()) as TestimonialDisplaySettings & { error?: string }

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to save display settings')
      }

      setDisplaySettings(result)
      setMessage('Display settings saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save display settings')
    } finally {
      setSavingSettings(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Website content</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Testimonials</h1>
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
        <div className="bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Text testimonials</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {counts.text}
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Video testimonials</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {counts.video}
          </p>
        </div>
      </div>

      <Tabs defaultValue="manage" className="flex w-full min-w-0 flex-col">
        <TabsList aria-label="Testimonial sections" className="flex! h-auto! w-full! max-w-none! min-w-0 gap-1 overflow-hidden rounded-lg bg-slate-100 p-1">
          <TabsTrigger
            value="manage"
            className="h-10 min-w-0 flex-1 basis-0 whitespace-normal wrap-break-word rounded-md px-2 text-center text-xs font-medium leading-tight text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm sm:text-sm"
          >
            Manage testimonials
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="h-10 min-w-0 flex-1 basis-0 whitespace-normal wrap-break-word rounded-md px-2 text-center text-xs font-medium leading-tight text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm sm:text-sm"
          >
            Display settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Testimonials</h2>
              <p className="mt-1 text-sm text-slate-500">{total} records</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openCreateDialog('TEXT')}>Add text</Button>
              <Button onClick={() => openCreateDialog('VIDEO')}>Add video</Button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {selectedIds.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                <span className="mr-auto text-sm font-medium text-slate-700">
                  {selectedIds.length} selected across pages
                </span>
                <Button variant="outline" size="sm" disabled={bulkActionPending} onClick={() => void handleBulkAction('ACTIVATE')}>
                  Activate
                </Button>
                <Button variant="outline" size="sm" disabled={bulkActionPending} onClick={() => void handleBulkAction('DEACTIVATE')}>
                  Deactivate
                </Button>
                <Button variant="destructive" size="sm" disabled={bulkActionPending} onClick={() => void handleBulkAction('DELETE')}>
                  Delete
                </Button>
              </div>
            )}

            {loadingItems ? (
              <p className="py-8 text-center text-sm text-slate-500">Loading testimonials...</p>
            ) : total === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No testimonials yet.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          aria-label="Select all testimonials on this page"
                          checked={allCurrentPageSelected}
                          ref={(element) => {
                            if (element) element.indeterminate = currentPageSelectedCount > 0 && !allCurrentPageSelected
                          }}
                          onChange={(event) => togglePageSelection(event.target.checked)}
                        />
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Testimonial</TableHead>
                      <TableHead>Placement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            aria-label={`Select ${item.attribution}`}
                            checked={selectedIds.includes(item.id)}
                            onChange={(event) => toggleItemSelection(item.id, event.target.checked)}
                          />
                        </TableCell>
                        <TableCell>{item.contentType}</TableCell>
                        <TableCell>
                          <p className="max-w-56 truncate font-medium text-slate-900">
                            {item.contentType === 'VIDEO'
                              ? item.title || 'Video testimonial'
                              : item.quote || item.beforeText || 'Text testimonial'}
                          </p>
                          <p className="max-w-56 truncate text-slate-500">{item.attribution}</p>
                        </TableCell>
                        <TableCell>{item.placement}</TableCell>
                        <TableCell>{item.isPublished ? 'Active' : 'Inactive'}</TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-500">Page {currentPage} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingItems || currentPage <= 1}
                      onClick={() => void loadItems(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingItems || currentPage >= totalPages}
                      onClick={() => void loadItems(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Visible testimonial types</h2>
              <p className="mt-1 text-sm text-slate-600">Only checked types appear on the public testimonial sections.</p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={displaySettings.showText}
                onChange={(event) => setDisplaySettings((current) => ({ ...current, showText: event.target.checked }))}
                className="mt-1 size-4 accent-slate-900"
              />
              <span>
                <span className="block font-medium text-slate-900">Text testimonials</span>
                <span className="mt-1 block text-sm text-slate-600">Show published text quotes and stories.</span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={displaySettings.showVideo}
                onChange={(event) => setDisplaySettings((current) => ({ ...current, showVideo: event.target.checked }))}
                className="mt-1 size-4 accent-slate-900"
              />
              <span>
                <span className="block font-medium text-slate-900">Video testimonials</span>
                <span className="mt-1 block text-sm text-slate-600">Show published video stories.</span>
              </span>
            </label>

            <Button onClick={handleSaveDisplaySettings} disabled={savingSettings}>
              {savingSettings ? 'Saving...' : 'Save display settings'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (open) setDialogOpen(true)
          else resetForm()
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit' : 'Add'} {form.contentType === 'TEXT' ? 'text' : 'video'} testimonial
            </DialogTitle>
            <DialogDescription>Manage testimonial content, placement, and active status.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="placement">Placement</Label>
              <select
                id="placement"
                value={form.placement}
                onChange={(event) => setForm((current) => ({ ...current, placement: event.target.value as TestimonialPlacement }))}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="HOME">Home</option>
                <option value="TESTIMONIALS">Testimonials page</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            {form.contentType === 'TEXT' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="beforeText">Before</Label>
                  <Textarea
                    id="beforeText"
                    value={form.beforeText ?? ''}
                    onChange={(event) => setForm((current) => ({ ...current, beforeText: event.target.value }))}
                    placeholder="What the person was struggling with before the guidance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="afterText">After</Label>
                  <Textarea
                    id="afterText"
                    value={form.afterText ?? ''}
                    onChange={(event) => setForm((current) => ({ ...current, afterText: event.target.value }))}
                    placeholder="What changed after the guidance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote</Label>
                  <Textarea
                    id="quote"
                    value={form.quote ?? ''}
                    onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))}
                    placeholder="A short testimonial quote"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Video title</Label>
                  <Input
                    id="title"
                    value={form.title ?? ''}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Optional title for the video testimonial"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={form.videoUrl ?? ''}
                    onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))}
                    placeholder="https://.../video.mp4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoFile">Upload video</Label>
                  <Input
                    id="videoFile"
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] ?? null
                      if (file && (!file.type.startsWith('video/') || file.size > 50 * 1024 * 1024)) {
                        setMessage('Choose a video file smaller than 50 MB.')
                        event.currentTarget.value = ''
                        setVideoFile(null)
                        return
                      }
                      setMessage(null)
                      setVideoFile(file)
                    }}
                  />
                  <p className="text-xs text-slate-500">
                    {videoFile ? `${videoFile.name} will upload when you save.` : 'Optional. Videos up to 50 MB.'}
                  </p>
                </div>
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attribution">Attribution</Label>
                <Input
                  id="attribution"
                  value={form.attribution ?? ''}
                  onChange={(event) => setForm((current) => ({ ...current, attribution: event.target.value }))}
                  placeholder="Name or role"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Display order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={form.sortOrder ?? 0}
                  onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) || 0 }))}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
              />
              Active and visible to visitors
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  )
}
