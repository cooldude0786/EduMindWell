import { getServerSession } from 'next-auth'
import RefundPolicyAdmin from './ui/RefundPolicyAdmin'

export default async function RefundPolicyPage() {
  const session = await getServerSession()

  if (!session) {
    return <div>Unauthorized</div>
  }

  return <RefundPolicyAdmin />
}
