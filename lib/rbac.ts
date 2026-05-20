export const ROLES = ['CCO', 'CO', 'LINE_MANAGER', 'EMPLOYEE', 'CONF_INV', 'AUDIT', 'SCHEDULER'] as const
export type Role = typeof ROLES[number]

export const PERMISSIONS = {
  'incidents:read':        ['CCO', 'CO', 'CONF_INV', 'AUDIT'],
  'incidents:write':       ['CCO', 'CO'],
  'incidents:triage':      ['CO'],
  'incidents:investigate': ['CO', 'CONF_INV'],
  'incidents:disclose':    ['CCO'],
  'gifts:read':            ['CCO', 'CO', 'LINE_MANAGER', 'EMPLOYEE', 'AUDIT'],
  'gifts:submit':          ['EMPLOYEE', 'CO', 'LINE_MANAGER', 'CCO'],
  'gifts:approve:manager': ['LINE_MANAGER'],
  'gifts:approve:co':      ['CO', 'CCO'],
  'coi:read':              ['CCO', 'CO', 'LINE_MANAGER', 'AUDIT'],
  'coi:submit':            ['EMPLOYEE', 'CO', 'LINE_MANAGER', 'CCO'],
  'coi:assess':            ['CO', 'CCO'],
  'wr:read':               ['CONF_INV'],
  'wr:read:masked':        ['CO', 'CCO', 'AUDIT'],
  'wr:submit':             ['EMPLOYEE', 'CO', 'CCO', 'LINE_MANAGER'],
  'ddq:read':              ['CO', 'CCO', 'AUDIT'],
  'ddq:manage':            ['CO', 'CCO'],
  'obligations:read':      ['CCO', 'CO', 'AUDIT', 'LINE_MANAGER', 'EMPLOYEE'] as const,
  'obligations:write':     ['CCO', 'CO'] as const,
  'risks:write':           ['CCO', 'CO'] as const,
  'controls:read':         ['CO', 'CCO', 'AUDIT'],
  'controls:write':        ['CCO', 'CO', 'SCHEDULER'] as const,
  'controls:test':         ['CO', 'CCO'],
  'assessments:read':      ['CO', 'CCO', 'AUDIT'],
  'assessments:write':     ['CO'],
  'assessments:signoff':   ['CCO'],
  'reports:read':          ['CO', 'CCO', 'AUDIT'],
  'admin:settings':        ['CCO'],
} as const

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role)
}

export function requirePermission(role: Role | undefined, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new Error(`Forbidden: requires permission '${permission}'`)
  }
}

export function canAccess(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.some(p => hasPermission(role, p))
}
