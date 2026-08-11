import { prisma } from '@/lib/prisma'

// API supports managing both RefundPolicySection and RefundPolicyParagraph.
// Query string or body field `type` should be 'section' or 'paragraph'.

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : error
}

export async function GET() {
  try {
    const sections = await prisma.refundPolicySection.findMany({
      orderBy: { order: 'asc' },
      include: { paragraphs: { orderBy: { order: 'asc' } } },
    })

    return Response.json(sections)
  } catch (error: unknown) {
    console.error('Refund policy fetch error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to fetch refund policy' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const type = body.type || 'section'

    if (type === 'section') {
      const { title, order, status } = body
      if (typeof order !== 'number' || order < 1) {
        return Response.json({ error: 'Order must be a positive integer' }, { status: 400 })
      }
      if (status && !['ACTIVE', 'ARCHIVED'].includes(status)) {
        return Response.json({ error: 'Invalid status' }, { status: 400 })
      }

      const section = await prisma.$transaction(async (tx) => {
        await tx.refundPolicySection.updateMany({
          where: { order: { gte: order } },
          data: { order: { increment: 1 } },
        })

        return tx.refundPolicySection.create({
          data: { title: title?.trim() || null, order, status },
        })
      })

      return Response.json(section, { status: 201 })
    }

    if (type === 'paragraph') {
      const { sectionId, order, text } = body
      if (!sectionId || typeof sectionId !== 'string') {
        return Response.json({ error: 'sectionId is required' }, { status: 400 })
      }
      if (typeof order !== 'number' || order < 1) {
        return Response.json({ error: 'Order must be a positive integer' }, { status: 400 })
      }
      if (!text || typeof text !== 'string') {
        return Response.json({ error: 'Text is required' }, { status: 400 })
      }

      const paragraph = await prisma.refundPolicyParagraph.create({
        data: { sectionId, order, text: text.trim() },
      })

      return Response.json(paragraph, { status: 201 })
    }

    return Response.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Refund policy create error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to create refund policy entity' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const type = body.type || 'section'

    if (type === 'section') {
      const { id, title, order, status } = body
      if (!id || typeof id !== 'string') {
        return Response.json({ error: 'Section ID is required' }, { status: 400 })
      }
      if (order !== undefined && (typeof order !== 'number' || order < 1)) {
        return Response.json({ error: 'Order must be a positive integer' }, { status: 400 })
      }
      if (status !== undefined && !['ACTIVE', 'ARCHIVED'].includes(status)) {
        return Response.json({ error: 'Invalid status' }, { status: 400 })
      }

      const section = await prisma.refundPolicySection.update({
        where: { id },
        data: { title: title?.trim() ?? undefined, order, status },
      })

      return Response.json(section)
    }

    if (type === 'paragraph') {
      const { id, sectionId, order, text } = body
      if (!id || typeof id !== 'string') {
        return Response.json({ error: 'Paragraph ID is required' }, { status: 400 })
      }
      if (order !== undefined && (typeof order !== 'number' || order < 1)) {
        return Response.json({ error: 'Order must be a positive integer' }, { status: 400 })
      }
      if (text !== undefined && typeof text !== 'string') {
        return Response.json({ error: 'Text must be a string' }, { status: 400 })
      }

      const paragraph = await prisma.refundPolicyParagraph.update({
        where: { id },
        data: { sectionId, order, text: text?.trim() ?? undefined },
      })

      return Response.json(paragraph)
    }

    return Response.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Refund policy update error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to update refund policy entity' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') || 'section'

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 })
    }

    if (type === 'section') {
      await prisma.refundPolicySection.delete({ where: { id } })
      return Response.json({ message: 'Section deleted successfully' })
    }

    if (type === 'paragraph') {
      await prisma.refundPolicyParagraph.delete({ where: { id } })
      return Response.json({ message: 'Paragraph deleted successfully' })
    }

    return Response.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Refund policy delete error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to delete refund policy entity' }, { status: 500 })
  }
}
