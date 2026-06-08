'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import type { Branch } from '@/lib/types'

interface BranchCardProps {
  branch: Branch
  distance?: number
  isSelected?: boolean
  isNearest?: boolean
  onSelect?: () => void
  index?: number
}

export function BranchCard({
  branch,
  distance,
  isSelected,
  isNearest,
  onSelect,
  index = 0,
}: BranchCardProps) {
  const { t, language } = useStore()

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`
  const callUrl = `tel:${branch.phone}`

  return (
    <motion.div
      id={`branch-${branch.id}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={onSelect}
      className={cn(
        'card p-4 cursor-pointer transition-all duration-300',
        isSelected
          ? 'ring-2 ring-cleano-blue shadow-card-hover -translate-y-0.5'
          : 'hover:shadow-card-hover hover:-translate-y-0.5',
        isNearest && 'border-amber-200 dark:border-amber-800'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
              isNearest
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                : isSelected
                ? 'bg-cleano-light dark:bg-blue-950 text-cleano-blue'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            )}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white leading-tight">
              {branch.name[language]}
            </h3>
            {branch.isMain && (
              <span className="text-[10px] text-cleano-blue font-semibold uppercase tracking-wide">
                Main Branch
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {isNearest && (
            <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {t.locations.nearestBranch}
            </span>
          )}
          {distance !== undefined && (
            <span className="text-xs text-gray-400 font-medium">
              {distance.toFixed(1)} {t.locations.kmAway}
            </span>
          )}
        </div>
      </div>

      {/* Address */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-start gap-1.5 leading-relaxed">
        <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
        {branch.address[language]}
      </p>

      {/* Hours */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
        <Clock className="w-3 h-3 shrink-0" />
        {branch.hours}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-primary flex-1 text-xs py-2 px-3"
        >
          <Navigation className="w-3.5 h-3.5" />
          {t.locations.getDirections}
        </a>
        <a
          href={callUrl}
          onClick={(e) => e.stopPropagation()}
          className="btn-secondary flex-1 text-xs py-2 px-3"
        >
          <Phone className="w-3.5 h-3.5" />
          {t.locations.callNow}
        </a>
      </div>
    </motion.div>
  )
}
