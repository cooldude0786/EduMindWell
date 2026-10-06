import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

const validContentTypes = ['TEXT', 'VIDEO'] as const
const validPlacements = ['HOME', 'TESTIMONIALS', 'BOTH'] as const

type TestimonialContentType = (typeof validContentTypes)[number]
type TestimonialPlacement = (typeof validPlacements)[number]

type Payload = {
  id?: string
  contentType?: string
  placement?: string
  title?: string | null
  quote?: string | null
  beforeText?: string | null
  afterText?: string | null
  attribution?: string
  videoUrl?: string | null
  isPublished?: boolean
  sortOrder?: number
}

function parsePayload(body: Payload) {
  const contentType = (body.contentType ?? 'TEXT') as TestimonialContentType
  const placement = (body.placement ?? 'BOTH') as TestimonialPlacement

  if (!validContentTypes.includes(contentType)) {
    throw new Error('contentType must be TEXT or VIDEO')
  }

  if (!validPlacements.includes(placement)) {
    throw new Error('placement must be HOME, TESTIMONIALS, or BOTH')
  }

  const attribution = (body.attribution ?? '').trim()
  if (!attribution) {
    throw new Error('attribution is required')
  }

  if (contentType === 'TEXT') {
    const quote = (body.quote ?? '').trim()
    if (!quote) {
      throw new Error('quote is required for text testimonials')
    }
  }

  if (contentType === 'VIDEO') {
    const videoUrl = (body.videoUrl ?? '').trim()
    if (!videoUrl) {
      throw new Error('videoUrl is required for video testimonials')
    }
  }

  return {
    contentType,
    placement,
    title: (body.title ?? '').trim() || null,
    quote: (body.quote ?? '').trim() || null,
    beforeText: (body.beforeText ?? '').trim() || null,
    afterText: (body.afterText ?? '').trim() || null,
    attribution,
    videoUrl: (body.videoUrl ?? '').trim() || null,
    isPublished: body.isPublished !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const scope = (searchParams.get('scope') ?? 'all').toUpperCase()
    const includeAll = searchParams.get('all') === 'true'
    const requestedPage = Math.max(1, Math.floor(Number(searchParams.get('page')) || 1))
    const pageSize = Math.min(50, Math.max(1, Math.floor(Number(searchParams.get('pageSize')) || 8)))
    const paginate = searchParams.has('page') || searchParams.has('pageSize')
    const displaySettings = includeAll
      ? null
      : await prisma.testimonialDisplaySetting.findUnique({
          where: { id: 'testimonial-display' },
        })
    const contentTypes: TestimonialContentType[] = []

    if (!displaySettings || displaySettings.showText) {
      contentTypes.push('TEXT')
    }
    if (!displaySettings || displaySettings.showVideo) {
      contentTypes.push('VIDEO')
    }

    const where = includeAll
      ? {}
      : {
          isPublished: true,
          contentType: { in: contentTypes },
          ...(scope === 'HOME'
            ? { placement: { in: ['HOME', 'BOTH'] } }
            : scope === 'TESTIMONIALS'
              ? { placement: { in: ['TESTIMONIALS', 'BOTH'] } }
              : {}),
        }

    if (paginate) {
      const [total, textCount, videoCount] = await Promise.all([
        prisma.testimonial.count({ where }),
        prisma.testimonial.count({ where: { ...where, contentType: 'TEXT' } }),
        prisma.testimonial.count({ where: { ...where, contentType: 'VIDEO' } }),
      ])
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const page = Math.min(requestedPage, totalPages)
      const testimonials = await prisma.testimonial.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      })

      return Response.json({
        items: testimonials,
        total,
        page,
        pageSize,
        totalPages,
        counts: { text: textCount, video: videoCount },
      })
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })

    return Response.json(testimonials)
  } catch (error: unknown) {
    console.error('Fetch testimonials error:', error)
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as NextRequest })
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as Payload
    const data = parsePayload(body)

    const testimonial = await prisma.testimonial.create({
      data,
    })

    return Response.json(testimonial, { status: 201 })
  } catch (error: unknown) {
    console.error('Create testimonial error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create testimonial' },
      { status: 400 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getToken({ req: request as NextRequest })
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as Payload
    const id = body.id

    if (!id) {
      return Response.json({ error: 'Testimonial id is required' }, { status: 400 })
    }

    const data = parsePayload(body)

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    })

    return Response.json(testimonial)
  } catch (error: unknown) {
    console.error('Update testimonial error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to update testimonial' },
      { status: 400 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const token = await getToken({ req: request as NextRequest })
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { ids?: unknown; action?: unknown }
    if (
      !Array.isArray(body.ids) ||
      body.ids.length === 0 ||
      !body.ids.every((id) => typeof id === 'string' && id.trim())
    ) {
      return Response.json({ error: 'A non-empty list of testimonial IDs is required' }, { status: 400 })
    }

    const ids = [...new Set(body.ids as string[])]
    if (body.action === 'DELETE') {
      const result = await prisma.testimonial.deleteMany({ where: { id: { in: ids } } })
      return Response.json({ count: result.count })
    }

    if (body.action !== 'ACTIVATE' && body.action !== 'DEACTIVATE') {
      return Response.json({ error: 'Action must be ACTIVATE, DEACTIVATE, or DELETE' }, { status: 400 })
    }

    const result = await prisma.testimonial.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: body.action === 'ACTIVATE' },
    })

    return Response.json({ count: result.count })
  } catch (error: unknown) {
    console.error('Bulk testimonial action error:', error)
    return Response.json({ error: 'Failed to apply action to testimonials' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getToken({ req: request as NextRequest })
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Testimonial id is required' }, { status: 400 })
    }

    await prisma.testimonial.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('Delete testimonial error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to delete testimonial' },
      { status: 400 },
    )
  }
}
