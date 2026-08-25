import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CONTACT_DETAILS_ID } from '@/lib/contact-details'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-()\s]{7,30}$/

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)

const isValidUrl = (value: unknown) => {
  if (value === null || value === '') return true
  if (typeof value !== 'string') return false

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const cleanOptional = (value: unknown) => {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  return trimmed || null
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const contactDetails = await prisma.contactDetails.findUnique({
      where: { id: CONTACT_DETAILS_ID },
    })

    if (!contactDetails || (!contactDetails.isPublished && !token)) {
      return Response.json({ error: 'Contact details not found' }, { status: 404 })
    }

    return Response.json(contactDetails)
  } catch (error: unknown) {
    console.error('Contact details fetch error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to fetch contact details' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const address = typeof body.address === 'string' ? body.address.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const secondaryPhone = cleanOptional(body.secondaryPhone)
    const whatsappCountryCode = cleanOptional(body.whatsappCountryCode)
    const whatsappNumber = cleanOptional(body.whatsappNumber)
    const linkedinUrl = cleanOptional(body.linkedinUrl)
    const instagramUrl = cleanOptional(body.instagramUrl)
    const youtubeUrl = cleanOptional(body.youtubeUrl)

    if (!address || !email || !phone) {
      return Response.json({ error: 'Address, email, and phone are required' }, { status: 400 })
    }
    if (address.length > 500 || email.length > 254 || phone.length > 30) {
      return Response.json({ error: 'Contact field exceeds the allowed length' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 })
    }
    if (![phone, secondaryPhone, whatsappNumber].every((value) => value === null || phoneRegex.test(value))) {
      return Response.json({ error: 'Invalid phone number format' }, { status: 400 })
    }
    if (![linkedinUrl, instagramUrl, youtubeUrl].every(isValidUrl)) {
      return Response.json({ error: 'Social links must be valid HTTP or HTTPS URLs' }, { status: 400 })
    }

    const updated = await prisma.contactDetails.upsert({
      where: { id: CONTACT_DETAILS_ID },
      update: {
        address,
        email,
        phone,
        secondaryPhone,
        whatsappCountryCode,
        whatsappNumber,
        linkedinUrl,
        instagramUrl,
        youtubeUrl,
        isPublished: body.isPublished !== false,
      },
      create: {
        id: CONTACT_DETAILS_ID,
        address,
        email,
        phone,
        secondaryPhone,
        whatsappCountryCode,
        whatsappNumber,
        linkedinUrl,
        instagramUrl,
        youtubeUrl,
        isPublished: body.isPublished !== false,
      },
    })

    return Response.json(updated)
  } catch (error: unknown) {
    console.error('Contact details update error:', getErrorMessage(error))
    return Response.json({ error: 'Failed to update contact details' }, { status: 500 })
  }
}
