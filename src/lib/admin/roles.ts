export type AdminRole = 'super_admin' | 'manager' | 'translator' | 'inventory_manager' | 'content_editor'

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  translator: 'Translator',
  inventory_manager: 'Inventory Manager',
  content_editor: 'Content Editor',
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  manager: ['products', 'categories', 'stores', 'inventory'],
  translator: ['translations'],
  inventory_manager: ['inventory'],
  content_editor: ['content', 'media'],
}

export function hasPermission(role: AdminRole, resource: string): boolean {
  const perms = ROLE_PERMISSIONS[role]
  return perms.includes('*') || perms.includes(resource)
}
