import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Obligations | EU AC Compliance' }

const STATUS_STYLE: Record<string, string> = {
  COMPLIANT:    'bg-green-100 text-green-700',
  IN_PROGRESS:  'bg-blue-100 text-blue-700',
  NOT_STARTED:  'bg-slate-100 text-slate-600',
  NEEDS_REVIEW: 'bg-amber-100 text-amber-700',
}

const TYPE_STYLE: Record<string, string> = {
  Mandatory:    'bg-red-100 text-red-700',
  Conditional:  'bg-amber-100 text-amber-700',
  Recommended:  'bg-slate-100 text-slate-600',
}

export default async function ObligationsPage() {
  const obligations = await prisma.obligation.findMany({ orderBy: { articleRef: 'asc' } })
  const stats = {
    total: obligations.length,
    compliant: obligations.filter(o => o.status === 'COMPLIANT').length,
    inProgress: obligations.filter(o => o.status === 'IN_PROGRESS').length,
    notStarted: obligations.filter(o => o.status === 'NOT_STARTED').length,
    needsReview: obligations.filter(o => o.status === 'NEEDS_REVIEW').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Regulatory Obligation Library
        </h1>
        <p className="text-sm text-[#475569] mt-1">Directive (EU) 2026/1021 — Article-by-article compliance status</p>
      </div>

      {/* About this module */}
      <CollapsibleAbout title="About this Module">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Regulatory Obligation Library (ROL) captures every legal requirement imposed on the organisation by Directive (EU) 2026/1021. Each entry maps a specific Article reference to an implementation status, risk score, linked policies, and linked controls. Maintaining this library is how the organisation demonstrates to regulators that it knows what it must do and has taken steps to do it — a prerequisite for any Art. 16(c) mitigation argument. Click any row to view the full obligation detail and edit implementation status.
        </p>
      </CollapsibleAbout>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Obligations', value: stats.total, style: 'bg-slate-50 border-slate-200 text-slate-700' },
          { label: 'Compliant', value: stats.compliant, style: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'In Progress', value: stats.inProgress, style: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Needs Review', value: stats.needsReview, style: 'bg-amber-50 border-amber-200 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.style}`}>
            <p className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Article</span>
                <span className="text-xs text-[#94A3B8] font-normal">Click any row to view and edit</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Obligation</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Classification</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Risk</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {obligations.map(o => {
              const risk = o.probability * o.impact
              const riskLabel = risk >= 15 ? 'CRITICAL' : risk >= 9 ? 'HIGH' : risk >= 4 ? 'MEDIUM' : 'LOW'
              const riskStyle = risk >= 15 ? 'text-purple-700 bg-purple-50' : risk >= 9 ? 'text-red-700 bg-red-50' : risk >= 4 ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-50'
              return (
                <tr key={o.id} className="hover:bg-[#F8FAFC] cursor-pointer">
                  <td className="px-4 py-3">
                    <Link href={`/obligations/${o.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">
                      {o.articleRef}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#0F172A] font-medium max-w-xs">
                    <Link href={`/obligations/${o.id}`} className="hover:text-[#1D5FAB]">{o.title}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLE[o.obligationType] ?? 'bg-slate-100 text-slate-600'}`}>
                      {o.obligationType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#475569] text-xs">{o.classification}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${riskStyle}`}>
                      {riskLabel} ({risk})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#475569] text-xs">{o.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[o.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {o.status.replace(/_/g, ' ')}
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
