import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import FreeConsultationsList from './ui/FreeConsultationsList'

export default async function FreeConsultationsPage() {
  const session = await getServerSession()

  if (!session) {
    return <div>Unauthorized</div>
  }

  const leads = await prisma.freeConsultationLead.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  const initialLeads = leads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Free Consultations</h1>
        <p className="text-sm text-gray-500">
          Manage consultation requests submitted from the website ({leads.length} total)
        </p>
      </div>

      <FreeConsultationsList initialLeads={initialLeads} />
    </div>
  )
}
