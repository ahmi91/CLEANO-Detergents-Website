import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, updateUser, addAuditEntry } from '@/lib/admin/data'
import { createSessionCookieValue, SESSION_COOKIE_NAME, AdminSession } from '@/lib/admin/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const user = await getUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    if (!verifyPassword(password, user.passwordHash)) {
      await addAuditEntry({
        userId: user.id, userName: user.name,
        action: 'login_failed', resource: 'auth',
        details: `Failed login for ${email}`,
        ip: req.headers.get('x-forwarded-for') || 'unknown',
      })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const session: AdminSession = {
      userId: user.id, email: user.email, role: user.role,
      name: user.name, expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }

    await updateUser(user.id, { lastLogin: new Date().toISOString() })
    await addAuditEntry({
      userId: user.id, userName: user.name,
      action: 'login', resource: 'auth', details: 'Logged in successfully',
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    })

    const res = NextResponse.json({ success: true, user: { email: user.email, name: user.name, role: user.role } })
    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error. Check Supabase environment variables.' }, { status: 500 })
  }
}
