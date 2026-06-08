import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function toRow(d: any) {
  return {
    id:         d.id,
    name_en:    d.name?.en || '',
    name_am:    d.name?.am || '',
    address_en: d.address?.en || '',
    address_am: d.address?.am || '',
    phone:      d.phone || '',
    hours:      d.hours || '',
    lat:        d.lat || 9.0054,
    lng:        d.lng || 38.7636,
    tiktok_videos: d.tiktokVideos || [],
    is_main:    d.isMain || false,
    updated_at: new Date().toISOString(),
  }
}

function fromRow(row: any) {
  return {
    id:           row.id,
    name:         { en: row.name_en, am: row.name_am },
    address:      { en: row.address_en, am: row.address_am },
    phone:        row.phone,
    hours:        row.hours,
    lat:          parseFloat(row.lat),
    lng:          parseFloat(row.lng),
    tiktokVideos: row.tiktok_videos || [],
    isMain:       row.is_main,
  }
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await sb().from('branches').select('*').order('created_at')
  return NextResponse.json((data || []).map(fromRow))
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body._action === 'delete') {
    await sb().from('branches').delete().eq('id', body.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'stores', details: `Deleted: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update') {
    const { _action, ...data } = body
    await sb().from('branches').update(toRow(data)).eq('id', data.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'stores', details: `Updated: ${data.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'create') {
    const { _action, ...data } = body
    await sb().from('branches').insert(toRow(data))
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'stores', details: `Created: ${data.id}` })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
