import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { ArrowLeft } from 'lucide-react'
import ControlEditForm from '@/components/modules/ControlEditForm'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Control Detail | EU AC Compliance' }

export default async function ControlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'controls:read')) redirect('/dashboard')

  const control = await prisma.control.findUnique({ where: { id } })
  if (!control) notFound()

  const evidenceRefs: string[] = JSON.parse(control.evidenceRefs || '[]')
  const canEdit = hasPermission(session.user.role, 'controls:write')

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/controls" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Controls
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{control.reference}</span>
          <StatusBadge status={control.status} />
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{control.controlType}</span>
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {control.title}
        </h1>
      </div>

      {/* About section */}
      <CollapsibleAbout title="About the Control Testing Record">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Control Testing Record (CTR) documents the independent testing of a compliance control — what was tested, how, by whom, and whether the control worked. Independent testing is required by Art. 13(2)(e) and is the fourth input to the annual Compliance Programme Assessment score (controlEffPct, weighted 25%).
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The mandatory segregation of duties rule (FR-25) requires that the person who operates the control (owner) and the person who tests it (tester) are different individuals. This prevents self-certification, which regulators treat as evidence that the programme is not genuinely implemented. An INEFFECTIVE result automatically creates a remediation obligation that must be tracked to closure.
        </p>
      </CollapsibleAbout>

      <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <strong>FR-25:</strong> Control tester must differ from the control owner. Segregation of duties is enforced at assignment.
      </div>

      {canEdit ? (
        <ControlEditForm
          id={control.id}
          title={control.title}
          description={control.description}
          controlType={control.controlType}
          owner={control.owner}
          tester={control.tester ?? ''}
          status={control.status}
          testResult={control.testResult ?? null}
          reviewNotes={control.reviewNotes ?? null}
          remediationPlan={control.remediationPlan ?? null}
          remediationDue={control.remediationDue ? control.remediationDue.toISOString().split('T')[0] : null}
          evidenceRefs={evidenceRefs}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Control Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-[#94A3B8] text-xs mb-1">Owner</dt><dd className="font-medium text-[#0F172A]">{control.owner}</dd></div>
            <div><dt className="text-[#94A3B8] text-xs mb-1">Tester</dt><dd className="font-medium text-[#0F172A]">{control.tester ?? 'Not assigned'}</dd></div>
            <div className="col-span-2"><dt className="text-[#94A3B8] text-xs mb-1">Description</dt><dd className="text-[#0F172A] leading-relaxed">{control.description}</dd></div>
            {control.testResult && (
              <div className="col-span-2">
                <dt className="text-[#94A3B8] text-xs mb-1">Test Result</dt>
                <dd>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${control.testResult === 'EFFECTIVE' ? 'bg-green-100 text-green-700' : control.testResult === 'PARTIALLY_EFFECTIVE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {control.testResult.replace(/_/g, ' ')}
                  </span>
                </dd>
              </div>
            )}
            {control.reviewNotes && (
              <div className="col-span-2"><dt className="text-[#94A3B8] text-xs mb-1">Review Notes</dt><dd className="text-[#0F172A]">{control.reviewNotes}</dd></div>
            )}
            {control.remediationPlan && (
              <div className="col-span-2"><dt className="text-[#94A3B8] text-xs mb-1">Remediation Plan</dt><dd className="text-[#0F172A]">{control.remediationPlan}</dd></div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}
