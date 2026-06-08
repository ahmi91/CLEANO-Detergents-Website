'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useTrackPageView() {
  const pathname = usePathname()
  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return
    fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_view', data: { page: pathname } }),
    }).catch(() => {}) // silent fail
  }, [pathname])
}

export function trackProductView(productId: string) {
  fetch('/api/admin/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'product_view', data: { productId } }),
  }).catch(() => {})
}

export function trackSearch(query: string) {
  if (!query || query.length < 2) return
  fetch('/api/admin/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'search', data: { query } }),
  }).catch(() => {})
}

export function trackOrderClick(productId: string, size: string) {
  fetch('/api/admin/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'order_click', data: { productId, size } }),
  }).catch(() => {})
}
