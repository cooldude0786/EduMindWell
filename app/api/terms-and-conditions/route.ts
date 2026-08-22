import { prisma } from '@/lib/prisma'

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : error

export async function GET() {
  try {
    const sections = await prisma.termsAndConditionsSection.findMany({ orderBy: { order: 'asc' }, include: { paragraphs: { orderBy: { order: 'asc' } } } })
    return Response.json(sections)
  } catch (error: unknown) {
    console.error('Terms fetch error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to fetch terms and conditions' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.type === 'paragraph') {
      if (!body.sectionId || typeof body.sectionId !== 'string' || typeof body.order !== 'number' || body.order < 1 || !body.text?.trim()) return Response.json({ error: 'Invalid paragraph' }, { status: 400 })
      const paragraph = await prisma.termsAndConditionsParagraph.create({ data: { sectionId: body.sectionId, order: body.order, text: body.text.trim() } })
      return Response.json(paragraph, { status: 201 })
    }
    if (typeof body.order !== 'number' || body.order < 1) return Response.json({ error: 'Order must be positive' }, { status: 400 })
    const section = await prisma.$transaction(async (tx) => {
      await tx.termsAndConditionsSection.updateMany({ where: { order: { gte: body.order } }, data: { order: { increment: 1 } } })
      return tx.termsAndConditionsSection.create({ data: { title: body.title?.trim() || null, order: body.order } })
    })
    return Response.json(section, { status: 201 })
  } catch (error: unknown) {
    console.error('Terms create error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to create terms content' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    if (!body.id) return Response.json({ error: 'ID is required' }, { status: 400 })
    if (body.type === 'paragraph') {
      const paragraph = await prisma.termsAndConditionsParagraph.update({ where: { id: body.id }, data: { order: body.order, text: body.text?.trim() } })
      return Response.json(paragraph)
    }
    const section = await prisma.termsAndConditionsSection.update({ where: { id: body.id }, data: { title: body.title?.trim() ?? undefined, order: body.order, status: body.status } })
    return Response.json(section)
  } catch (error: unknown) {
    console.error('Terms update error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to update terms content' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 })
    if (url.searchParams.get('type') === 'paragraph') await prisma.termsAndConditionsParagraph.delete({ where: { id } })
    else await prisma.termsAndConditionsSection.delete({ where: { id } })
    return Response.json({ message: 'Deleted successfully' })
  } catch (error: unknown) {
    console.error('Terms delete error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to delete terms content' }, { status: 500 })
  }
}
