import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { AnalyticsClient } from './AnalyticsClient'
import { getAnalytics } from '@/lib/admin/data'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const raw = await getAnalytics()
  const now = Date.now()
  const DAY = 86400000

  const dailyVisits = Array.from({ length: 14 }, (_, i) => {
    const dayStart = new Date(now - (13 - i) * DAY)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart.getTime() + DAY)
    const events = raw.filter(e => {
      const t = new Date(e.timestamp).getTime()
      return t >= dayStart.getTime() && t < dayEnd.getTime()
    })
    return {
      date: dayStart.toLocaleDateString('en-ET', { month: 'short', day: 'numeric' }),
      visits: events.filter(e => e.type === 'page_view').length,
      productViews: events.filter(e => e.type === 'product_view').length,
      searches: events.filter(e => e.type === 'search').length,
    }
  })

  const productCounts: Record<string, number> = {}
  raw.filter(e => e.type === 'product_view').forEach(e => {
    const id = e.data?.productId || 'unknown'
    productCounts[id] = (productCounts[id] || 0) + 1
  })

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: products } = await sb.from('products').select('id, name_en').in('id', Object.keys(productCounts))

  const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([id, count]) => ({ id, count, name: products?.find(p => p.id === id)?.name_en || id }))

  const searchCounts: Record<string, number> = {}
  raw.filter(e => e.type === 'search').forEach(e => {
    const q = (e.data?.query || '').toLowerCase().trim()
    if (q) searchCounts[q] = (searchCounts[q] || 0) + 1
  })
  const topSearches = Object.entries(searchCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([query, count]) => ({ query, count }))

  const pageCounts: Record<string, number> = {}
  raw.filter(e => e.type === 'page_view').forEach(e => {
    const pg = e.data?.page || '/'
    pageCounts[pg] = (pageCounts[pg] || 0) + 1
  })
  const pageBreakdown = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])
    .map(([page, count]) => ({ page, count }))

  return (
    <AdminPageWrapper requiredResource="analytics">
      <AnalyticsClient
        dailyVisits={dailyVisits}
        topProducts={topProducts}
        topSearches={topSearches}
        pageBreakdown={pageBreakdown}
        totals={{
          totalVisits:       raw.filter(e => e.type === 'page_view').length,
          totalProductViews: raw.filter(e => e.type === 'product_view').length,
          totalSearches:     raw.filter(e => e.type === 'search').length,
          totalOrderClicks:  raw.filter(e => e.type === 'order_click').length,
        }}
      />
    </AdminPageWrapper>
  )
}
