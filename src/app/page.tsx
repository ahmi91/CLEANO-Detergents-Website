import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import productsData from '@/data/products.json'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: "CLEANO Detergents – Ethiopia's Premium Cleaning Brand",
  description:
    "Shop Ethiopia's most trusted detergent brand. Premium laundry detergent, floor cleaner, dish soap & more. Available across Addis Ababa.",
}

export default function HomePage() {
  const products = productsData as Product[]

  return (
    <div className="page-enter">
      <HeroSection />
      <FeaturedProducts products={products} />
      <FeaturesSection />
    </div>
  )
}
