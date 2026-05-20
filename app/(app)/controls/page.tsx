import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'

export const metadata = { title: 'Control Testing | EU AC Compliance' }

export default async function ControlsPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'controls:read')) redirect('/dashboard')

  const controls = await prisma.control.findMany({ orderBy: { reference: 'asc' } })

  const stats = {
    total: controls.length,
    effective: controls.filter(c => c.testResult === 'EFFECTIVE').length,
    partial: controls.filter(c => c.testResult === 'PARTIALLY_EFFECTIVE').length,
    ineffective: controls.filter(c => c.testResult === 'INEFFECTIVE').length,
  }
  const effPct = stats.total > 0 ? Math.round((stats.effective / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>Control Testing Records</h1>
        <p className="text-sm text-[#475569] mt-1">Art. 13 — CTR · {controls.length} controls · {effPct}% effective</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Controls', value: stats.total, style: 'bg-slate-50 border-slate-200 text-slate-700' },
          { label: 'Effective', value: stats.effective, style: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Partially Effective', value: stats.partial, style: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Ineffective', value: stats.ineffective, style: 'bg-red-50 border-red-200 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.style}`}>
            <p className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Ref</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Control</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Result</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Test End</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {controls.map(c => (
              <tr key={c.id} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <Link href={`/controls/${c.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">{c.reference}</Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#0F172A]">{c.title}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">{c.description}</p>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">{c.controlType}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  {c.testResult ? (
                    <span className={`text-xs font-semibold ${c.testResult === 'EFFECTIVE' ? 'text-green-700' : c.testResult === 'PARTIALLY_EFFECTIVE' ? 'text-amber-700' : 'text-red-700'}`}>
                      {c.testResult.replace(/_/g, ' ')}
                    </span>
                  ) : <span className="text-xs text-[#94A3B8]">Pending</span>}
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">{c.testEndDate ? formatDate(c.testEndDate) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
