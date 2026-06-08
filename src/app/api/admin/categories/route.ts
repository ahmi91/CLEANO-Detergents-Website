import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function fromRow(row: any) {
  return {
    id:    row.id,
    label: { en: row.label_en, am: row.label_am },
    order: row.sort_order,
    icon:  row.icon,
    color: row.color,
  }
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await sb().from('categories').select('*').order('sort_order')
  return NextResponse.json((data || []).map(fromRow))
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body._action === 'create') {
    const { _action, ...d } = body
    await sb().from('categories').insert({
      id: d.id, label_en: d.label?.en || '', label_am: d.label?.am || '',
      sort_order: d.order || 99, icon: d.icon || '🧴', color: d.color || '#3B82F6'
    })
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'categories', details: `Created: ${d.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update') {
    const { _action, ...d } = body
    await sb().from('categories').update({
      label_en: d.label?.en, label_am: d.label?.am,
      sort_order: d.order, icon: d.icon, color: d.color
    }).eq('id', d.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'categories', details: `Updated: ${d.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'delete') {
    await sb().from('categories').delete().eq('id', body.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'categories', details: `Deleted: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'reorder') {
    const updates = (body.ids as string[]).map((id: string, i: number) =>
      sb().from('categories').update({ sort_order: i + 1 }).eq('id', id)
    )
    await Promise.all(updates)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
