'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, Loader2, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useStore } from '@/store/useStore'
import { BranchCard } from '@/components/map/BranchCard'
import { SkeletonBranchCard } from '@/components/ui/SkeletonCard'
import { findNearestBranch, calculateDistance } from '@/lib/utils'
import branchesData from '@/data/branches.json'
import type { Branch } from '@/lib/types'

// Dynamic import for Leaflet (no SSR)
const BranchMap = dynamic(
  () => import('@/components/map/BranchMap').then((m) => m.BranchMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] md:h-[500px] rounded-2xl bg-blue-50 dark:bg-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cleano-blue animate-spin" />
      </div>
    ),
  }
)

const branches = branchesData as Branch[]

export default function LocationsPage() {
  const { t, language } = useStore()
  const [selectedId, setSelectedId]     = useState<string | null>(null)
  const [nearestId, setNearestId]       = useState<string | null>(null)
  const [distances, setDistances]       = useState<Record<string, number>>({})
  const [locating, setLocating]         = useState(false)
  const [locError, setLocError]         = useState<string | null>(null)
  const cardListRef = useRef<HTMLDivElement>(null)

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    setLocError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const result = findNearestBranch(lat, lng, branches)

        if (result) {
          setNearestId(result.branch.id)
          setSelectedId(result.branch.id)

          // Calculate distances for all branches
          const dists: Record<string, number> = {}
          branches.forEach((b) => {
            dists[b.id] = calculateDistance(lat, lng, b.lat, b.lng)
          })
          setDistances(dists)

          // Scroll to nearest branch card
          setTimeout(() => {
            const el = document.getElementById(`branch-${result.branch.id}`)
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 500)
        }

        setLocating(false)
      },
      (err) => {
        setLocError('Unable to get your location. Please allow location access.')
        setLocating(false)
      },
      { timeout: 10000 }
    )
  }

  const handleSelectBranch = (branch: Branch) => {
    setSelectedId(branch.id)
    // Scroll card into view
    setTimeout(() => {
      const el = document.getElementById(`branch-${branch.id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      {/* Header */}
      <div className="bg-cleano-navy pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-3xl md:text-4xl text-white mb-2"
          >
            {t.locations.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-200 text-sm mb-6"
          >
            {t.locations.subtitle}
          </motion.p>

          {/* Near Me button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleNearMe}
            disabled={locating}
            className="inline-flex items-center gap-2 bg-white text-cleano-blue font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-all disabled:opacity-70 active:scale-95"
          >
            {locating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.locations.detecting}
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                {t.locations.nearMe}
              </>
            )}
          </motion.button>

          {locError && (
            <p className="text-red-300 text-xs mt-2">{locError}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Branch list (sidebar) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cleano-blue" />
              {t.locations.allBranches}
            </h2>
            <div ref={cardListRef} className="flex flex-col gap-3">
              {branches.map((branch, i) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  index={i}
                  distance={distances[branch.id]}
                  isSelected={selectedId === branch.id}
                  isNearest={nearestId === branch.id}
                  onSelect={() => handleSelectBranch(branch)}
                />
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <BranchMap
              branches={branches}
              selectedBranchId={selectedId}
              onSelectBranch={handleSelectBranch}
              nearestBranchId={nearestId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
