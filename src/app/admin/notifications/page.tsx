import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { NotificationsClient } from './NotificationsClient'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  return (
    <AdminPageWrapper>
      <NotificationsClient />
    </AdminPageWrapper>
  )
}
