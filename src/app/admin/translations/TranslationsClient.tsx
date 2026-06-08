'use client'

import { useState, useMemo } from 'react'
import { Search, Save, Globe, RefreshCw } from 'lucide-react'

function flattenObj(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObj(obj[key], path))
    } else {
      result[path] = String(obj[key] ?? '')
    }
  }
  return result
}

function unflattenObj(flat: Record<string, string>): any {
  const result: any = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] || {}
      current = current[parts[i]]
    }
    current[parts[parts.length - 1]] = value
  }
  return result
}

export function TranslationsClient({ initialEn, initialAm }: { initialEn: any; initialAm: any }) {
  const [enFlat, setEnFlat] = useState(() => flattenObj(initialEn))
  const [amFlat, setAmFlat] = useState(() => flattenObj(initialAm))
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  const keys = useMemo(() => Object.keys(enFlat), [enFlat])
  const filteredKeys = useMemo(() => {
    if (!search) return keys
    const q = search.toLowerCase()
    return keys.filter(k =>
      k.toLowerCase().includes(q) ||
      (enFlat[k] || '').toLowerCase().includes(q) ||
      (amFlat[k] || '').toLowerCase().includes(q)
    )
  }, [keys, search, enFlat, amFlat])

  function setEn(key: string, val: string) {
    setEnFlat(prev => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  function setAm(key: string, val: string) {
    setAmFlat(prev => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ en: unflattenObj(enFlat), am: unflattenObj(amFlat) }),
      })
      if (res.ok) {
        setDirty(false)
        setToast('Translations saved! Restart the dev server to see changes.')
        setTimeout(() => setToast(null), 5000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-sm">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Translations</h1>
          <p className="text-gray-400 text-sm mt-0.5">{keys.length} translation keys · English & Amharic</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : `Save Changes${dirty ? ' *' : ''}`}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search keys or values..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-800 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div>Translation Key</div>
          <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> English</div>
          <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> አማርኛ (Amharic)</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-800/50 max-h-[60vh] overflow-y-auto">
          {filteredKeys.map(key => (
            <div key={key} className="grid grid-cols-[1fr_1fr_1fr] gap-0 hover:bg-gray-800/30 transition-colors">
              <div className="px-4 py-3 flex items-center">
                <code className="text-xs text-blue-400 font-mono break-all">{key}</code>
              </div>
              <div className="px-2 py-2 border-l border-gray-800/50">
                <textarea
                  value={enFlat[key] || ''}
                  onChange={e => setEn(key, e.target.value)}
                  rows={1}
                  className="w-full bg-transparent text-white text-sm resize-none focus:outline-none focus:bg-gray-800 rounded px-2 py-1 min-h-[32px]"
                  style={{ height: 'auto' }}
                  onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px' }}
                />
              </div>
              <div className="px-2 py-2 border-l border-gray-800/50">
                <textarea
                  value={amFlat[key] || ''}
                  onChange={e => setAm(key, e.target.value)}
                  rows={1}
                  dir="auto"
                  className="w-full bg-transparent text-white text-sm resize-none focus:outline-none focus:bg-gray-800 rounded px-2 py-1 min-h-[32px]"
                  style={{ height: 'auto' }}
                  onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px' }}
                />
              </div>
            </div>
          ))}
          {filteredKeys.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">No translation keys found</div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600">
        Note: Translation changes take effect after saving and restarting the Next.js server in production. In development, a page refresh may be needed.
      </p>
    </div>
  )
}
