'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Copy, Star, Package, X, Save, AlertTriangle } from 'lucide-react'

const CATEGORIES = ['laundry', 'multipurpose', 'floor', 'dishes', 'baby']
const BADGES = ['', 'Best Seller', 'New', 'Premium', 'Value Pack', 'Hypoallergenic', 'Limited']

type Product = {
  id: string
  name: { en: string; am: string }
  description: { en: string; am: string }
  image: string
  category: string
  prices: Record<string, number>
  badge: string | null
  rating: number
  reviews: number
  tiktokVideos: string[]
  featured: boolean
}

function emptyProduct(): Omit<Product, 'id'> {
  return {
    name: { en: '', am: '' },
    description: { en: '', am: '' },
    image: '',
    category: 'laundry',
    prices: { '3L': 0, '5L': 0 },
    badge: null,
    rating: 4.5,
    reviews: 0,
    tiktokVideos: [],
    featured: false,
  }
}

interface Props {
  initialProducts: Product[]
  branches: any[]
}

export function ProductsClient({ initialProducts, branches }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<Partial<Product>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [catFilter, setCatFilter] = useState('all')

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openEdit(product: Product) {
    setForm({ ...product })
    setEditingId(product.id)
    setIsCreating(false)
  }

  function openCreate() {
    setForm({ id: `product-${Date.now()}`, ...emptyProduct() })
    setIsCreating(true)
    setEditingId(null)
  }

  function closeForm() {
    setEditingId(null)
    setIsCreating(false)
    setForm({})
  }

  async function saveProduct() {
    setSaving(true)
    try {
      const action = isCreating ? 'create' : 'update'
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: action, ...form }),
      })
      if (res.ok) {
        if (isCreating) {
          setProducts(prev => [...prev, form as Product])
        } else {
          setProducts(prev => prev.map(p => p.id === form.id ? form as Product : p))
        }
        closeForm()
        showToast(isCreating ? 'Product created!' : 'Product updated!')
      } else {
        showToast('Failed to save product', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: string) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'delete', id }),
    })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
      setDeleteConfirm(null)
      showToast('Product deleted')
    } else {
      showToast('Failed to delete', 'error')
    }
  }

  function duplicateProduct(product: Product) {
    const copy = { ...product, id: `${product.id}-copy-${Date.now()}`, name: { en: product.name.en + ' (Copy)', am: product.name.am } }
    setForm(copy)
    setIsCreating(true)
    setEditingId(null)
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.en.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || p.category === catFilter
    return matchSearch && matchCat
  })

  const formOpen = isCreating || editingId !== null

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">{products.length} products total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${catFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group">
            <div className="aspect-video bg-gray-800 relative overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name.en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-600" />
                </div>
              )}
              {product.badge && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.badge}</span>
              )}
              {product.featured && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-1">{product.category}</div>
              <h3 className="font-semibold text-white text-sm mb-1 truncate">{product.name.en}</h3>
              <p className="text-xs text-gray-500 truncate mb-3">{product.name.am}</p>
              <div className="flex items-center gap-2 mb-3">
                {Object.entries(product.prices).map(([size, price]) => (
                  <span key={size} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    {size}: {price} Birr
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 py-1.5 rounded-lg transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => duplicateProduct(product)} className="flex items-center justify-center p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <Copy className="w-3 h-3" />
                </button>
                <button onClick={() => setDeleteConfirm(product.id)} className="flex items-center justify-center p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-950 rounded-lg transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            No products found
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-950 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Delete Product</h3>
                <p className="text-sm text-gray-400">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => deleteProduct(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create form drawer */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50">
          <div className="bg-gray-900 border-l border-gray-800 h-full w-full max-w-2xl overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between sticky top-0 bg-gray-900 pb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{isCreating ? 'New Product' : 'Edit Product'}</h2>
              <div className="flex gap-2">
                <button onClick={saveProduct} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Product ID (slug)</label>
                <input
                  value={form.id || ''}
                  onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="cleano-laundry-detergent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">English Name</label>
                  <input
                    value={form.name?.en || ''}
                    onChange={e => setForm(f => ({ ...f, name: { ...f.name as any, en: e.target.value } }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Amharic Name (አማርኛ)</label>
                  <input
                    value={form.name?.am || ''}
                    onChange={e => setForm(f => ({ ...f, name: { ...f.name as any, am: e.target.value } }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    dir="auto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">English Description</label>
                  <textarea
                    value={form.description?.en || ''}
                    onChange={e => setForm(f => ({ ...f, description: { ...f.description as any, en: e.target.value } }))}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Amharic Description</label>
                  <textarea
                    value={form.description?.am || ''}
                    onChange={e => setForm(f => ({ ...f, description: { ...f.description as any, am: e.target.value } }))}
                    rows={3}
                    dir="auto"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Image URL</label>
                <input
                  value={form.image || ''}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
                {form.image && (
                  <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden bg-gray-800">
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select
                    value={form.category || ''}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Badge</label>
                  <select
                    value={form.badge || ''}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value || null }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {BADGES.map(b => <option key={b} value={b}>{b || 'No badge'}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured || false}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Prices (Birr)</label>
                <div className="grid grid-cols-2 gap-4">
                  {['3L', '5L'].map(size => (
                    <div key={size}>
                      <label className="block text-xs text-gray-500 mb-1">{size}</label>
                      <input
                        type="number"
                        value={(form.prices as any)?.[size] || ''}
                        onChange={e => setForm(f => ({ ...f, prices: { ...(f.prices as any), [size]: Number(e.target.value) } }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Rating (0–5)</label>
                  <input
                    type="number"
                    min="0" max="5" step="0.1"
                    value={form.rating || ''}
                    onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Reviews Count</label>
                  <input
                    type="number"
                    value={form.reviews || ''}
                    onChange={e => setForm(f => ({ ...f, reviews: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">TikTok Videos (one per line)</label>
                <textarea
                  value={(form.tiktokVideos || []).join('\n')}
                  onChange={e => setForm(f => ({ ...f, tiktokVideos: e.target.value.split('\n').filter(Boolean) }))}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
                  placeholder="https://www.tiktok.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
