import { getServerSession } from 'next-auth'
import ContactDetailsAdmin from './ui/ContactDetailsAdmin'

export default async function ContactDetailsPage() {
  const session = await getServerSession()

  if (!session) return <div>Unauthorized</div>

  return <ContactDetailsAdmin />
}
