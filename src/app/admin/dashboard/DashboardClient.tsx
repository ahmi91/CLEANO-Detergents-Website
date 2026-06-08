'use client'

import { Package, MapPin, Warehouse, TrendingUp, Search, Activity, Clock, ArrowUpRight } from 'lucide-react'

interface Props {
  stats: { totalProducts: number; totalStores: number; totalInventoryItems: number; totalVisits: number }
  topProducts: { id: string; name: string; count: number }[]
  topSearches: { query: string; count: number }[]
  recentActivity: { id: string; userName: string; action: string; resource: string; details?: string; timestamp: string }[]
  settings: { companyName: string }
}

function StatCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-600" />
      </div>
      <div className="text-3xl font-bold text-white font-display mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  )
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

function actionBadge(action: string) {
  const colors: Record<string, string> = {
    login: 'bg-green-950 text-green-400',
    logout: 'bg-gray-800 text-gray-400',
    login_failed: 'bg-red-950 text-red-400',
    update: 'bg-blue-950 text-blue-400',
    create: 'bg-purple-950 text-purple-400',
    delete: 'bg-red-950 text-red-400',
  }
  return colors[action] || 'bg-gray-800 text-gray-400'
}

export function DashboardClient({ stats, topProducts, topSearches, recentActivity, settings }: Props) {
  const now = new Date().toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">{now} · {settings.companyName}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-blue-600" />
        <StatCard icon={MapPin} label="Store Locations" value={stats.totalStores} color="bg-emerald-600" />
        <StatCard icon={Warehouse} label="Inventory Items" value={stats.totalInventoryItems} color="bg-purple-600" sub="tracked records" />
        <StatCard icon={TrendingUp} label="Visits (7 days)" value={stats.totalVisits || '—'} color="bg-orange-600" sub="page views" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white text-sm">Most Viewed Products</h3>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No data yet. Analytics will appear here as visitors browse your site.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold flex-shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.count} views</div>
                  </div>
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min((p.count / (topProducts[0]?.count || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Searches */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">Most Searched Terms</h3>
          </div>
          {topSearches.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No search data yet.</p>
          ) : (
            <div className="space-y-3">
              {topSearches.map((s, i) => (
                <div key={s.query} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold flex-shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">"{s.query}"</div>
                    <div className="text-xs text-gray-500">{s.count} searches</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Add New Product', href: '/admin/products?action=new', color: 'bg-blue-600 hover:bg-blue-500' },
              { label: 'Add Store Location', href: '/admin/stores?action=new', color: 'bg-emerald-700 hover:bg-emerald-600' },
              { label: 'Update Translations', href: '/admin/translations', color: 'bg-purple-700 hover:bg-purple-600' },
              { label: 'Edit Site Settings', href: '/admin/settings', color: 'bg-gray-700 hover:bg-gray-600' },
            ].map(a => (
              <a key={a.href} href={a.href} className={`block w-full text-center text-sm font-medium text-white py-2 rounded-lg transition-colors ${a.color}`}>
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-white text-sm">Recent Activity</h3>
        </div>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No activity logged yet.</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map(entry => (
              <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
                <div className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${actionBadge(entry.action)}`}>
                  {entry.action.replace(/_/g, ' ')}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white">{entry.userName}</span>
                  {entry.details && <span className="text-sm text-gray-400"> · {entry.details}</span>}
                </div>
                <div className="text-xs text-gray-600 flex-shrink-0">{timeAgo(entry.timestamp)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
