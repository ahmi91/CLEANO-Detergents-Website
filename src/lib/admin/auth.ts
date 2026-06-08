import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { AdminRole, ROLE_LABELS, ROLE_PERMISSIONS, hasPermission } from './roles'

export type { AdminRole }
export { ROLE_LABELS, ROLE_PERMISSIONS, hasPermission }

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  createdAt: string
  lastLogin?: string
}

export interface AdminSession {
  userId: string
  email: string
  role: AdminRole
  name: string
  expiresAt: number
}

const SESSION_COOKIE = 'cleano_admin_session'

export function encodeSession(session: AdminSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export function decodeSession(token: string): AdminSession | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const session = JSON.parse(decoded) as AdminSession
    if (session.expiresAt < Date.now()) return null
    return session
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null
    return decodeSession(token)
  } catch {
    return null
  }
}

export function getSessionFromRequest(req: NextRequest): AdminSession | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  return decodeSession(token)
}

export function createSessionCookieValue(session: AdminSession): string {
  return encodeSession(session)
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
