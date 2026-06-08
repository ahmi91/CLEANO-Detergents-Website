'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, GripVertical, Tag, AlertTriangle } from 'lucide-react'

type Category = {
  id: string
  label: { en: string; am: string }
  order: number
  icon: string
  color: string
}

function emptyCategory(): Category {
  return { id: '', label: { en: '', am: '' }, order: 99, icon: '🧴', color: '#3B82F6' }
}

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(() =>
    [...initialCategories].sort((a, b) => a.order - b.order)
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<Category>(emptyCategory())
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function openEdit(cat: Category) { setForm({ ...cat }); setEditingId(cat.id); setIsCreating(false) }
  function openCreate() { setForm({ ...emptyCategory(), id: `cat-${Date.now()}` }); setIsCreating(true); setEditingId(null) }
  function closeForm() { setEditingId(null); setIsCreating(false) }

  async function save() {
    setSaving(true)
    try {
      const action = isCreating ? 'create' : 'update'
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: action, ...form }),
      })
      if (res.ok) {
        if (isCreating) setCategories(prev => [...prev, form].sort((a, b) => a.order - b.order))
        else setCategories(prev => prev.map(c => c.id === form.id ? form : c))
        closeForm()
        showToast(isCreating ? 'Category created!' : 'Category updated!')
      }
    } finally { setSaving(false) }
  }

  async function deleteCategory(id: string) {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'delete', id }),
    })
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id))
      setDeleteConfirm(null)
      showToast('Category deleted')
    }
  }

  // Drag-to-reorder
  function handleDragStart(id: string) { setDragging(id) }
  function handleDragOver(e: React.DragEvent, id: string) { e.preventDefault(); setDragOver(id) }

  async function handleDrop(targetId: string) {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }
    const ids = categories.map(c => c.id)
    const fromIdx = ids.indexOf(dragging)
    const toIdx = ids.indexOf(targetId)
    const reordered = [...categories]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    const withOrder = reordered.map((c, i) => ({ ...c, order: i + 1 }))
    setCategories(withOrder)
    setDragging(null)
    setDragOver(null)
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'reorder', ids: withOrder.map(c => c.id) }),
    })
    showToast('Order saved')
  }

  const formOpen = isCreating || editingId !== null
  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Categories</h1>
          <p className="text-gray-400 text-sm mt-0.5">{categories.length} categories · drag to reorder</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_auto_1fr_1fr_auto_auto] items-center bg-gray-800 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider gap-4">
          <div className="w-4" />
          <div>Icon</div>
          <div>English Label</div>
          <div>Amharic Label</div>
          <div>Color</div>
          <div>Actions</div>
        </div>
        <div className="divide-y divide-gray-800/50">
          {categories.map(cat => (
            <div
              key={cat.id}
              draggable
              onDragStart={() => handleDragStart(cat.id)}
              onDragOver={e => handleDragOver(e, cat.id)}
              onDrop={() => handleDrop(cat.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null) }}
              className={`grid grid-cols-[auto_auto_1fr_1fr_auto_auto] items-center px-4 py-3.5 gap-4 transition-colors ${
                dragOver === cat.id ? 'bg-blue-950/40 border-t-2 border-blue-600' :
                dragging === cat.id ? 'opacity-40' : 'hover:bg-gray-800/30'
              }`}
            >
              <GripVertical className="w-4 h-4 text-gray-600 cursor-grab active:cursor-grabbing" />
              <div className="text-2xl w-8 text-center">{cat.icon}</div>
              <div className="text-sm text-white font-medium">{cat.label.en}</div>
              <div className="text-sm text-gray-400" dir="auto">{cat.label.am}</div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-gray-700" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-gray-500 font-mono">{cat.color}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteConfirm(cat.id)} className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-950 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <Tag className="w-10 h-10 mx-auto mb-3 text-gray-700" />
              No categories yet
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600">Drag categories to reorder them. Order affects how they appear in the public product filter tabs.</p>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="font-semibold text-white">Delete Category?</h3>
                <p className="text-sm text-gray-400">Products using this category won't be affected.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => deleteCategory(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Form drawer */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50">
          <div className="bg-gray-900 border-l border-gray-800 h-full w-full max-w-md overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800 sticky top-0 bg-gray-900">
              <h2 className="text-lg font-bold text-white">{isCreating ? 'New Category' : 'Edit Category'}</h2>
              <div className="flex gap-2">
                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Category ID (slug, no spaces)</label>
                <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className={inp} placeholder="e.g. laundry" disabled={!isCreating} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">English Label</label>
                  <input value={form.label.en} onChange={e => setForm(f => ({ ...f, label: { ...f.label, en: e.target.value } }))} className={inp} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Amharic Label</label>
                  <input value={form.label.am} onChange={e => setForm(f => ({ ...f, label: { ...f.label, am: e.target.value } }))} dir="auto" className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Emoji Icon</label>
                  <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className={inp} placeholder="🧴" maxLength={4} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      className="w-10 h-9 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
                    <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className={`${inp} flex-1`} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} className={inp} />
              </div>
              {/* Preview */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-400 mb-3">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white" style={{ backgroundColor: form.color + '33', border: `1px solid ${form.color}66`, color: form.color }}>
                    <span>{form.icon}</span>
                    <span>{form.label.en || 'Category Name'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
