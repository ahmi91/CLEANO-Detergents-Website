'use client'

import { useState } from 'react'
import { Plus, Save, Warehouse, TrendingDown, AlertTriangle, CheckCircle2, Search } from 'lucide-react'

type InventoryRecord = {
  id: string
  productId: string
  size: string
  storeId: string
  quantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
  updatedBy: string
}

const STATUS_COLORS = {
  in_stock: 'bg-green-950 text-green-400 border-green-800',
  low_stock: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  out_of_stock: 'bg-red-950 text-red-400 border-red-800',
}

const STATUS_ICONS = {
  in_stock: CheckCircle2,
  low_stock: AlertTriangle,
  out_of_stock: TrendingDown,
}

function computeStatus(qty: number): InventoryRecord['status'] {
  if (qty <= 0) return 'out_of_stock'
  if (qty <= 10) return 'low_stock'
  return 'in_stock'
}

export function InventoryClient({
  initialInventory, products, branches
}: {
  initialInventory: InventoryRecord[]
  products: any[]
  branches: any[]
}) {
  const [inventory, setInventory] = useState(initialInventory)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ productId: products[0]?.id || '', size: '3L', storeId: 'all', quantity: 0 })
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function updateItem(id: string, quantity: number) {
    setSaving(id)
    const status = computeStatus(quantity)
    const res = await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity, status }),
    })
    if (res.ok) {
      setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity, status, lastUpdated: new Date().toISOString() } : i))
      showToast('Inventory updated')
    }
    setSaving(null)
  }

  async function addItem() {
    const id = `inv-${Date.now()}`
    const status = computeStatus(form.quantity)
    const res = await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form, status }),
    })
    if (res.ok) {
      const newItem: InventoryRecord = { id, ...form, status, lastUpdated: new Date().toISOString(), updatedBy: 'admin' }
      setInventory(prev => [...prev, newItem])
      setIsAdding(false)
      showToast('Inventory item added')
    }
  }

  const getProductName = (id: string) => products.find(p => p.id === id)?.name?.en || id
  const getBranchName = (id: string) => id === 'all' ? 'All Stores' : branches.find(b => b.id === id)?.name?.en || id

  const filtered = inventory.filter(item => {
    const name = getProductName(item.productId).toLowerCase()
    return name.includes(search.toLowerCase()) || item.storeId.includes(search.toLowerCase())
  })

  const summary = {
    total: inventory.length,
    inStock: inventory.filter(i => i.status === 'in_stock').length,
    lowStock: inventory.filter(i => i.status === 'low_stock').length,
    outOfStock: inventory.filter(i => i.status === 'out_of_stock').length,
  }

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Inventory</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track stock levels across all stores</p>
        </div>
        <button onClick={() => setIsAdding(v => !v)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: summary.total, color: 'text-white', bg: 'bg-gray-800' },
          { label: 'In Stock', value: summary.inStock, color: 'text-green-400', bg: 'bg-green-950' },
          { label: 'Low Stock', value: summary.lowStock, color: 'text-yellow-400', bg: 'bg-yellow-950' },
          { label: 'Out of Stock', value: summary.outOfStock, color: 'text-red-400', bg: 'bg-red-950' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-800 rounded-xl p-4`}>
            <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Add Inventory Record</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Product</label>
              <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                {products.map(p => <option key={p.id} value={p.id}>{p.name.en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Size</label>
              <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                {['3L', '5L'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Store</label>
              <select value={form.storeId} onChange={e => setForm(f => ({ ...f, storeId: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="all">All Stores</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name.en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Quantity</label>
              <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addItem} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Add Record</button>
            <button onClick={() => setIsAdding(false)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or store..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] bg-gray-800 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider gap-4">
          <div>Product</div>
          <div>Size</div>
          <div>Store</div>
          <div>Qty</div>
          <div>Status</div>
        </div>
        <div className="divide-y divide-gray-800/50">
          {filtered.map(item => {
            const Icon = STATUS_ICONS[item.status]
            return (
              <div key={item.id} className="grid grid-cols-[1fr_auto_1fr_auto_auto] px-4 py-3 gap-4 items-center hover:bg-gray-800/30">
                <div className="text-sm text-white truncate">{getProductName(item.productId)}</div>
                <div className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">{item.size}</div>
                <div className="text-xs text-gray-400 truncate">{getBranchName(item.storeId)}</div>
                <div>
                  <input
                    type="number"
                    defaultValue={item.quantity}
                    onBlur={e => {
                      const newQty = Number(e.target.value)
                      if (newQty !== item.quantity) updateItem(item.id, newQty)
                    }}
                    className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${STATUS_COLORS[item.status]}`}>
                  <Icon className="w-3 h-3" />
                  {item.status.replace(/_/g, ' ')}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Warehouse className="w-10 h-10 mx-auto mb-3 text-gray-700" />
              No inventory records. Click "Add Item" to start tracking.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
