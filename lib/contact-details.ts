export const CONTACT_DETAILS_ID = 'contact-details'

export type ContactDetails = {
  id: string
  address: string
  email: string
  phone: string
  secondaryPhone: string | null
  whatsappCountryCode: string | null
  whatsappNumber: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  youtubeUrl: string | null
  isPublished: boolean
}

export const contactDetailsFields = [
  'address',
  'email',
  'phone',
  'secondaryPhone',
  'whatsappCountryCode',
  'whatsappNumber',
  'linkedinUrl',
  'instagramUrl',
  'youtubeUrl',
  'isPublished',
] as const

export const WHATSAPP_MESSAGE = "Hi, I'm interested in your consulting session. Please share more details."

export function getWhatsAppUrl(
  contactDetails: Pick<ContactDetails, 'whatsappCountryCode' | 'whatsappNumber'>,
  whatToDiscuss?: string,
) {
  const countryCode = contactDetails.whatsappCountryCode?.replace(/\D/g, '')
  const number = contactDetails.whatsappNumber?.replace(/\D/g, '')
  if (!countryCode || !number) return null

  const message = whatToDiscuss?.trim()
    ? `${WHATSAPP_MESSAGE}\n\nWhat I would like help with: ${whatToDiscuss.trim()}`
    : WHATSAPP_MESSAGE

  return `https://wa.me/${countryCode}${number}?text=${encodeURIComponent(message)}`
}
