import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'

export const metadata = { title: 'Due Diligence | EU AC Compliance' }

export default async function DDQPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'ddq:read')) redirect('/dashboard')

  const thirdParties = await prisma.thirdParty.findMany({
    include: { ddqQuestionnaires: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { riskScore: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>Third-Party Due Diligence</h1>
        <p className="text-sm text-[#475569] mt-1">Art. 13 — DDQ · {thirdParties.length} third parties</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Third Party</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Jurisdiction</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">Risk Tier</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">DDQ Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last DDQ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Next DDQ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {thirdParties.map(tp => {
              const latest = tp.ddqQuestionnaires[0]
              const tierStyle: Record<string, string> = {
                CRITICAL: 'bg-purple-100 text-purple-700',
                HIGH:     'bg-red-100 text-red-700',
                MEDIUM:   'bg-amber-100 text-amber-700',
                LOW:      'bg-green-100 text-green-700',
              }
              return (
                <tr key={tp.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3">
                    <Link href={`/ddq/${tp.id}`} className="font-medium text-[#1D5FAB] hover:underline">{tp.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{tp.type}</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{tp.jurisdiction}</td>
                  <td className="px-4 py-3 text-center">
                    {tp.riskTier && (
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${tierStyle[tp.riskTier] ?? 'bg-slate-100 text-slate-600'}`}>
                        {tp.riskTier}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm">
                    {tp.riskScore != null ? (
                      <span className={tp.riskScore >= 70 ? 'text-red-600 font-bold' : tp.riskScore >= 40 ? 'text-amber-600' : 'text-green-600'}>
                        {tp.riskScore.toFixed(0)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tp.ddqStatus} />
                    {tp.ddqStatus === 'ENHANCED' && (
                      <span className="ml-1 text-xs text-purple-600 font-semibold">Enhanced</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{tp.lastDDQDate ? formatDate(tp.lastDDQDate) : '—'}</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{tp.nextDDQDate ? formatDate(tp.nextDDQDate) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
