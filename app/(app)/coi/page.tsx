import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate, formatEUR } from '@/lib/formulas'
import { Plus } from 'lucide-react'

export const metadata = { title: 'Conflicts of Interest | EU AC Compliance' }

export default async function COIPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'coi:read')) redirect('/dashboard')

  const cois = await prisma.cOI.findMany({
    include: { declarer: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Conflict of Interest Register
          </h1>
          <p className="text-sm text-[#475569] mt-1">Art. 13 — COI declarations · {cois.length} records</p>
        </div>
        {hasPermission(session.user.role, 'coi:submit') && (
          <Link href="/coi/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298]">
            <Plus size={16} /> Declare COI
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Ref</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Declarer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Interest Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Counterparty</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Next Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {cois.map(c => (
              <tr key={c.id} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <Link href={`/coi/${c.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">{c.reference}</Link>
                </td>
                <td className="px-4 py-3 text-[#0F172A] font-medium">{c.declarer.name}</td>
                <td className="px-4 py-3 text-[#475569] text-xs">{c.interestType}</td>
                <td className="px-4 py-3 text-[#475569] text-xs">{c.counterparty}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{c.estimatedValue ? formatEUR(c.estimatedValue) : '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-xs text-[#475569]">{c.nextReviewDate ? formatDate(c.nextReviewDate) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
