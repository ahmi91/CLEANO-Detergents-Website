import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { StoresClient } from './StoresClient'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getBranches() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await sb.from('branches').select('*').order('created_at')
  return (data || []).map((row: any) => ({
    id:           row.id,
    name:         { en: row.name_en, am: row.name_am },
    address:      { en: row.address_en, am: row.address_am },
    phone:        row.phone,
    hours:        row.hours,
    lat:          parseFloat(row.lat),
    lng:          parseFloat(row.lng),
    tiktokVideos: row.tiktok_videos || [],
    isMain:       row.is_main,
  }))
}

export default async function StoresPage() {
  const branches = await getBranches()
  return (
    <AdminPageWrapper requiredResource="stores">
      <StoresClient initialBranches={branches as any} />
    </AdminPageWrapper>
  )
}
