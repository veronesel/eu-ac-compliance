import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/formulas'
import Link from 'next/link'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Risk Register | EU AC Compliance' }

export default async function RisksPage() {
  const risks = await prisma.risk.findMany({ orderBy: { inherentScore: 'desc' } })

  const stats = {
    total: risks.length,
    active: risks.filter(r => r.status === 'ACTIVE').length,
    mitigated: risks.filter(r => r.status === 'MITIGATED').length,
    highCritical: risks.filter(r => r.inherentScore >= 9).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Corruption Risk Register
          </h1>
          <p className="text-sm text-[#475569] mt-1">Art. 13 — Prevention measures risk assessment</p>
        </div>
        <Link href="/risks/new" className="px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298]">
          + New Risk
        </Link>
      </div>

      {/* About */}
      <CollapsibleAbout title="About this Module">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Corruption Risk Register (CRR) is the organisation&apos;s structured assessment of the corruption threats it faces. Each risk maps to one or more Directive offence categories (Arts. 3-9), carries inherent and residual risk scores, and is assigned to a named owner responsible for keeping controls current. The CRR is the evidence that the compliance programme is risk-based — a core Recital 29 adequacy criterion. Click any risk title to view details and edit.
        </p>
      </CollapsibleAbout>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Risks', value: stats.total, style: 'bg-slate-50 border-slate-200 text-slate-700' },
          { label: 'Active', value: stats.active, style: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Mitigated', value: stats.mitigated, style: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'High + Critical', value: stats.highCritical, style: 'bg-purple-50 border-purple-200 text-purple-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.style}`}>
            <p className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Risk</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">Inherent Score</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">Residual Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Review Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {risks.map(r => {
              const inhLabel = r.inherentScore >= 15 ? 'CRITICAL' : r.inherentScore >= 9 ? 'HIGH' : r.inherentScore >= 4 ? 'MEDIUM' : 'LOW'
              const resLabel = r.residualScore >= 15 ? 'CRITICAL' : r.residualScore >= 9 ? 'HIGH' : r.residualScore >= 4 ? 'MEDIUM' : 'LOW'
              const scoreStyle = (s: number) => s >= 15 ? 'text-purple-700 bg-purple-100' : s >= 9 ? 'text-red-700 bg-red-100' : s >= 4 ? 'text-amber-700 bg-amber-100' : 'text-slate-600 bg-slate-100'
              return (
                <tr key={r.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3">
                    <Link href={`/risks/${r.id}`} className="font-medium text-[#0F172A] hover:text-[#1D5FAB]">{r.title}</Link>
                    <p className="text-xs text-[#475569] mt-0.5 line-clamp-1">{r.description}</p>
                  </td>
                  <td className="px-4 py-3 text-[#475569] text-xs">{r.category}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${scoreStyle(r.inherentScore)}`}>
                      {r.inherentScore} {inhLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${scoreStyle(r.residualScore)}`}>
                      {r.residualScore} {resLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{r.owner}</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{formatDate(r.reviewDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${r.status === 'ACTIVE' ? 'bg-red-100 text-red-700' : r.status === 'MITIGATED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {r.status}
                    </span>
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
