'use client'

import { useState } from 'react'
import { Plus, Trash2, Shield, Key, X, Save, AlertTriangle, Users } from 'lucide-react'
import { ROLE_LABELS, AdminRole } from '@/lib/admin/roles'

type AdminUser = {
  id: string
  email: string
  name: string
  role: AdminRole
  createdAt: string
  lastLogin?: string
}

const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin:       'bg-red-950 text-red-400 border-red-800',
  manager:           'bg-blue-950 text-blue-400 border-blue-800',
  translator:        'bg-purple-950 text-purple-400 border-purple-800',
  inventory_manager: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  content_editor:    'bg-green-950 text-green-400 border-green-800',
}

const ROLES: AdminRole[] = ['super_admin', 'manager', 'translator', 'inventory_manager', 'content_editor']

function timeAgo(ts?: string) {
  if (!ts) return 'Never'
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'manager' as AdminRole, password: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [resetPwd, setResetPwd] = useState<{ id: string; pwd: string } | null>(null)
  const [editRole, setEditRole] = useState<{ id: string; role: AdminRole } | null>(null)

  function showToast(msg: string, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  async function createUser() {
    if (!form.name || !form.email || !form.password) { showToast('Fill in all fields', false); return }
    setSaving(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'create', ...form }),
    })
    setSaving(false)
    if (res.ok) {
      const newUser: AdminUser = { id: `user-${Date.now()}`, ...form, createdAt: new Date().toISOString() }
      setUsers(prev => [...prev, newUser])
      setIsCreating(false)
      setForm({ name: '', email: '', role: 'manager', password: '' })
      showToast('Admin user created!')
    } else { showToast('Failed to create user', false) }
  }

  async function deleteUser(id: string) {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'delete', id }),
    })
    if (res.ok) { setUsers(prev => prev.filter(u => u.id !== id)); setDeleteConfirm(null); showToast('User deleted') }
    else { const d = await res.json(); showToast(d.error || 'Failed', false) }
  }

  async function updateRole(id: string, role: AdminRole) {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'update_role', id, role }),
    })
    if (res.ok) { setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u)); setEditRole(null); showToast('Role updated!') }
  }

  async function resetPassword(id: string, pwd: string) {
    if (!pwd || pwd.length < 8) { showToast('Password must be at least 8 characters', false); return }
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'reset_password', id, newPassword: pwd }),
    })
    if (res.ok) { setResetPwd(null); showToast('Password reset!') }
  }

  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"

  return (
    <div className="space-y-5">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Admin Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">{users.length} team members with portal access</p>
        </div>
        <button onClick={() => setIsCreating(v => !v)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Create form */}
      {isCreating && (
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">New Admin User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inp} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inp} placeholder="john@cleano.et" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminRole }))} className={inp}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Temporary Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inp} placeholder="Min. 8 characters" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={createUser} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Save className="w-4 h-4" /> {saving ? 'Creating...' : 'Create User'}
            </button>
            <button onClick={() => setIsCreating(false)} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium">Cancel</button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] bg-gray-800 px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider gap-4">
          <div className="w-8" />
          <div>User</div>
          <div>Role</div>
          <div>Last Login</div>
          <div>Actions</div>
        </div>
        <div className="divide-y divide-gray-800/50">
          {users.map(user => (
            <div key={user.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center px-5 py-4 gap-4 hover:bg-gray-800/30">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <div>
                {editRole?.id === user.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editRole.role}
                      onChange={e => setEditRole({ id: user.id, role: e.target.value as AdminRole })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                    <button onClick={() => updateRole(user.id, editRole.role)} className="text-xs text-green-400 hover:text-green-300">Save</button>
                    <button onClick={() => setEditRole(null)} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setEditRole({ id: user.id, role: user.role })}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500">{timeAgo(user.lastLogin)}</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setResetPwd({ id: user.id, pwd: '' })}
                  title="Reset Password"
                  className="p-1.5 text-gray-400 hover:text-yellow-400 bg-gray-800 hover:bg-yellow-950 rounded-lg transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(user.id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-950 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-700" />
              No admin users found
            </div>
          )}
        </div>
      </div>

      {/* Role permissions info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white text-sm">Role Permissions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {ROLES.map(role => (
            <div key={role} className={`rounded-lg border p-3 ${ROLE_COLORS[role]}`} style={{ background: 'transparent' }}>
              <div className={`text-xs font-bold mb-2 ${ROLE_COLORS[role].split(' ')[1]}`}>{ROLE_LABELS[role]}</div>
              <div className="text-xs text-gray-400">
                {{
                  super_admin:       'Full access to all features',
                  manager:           'Products, Categories, Stores, Inventory',
                  translator:        'Translation management only',
                  inventory_manager: 'Inventory updates only',
                  content_editor:    'Website content & media only',
                }[role]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="font-semibold text-white">Delete Admin User?</h3>
                <p className="text-sm text-gray-400">They will lose all access immediately.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => deleteUser(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetPwd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2"><Key className="w-4 h-4 text-yellow-400" /> Reset Password</h3>
              <button onClick={() => setResetPwd(null)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <input
              type="password"
              placeholder="New password (min. 8 chars)"
              value={resetPwd.pwd}
              onChange={e => setResetPwd(p => p ? { ...p, pwd: e.target.value } : p)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setResetPwd(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => resetPassword(resetPwd.id, resetPwd.pwd)} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
