'use client'

import { useState } from 'react'
import { FileText, Save, Edit2, X, Check } from 'lucide-react'

type Section = {
  id: string
  page: string
  section: string
  titleEn: string
  titleAm: string
  bodyEn: string
  bodyAm: string
  updatedAt: string
}

const PAGE_COLORS: Record<string, string> = {
  home: '#3B82F6',
  about: '#8B5CF6',
  contact: '#10B981',
  footer: '#F59E0B',
}

function PageBadge({ page }: { page: string }) {
  const color = PAGE_COLORS[page] || '#6B7280'
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: color + '22', color }}>
      {page}
    </span>
  )
}

export function ContentClient({ sections: initialSections }: { sections: Section[] }) {
  const [sections, setSections] = useState(initialSections)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Section | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [pageFilter, setPageFilter] = useState('all')

  const pages = ['all', ...Array.from(new Set(sections.map(s => s.page)))]

  function openEdit(section: Section) {
    setForm({ ...section })
    setEditingId(section.id)
  }
  function closeEdit() { setEditingId(null); setForm(null) }

  async function save() {
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSections(prev => prev.map(s => s.id === form.id ? { ...form, updatedAt: new Date().toISOString() } : s))
        setSavedIds(prev => {
  const next = new Set(prev)
  next.add(form.id)
  return next
})
        closeEdit()
        setTimeout(() => setSavedIds(prev => { const n = new Set(prev); n.delete(form.id); return n }), 2000)
      }
    } finally { setSaving(false) }
  }

  const filtered = sections.filter(s => pageFilter === 'all' || s.page === pageFilter)
  const ta = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Content Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">Edit website text content without touching code</p>
      </div>

      {/* Page filter */}
      <div className="flex gap-2 flex-wrap">
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setPageFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${pageFilter === p ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            {p === 'all' ? 'All Pages' : p}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(section => {
          const isEditing = editingId === section.id
          const isSaved = savedIds.has(section.id)

          return (
            <div key={section.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-800/50">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">{section.section}</span>
                  {section.updatedAt && (
                    <span className="text-xs text-gray-500 ml-2">· updated {new Date(section.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
                <PageBadge page={section.page} />
                <button
                  onClick={() => isEditing ? closeEdit() : openEdit(section)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${isEditing ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                >
                  {isSaved ? <><Check className="w-3 h-3" /> Saved!</> : isEditing ? <><X className="w-3 h-3" /> Cancel</> : <><Edit2 className="w-3 h-3" /> Edit</>}
                </button>
              </div>

              {/* Content */}
              {!isEditing ? (
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">🇬🇧 English</div>
                    <p className="text-sm text-white font-medium mb-1">{section.titleEn}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{section.bodyEn}</p>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">🇪🇹 Amharic</div>
                    <p className="text-sm text-white font-medium mb-1" dir="auto">{section.titleAm}</p>
                    <p className="text-xs text-gray-400 leading-relaxed" dir="auto">{section.bodyAm}</p>
                  </div>
                </div>
              ) : form && (
                <div className="px-5 py-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">🇬🇧 English Title</label>
                      <input value={form.titleEn} onChange={e => setForm(f => f ? { ...f, titleEn: e.target.value } : f)} className={inp} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">🇪🇹 Amharic Title</label>
                      <input value={form.titleAm} onChange={e => setForm(f => f ? { ...f, titleAm: e.target.value } : f)} dir="auto" className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">🇬🇧 English Body</label>
                      <textarea value={form.bodyEn} onChange={e => setForm(f => f ? { ...f, bodyEn: e.target.value } : f)} rows={4} className={ta} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">🇪🇹 Amharic Body</label>
                      <textarea value={form.bodyAm} onChange={e => setForm(f => f ? { ...f, bodyAm: e.target.value } : f)} dir="auto" rows={4} className={ta} />
                    </div>
                  </div>
                  <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-600 pb-4">
        Content saved here is stored in <code className="text-gray-500">src/data/admin/content.json</code>. 
        To make the public website dynamically read these values, your page components need to fetch from the content API or read the JSON file.
      </p>
    </div>
  )
}
