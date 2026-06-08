import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function toRow(d: any) {
  return {
    id:             d.id,
    name_en:        d.name?.en || '',
    name_am:        d.name?.am || '',
    description_en: d.description?.en || '',
    description_am: d.description?.am || '',
    image:          d.image || '',
    category:       d.category || 'laundry',
    prices:         d.prices || {},
    badge:          d.badge || null,
    rating:         d.rating || 4.5,
    reviews:        d.reviews || 0,
    tiktok_videos:  d.tiktokVideos || [],
    featured:       d.featured || false,
    updated_at:     new Date().toISOString(),
  }
}

function fromRow(row: any) {
  return {
    id:           row.id,
    name:         { en: row.name_en, am: row.name_am },
    description:  { en: row.description_en, am: row.description_am },
    image:        row.image,
    category:     row.category,
    prices:       row.prices,
    badge:        row.badge,
    rating:       parseFloat(row.rating),
    reviews:      row.reviews,
    tiktokVideos: row.tiktok_videos || [],
    featured:     row.featured,
  }
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await sb().from('products').select('*').order('created_at')
  return NextResponse.json((data || []).map(fromRow))
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body._action === 'delete') {
    await sb().from('products').delete().eq('id', body.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'products', details: `Deleted product: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update') {
    const { _action, ...data } = body
    await sb().from('products').update(toRow(data)).eq('id', data.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'products', details: `Updated: ${data.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'create') {
    const { _action, ...data } = body
    await sb().from('products').insert(toRow(data))
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'products', details: `Created: ${data.id}` })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
