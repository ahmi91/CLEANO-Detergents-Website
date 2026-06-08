import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { getInventory, updateInventoryItem, addAuditEntry } from '@/lib/admin/data'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getInventory())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  await updateInventoryItem(body.id || `inv-${Date.now()}`, { ...body, updatedBy: session.name })
  await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'inventory', details: `Updated inventory for ${body.productId} / ${body.size}` })
  return NextResponse.json({ success: true })
}
