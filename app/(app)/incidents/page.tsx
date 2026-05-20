import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SeverityBadge from '@/components/modules/SeverityBadge'
import StatusBadge from '@/components/modules/StatusBadge'
import { calculatePenaltyExposure, daysElapsed, formatDate } from '@/lib/formulas'
import { Plus, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Incidents (CIR) | EU AC Compliance' }

export default async function IncidentsPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:read')) redirect('/dashboard')

  const incidents = await prisma.incident.findMany({
    include: { investigator: true, subject: true },
    orderBy: { reportedDate: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Corruption Incident Register
          </h1>
          <p className="text-sm text-[#475569] mt-1">Arts. 4-9 — CIR workflow · {incidents.length} records</p>
        </div>
        {hasPermission(session.user.role, 'incidents:write') && (
          <Link
            href="/incidents/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] transition-colors"
          >
            <Plus size={16} />
            New Incident
          </Link>
        )}
      </div>

      {/* Art. 14(3) note */}
      <div className="flex items-start gap-3 px-4 py-3 bg-[#FEF3C7] border border-amber-200 rounded-lg">
        <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800">
          <strong>Art. 14(3):</strong> Maximum penalty exposure — 5% of worldwide turnover or EUR 40M for Arts. 3-5 offences (bribery/misappropriation); 3% or EUR 24M for Arts. 6, 8, 9. Penalty shown is the greater of % and flat amount.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider w-32">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider w-24">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider w-36">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider w-32">Investigator</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider w-24">Days Open</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider w-36">Max Exposure</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider w-16">AML</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {incidents.map(inc => {
              const days = daysElapsed(inc.reportedDate)
              const penalty = inc.worldwideTurnover
                ? calculatePenaltyExposure({
                    worldwideTurnover: inc.worldwideTurnover,
                    articleGroup: ['Bribery', 'Misappropriation'].includes(inc.allegationType) ? '3-5' : '6-8-9',
                  }).maxPenalty
                : null

              return (
                <tr key={inc.id} className="hover:bg-[#F8FAFC] cursor-pointer">
                  <td className="px-4 py-3">
                    <Link href={`/incidents/${inc.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">
                      {inc.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/incidents/${inc.id}`} className="text-[#0F172A] font-medium hover:text-[#1D5FAB] line-clamp-1">
                      {inc.title}
                    </Link>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{inc.allegationType}</p>
                  </td>
                  <td className="px-4 py-3"><SeverityBadge severity={inc.severity} /></td>
                  <td className="px-4 py-3"><StatusBadge status={inc.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{inc.investigator?.name ?? '—'}</td>
                  <td className={`px-4 py-3 text-right text-xs font-mono font-semibold ${days > 30 ? 'text-red-600' : days > 14 ? 'text-amber-600' : 'text-[#0F172A]'}`}>
                    {days}d
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    {penalty != null ? (
                      <span className={penalty > 10_000_000 ? 'text-red-600 font-semibold' : 'text-[#475569]'}>
                        EUR {(penalty / 1_000_000).toFixed(0)}M
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inc.amlFlag && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded" title="Art. 15(2)(f) AML Flag">AML</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
