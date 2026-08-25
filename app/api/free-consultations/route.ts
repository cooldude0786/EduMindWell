import { prisma } from '@/lib/prisma'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-()\s]{7,20}$/

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}

export async function POST(req: Request) {
  try {
    const { phone, email, whatToDiscuss } = await req.json()

    if (phone !== undefined && typeof phone !== 'string') {
      return Response.json({ error: 'Phone number must be a string' }, { status: 400 })
    }

    if (email !== undefined && typeof email !== 'string') {
      return Response.json({ error: 'Email must be a string' }, { status: 400 })
    }

    if (whatToDiscuss !== undefined && typeof whatToDiscuss !== 'string') {
      return Response.json({ error: 'Help request must be a string' }, { status: 400 })
    }

    const trimmedPhone = typeof phone === 'string' ? phone.trim() : ''
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const trimmedWhatToDiscuss = typeof whatToDiscuss === 'string' ? whatToDiscuss.trim() : ''

    if (!trimmedPhone && !trimmedEmail) {
      return Response.json({ error: 'Please provide either a phone number or an email address' }, { status: 400 })
    }

    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      return Response.json(
        { error: 'Invalid phone number format' },
        { status: 400 },
      )
    }

    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    if (trimmedWhatToDiscuss.length > 1000) {
      return Response.json(
        { error: 'Please keep your message under 1000 characters' },
        { status: 400 },
      )
    }

    const lead = await prisma.freeConsultationLead.create({
      data: {
        phone: trimmedPhone || null,
        email: trimmedEmail || null,
        whatToDiscuss: trimmedWhatToDiscuss,
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
