import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate, formatEUR } from '@/lib/formulas'
import { ArrowLeft } from 'lucide-react'
import COIActions from '@/components/modules/COIActions'

export const metadata = { title: 'COI Detail | EU AC Compliance' }

export default async function COIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'coi:read')) redirect('/dashboard')

  const coi = await prisma.cOI.findUnique({ where: { id }, include: { declarer: true } })
  if (!coi) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/coi" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to COI Register
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{coi.reference}</span>
          <StatusBadge status={coi.status} />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {coi.interestType} Interest — {coi.counterparty}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Declaration Details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[#94A3B8] text-xs mb-1">Declarer</dt><dd className="font-medium text-[#0F172A]">{coi.declarer.name}</dd></div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Interest Type</dt><dd className="font-medium text-[#0F172A]">{coi.interestType}</dd></div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Counterparty</dt><dd className="font-medium text-[#0F172A]">{coi.counterparty}</dd></div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Estimated Value</dt><dd className="font-mono font-medium text-[#0F172A]">{coi.estimatedValue ? formatEUR(coi.estimatedValue) : '—'}</dd></div>
          <div className="col-span-2"><dt className="text-[#94A3B8] text-xs mb-1">Description</dt><dd className="text-[#0F172A] leading-relaxed">{coi.description}</dd></div>
        </dl>
      </div>

      {coi.coAssessment && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">CO Assessment</h2>
          <div className="text-sm space-y-3">
            <div className="flex gap-4">
              <span className="text-[#94A3B8]">Classification:</span>
              <span className={`font-semibold ${coi.coAssessment === 'ACTUAL' ? 'text-red-700' : coi.coAssessment === 'MANAGEABLE' ? 'text-amber-700' : 'text-green-700'}`}>
                {coi.coAssessment}
              </span>
            </div>
            {coi.managementDecision && (
              <div><span className="text-[#94A3B8]">Management Decision:</span><p className="mt-1 text-[#0F172A]">{coi.managementDecision}</p></div>
            )}
            {coi.remediationPlan && (
              <div><span className="text-[#94A3B8]">Remediation Plan:</span><p className="mt-1 text-[#0F172A]">{coi.remediationPlan}</p></div>
            )}
            {coi.nextReviewDate && (
              <div className="flex gap-4"><span className="text-[#94A3B8]">Next Review:</span><span className="font-mono">{formatDate(coi.nextReviewDate)}</span></div>
            )}
          </div>
        </div>
      )}

      {hasPermission(session.user.role, 'coi:assess') && coi.status === 'PENDING_CO' && (
        <COIActions coiId={coi.id} />
      )}
    </div>
  )
}
