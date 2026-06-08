'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryTabs, SearchBar } from '@/components/products/CategoryTabs'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import productsData from '@/data/products.json'
import type { Product, ProductCategory } from '@/lib/types'

const products = productsData as Product[]

export default function ProductsPage() {
  const { t, language, searchQuery, activeCategory } = useStore()
  const [loading] = useState(false)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description[language].toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCat =
        activeCategory === 'all' || p.category === activeCategory

      return matchesSearch && matchesCat
    })
  }, [searchQuery, activeCategory, language])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      {/* Page header */}
      <div className="bg-cleano-navy pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-3xl md:text-4xl text-white mb-2"
          >
            {t.products.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-200 text-sm"
          >
            {t.products.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="overflow-x-auto">
            <CategoryTabs />
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'product' : 'products'} found
          </p>
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div className="text-5xl">🔍</div>
            <p className="text-gray-500 dark:text-gray-400">{t.products.noResults}</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
