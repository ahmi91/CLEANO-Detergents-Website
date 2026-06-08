'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation, Loader2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Branch, BranchWithDistance } from '@/lib/types'
import { calculateDistance, findNearestBranch } from '@/lib/utils'

interface BranchMapProps {
  branches: Branch[]
  selectedBranchId?: string | null
  onSelectBranch?: (branch: Branch) => void
  nearestBranchId?: string | null
}

export function BranchMap({
  branches,
  selectedBranchId,
  onSelectBranch,
  nearestBranchId,
}: BranchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const markersRef = useRef<Record<string, unknown>>({})
  const { language } = useStore()
  const [mapReady, setMapReady] = useState(false)

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamic import of Leaflet (SSR-safe)
    const initMap = async () => {
      const L = (await import('leaflet')).default

      // Fix default icon paths
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Addis Ababa center
      const AA_CENTER: [number, number] = [9.02, 38.75]

      const map = L.map(mapRef.current!, {
        center: AA_CENTER,
        zoom: 4, // Start at Ethiopia level for dramatic zoom-in
        zoomControl: false,
        attributionControl: false,
      })

      // Tile layer — CartoDB Positron (clean, minimal)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19 }
      ).addTo(map)

      // Attribution bottom-right
      L.control.attribution({ position: 'bottomright', prefix: '' })
        .addTo(map)
        .setPrefix('© <a href="https://carto.com">CARTO</a>')

      // Custom zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map

      // Animate zoom-in: Ethiopia → Addis Ababa → branch cluster
      setTimeout(() => {
        map.flyTo([8.5, 39], 6, { duration: 1.5 })
      }, 300)
      setTimeout(() => {
        map.flyTo(AA_CENTER, 12, { duration: 2 })
      }, 2000)

      // Add branch markers
      branches.forEach((branch) => {
        const isMain    = branch.isMain
        const isNearest = branch.id === nearestBranchId

        const markerColor = isNearest
          ? '#F59E0B' // gold for nearest
          : isMain
          ? '#1B4FD8'  // brand blue for main
          : '#38BDF8'  // sky for others

        // Custom SVG marker
        const svgIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              position: relative;
              width: 36px;
              height: 44px;
            ">
              ${isNearest || selectedBranchId === branch.id ? `
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50% 50% 50% 0;
                background: ${markerColor}33;
                animation: markerPulse 1.5s ease-out infinite;
                transform: rotate(-45deg) scale(1.5);
                top: 2px;
                left: 2px;
                width: 32px;
                height: 32px;
              "/>` : ''}
              <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 0C8.06 0 0 8.06 0 18C0 31.5 18 44 18 44C18 44 36 31.5 36 18C36 8.06 27.94 0 18 0Z" fill="${markerColor}"/>
                <circle cx="18" cy="18" r="8" fill="white" opacity="0.9"/>
                <text x="18" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="${markerColor}">C</text>
              </svg>
            </div>
          `,
          iconSize: [36, 44],
          iconAnchor: [18, 44],
          popupAnchor: [0, -44],
        })

        const marker = L.marker([branch.lat, branch.lng], { icon: svgIcon })
          .addTo(map)

        // Popup
        const popupContent = `
          <div style="padding:12px;min-width:180px;font-family:system-ui,sans-serif;">
            <div style="font-weight:700;font-size:14px;color:#1B4FD8;margin-bottom:4px;">
              ${branch.name[language]}
            </div>
            <div style="font-size:12px;color:#6B7280;margin-bottom:8px;line-height:1.4;">
              ${branch.address[language]}
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="display:inline-flex;align-items:center;gap:4px;background:#1B4FD8;color:white;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;"
            >
              📍 Get Directions
            </a>
          </div>
        `

        marker.bindPopup(popupContent)

        marker.on('click', () => {
          onSelectBranch?.(branch)
        })

        markersRef.current[branch.id] = marker
      })

      setMapReady(true)
    }

    initMap().catch(console.error)

    return () => {
      if (mapInstanceRef.current) {
        ;(mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
        markersRef.current = {}
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly to selected branch
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedBranchId) return
    const branch = branches.find((b) => b.id === selectedBranchId)
    if (!branch) return

    const map = mapInstanceRef.current as { flyTo: (c: [number, number], z: number, o: unknown) => void; openPopup?: () => void }
    map.flyTo([branch.lat, branch.lng], 15, { duration: 1.2 })

    const marker = markersRef.current[selectedBranchId] as { openPopup?: () => void } | undefined
    if (marker?.openPopup) {
      setTimeout(() => marker.openPopup?.(), 1300)
    }
  }, [selectedBranchId, branches])

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-gray-800">
      <div ref={mapRef} className="w-full h-[400px] md:h-[500px]" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-cleano-blue animate-spin" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
