// ============================================================
// CLEANO Admin — Supabase Data Layer
// All fs-based storage replaced with Supabase queries
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { AdminRole } from './roles'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  return createClient(url, key)
}

// ---- TYPES ----
export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  createdAt: string
  lastLogin?: string
}

export interface StoredUser extends AdminUser {
  passwordHash: string
}

export interface AuditEntry {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details?: string
  timestamp: string
  ip?: string
}

export interface SiteSettings {
  companyName: string
  tagline: string
  whatsappNumber: string
  telegramUsername: string
  email: string
  phone: string
  address: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  seoTitle: string
  seoDescription: string
  primaryColor: string
  accentColor: string
  logoUrl: string
  bannerEnabled: boolean
  bannerText: string
  bannerColor: string
  updatedAt: string
}

export interface InventoryRecord {
  id: string
  productId: string
  size: string
  storeId: string
  quantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
  updatedBy: string
}

export interface PageContent {
  id: string
  page: string
  section: string
  titleEn: string
  titleAm: string
  bodyEn: string
  bodyAm: string
  updatedAt: string
}

export interface AnalyticsEvent {
  id: string
  type: string
  data: Record<string, string>
  timestamp: string
}

// ---- USERS ----
export async function getUsers(): Promise<StoredUser[]> {
  const sb = getSupabase()
  const { data } = await sb.from('admin_users').select('*').order('created_at')
  return (data || []).map(row => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as AdminRole,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    lastLogin: row.last_login,
  }))
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const sb = getSupabase()
  const { data } = await sb.from('admin_users').select('*').ilike('email', email).single()
  if (!data) return null
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as AdminRole,
    passwordHash: data.password_hash,
    createdAt: data.created_at,
    lastLogin: data.last_login,
  }
}

export function verifyPassword(plain: string, hash: string): boolean {
  return Buffer.from(plain).toString('base64') === hash
}

export async function updateUser(id: string, updates: Partial<StoredUser>): Promise<void> {
  const sb = getSupabase()
  const row: Record<string, unknown> = {}
  if (updates.name)         row.name          = updates.name
  if (updates.role)         row.role          = updates.role
  if (updates.passwordHash) row.password_hash = updates.passwordHash
  if (updates.lastLogin)    row.last_login    = updates.lastLogin
  await sb.from('admin_users').update(row).eq('id', id)
}

export async function createUser(user: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser> {
  const sb = getSupabase()
  const { data } = await sb.from('admin_users').insert({
    email: user.email,
    name: user.name,
    role: user.role,
    password_hash: user.passwordHash,
  }).select().single()
  return {
    id: data!.id,
    email: data!.email,
    name: data!.name,
    role: data!.role,
    passwordHash: data!.password_hash,
    createdAt: data!.created_at,
  }
}

export async function deleteUser(id: string): Promise<void> {
  const sb = getSupabase()
  await sb.from('admin_users').delete().eq('id', id)
}

// ---- AUDIT LOG ----
export async function getAuditLog(): Promise<AuditEntry[]> {
  const sb = getSupabase()
  const { data } = await sb.from('audit_log').select('*').order('created_at', { ascending: false }).limit(1000)
  return (data || []).map(row => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    action: row.action,
    resource: row.resource,
    details: row.details,
    timestamp: row.created_at,
    ip: row.ip,
  }))
}

export async function addAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void> {
  const sb = getSupabase()
  await sb.from('audit_log').insert({
    user_id:   entry.userId,
    user_name: entry.userName,
    action:    entry.action,
    resource:  entry.resource,
    details:   entry.details,
    ip:        entry.ip,
  })
}

// ---- SETTINGS ----
const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'CLEANO Detergents',
  tagline: "Ethiopia's Most Trusted Cleaning Brand",
  whatsappNumber: '+251911234567',
  telegramUsername: '@cleano_official',
  email: 'info@cleano.et',
  phone: '+251 91 123 4567',
  address: 'Bole Road, Addis Ababa, Ethiopia',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: 'https://www.tiktok.com/@cleano_official',
  seoTitle: "CLEANO Detergents – Ethiopia's Premium Cleaning Brand",
  seoDescription: 'Premium detergents crafted for Ethiopian homes.',
  primaryColor: '#1B4FD8',
  accentColor: '#F59E0B',
  logoUrl: '',
  bannerEnabled: false,
  bannerText: 'Free delivery on orders over 500 Birr!',
  bannerColor: '#1B4FD8',
  updatedAt: new Date().toISOString(),
}

