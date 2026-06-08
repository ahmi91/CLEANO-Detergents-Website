'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin, Phone, Clock, Star, X, Save, AlertTriangle } from 'lucide-react'

type Branch = {
  id: string
  name: { en: string; am: string }
  address: { en: string; am: string }
  phone: string
  hours: string
  lat: number
  lng: number
  tiktokVideos: string[]
  isMain: boolean
}

function emptyBranch(): Branch {
  return {
    id: `branch-${Date.now()}`,
    name: { en: '', am: '' },
    address: { en: '', am: '' },
    phone: '',
    hours: 'Mon–Sat: 8AM–8PM | Sun: 9AM–6PM',
    lat: 9.0054,
    lng: 38.7636,
    tiktokVideos: [],
    isMain: false,
  }
}

export function StoresClient({ initialBranches }: { initialBranches: Branch[] }) {
  const [branches, setBranches] = useState(initialBranches)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<Branch>(emptyBranch())
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function openEdit(b: Branch) { setForm({ ...b }); setEditingId(b.id); setIsCreating(false) }
  function openCreate() { setForm(emptyBranch()); setIsCreating(true); setEditingId(null) }
  function closeForm() { setEditingId(null); setIsCreating(false) }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: isCreating ? 'create' : 'update', ...form }),
      })
      if (res.ok) {
        if (isCreating) setBranches(prev => [...prev, form])
        else setBranches(prev => prev.map(b => b.id === form.id ? form : b))
        closeForm()
        showToast(isCreating ? 'Store created!' : 'Store updated!')
      }
    } finally { setSaving(false) }
  }

  async function deleteBranch(id: string) {
    const res = await fetch('/api/admin/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'delete', id }),
    })
    if (res.ok) { setBranches(prev => prev.filter(b => b.id !== id)); setDeleteConfirm(null); showToast('Store deleted') }
  }

  const formOpen = isCreating || editingId !== null

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Store Locations</h1>
          <p className="text-gray-400 text-sm mt-0.5">{branches.length} locations · Changes update the public map</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Store
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map(branch => (
          <div key={branch.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm truncate">{branch.name.en}</h3>
                  {branch.isMain && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Main</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{branch.name.am}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3 h-3 flex-shrink-0 text-blue-400" /> <span className="truncate">{branch.address.en}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Phone className="w-3 h-3 flex-shrink-0 text-green-400" /> {branch.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 flex-shrink-0 text-purple-400" /> <span className="truncate">{branch.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-mono">📍 {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(branch)} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 py-1.5 rounded-lg transition-colors">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(branch.id)} className="flex items-center justify-center p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-950 rounded-lg transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="font-semibold text-white">Delete Store?</h3>
                <p className="text-sm text-gray-400">This will remove it from the public map.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => deleteBranch(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Form drawer */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50">
          <div className="bg-gray-900 border-l border-gray-800 h-full w-full max-w-lg overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{isCreating ? 'New Store' : 'Edit Store'}</h2>
              <div className="flex gap-2">
                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">English Name</label>
                  <input value={form.name.en} onChange={e => setForm(f => ({ ...f, name: { ...f.name, en: e.target.value } }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Amharic Name</label>
                  <input value={form.name.am} onChange={e => setForm(f => ({ ...f, name: { ...f.name, am: e.target.value } }))} dir="auto"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Address (English)</label>
                  <input value={form.address.en} onChange={e => setForm(f => ({ ...f, address: { ...f.address, en: e.target.value } }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Address (Amharic)</label>
                  <input value={form.address.am} onChange={e => setForm(f => ({ ...f, address: { ...f.address, am: e.target.value } }))} dir="auto"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Phone Number</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="+251 91 ..." />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Opening Hours</label>
                <input value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Mon–Sat: 8AM–8PM | Sun: 9AM–6PM" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Latitude</label>
                  <input type="number" step="0.0001" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Longitude</label>
                  <input type="number" step="0.0001" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Google Maps tip: search location → right-click → copy coordinates</label>
                <a href="https://maps.google.com" target="_blank" className="text-xs text-blue-400 hover:underline">Open Google Maps →</a>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isMain} onChange={e => setForm(f => ({ ...f, isMain: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-300">Main / Flagship Location</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
