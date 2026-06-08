import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { CategoriesClient } from './CategoriesClient'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEFAULTS = [
  { id: 'laundry',      label: { en: 'Laundry',      am: 'ልብስ ማጠቢያ' },   order: 1, icon: '🧺', color: '#3B82F6' },
  { id: 'multipurpose', label: { en: 'Multipurpose',  am: 'ባለብዙ ዓላማ' },  order: 2, icon: '✨', color: '#8B5CF6' },
  { id: 'floor',        label: { en: 'Floor',         am: 'ወለል' },          order: 3, icon: '🧹', color: '#10B981' },
  { id: 'dishes',       label: { en: 'Dishes',        am: 'ምግብ ዕቃ' },     order: 4, icon: '🍽️', color: '#F59E0B' },
  { id: 'baby',         label: { en: 'Baby',          am: 'ሕጻን' },          order: 5, icon: '🍼', color: '#EC4899' },
]

async function getCategories() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await sb.from('categories').select('*').order('sort_order')
    if (!data || data.length === 0) return DEFAULTS
    return data.map(row => ({
      id:    row.id,
      label: { en: row.label_en, am: row.label_am },
      order: row.sort_order,
      icon:  row.icon,
      color: row.color,
    }))
  } catch {
    return DEFAULTS
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return (
    <AdminPageWrapper requiredResource="categories">
      <CategoriesClient initialCategories={categories} />
    </AdminPageWrapper>
  )
}
