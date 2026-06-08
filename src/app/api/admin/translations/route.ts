import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Flatten nested JSON object to dot-notation keys
function flatten(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flatten(obj[key], path))
    } else {
      result[path] = String(obj[key] ?? '')
    }
  }
  return result
}

// Rebuild nested JSON from dot-notation keys
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

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await sb().from('translations').select('*')

  const en: Record<string, string> = {}
  const am: Record<string, string> = {}
  for (const row of data || []) {
    if (row.lang === 'en') en[row.key] = row.value
    else if (row.lang === 'am') am[row.key] = row.value
  }

  // If empty, fall back to JSON files
  if (Object.keys(en).length === 0) {
    try {
      const enJson = require('@/i18n/en.json')
      const amJson = require('@/i18n/am.json')
      return NextResponse.json({ en: enJson, am: amJson })
    } catch {
      return NextResponse.json({ en: {}, am: {} })
    }
  }

  return NextResponse.json({ en: unflatten(en), am: unflatten(am) })
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { en, am } = await req.json()

  const rows: { lang: string; key: string; value: string }[] = []
  if (en) {
    const flat = flatten(en)
    for (const [key, value] of Object.entries(flat)) rows.push({ lang: 'en', key, value })
  }
  if (am) {
    const flat = flatten(am)
    for (const [key, value] of Object.entries(flat)) rows.push({ lang: 'am', key, value })
  }

  // Upsert all rows
  await sb().from('translations').upsert(rows, { onConflict: 'lang,key' })
  await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'translations', details: `Updated ${rows.length} translation keys` })
  return NextResponse.json({ success: true })
}
