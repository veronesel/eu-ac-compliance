'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HelpCircle, LogOut, Bell } from 'lucide-react'
import type { Role } from '@/lib/rbac'

interface TopBarProps {
  user: {
    name: string
    email: string
    role: Role
  }
}

const ROLE_LABELS: Record<Role, string> = {
  CCO:          'Chief Compliance Officer',
  CO:           'Compliance Officer',
  LINE_MANAGER: 'Line Manager',
  EMPLOYEE:     'Employee',
  CONF_INV:     'Confidential Investigator',
  AUDIT:        'Auditor',
  SCHEDULER:    'Scheduler',
}

export default function TopBar({ user }: TopBarProps) {
  const pathname = usePathname()

  // Build breadcrumb from pathname
  const crumbs = pathname.split('/').filter(Boolean).map((segment) => {
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    return label
  })

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
        <Link href="/dashboard" className="hover:text-[#1D5FAB]">Home</Link>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span>/</span>
            <span className={i === crumbs.length - 1 ? 'text-[#0F172A] font-medium' : 'hover:text-[#1D5FAB]'}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Help button */}
        <Link
          href="/help"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1D5FAB] transition-colors"
          title="Help & Documentation"
        >
          <HelpCircle size={18} />
        </Link>

        {/* Notifications */}
        <Link
          href="/dashboard"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Link>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0]">
          <div className="text-right">
            <p className="text-sm font-medium text-[#0F172A] leading-none">{user.name}</p>
            <p className="text-xs text-[#475569] mt-0.5">{ROLE_LABELS[user.role]}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1D5FAB] flex items-center justify-center text-white text-sm font-semibold">
            {user.name.charAt(0)}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-[#94A3B8] hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
