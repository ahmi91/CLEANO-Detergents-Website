'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Globe, Menu, X, Droplets } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { t, language, setLanguage, darkMode, toggleDarkMode } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/',          label: t.nav.home },
    { href: '/products',  label: t.nav.products },
    { href: '/locations', label: t.nav.locations },
  ]

  const toggleLang = () => setLanguage(language === 'en' ? 'am' : 'en')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-soft border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-cleano-blue rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-display font-900 text-lg text-cleano-blue tracking-tight">
                CLEANO
              </span>
              <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Detergents
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                  pathname === link.href
                    ? 'text-cleano-blue bg-cleano-light dark:bg-blue-950'
                    : 'text-gray-600 dark:text-gray-300 hover:text-cleano-blue hover:bg-cleano-light dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-cleano-light dark:hover:bg-gray-800 hover:text-cleano-blue transition-all"
              title={t.common.switchTo}
            >
              <Globe className="w-4 h-4" />
              <span>{t.common.language}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-cleano-light dark:hover:bg-gray-800 hover:text-cleano-blue transition-all"
              title={darkMode ? t.common.lightMode : t.common.darkMode}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Order CTA — desktop */}
            <Link
              href="/products"
              className="hidden md:flex btn-primary text-sm py-2.5 px-5"
            >
              {t.nav.orderNow}
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                    pathname === link.href
                      ? 'text-cleano-blue bg-cleano-light dark:bg-blue-950'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-2"
              >
                {t.nav.orderNow}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
