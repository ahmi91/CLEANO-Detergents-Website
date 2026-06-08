import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { MediaClient } from './MediaClient'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getMedia() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await sb.from('media_files').select('*').order('uploaded_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function MediaPage() {
  const media = await getMedia()
  return (
    <AdminPageWrapper requiredResource="media">
      <MediaClient initialMedia={media} />
    </AdminPageWrapper>
  )
}
