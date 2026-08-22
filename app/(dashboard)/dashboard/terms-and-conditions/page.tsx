import { getServerSession } from 'next-auth'
import RefundPolicyAdmin from '../refund-policy/ui/RefundPolicyAdmin'

export default async function TermsAndConditionsAdminPage() {
  const session = await getServerSession()
  if (!session) return <div>Unauthorized</div>
  return <RefundPolicyAdmin endpoint="/api/terms-and-conditions" pageTitle="Terms and Conditions" pageDescription="Keep the public terms current by editing sections in the same order visitors will read them." loadingLabel="Loading terms editor..." />
}
