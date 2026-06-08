'use client'

import { useTrackPageView } from '@/lib/analytics'

export function AnalyticsTracker() {
  useTrackPageView()
  return null
}
