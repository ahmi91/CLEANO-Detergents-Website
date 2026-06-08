import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { getPageContent, updatePageContent, addAuditEntry } from '@/lib/admin/data'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getPageContent())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  await updatePageContent(body.id, body)
  await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'content', details: `Updated: ${body.page}/${body.section}` })
  return NextResponse.json({ success: true })
}
