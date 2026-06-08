'use client'

import { useState } from 'react'
import { ExternalLink, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { extractTikTokId } from '@/lib/utils'

interface TikTokEmbedProps {
  url: string
  className?: string
}

export function TikTokEmbed({ url, className = '' }: TikTokEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const videoId = extractTikTokId(url)

  if (!videoId) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl overflow-hidden bg-black ${className}`}
      style={{ paddingBottom: '177.77%' }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-gray-900 to-black">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
          <p className="text-white/60 text-xs">Loading TikTok...</p>
        </div>
      )}

      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}`}
        className="absolute inset-0 w-full h-full border-none"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />

      {/* Fallback link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 hover:bg-black text-white text-xs px-2 py-1 rounded-lg transition-colors backdrop-blur-sm"
      >
        <ExternalLink className="w-3 h-3" />
        TikTok
      </a>
    </motion.div>
  )
}

interface TikTokGridProps {
  videos: string[]
  title?: string
  subtitle?: string
}

export function TikTokGrid({ videos, title, subtitle }: TikTokGridProps) {
  if (!videos.length) return null

  return (
    <div>
      {title && (
        <div className="mb-4">
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {videos.map((url, i) => (
          <TikTokEmbed key={i} url={url} />
        ))}
      </div>
    </div>
  )
}
