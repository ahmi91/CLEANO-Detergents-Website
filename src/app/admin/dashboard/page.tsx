import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { DashboardClient } from './DashboardClient'
import { createClient } from '@supabase/supabase-js'
import { getAuditLog, getAnalytics, getSettings } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [
    { count: totalProducts },
    { count: totalStores },
    { count: totalInventoryItems },
    auditLog,
    analytics,
    settings,
  ] = await Promise.all([
    sb.from('products').select('*', { count: 'exact', head: true }),
    sb.from('branches').select('*', { count: 'exact', head: true }),
    sb.from('inventory').select('*', { count: 'exact', head: true }),
    getAuditLog(),
    getAnalytics(),
    getSettings(),
  ])

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const totalVisits = analytics.filter(e =>
    e.type === 'page_view' && new Date(e.timestamp).getTime() > sevenDaysAgo
  ).length

  const productViews: Record<string, number> = {}
  analytics.filter(e => e.type === 'product_view').forEach(e => {
    const pid = e.data.productId || 'unknown'
    productViews[pid] = (productViews[pid] || 0) + 1
  })

  const { data: products } = await sb.from('products').select('id, name_en').in('id', Object.keys(productViews))
  const topProducts = Object.entries(productViews)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, count]) => ({
      id, count,
      name: products?.find(p => p.id === id)?.name_en || id
    }))

  const searchCounts: Record<string, number> = {}
  analytics.filter(e => e.type === 'search').forEach(e => {
    const q = e.data.query || ''
    if (q) searchCounts[q] = (searchCounts[q] || 0) + 1
  })
  const topSearches = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([query, count]) => ({ query, count }))

  return {
    stats: {
      totalProducts:      totalProducts || 0,
      totalStores:        totalStores || 0,
      totalInventoryItems: totalInventoryItems || 0,
      totalVisits,
    },
    topProducts,
    topSearches,
    recentActivity: auditLog.slice(0, 10),
    settings,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  return (
    <AdminPageWrapper>
      <DashboardClient {...data} />
    </AdminPageWrapper>
  )
}
