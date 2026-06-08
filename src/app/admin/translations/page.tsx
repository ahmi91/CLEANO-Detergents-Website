import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { TranslationsClient } from './TranslationsClient'
import enData from '@/i18n/en.json'
import amData from '@/i18n/am.json'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function unflatten(flat: Record<string, string>): any {
  const result: any = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let cur = result
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] || {}
      cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = value
  }
  return result
}

async function getTranslations() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await sb.from('translations').select('*')
    if (!data || data.length === 0) return { en: enData, am: amData }

    const en: Record<string, string> = {}
    const am: Record<string, string> = {}
    for (const row of data) {
      if (row.lang === 'en') en[row.key] = row.value
      else if (row.lang === 'am') am[row.key] = row.value
    }

    return {
      en: Object.keys(en).length > 0 ? unflatten(en) : enData,
      am: Object.keys(am).length > 0 ? unflatten(am) : amData,
    }
  } catch {
    return { en: enData, am: amData }
  }
}

export default async function TranslationsPage() {
  const { en, am } = await getTranslations()
  return (
    <AdminPageWrapper requiredResource="translations">
      <TranslationsClient initialEn={en} initialAm={am} />
    </AdminPageWrapper>
  )
}
