import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ObligationEditForm from '@/components/modules/ObligationEditForm'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Obligation Detail | EU AC Compliance' }

const STATUS_STYLE: Record<string, string> = {
  COMPLIANT:    'bg-green-100 text-green-700',
  IN_PROGRESS:  'bg-blue-100 text-blue-700',
  NOT_STARTED:  'bg-slate-100 text-slate-600',
  NEEDS_REVIEW: 'bg-amber-100 text-amber-700',
}

function riskLabel(score: number) {
  if (score >= 15) return { label: 'CRITICAL', style: 'text-purple-700 bg-purple-100' }
  if (score >= 9) return { label: 'HIGH', style: 'text-red-700 bg-red-100' }
  if (score >= 4) return { label: 'MEDIUM', style: 'text-amber-700 bg-amber-100' }
  return { label: 'LOW', style: 'text-slate-600 bg-slate-100' }
}

export default async function ObligationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect('/dashboard')

  const obligation = await prisma.obligation.findUnique({ where: { id } })
  if (!obligation) notFound()

  const score = obligation.probability * obligation.impact
  const risk = riskLabel(score)
  const policies: string[] = JSON.parse(obligation.policies || '[]')
  const controls: string[] = JSON.parse(obligation.controls || '[]')
  const canEdit = hasPermission(session.user.role, 'obligations:write')

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/obligations" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Obligations
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{obligation.articleRef}</span>
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[obligation.status] ?? 'bg-slate-100 text-slate-600'}`}>
            {obligation.status.replace(/_/g, ' ')}
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {obligation.title}
        </h1>
      </div>

      {/* About section */}
      <CollapsibleAbout title="About the Regulatory Obligation Library">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Regulatory Obligation Library (ROL) captures every legal requirement imposed on the organisation by Directive (EU) 2026/1021. Each entry maps a specific Article reference to an implementation status, risk score, linked policies, and linked controls. Maintaining this library is how the organisation demonstrates to regulators that it knows what it must do and has taken steps to do it — a prerequisite for any Art. 16(c) mitigation argument.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Use this record to: track implementation progress per article, link the controlling policies and controls, and set the probability/impact scores that feed into the risk register. The status field directly affects the obligationCovPct metric in the annual Compliance Programme Assessment.
        </p>
      </CollapsibleAbout>

      {/* Metadata grid */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Obligation Details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Article Reference</dt>
            <dd className="font-mono font-semibold text-[#1D5FAB]">{obligation.articleRef}</dd>
          </div>
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Type</dt>
            <dd className="font-medium text-[#0F172A]">{obligation.obligationType}</dd>
          </div>
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Classification</dt>
            <dd className="font-medium text-[#0F172A]">{obligation.classification}</dd>
          </div>
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Deadline</dt>
            <dd className="font-medium text-[#0F172A]">{obligation.deadline}</dd>
          </div>
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Status</dt>
            <dd>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[obligation.status] ?? 'bg-slate-100 text-slate-600'}`}>
                {obligation.status.replace(/_/g, ' ')}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Risk score */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Risk Score</h2>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-[#94A3B8] mb-1">Probability</p>
            <p className="text-2xl font-bold text-[#0F172A]">{obligation.probability}</p>
          </div>
          <p className="text-xl text-[#94A3B8]">×</p>
          <div className="text-center">
            <p className="text-xs text-[#94A3B8] mb-1">Impact</p>
            <p className="text-2xl font-bold text-[#0F172A]">{obligation.impact}</p>
          </div>
          <p className="text-xl text-[#94A3B8]">=</p>
          <div className="text-center">
            <p className="text-xs text-[#94A3B8] mb-1">Score</p>
            <span className={`inline-flex px-4 py-2 rounded-lg text-lg font-bold ${risk.style}`}>
              {score} — {risk.label}
            </span>
          </div>
        </div>
      </div>

      {/* Linked policies */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Linked Policies</h2>
        {policies.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No policies linked.</p>
        ) : (
          <ul className="space-y-1">
            {policies.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#0F172A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D5FAB]" />
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Linked controls */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Linked Controls</h2>
        {controls.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No controls linked.</p>
        ) : (
          <ul className="space-y-1">
            {controls.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#0F172A]">
                <span className="font-mono text-xs text-[#1D5FAB] font-semibold">{c}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit form */}
      {canEdit ? (
        <ObligationEditForm
          id={obligation.id}
          status={obligation.status}
          probability={obligation.probability}
          impact={obligation.impact}
          policies={policies}
          controls={controls}
          deadline={obligation.deadline}
        />
      ) : (
        <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          Editing requires CO or CCO role.
        </div>
      )}
    </div>
  )
}
