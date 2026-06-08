'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Share2, ShoppingCart } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { PriceToggle } from '@/components/products/PriceToggle'
import { ProductCard } from '@/components/products/ProductCard'
import { TikTokGrid } from '@/components/tiktok/TikTokEmbed'
import { generateWhatsAppLink } from '@/lib/utils'
import type { Product, SizeOption } from '@/lib/types'

interface Props {
  product: Product
  related: Product[]
}

export function ProductDetailClient({ product, related }: Props) {
  const { t, language } = useStore()
  const [size, setSize] = useState<SizeOption>('3L')

  const name        = product.name[language]
  const description = product.description[language]
  const price       = product.prices[size]
  const whatsapp    = generateWhatsAppLink(name, size, price)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      {/* Back nav */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cleano-blue font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.common.back}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 aspect-square"
          >
            <Image
              src={product.image}
              alt={name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className="badge bg-cleano-blue text-white text-sm px-3 py-1">
                  {product.badge}
                </span>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Name + rating */}
            <div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-gray-900 dark:text-white leading-tight">
                {name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200 fill-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {product.rating}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.reviews.toLocaleString()} {t.products.reviews})
                </span>
              </div>
            </div>

            {/* Size toggle */}
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {t.productDetail.size}
              </p>
              <PriceToggle value={size} onChange={setSize} />
            </div>

            {/* Price */}
            <div className="card p-4 bg-cleano-light dark:bg-blue-950/40 border-brand-200 dark:border-blue-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t.products.priceFor} {size === '3L' ? t.productDetail.threeL : t.productDetail.fiveL}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={size}
                  initial={{ opacity: 0, scale: 0.85, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex items-baseline gap-2"
                >
                  <span className="font-display font-black text-4xl text-cleano-blue">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {t.common.birr}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t.productDetail.description}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 py-3.5"
              >
                <ShoppingCart className="w-4 h-4" />
                {t.productDetail.orderNow}
              </a>
              <button
                onClick={handleShare}
                className="btn-secondary px-4 py-3.5"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* TikTok videos */}
        {product.tiktokVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <TikTokGrid
              videos={product.tiktokVideos}
              title={t.productDetail.tiktokVideos}
              subtitle={t.productDetail.tiktokDesc}
            />
          </motion.div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title mb-6">{t.productDetail.related}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
