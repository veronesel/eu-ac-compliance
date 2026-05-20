'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Role } from '@/lib/rbac'
import { hasPermission } from '@/lib/rbac'
import {
  LayoutDashboard, AlertTriangle, Gift, Users, MessageSquare,
  Search, CheckSquare, ClipboardList, BookOpen, BarChart3,
  FileText, HelpCircle, Shield,
} from 'lucide-react'

interface NavGroup {
  label: string
  items: NavItem[]
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  permission?: Parameters<typeof hasPermission>[1]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard',    label: 'Dashboard',       icon: <LayoutDashboard size={16} /> },
      { href: '/obligations',  label: 'Obligations',     icon: <BookOpen size={16} /> },
      { href: '/risks',        label: 'Risk Register',   icon: <Shield size={16} /> },
    ],
  },
  {
    label: 'Compliance Modules',
    items: [
      { href: '/incidents',    label: 'Incidents (CIR)', icon: <AlertTriangle size={16} />, permission: 'incidents:read' },
      { href: '/gifts',        label: 'Gifts (GHR)',     icon: <Gift size={16} />,          permission: 'gifts:read' },
      { href: '/coi',          label: 'Conflicts (COI)', icon: <Users size={16} />,         permission: 'coi:read' },
      { href: '/whistleblower',label: 'Whistleblower',   icon: <MessageSquare size={16} />, permission: 'wr:read:masked' },
      { href: '/ddq',          label: 'Due Diligence',   icon: <Search size={16} />,        permission: 'ddq:read' },
      { href: '/controls',     label: 'Controls (CTR)',  icon: <CheckSquare size={16} />,   permission: 'controls:read' },
      { href: '/assessments',  label: 'Assessments',     icon: <ClipboardList size={16} />, permission: 'assessments:read' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href: '/reports/traceability', label: 'Traceability',        icon: <BarChart3 size={16} />, permission: 'reports:read' },
      { href: '/reports/art16c',       label: 'Art. 16(c) Package',  icon: <FileText size={16} />,  permission: 'reports:read' },
    ],
  },
  {
    label: 'Help',
    items: [
      { href: '/help', label: 'Help & Diagrams', icon: <HelpCircle size={16} /> },
    ],
  },
]

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#0F1929] flex flex-col shrink-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1D5FAB] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate" style={{ fontFamily: 'Syne, sans-serif' }}>EU AC</p>
            <p className="text-white/40 text-xs truncate">2026/1021</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(item =>
            !item.permission || hasPermission(role, item.permission)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="mb-4">
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {group.label}
              </p>
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#1D5FAB] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
