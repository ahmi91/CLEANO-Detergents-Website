'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Eye, ShoppingCart } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { PriceToggle } from './PriceToggle'
import { cn, generateWhatsAppLink } from '@/lib/utils'
import type { Product, SizeOption } from '@/lib/types'

interface ProductCardProps {
  product: Product
  index?: number
}

const badgeColors: Record<string, string> = {
  'Best Seller':     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'New':             'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Premium':         'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Value Pack':      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Hypoallergenic':  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, language, selectedSize } = useStore()
  const [localSize, setLocalSize] = useState<SizeOption>(selectedSize)
  const [hovered, setHovered] = useState(false)

  const name  = product.name[language]
  const price = product.prices[localSize]

  const whatsappLink = generateWhatsAppLink(name, localSize, price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="card card-hover group relative flex flex-col"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={cn('badge', badgeColors[product.badge] ?? 'bg-gray-100 text-gray-700')}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 md:h-52 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>

        {/* Quick view overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cleano-navy/40 flex items-center justify-center gap-2"
            >
              <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-1.5 bg-white text-cleano-blue text-xs font-semibold px-4 py-2 rounded-xl shadow-lg hover:bg-cleano-light transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {t.products.quickView}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + rating */}
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm md:text-base leading-tight hover:text-cleano-blue transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {product.rating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviews.toLocaleString()} {t.products.reviews})
            </span>
          </div>
        </div>

        {/* Size toggle */}
        <PriceToggle value={localSize} onChange={setLocalSize} />

        {/* Price */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${product.id}-${localSize}`}
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-baseline gap-1"
            >
              <span className="font-display font-black text-xl text-cleano-blue">
                {price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 font-medium">{t.common.birr}</span>
            </motion.div>
          </AnimatePresence>

          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-cleano-blue hover:bg-brand-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm hover:shadow-glow transition-all active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {t.products.orderNow}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
