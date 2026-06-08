'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Package, MapPin, Phone } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useStore()

  const links = [
    { href: '/',          label: t.nav.home,      icon: Home    },
    { href: '/products',  label: t.nav.products,  icon: Package },
    { href: '/locations', label: t.nav.locations, icon: MapPin  },
    { href: '#contact',   label: t.nav.contact,   icon: Phone   },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 flex-1 py-1.5 relative"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-x-2 -top-1 h-0.5 bg-cleano-blue rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-2xl transition-all',
                  active
                    ? 'bg-cleano-light dark:bg-blue-950 text-cleano-blue'
                    : 'text-gray-400 dark:text-gray-500'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold leading-none',
                  active ? 'text-cleano-blue' : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