export async function getSettings(): Promise<SiteSettings> {
  const sb = getSupabase()
  const { data } = await sb.from('site_settings').select('*').eq('id', 1).single()
  if (!data) return DEFAULT_SETTINGS
  return {
    companyName:      data.company_name,
    tagline:          data.tagline,
    whatsappNumber:   data.whatsapp_number,
    telegramUsername: data.telegram_username,
    email:            data.email,
    phone:            data.phone,
    address:          data.address,
    facebookUrl:      data.facebook_url,
    instagramUrl:     data.instagram_url,
    tiktokUrl:        data.tiktok_url,
    seoTitle:         data.seo_title,
    seoDescription:   data.seo_description,
    primaryColor:     data.primary_color,
    accentColor:      data.accent_color,
    logoUrl:          data.logo_url,
    bannerEnabled:    data.banner_enabled,
    bannerText:       data.banner_text,
    bannerColor:      data.banner_color,
    updatedAt:        data.updated_at,
  }
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const sb = getSupabase()
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.companyName      !== undefined) row.company_name      = updates.companyName
  if (updates.tagline          !== undefined) row.tagline           = updates.tagline
  if (updates.whatsappNumber   !== undefined) row.whatsapp_number   = updates.whatsappNumber
  if (updates.telegramUsername !== undefined) row.telegram_username = updates.telegramUsername
  if (updates.email            !== undefined) row.email             = updates.email
  if (updates.phone            !== undefined) row.phone             = updates.phone
  if (updates.address          !== undefined) row.address           = updates.address
  if (updates.facebookUrl      !== undefined) row.facebook_url      = updates.facebookUrl
  if (updates.instagramUrl     !== undefined) row.instagram_url     = updates.instagramUrl
  if (updates.tiktokUrl        !== undefined) row.tiktok_url        = updates.tiktokUrl
  if (updates.seoTitle         !== undefined) row.seo_title         = updates.seoTitle
  if (updates.seoDescription   !== undefined) row.seo_description   = updates.seoDescription
  if (updates.primaryColor     !== undefined) row.primary_color     = updates.primaryColor
  if (updates.accentColor      !== undefined) row.accent_color      = updates.accentColor
  if (updates.logoUrl          !== undefined) row.logo_url          = updates.logoUrl
  if (updates.bannerEnabled    !== undefined) row.banner_enabled    = updates.bannerEnabled
  if (updates.bannerText       !== undefined) row.banner_text       = updates.bannerText
  if (updates.bannerColor      !== undefined) row.banner_color      = updates.bannerColor
  await sb.from('site_settings').update(row).eq('id', 1)
  return getSettings()
}

// ---- INVENTORY ----
export async function getInventory(): Promise<InventoryRecord[]> {
  const sb = getSupabase()
  const { data } = await sb.from('inventory').select('*').order('updated_at', { ascending: false })
  return (data || []).map(row => ({
    id:          row.id,
    productId:   row.product_id,
    size:        row.size,
    storeId:     row.store_id,
    quantity:    row.quantity,
    status:      row.status,
    lastUpdated: row.updated_at,
    updatedBy:   row.updated_by,
  }))
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryRecord>): Promise<void> {
  const sb = getSupabase()
  const { data: existing } = await sb.from('inventory').select('id').eq('id', id).single()
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.productId !== undefined) row.product_id = updates.productId
  if (updates.size      !== undefined) row.size       = updates.size
  if (updates.storeId   !== undefined) row.store_id   = updates.storeId
  if (updates.quantity  !== undefined) row.quantity   = updates.quantity
  if (updates.status    !== undefined) row.status     = updates.status
  if (updates.updatedBy !== undefined) row.updated_by = updates.updatedBy

  if (existing) {
    await sb.from('inventory').update(row).eq('id', id)
  } else {
    await sb.from('inventory').insert({ id, ...row })
  }
}

// ---- PAGE CONTENT ----
export async function getPageContent(): Promise<PageContent[]> {
  const sb = getSupabase()
  const { data } = await sb.from('content_sections').select('*')
  return (data || []).map(row => ({
    id:        row.id,
    page:      row.page,
    section:   row.section,
    titleEn:   row.title_en,
    titleAm:   row.title_am,
    bodyEn:    row.body_en,
    bodyAm:    row.body_am,
    updatedAt: row.updated_at,
  }))
}

export async function updatePageContent(id: string, updates: Partial<PageContent>): Promise<void> {
  const sb = getSupabase()
  const { data: existing } = await sb.from('content_sections').select('id').eq('id', id).single()
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.page    !== undefined) row.page     = updates.page
  if (updates.section !== undefined) row.section  = updates.section
  if (updates.titleEn !== undefined) row.title_en = updates.titleEn
  if (updates.titleAm !== undefined) row.title_am = updates.titleAm
  if (updates.bodyEn  !== undefined) row.body_en  = updates.bodyEn
  if (updates.bodyAm  !== undefined) row.body_am  = updates.bodyAm

  if (existing) {
    await sb.from('content_sections').update(row).eq('id', id)
  } else {
    await sb.from('content_sections').insert({ id, ...row })
  }
}

// ---- ANALYTICS ----
export async function getAnalytics(): Promise<AnalyticsEvent[]> {
  const sb = getSupabase()
  const { data } = await sb.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(5000)
  return (data || []).map(row => ({
    id:        row.id,
    type:      row.type,
    data:      row.data || {},
    timestamp: row.created_at,
  }))
}

export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
  const sb = getSupabase()
  await sb.from('analytics_events').insert({ type: event.type, data: event.data })
}
