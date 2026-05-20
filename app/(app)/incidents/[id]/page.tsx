import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import SeverityBadge from '@/components/modules/SeverityBadge'
import StatusBadge from '@/components/modules/StatusBadge'
import { calculatePenaltyExposure, classifyRapidity, daysElapsed, formatDate, formatEUR } from '@/lib/formulas'
import { ArrowLeft, AlertTriangle, Shield, Clock } from 'lucide-react'
import IncidentActions from '@/components/modules/IncidentActions'

export const metadata = { title: 'Incident Detail | EU AC Compliance' }

const STAGES = ['DRAFT', 'TRIAGE', 'INVESTIGATION', 'FINDINGS_REVIEW', 'DISCLOSURE', 'REMEDIATION', 'CLOSED'] as const
const STAGE_LABELS: Record<string, string> = {
  DRAFT: 'Draft', TRIAGE: 'Triage', INVESTIGATION: 'Investigation',
  FINDINGS_REVIEW: 'Findings Review', DISCLOSURE: 'Disclosure', REMEDIATION: 'Remediation', CLOSED: 'Closed',
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:read')) redirect('/dashboard')

  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      investigator: true,
      subject: true,
      findings: true,
      disclosure: true,
      remediations: true,
      auditLog: { include: { actor: true }, orderBy: { createdAt: 'asc' } },
    },
  })
  if (!incident) notFound()

  const currentStageIdx = STAGES.indexOf(incident.status as typeof STAGES[number])
  const penalty = incident.worldwideTurnover
    ? calculatePenaltyExposure({
        worldwideTurnover: incident.worldwideTurnover,
        articleGroup: ['Bribery', 'Misappropriation'].includes(incident.allegationType) ? '3-5' : '6-8-9',
      })
    : null

  const rapidity = incident.disclosure?.ccoDecision && incident.discoveryDate && incident.disclosure.decisionDate
    ? classifyRapidity(new Date(incident.discoveryDate), new Date(incident.disclosure.decisionDate))
    : null

  const rapidityColour = rapidity === 'RAPID' ? 'text-green-700 bg-green-100' : rapidity === 'PROMPT' ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100'
  const daysOpen = daysElapsed(incident.reportedDate)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link href="/incidents" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Incidents
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{incident.reference}</span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              {incident.amlFlag && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                  ⚠ Art. 15(2)(f) AML Flag
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
              {incident.title}
            </h1>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold font-mono ${daysOpen > 30 ? 'text-red-600' : daysOpen > 14 ? 'text-amber-600' : 'text-[#0F172A]'}`}>
              {daysOpen}d
            </p>
            <p className="text-xs text-[#94A3B8]">days open</p>
          </div>
        </div>
      </div>

      {/* Stage Stepper */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] mb-4 uppercase tracking-wider">Workflow Stage</h2>
        <div className="flex items-center">
          {STAGES.map((stage, i) => {
            const isCompleted = i < currentStageIdx
            const isCurrent = i === currentStageIdx
            const isFuture = i > currentStageIdx
            return (
              <div key={stage} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    isCompleted ? 'bg-[#1D5FAB] border-[#1D5FAB] text-white' :
                    isCurrent  ? 'bg-white border-[#1D5FAB] text-[#1D5FAB]' :
                                 'bg-white border-[#E2E8F0] text-[#94A3B8]'
                  }`}>
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <p className={`text-xs mt-1 text-center max-w-16 ${isCurrent ? 'font-semibold text-[#1D5FAB]' : isFuture ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {STAGE_LABELS[stage]}
                  </p>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${i < currentStageIdx ? 'bg-[#1D5FAB]' : 'bg-[#E2E8F0]'}`} />
                )}
              </div>
            )
          })}
        </div>
        {/* Action buttons */}
        {hasPermission(session.user.role, 'incidents:write') && incident.status !== 'CLOSED' && (
          <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
            <IncidentActions incidentId={incident.id} currentStatus={incident.status} userRole={session.user.role} />
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Incident Details</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[#94A3B8] text-xs mb-1">Allegation Type</dt>
                <dd className="font-medium text-[#0F172A]">{incident.allegationType}</dd>
              </div>
              <div>
                <dt className="text-[#94A3B8] text-xs mb-1">Discovery Date</dt>
                <dd className="font-medium text-[#0F172A]">{incident.discoveryDate ? formatDate(incident.discoveryDate) : '—'}</dd>
              </div>
              <div>
                <dt className="text-[#94A3B8] text-xs mb-1">Reported Date</dt>
                <dd className="font-medium text-[#0F172A]">{formatDate(incident.reportedDate)}</dd>
              </div>
              <div>
                <dt className="text-[#94A3B8] text-xs mb-1">Investigator</dt>
                <dd className="font-medium text-[#0F172A]">{incident.investigator?.name ?? 'Unassigned'}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#94A3B8] text-xs mb-1">Description</dt>
                <dd className="text-[#0F172A] leading-relaxed">{incident.description}</dd>
              </div>
            </dl>
          </div>

          {/* Findings */}
          {incident.findings.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Investigation Findings</h2>
              {incident.findings.map(f => (
                <div key={f.id} className="border border-[#E2E8F0] rounded-lg p-4 mb-3 last:mb-0">
                  <p className="text-sm text-[#0F172A] mb-2">{f.summary}</p>
                  <p className="text-xs text-[#475569] mb-2"><strong>Recommendation:</strong> {f.recommendation}</p>
                  <p className="text-xs text-[#94A3B8]">{f.author} · {formatDate(f.findingDate)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Remediation */}
          {incident.remediations.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Remediation Actions</h2>
              <div className="space-y-3">
                {incident.remediations.map(r => (
                  <div key={r.id} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${r.status === 'COMPLETED' ? 'bg-green-500' : r.status === 'OVERDUE' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{r.action}</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">Due: {formatDate(r.dueDate)} · {r.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Timeline */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Audit Timeline</h2>
            {incident.auditLog.length === 0 ? (
              <p className="text-sm text-[#94A3B8]">No audit entries yet.</p>
            ) : (
              <div className="space-y-3">
                {incident.auditLog.map(entry => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#1D5FAB] shrink-0 mt-1" />
                      <div className="w-px flex-1 bg-[#E2E8F0] mt-1" />
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-[#0F172A]">{entry.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-[#475569]">{entry.actor.name} · {formatDate(entry.createdAt)}</p>
                      {entry.notes && <p className="text-xs text-[#94A3B8] mt-1">{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar panels */}
        <div className="space-y-4">
          {/* Penalty Calculator */}
          {penalty && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-[#B91C1C]" />
                <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Art. 14(3) Exposure</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">% of turnover</span>
                  <span className="font-mono font-semibold">{formatEUR(penalty.pctAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Flat max</span>
                  <span className="font-mono font-semibold">{formatEUR(penalty.flatAmount)}</span>
                </div>
                <div className="border-t border-[#E2E8F0] pt-2 flex justify-between">
                  <span className="font-semibold text-[#0F172A]">Max Penalty</span>
                  <span className="font-mono font-bold text-red-600">{formatEUR(penalty.maxPenalty)}</span>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  {incident.allegationType === 'Bribery' || incident.allegationType === 'Misappropriation'
                    ? 'Arts. 3-5: 5% / EUR 40M'
                    : 'Arts. 6,8,9: 3% / EUR 24M'}
                </p>
              </div>
            </div>
          )}

          {/* Disclosure panel */}
          {(incident.status === 'DISCLOSURE' || incident.disclosure) && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[#1D5FAB]" />
                <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Art. 16(d) Rapidity</h2>
              </div>
              {incident.discoveryDate && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Discovery</span>
                    <span className="font-mono text-xs">{formatDate(incident.discoveryDate)}</span>
                  </div>
                  {incident.disclosure?.decisionDate && (
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Decision</span>
                      <span className="font-mono text-xs">{formatDate(incident.disclosure.decisionDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Days elapsed</span>
                    <span className="font-mono font-semibold">
                      {incident.disclosure?.decisionDate
                        ? daysElapsed(incident.discoveryDate, incident.disclosure.decisionDate)
                        : daysElapsed(incident.discoveryDate)}d
                    </span>
                  </div>
                  {rapidity && (
                    <div className="pt-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${rapidityColour}`}>
                        {rapidity}
                      </span>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {rapidity === 'RAPID' ? '≤14 days — strong mitigation claim' : rapidity === 'PROMPT' ? '≤30 days — moderate mitigation' : '>30 days — limited mitigation'}
                      </p>
                    </div>
                  )}
                  {incident.disclosure?.ccoDecision && (
                    <div className="mt-2 pt-2 border-t border-[#F1F5F9]">
                      <span className="text-[#94A3B8] text-xs">CCO Decision: </span>
                      <span className={`text-xs font-semibold ${incident.disclosure.ccoDecision === 'DISCLOSE' ? 'text-green-700' : 'text-red-700'}`}>
                        {incident.disclosure.ccoDecision}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Key dates */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Key Dates</h2>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Reported', date: incident.reportedDate },
                { label: 'Triage', date: incident.triageDate },
                { label: 'Investigation', date: incident.investigationStartDate },
                { label: 'Findings', date: incident.findingsDate },
                { label: 'Closed', date: incident.closedDate },
              ].filter(d => d.date).map(d => (
                <div key={d.label} className="flex justify-between">
                  <span className="text-[#94A3B8]">{d.label}</span>
                  <span className="font-mono text-[#0F172A]">{formatDate(d.date!)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
