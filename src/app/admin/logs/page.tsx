import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { LogsClient } from './LogsClient'
import { getAuditLog } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const logs = await getAuditLog()
  return (
    <AdminPageWrapper requiredResource="logs">
      <LogsClient logs={logs} />
    </AdminPageWrapper>
  )
}
