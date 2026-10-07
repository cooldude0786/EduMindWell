import { prisma } from '@/lib/prisma'
import { qstash } from '@/lib/qstash'

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

    try {
      const admins = await prisma.user.findMany({
        where: { isActive: true },
        select: { email: true },
      })
      const adminEmails = admins.map((admin) => admin.email)

      if (adminEmails.length > 0) {
        const publishUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL

        if (!publishUrl) {
          throw new Error('Missing publish base URL for QStash')
        }

        const parsedPublishUrl = new URL(publishUrl)
        if (
          parsedPublishUrl.protocol !== 'https:' ||
          parsedPublishUrl.hostname === 'localhost' ||
          parsedPublishUrl.hostname === '127.0.0.1' ||
          parsedPublishUrl.hostname === '::1'
        ) {
          throw new Error('QStash requires a public HTTPS callback URL')
        }

        const subject = 'New free consultation request'
        const body = [
          'New free consultation request',
          `Email: ${lead.email || 'Not provided'}`,
          `Phone: ${lead.phone || 'Not provided'}`,
          `What they would like to discuss: ${lead.whatToDiscuss || 'Not provided'}`,
          `Received: ${lead.createdAt.toLocaleString()}`,
        ].join('\n')
        const jobs = adminEmails.map((adminEmail) => ({
            id: crypto.randomUUID(),
            email: adminEmail,
            subject,
            body,
          }))
        await prisma.emailQueue.createMany({ data: jobs })

        for (const job of jobs) {
          try {
            await qstash.publishJSON({
              url: new URL('/api/email/send', parsedPublishUrl).toString(),
              body: { jobId: job.id },
            })
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            await prisma.emailQueue.update({
              where: { id: job.id },
              data: { status: 'FAILED', error: errorMessage, attempts: { increment: 1 } },
            })
            await prisma.emailLog.create({
              data: {
                type: 'CONSULTATION',
                recipientEmail: job.email,
                subject: job.subject,
                status: 'FAILED',
                error: errorMessage,
              },
            })
            console.error('Failed to queue consultation notification:', error)
          }
        }
      } else {
        console.warn('Free consultation notification skipped: no active admin users found')
      }
    } catch (error: unknown) {
      console.error('Free consultation notification email failed:', error)
    }

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
