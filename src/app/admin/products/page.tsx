import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { ProductsClient } from './ProductsClient'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getData() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [{ data: products }, { data: branches }] = await Promise.all([
    sb.from('products').select('*').order('created_at'),
    sb.from('branches').select('id, name_en').order('created_at'),
  ])
  return {
    products: (products || []).map((row: any) => ({
      id: row.id,
      name: { en: row.name_en, am: row.name_am },
      description: { en: row.description_en, am: row.description_am },
      image: row.image,
      category: row.category,
      prices: row.prices,
      badge: row.badge,
      rating: parseFloat(row.rating),
      reviews: row.reviews,
      tiktokVideos: row.tiktok_videos || [],
      featured: row.featured,
    })),
    branches: (branches || []).map((b: any) => ({ id: b.id, name: { en: b.name_en } })),
  }
}

export default async function ProductsPage() {
  const { products, branches } = await getData()
  return (
    <AdminPageWrapper requiredResource="products">
      <ProductsClient initialProducts={products as any} branches={branches as any} />
    </AdminPageWrapper>
  )
}
