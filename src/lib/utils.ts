import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Branch } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Haversine formula to calculate distance between two coordinates in km */
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

function toRad(deg: number) {
  return deg * (Math.PI / 180)
}

/** Find nearest branch from user coordinates */
export function findNearestBranch(
  userLat: number,
  userLng: number,
  branches: Branch[]
): { branch: Branch; distance: number } | null {
  if (!branches.length) return null

  let nearest = branches[0]
  let minDist = calculateDistance(userLat, userLng, branches[0].lat, branches[0].lng)

  for (const branch of branches.slice(1)) {
    const dist = calculateDistance(userLat, userLng, branch.lat, branch.lng)
    if (dist < minDist) {
      minDist = dist
      nearest = branch
    }
  }

  return { branch: nearest, distance: minDist }
}

/** Extract TikTok video ID from URL */
export function extractTikTokId(url: string): string | null {
  const match = url.match(/video\/(\d+)/)
  return match ? match[1] : null
}

/** Format price with Ethiopian Birr */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()} ETB`
}

/** Format distance */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(1)} km`
}

/** Generate WhatsApp order link */
export function generateWhatsAppLink(
  productName: string,
  size: string,
  price: number
): string {
  const phone = '+251911234567'
  const message = encodeURIComponent(
    `Hello CLEANO! I'd like to order:\n\n` +
    `Product: ${productName}\n` +
    `Size: ${size}\n` +
    `Price: ${price} ETB\n\n` +
    `Please confirm availability.`
  )
  return `https://wa.me/${phone}?text=${message}`
}

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
