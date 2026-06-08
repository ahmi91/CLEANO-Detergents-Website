import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import productsData from '@/data/products.json'
import type { Product } from '@/lib/types'
import { ProductDetailClient } from './ProductDetailClient'

interface Props {
  params: { id: string }
}

export function generateStaticParams() {
  return (productsData as Product[]).map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = (productsData as Product[]).find((p) => p.id === params.id)
  if (!product) return {}

  return {
    title: product.name.en,
    description: product.description.en.slice(0, 160),
    openGraph: {
      title:       `${product.name.en} | CLEANO Detergents`,
      description: product.description.en.slice(0, 160),
      images:      [{ url: product.image, width: 800, height: 600 }],
    },
  }
}

export default function ProductDetailPage({ params }: Props) {
  const products = productsData as Product[]
  const product = products.find((p) => p.id === params.id)

  if (!product) notFound()

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return <ProductDetailClient product={product} related={related} />
}
