import { prisma } from '@/lib/prisma'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-()\s]{7,20}$/

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}

export async function POST(req: Request) {
  try {
    const { phone, email } = await req.json()

    if (!phone || typeof phone !== 'string') {
      return Response.json(
        { error: 'Phone number is required and must be a string' },
        { status: 400 },
      )
    }

    if (!email || typeof email !== 'string') {
      return Response.json(
        { error: 'Email is required and must be a string' },
        { status: 400 },
      )
    }

    const trimmedPhone = phone.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!phoneRegex.test(trimmedPhone)) {
      return Response.json(
        { error: 'Invalid phone number format' },
        { status: 400 },
      )
    }

    if (!emailRegex.test(trimmedEmail)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    const lead = await prisma.freeConsultationLead.create({
      data: {
        phone: trimmedPhone,
        email: trimmedEmail,
      },
    })

    return Response.json(lead, { status: 201 })
  } catch (error: unknown) {
    console.error('Free consultation lead creation error:', error)
    return Response.json(
      {
        error: 'Failed to create free consultation lead',
        details: getErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const leads = await prisma.freeConsultationLead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return Response.json(leads)
  } catch (error: unknown) {
    console.error('Free consultation lead fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch free consultation leads' },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json()

    if (!id) {
      return Response.json(
        { error: 'Lead ID is required' },
        { status: 400 },
      )
    }

    const validStatuses = ['NEW', 'CONTACTED', 'BOOKED', 'CLOSED'] as const
    if (!status || !validStatuses.includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 },
      )
    }

    const updated = await prisma.freeConsultationLead.update({
      where: { id },
      data: { status },
    })

    return Response.json(updated)
  } catch (error: unknown) {
    console.error('Free consultation lead update error:', error)
    return Response.json(
      {
        error: 'Failed to update free consultation lead',
        details: getErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json(
        { error: 'Lead ID is required' },
        { status: 400 },
      )
    }

    await prisma.freeConsultationLead.delete({
      where: { id },
    })

    return Response.json(
      { message: 'Free consultation lead deleted successfully' },
      { status: 200 },
    )
  } catch (error: unknown) {
    console.error('Free consultation lead delete error:', error)
    return Response.json(
      {
        error: 'Failed to delete free consultation lead',
        details: getErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
