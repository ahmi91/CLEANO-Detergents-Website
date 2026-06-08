import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { InventoryClient } from './InventoryClient'
import { createClient } from '@supabase/supabase-js'
import { getInventory } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

async function getData() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [inventory, { data: products }, { data: branches }] = await Promise.all([
    getInventory(),
    sb.from('products').select('id, name_en'),
    sb.from('branches').select('id, name_en'),
  ])
  return {
    inventory,
    products: (products || []).map(p => ({ id: p.id, name: { en: p.name_en } })),
    branches: (branches || []).map(b => ({ id: b.id, name: { en: b.name_en } })),
  }
}

export default async function InventoryPage() {
  const { inventory, products, branches } = await getData()
  return (
    <AdminPageWrapper requiredResource="inventory">
      <InventoryClient
        initialInventory={inventory}
        products={products as any}
        branches={branches as any}
      />
    </AdminPageWrapper>
  )
}
