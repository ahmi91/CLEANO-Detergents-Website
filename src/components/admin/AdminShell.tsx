'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Droplets, LayoutDashboard, Package, Tag, Warehouse,
  MapPin, Globe, FileText, Image, BarChart3, ScrollText,
  Settings, LogOut, Menu, X, ChevronRight, Bell,
  Users, Shield, Zap
} from 'lucide-react'
import { AdminRole, ROLE_LABELS } from '@/lib/admin/roles'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles: AdminRole[]
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'manager', 'translator', 'inventory_manager', 'content_editor'] },
  { href: '/admin/products', label: 'Products', icon: Package, roles: ['super_admin', 'manager'] },
  { href: '/admin/categories', label: 'Categories', icon: Tag, roles: ['super_admin', 'manager'] },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse, roles: ['super_admin', 'manager', 'inventory_manager'] },
  { href: '/admin/stores', label: 'Stores', icon: MapPin, roles: ['super_admin', 'manager'] },
  { href: '/admin/translations', label: 'Translations', icon: Globe, roles: ['super_admin', 'translator'] },
  { href: '/admin/content', label: 'Content', icon: FileText, roles: ['super_admin', 'content_editor'] },
  { href: '/admin/media', label: 'Media Library', icon: Image, roles: ['super_admin', 'content_editor', 'manager'] },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['super_admin', 'manager'] },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, roles: ['super_admin', 'manager'] },
  { href: '/admin/users', label: 'Admin Users', icon: Users, roles: ['super_admin'] },
  { href: '/admin/logs', label: 'Audit Logs', icon: ScrollText, roles: ['super_admin'] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['super_admin'] },
]

interface AdminShellProps {
  children: React.ReactNode
  user: { email: string; name: string; role: AdminRole }
}

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(user.role))

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const currentPage = NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || 'Admin'

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm font-display">CLEANO</div>
            <div className="text-xs text-gray-500">Admin Portal</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleNav.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{ROLE_LABELS[user.role]}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 py-1.5 px-2 rounded-md hover:bg-gray-800 transition-colors">
              <Zap className="w-3 h-3" /> View Site
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-red-400 py-1.5 px-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-3 h-3" /> {loggingOut ? '...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center gap-4 px-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-medium text-white">{currentPage}</div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2.5 py-1 rounded-full">
              <Shield className="w-3 h-3" />
              {ROLE_LABELS[user.role]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
