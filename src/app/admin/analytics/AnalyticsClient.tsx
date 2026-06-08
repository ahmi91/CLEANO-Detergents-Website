'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Search, Package, MousePointerClick, Eye } from 'lucide-react'

interface Props {
  dailyVisits: { date: string; visits: number; productViews: number; searches: number }[]
  topProducts: { id: string; name: string; count: number }[]
  topSearches: { query: string; count: number }[]
  pageBreakdown: { page: string; count: number }[]
  totals: { totalVisits: number; totalProductViews: number; totalSearches: number; totalOrderClicks: number }
}

function MiniBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-0.5 h-16">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: v === 0 ? 0.15 : 1 }}
          title={String(v)}
        />
      ))}
    </div>
  )
}

function BarList({ items, max, color }: { items: { label: string; count: number }[]; max: number; color: string }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-5 text-xs text-gray-600 font-bold text-right flex-shrink-0">{i + 1}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white truncate">{item.label}</span>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{item.count}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.count / max) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsClient({ dailyVisits, topProducts, topSearches, pageBreakdown, totals }: Props) {
  const [activeMetric, setActiveMetric] = useState<'visits' | 'productViews' | 'searches'>('visits')

  const metricColors = { visits: '#3B82F6', productViews: '#8B5CF6', searches: '#10B981' }
  const metricValues = dailyVisits.map(d => d[activeMetric])
  const total7Days = dailyVisits.slice(-7).reduce((sum, d) => sum + d[activeMetric], 0)

  const hasData = totals.totalVisits > 0 || topProducts.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Analytics</h1>
        <p className="text-gray-400 text-sm mt-0.5">Website performance overview</p>
      </div>

      {!hasData && (
        <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-5">
          <p className="text-blue-300 text-sm font-medium mb-1">📊 Analytics are ready to collect data</p>
          <p className="text-blue-400/70 text-xs">To enable analytics tracking on the public site, add the analytics tracker to your pages. Once visitors browse your site, data will appear here automatically.</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: Eye,              label: 'Page Views',      value: totals.totalVisits,      color: 'text-blue-400',   bg: 'bg-blue-950' },
          { icon: Package,          label: 'Product Views',   value: totals.totalProductViews, color: 'text-purple-400', bg: 'bg-purple-950' },
          { icon: Search,           label: 'Searches',        value: totals.totalSearches,    color: 'text-emerald-400', bg: 'bg-emerald-950' },
          { icon: MousePointerClick, label: 'Order Clicks',  value: totals.totalOrderClicks,  color: 'text-orange-400', bg: 'bg-orange-950' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white font-display">{s.value.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-white">14-Day Trend</h3>
            <p className="text-xs text-gray-500 mt-0.5">Last 7 days: <span className="text-white font-medium">{total7Days}</span> {activeMetric.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
          </div>
          <div className="flex gap-2 sm:ml-auto flex-wrap">
            {(['visits', 'productViews', 'searches'] as const).map(m => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeMetric === m ? 'text-white' : 'text-gray-500 hover:text-gray-300 bg-gray-800'}`}
                style={activeMetric === m ? { backgroundColor: metricColors[m] } : {}}
              >
                {m.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="relative">
          <MiniBar values={metricValues} color={metricColors[activeMetric]} />
          <div className="flex justify-between mt-2">
            {dailyVisits.map((d, i) => (
              <div key={i} className={`flex-1 text-center text-xs text-gray-600 ${i % 2 === 0 ? '' : 'hidden sm:block'}`}>
                {d.date}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Most Viewed Products</h3>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-gray-600 text-xs text-center py-4">No data yet</p>
          ) : (
            <BarList
              items={topProducts.map(p => ({ label: p.name, count: p.count }))}
              max={topProducts[0]?.count || 1}
              color="#8B5CF6"
            />
          )}
        </div>

        {/* Top Searches */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">Top Searches</h3>
          </div>
          {topSearches.length === 0 ? (
            <p className="text-gray-600 text-xs text-center py-4">No searches recorded</p>
          ) : (
            <BarList
              items={topSearches.map(s => ({ label: `"${s.query}"`, count: s.count }))}
              max={topSearches[0]?.count || 1}
              color="#10B981"
            />
          )}
        </div>

        {/* Page breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white text-sm">Pages Visited</h3>
          </div>
          {pageBreakdown.length === 0 ? (
            <p className="text-gray-600 text-xs text-center py-4">No page view data</p>
          ) : (
            <BarList
              items={pageBreakdown.map(p => ({ label: p.page || '/', count: p.count }))}
              max={pageBreakdown[0]?.count || 1}
              color="#3B82F6"
            />
          )}
        </div>
      </div>

      {/* How to enable tracking */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-white text-sm mb-3">🔌 Enable Analytics Tracking</h3>
        <p className="text-xs text-gray-400 mb-3">Add this snippet to your public pages to track visits. The <code className="text-blue-400">/api/admin/analytics</code> endpoint is public and accepts POST requests with event data.</p>
        <pre className="bg-gray-800 rounded-lg p-4 text-xs text-green-400 overflow-x-auto">{`// In your page components (useEffect):
fetch('/api/admin/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'page_view',     // or 'product_view', 'search', 'order_click'
    data: { page: '/products', productId: 'cleano-laundry' }
  })
})`}</pre>
      </div>
    </div>
  )
}
