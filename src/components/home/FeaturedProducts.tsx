'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useStore()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const featured = products.filter((p) => p.featured).slice(0, 3)

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">{t.home.featuredProducts}</h2>
            <div className="w-12 h-1 bg-cleano-blue rounded-full mt-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-cleano-blue font-semibold text-sm hover:gap-3 transition-all"
            >
              {t.home.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
