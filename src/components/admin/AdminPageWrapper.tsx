import { redirect } from 'next/navigation'
import { getAdminSession, AdminRole, hasPermission } from '@/lib/admin/auth'
import { AdminShell } from '@/components/admin/AdminShell'

interface AdminPageWrapperProps {
  children: React.ReactNode
  requiredResource?: string
}

export async function AdminPageWrapper({ children, requiredResource }: AdminPageWrapperProps) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  if (requiredResource && requiredResource !== '*' && !hasPermission(session.role, requiredResource)) {
    redirect('/admin/dashboard')
  }

  return (
    <AdminShell user={{ email: session.email, name: session.name, role: session.role }}>
      {children}
    </AdminShell>
  )
}
