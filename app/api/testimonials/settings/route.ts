import { getToken } from 'next-auth/jwt'

import { prisma } from '@/lib/prisma'

const settingId = 'testimonial-display'

export async function GET() {
  try {
    const setting = await prisma.testimonialDisplaySetting.findUnique({
      where: { id: settingId },
    })

    return Response.json({
      showText: setting?.showText ?? true,
      showVideo: setting?.showVideo ?? true,
    })
  } catch (error: unknown) {
    console.error('Fetch testimonial display settings error:', error)
    return Response.json({ error: 'Failed to fetch display settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getToken({ req: request as any })
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { showText?: unknown; showVideo?: unknown }
    if (typeof body.showText !== 'boolean' || typeof body.showVideo !== 'boolean') {
      return Response.json({ error: 'Both display options must be boolean values' }, { status: 400 })
    }

    const setting = await prisma.testimonialDisplaySetting.upsert({
      where: { id: settingId },
      create: { id: settingId, showText: body.showText, showVideo: body.showVideo },
      update: { showText: body.showText, showVideo: body.showVideo },
    })

    return Response.json({ showText: setting.showText, showVideo: setting.showVideo })
  } catch (error: unknown) {
    console.error('Update testimonial display settings error:', error)
    return Response.json({ error: 'Failed to update display settings' }, { status: 500 })
  }
}