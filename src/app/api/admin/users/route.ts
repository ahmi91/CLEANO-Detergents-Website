import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { getUsers, createUser, deleteUser, updateUser, addAuditEntry } from '@/lib/admin/data'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const users = (await getUsers()).map(({ passwordHash, ...rest }) => rest)
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body._action === 'create') {
    const { _action, password, ...data } = body
    await createUser({ ...data, passwordHash: Buffer.from(password).toString('base64') })
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'users', details: `Created user: ${data.email}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update_role') {
    await updateUser(body.id, { role: body.role })
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'users', details: `Role → ${body.role} for ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'delete') {
    if (body.id === session.userId) return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    await deleteUser(body.id)
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'users', details: `Deleted user: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'reset_password') {
    await updateUser(body.id, { passwordHash: Buffer.from(body.newPassword).toString('base64') })
    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'users', details: `Password reset for: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
