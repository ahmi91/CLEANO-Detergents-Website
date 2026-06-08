import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { UsersClient } from './UsersClient'
import { getUsers } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const users = (await getUsers()).map(({ passwordHash, ...rest }) => rest)
  return (
    <AdminPageWrapper requiredResource="*">
      <UsersClient initialUsers={users as any} />
    </AdminPageWrapper>
  )
}
