import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'
import { Lock } from 'lucide-react'

export const metadata = { title: 'Whistleblower Reports | EU AC Compliance' }

export default async function WhistleblowerPage() {
  const session = await auth()
  const canReadMasked = session && hasPermission(session.user.role, 'wr:read:masked')
  const canReadFull = session && hasPermission(session.user.role, 'wr:read')
  if (!session || (!canReadMasked && !canReadFull)) redirect('/dashboard')

  const cases = await prisma.wRCase.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Whistleblower Reports
        </h1>
        <p className="text-sm text-[#475569] mt-1">Arts. 20, 25 — Dir. 2019/1937 · {cases.length} cases</p>
      </div>

      {/* FLS banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <Lock size={16} className="text-red-600 mt-0.5 shrink-0" />
        <p className="text-xs text-red-800">
          <strong>Reporter Identity — FLS Restricted:</strong> Reporter name and contact details are visible only to the Confidential Investigator group (Dir. 2019/1937 / Art. 25(1)). All other roles see masked data (████████).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Ref</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reporter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Summary</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {cases.map(c => (
              <tr key={c.id} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <Link href={`/whistleblower/${c.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">{c.reference}</Link>
                </td>
                <td className="px-4 py-3">
                  {canReadFull ? (
                    <span className="text-xs text-[#0F172A]">{c.reporterName ?? 'Anonymous'}</span>
                  ) : (
                    <span className="text-xs font-mono tracking-widest text-[#94A3B8] flex items-center gap-1">
                      <Lock size={10} /> ████████
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">{c.category}</td>
                <td className="px-4 py-3 text-xs text-[#475569] max-w-xs">
                  <span className="line-clamp-2">
                    {canReadFull ? c.detailsRestricted : c.detailsPublic}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-xs text-[#475569]">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
