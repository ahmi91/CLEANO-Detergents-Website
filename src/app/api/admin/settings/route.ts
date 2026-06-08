import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { getSettings, updateSettings, addAuditEntry } from '@/lib/admin/data'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getSettings())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updates = await req.json()
  const updated = await updateSettings(updates)
  await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'settings', details: 'Updated site settings' })
  return NextResponse.json(updated)
}
