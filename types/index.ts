import type { Role } from '@/lib/rbac'

export type { Role }

export interface DemoUser {
  email: string
  name: string
  role: Role
  password: string
}

export const DEMO_USERS: DemoUser[] = [
  { email: 'cco@demo.eu',           name: 'Sofia Martins',   role: 'CCO',          password: 'demo123' },
  { email: 'co@demo.eu',            name: 'Marcus Weber',    role: 'CO',           password: 'demo123' },
  { email: 'manager@demo.eu',       name: 'Priya Nair',      role: 'LINE_MANAGER', password: 'demo123' },
  { email: 'employee@demo.eu',      name: 'Thomas Eriksson', role: 'EMPLOYEE',     password: 'demo123' },
  { email: 'investigator@demo.eu',  name: 'Katya Volkov',    role: 'CONF_INV',     password: 'demo123' },
  { email: 'auditor@demo.eu',       name: 'Jean-Pierre Moreau', role: 'AUDIT',     password: 'demo123' },
  { email: 'scheduler@demo.eu',     name: 'System Scheduler', role: 'SCHEDULER',   password: 'demo123' },
]

export interface NavItem {
  href: string
  label: string
  icon: string
  permission?: string
}
