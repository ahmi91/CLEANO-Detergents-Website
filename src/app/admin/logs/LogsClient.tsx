'use client'

import { useState } from 'react'
import { Search, ScrollText, Shield } from 'lucide-react'

type AuditEntry = {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details?: string
  timestamp: string
  ip?: string
}

const ACTION_COLORS: Record<string, string> = {
  login: 'bg-green-950 text-green-400',
  logout: 'bg-gray-800 text-gray-400',
  login_failed: 'bg-red-950 text-red-400',
  create: 'bg-blue-950 text-blue-400',
  update: 'bg-purple-950 text-purple-400',
  delete: 'bg-red-950 text-red-400',
}

export function LogsClient({ logs }: { logs: AuditEntry[] }) {
  const [search, setSearch] = useState('')
  const [resourceFilter, setResourceFilter] = useState('all')

  const resources = ['all', ...Array.from(new Set(logs.map(l => l.resource)))]

  const filtered = logs.filter(l => {
    const matchSearch = [l.userName, l.action, l.resource, l.details || ''].some(s =>
      s.toLowerCase().includes(search.toLowerCase())
    )
    const matchResource = resourceFilter === 'all' || l.resource === resourceFilter
    return matchSearch && matchResource
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Audit Logs</h1>
        <p className="text-gray-400 text-sm mt-0.5">{logs.length} total events recorded</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {resources.map(r => (
            <button key={r} onClick={() => setResourceFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${resourceFilter === r ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ScrollText className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            No log entries found
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {filtered.map(entry => (
              <div key={entry.id} className="flex items-start gap-4 px-4 py-3 hover:bg-gray-800/30">
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${ACTION_COLORS[entry.action] || 'bg-gray-800 text-gray-400'}`}>
                  {entry.action.replace(/_/g, ' ')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{entry.userName}</span>
                    <span className="text-xs text-gray-500">on</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">{entry.resource}</span>
                  </div>
                  {entry.details && <p className="text-xs text-gray-400 mt-0.5">{entry.details}</p>}
                  {entry.ip && <p className="text-xs text-gray-600 mt-0.5">IP: {entry.ip}</p>}
                </div>
                <div className="text-xs text-gray-600 flex-shrink-0 text-right">
                  <div>{new Date(entry.timestamp).toLocaleDateString()}</div>
                  <div>{new Date(entry.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
