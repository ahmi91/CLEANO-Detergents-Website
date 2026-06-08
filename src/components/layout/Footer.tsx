'use client'

import Link from 'next/link'
import { Droplets, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function Footer() {
  const { t } = useStore()

  return (
    <footer className="bg-cleano-navy dark:bg-gray-950 text-white border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-cleano-blue rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-black text-xl tracking-tight">CLEANO</div>
                <div className="text-xs text-blue-300 tracking-widest uppercase">Detergents</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              Ethiopia&apos;s most trusted cleaning brand, delivering premium quality
              detergents to homes and businesses across Addis Ababa.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-cleano-blue rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              {/* TikTok icon */}
              <a
                href="https://www.tiktok.com/@cleano_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-cleano-blue rounded-xl flex items-center justify-center transition-colors text-xs font-black"
              >
                ♪
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-blue-300 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/',          label: t.nav.home },
                { href: '/products',  label: t.nav.products },
                { href: '/locations', label: t.nav.locations },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-blue-300 mb-3">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-cleano-sky" />
                <span> Mafi Mall, Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-cleano-sky" />
                <a href="tel:+251917888888" className="hover:text-white transition-colors">
                  +251 91 788 8888
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-cleano-sky" />
                <a href="mailto:hello@cleanoet.com" className="hover:text-white transition-colors">
                  hello@cleanoet.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-400">
          <p>© {new Date().getFullYear()} CLEANO Detergents. All rights reserved.</p>
          <p>Made with ❤️ for Ethiopian homes</p>
        </div>
      </div>
    </footer>
  )
}
