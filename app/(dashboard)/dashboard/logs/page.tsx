import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { AlertCircle, CheckCircle2, Clock3, Mail, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12
const statuses = ['ALL', 'SENT', 'FAILED', 'PENDING', 'PROCESSING'] as const
const types = ['ALL', 'CAMPAIGN', 'CONSULTATION'] as const
type LogStatus = Exclude<(typeof statuses)[number], 'ALL'>
type LogType = Exclude<(typeof types)[number], 'ALL'>

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const logSelect = {
  id: true,
  recipientEmail: true,
  subject: true,
  type: true,
  status: true,
  messageId: true,
  error: true,
  createdAt: true,
  EmailRecipient: { select: { email: true, name: true } },
  BulkEmail: { select: { id: true, title: true, subject: true } },
} satisfies Prisma.EmailLogSelect

type LogRow = Prisma.EmailLogGetPayload<{ select: typeof logSelect }>

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function statusClasses(status: string) {
  if (status === 'SENT') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (status === 'FAILED') return 'border-red-200 bg-red-50 text-red-700'
  if (status === 'PROCESSING') return 'border-blue-200 bg-blue-50 text-blue-700'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

function pageHref({ query, status, type, page }: { query: string; status: string; type: string; page: number }) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (status !== 'ALL') params.set('status', status)
  if (type !== 'ALL') params.set('type', type)
  if (page > 1) params.set('page', String(page))
  const search = params.toString()
  return `/dashboard/logs${search ? `?${search}` : ''}`
}

export default async function LogsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = valueOf(params.q)?.trim() || ''
  const requestedStatus = valueOf(params.status)?.toUpperCase() || 'ALL'
  const requestedType = valueOf(params.type)?.toUpperCase() || 'ALL'
  const status = statuses.includes(requestedStatus as (typeof statuses)[number]) ? requestedStatus : 'ALL'
  const type = types.includes(requestedType as (typeof types)[number]) ? requestedType : 'ALL'
  const requestedPage = Number.parseInt(valueOf(params.page) || '1', 10)
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const where: Prisma.EmailLogWhereInput = {
    ...(status !== 'ALL' ? { status: status as LogStatus } : {}),
    ...(type !== 'ALL' ? { type: type as LogType } : {}),
    ...(query
      ? {
          OR: [
            { recipientEmail: { contains: query, mode: 'insensitive' } },
            { subject: { contains: query, mode: 'insensitive' } },
            { EmailRecipient: { email: { contains: query, mode: 'insensitive' } } },
            { BulkEmail: { subject: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : {}),
  }

  const [logs, filteredCount, sentCount, failedCount, pendingCount, processingCount] = await Promise.all([
    prisma.emailLog.findMany({ where, select: logSelect, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.emailLog.count({ where }),
    prisma.emailLog.count({ where: { status: 'SENT' } }),
    prisma.emailLog.count({ where: { status: 'FAILED' } }),
    prisma.emailLog.count({ where: { status: 'PENDING' } }),
    prisma.emailLog.count({ where: { status: 'PROCESSING' } }),
  ])

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const showingFrom = filteredCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(currentPage * PAGE_SIZE, filteredCount)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Operations</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Email delivery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor campaign and consultation notifications.</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/dashboard/logs" prefetch={false}><RefreshCw />Refresh</Link></Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Sent" value={sentCount} icon={<CheckCircle2 className="text-emerald-600" />} tone="bg-emerald-50" />
        <MetricCard label="Failed" value={failedCount} icon={<AlertCircle className="text-red-600" />} tone="bg-red-50" />
        <MetricCard label="In progress" value={pendingCount + processingCount} icon={<Clock3 className="text-amber-600" />} tone="bg-amber-50" />
        <MetricCard label="Matching logs" value={filteredCount} icon={<Mail className="text-blue-600" />} tone="bg-blue-50" />
      </div>

      <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px_auto]" method="get">
          <label className="sr-only" htmlFor="log-search">Search logs</label>
          <input id="log-search" name="q" defaultValue={query} placeholder="Search recipient or subject..." className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
          <select name="status" defaultValue={status} className="h-9 rounded-md border bg-background px-3 text-sm">
            {statuses.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All statuses' : item}</option>)}
          </select>
          <select name="type" defaultValue={type} className="h-9 rounded-md border bg-background px-3 text-sm">
            {types.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All types' : item}</option>)}
          </select>
          <Button type="submit" size="sm">Filter</Button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-5">
          <div><h2 className="font-semibold">Delivery activity</h2><p className="text-xs text-muted-foreground">{showingFrom}-{showingTo} of {filteredCount} matching logs</p></div>
        </div>
        {logs.length === 0 ? <div className="px-5 py-14 text-center text-sm text-muted-foreground">No delivery logs match these filters.</div> : <div className="divide-y">{logs.map((log) => <LogRowView key={log.id} log={log} />)}</div>}
        {filteredCount > 0 && <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm sm:px-5">
          <span className="text-muted-foreground">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            {currentPage > 1 ? <Button asChild variant="outline" size="sm"><Link href={pageHref({ query, status, type, page: currentPage - 1 })}>Previous</Link></Button> : <Button variant="outline" size="sm" disabled>Previous</Button>}
            {currentPage < totalPages ? <Button asChild variant="outline" size="sm"><Link href={pageHref({ query, status, type, page: currentPage + 1 })}>Next</Link></Button> : <Button variant="outline" size="sm" disabled>Next</Button>}
          </div>
        </div>}
      </section>
    </div>
  )
}

function MetricCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>{icon}</div><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value.toLocaleString('en-IN')}</p></div></div>
}

function LogRowView({ log }: { log: LogRow }) {
  const recipient = log.recipientEmail || log.EmailRecipient?.email || 'Unknown recipient'
  const subject = log.subject || log.BulkEmail?.subject || 'Untitled email'
  const source = log.type === 'CONSULTATION' ? 'Free consultation' : log.BulkEmail?.title || 'Campaign email'

  return <article className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-medium">{recipient}</p><Badge variant="outline" className="text-[10px]">{log.type}</Badge></div><p className="mt-1 truncate text-sm text-muted-foreground">{subject}</p><p className="mt-1 text-xs text-muted-foreground">{source} · {dateLabel(log.createdAt)}</p>{log.error && <p className="mt-2 break-words text-xs text-red-600">{log.error}</p>}</div>
    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1"><Badge variant="outline" className={statusClasses(log.status)}>{log.status}</Badge>{log.messageId && <span className="max-w-44 truncate text-[10px] text-muted-foreground" title={log.messageId}>ID: {log.messageId}</span>}</div>
  </article>
}
