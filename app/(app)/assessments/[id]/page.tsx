import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'
import { ArrowLeft } from 'lucide-react'
import AssessmentActions from '@/components/modules/AssessmentActions'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Assessment Detail | EU AC Compliance' }

function Recital29Checklist({
  obligationCovPct,
  trainingPct,
  controlEffPct,
  score,
  previousScore,
  isFirst,
}: {
  obligationCovPct: number | null
  trainingPct: number | null
  controlEffPct: number | null
  score: number | null
  previousScore: number | null
  isFirst: boolean
}) {
  function indicator(green: boolean, amber: boolean) {
    if (green) return { dot: 'bg-green-500', label: 'MET', style: 'text-green-700 bg-green-100' }
    if (amber) return { dot: 'bg-amber-400', label: 'PARTIAL', style: 'text-amber-700 bg-amber-100' }
    return { dot: 'bg-red-500', label: 'NOT MET', style: 'text-red-700 bg-red-100' }
  }

  const proportionality = indicator(
    (obligationCovPct ?? 0) >= 80,
    (obligationCovPct ?? 0) >= 60
  )
  const activeImpl = indicator(
    (trainingPct ?? 0) >= 75 && (controlEffPct ?? 0) >= 70,
    (trainingPct ?? 0) >= 50 || (controlEffPct ?? 0) >= 50
  )
  const contImprovement = !isFirst && score != null && previousScore != null && score > previousScore
    ? indicator(true, false)
    : !isFirst && score != null && previousScore != null
      ? indicator(false, false)
      : indicator(false, true)

  const criteria = [
    { label: 'Top-level commitment', desc: 'CCO signed off on programme', ind: indicator(true, false) },
    { label: 'Proportionality', desc: `Obligation coverage: ${obligationCovPct?.toFixed(0) ?? '—'}%`, ind: proportionality },
    { label: 'Active implementation', desc: `Training ${trainingPct?.toFixed(0) ?? '—'}% · Controls ${controlEffPct?.toFixed(0) ?? '—'}%`, ind: activeImpl },
    { label: 'Continuous improvement', desc: isFirst ? 'First assessment — baseline' : `Score: ${score ?? '—'} vs prior: ${previousScore ?? '—'}`, ind: contImprovement },
  ]

  return (
    <div className="space-y-3">
      {criteria.map(c => (
        <div key={c.label} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">{c.label}</p>
            <p className="text-xs text-[#475569] mt-0.5">{c.desc}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.ind.style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.ind.dot}`} />
            {c.ind.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function YearOnYearChart({ assessments }: { assessments: { period: string; effectivenessScore: number | null }[] }) {
  const signed = assessments.filter(a => a.effectivenessScore != null).sort((a, b) => a.period.localeCompare(b.period))
  if (signed.length === 0) return <p className="text-sm text-[#94A3B8]">No signed-off assessments to chart.</p>

  const max = 100
  const barWidth = 40
  const gap = 24
  const chartHeight = 120
  const svgWidth = signed.length * (barWidth + gap) + gap
  const svgHeight = chartHeight + 40

  return (
    <svg width={svgWidth} height={svgHeight} className="overflow-visible">
      {signed.map((a, i) => {
        const score = a.effectivenessScore!
        const barH = (score / max) * chartHeight
        const x = i * (barWidth + gap) + gap
        const y = chartHeight - barH
        const fill = score >= 80 ? '#16A34A' : score >= 66 ? '#D97706' : '#DC2626'
        return (
          <g key={a.period}>
            <rect x={x} y={y} width={barWidth} height={barH} fill={fill} rx={4} opacity={0.85} />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight="bold" fill={fill}>{score}</text>
            <text x={x + barWidth / 2} y={chartHeight + 16} textAnchor="middle" fontSize={10} fill="#64748B">{a.period}</text>
          </g>
        )
      })}
      <line x1={gap / 2} y1={chartHeight - (80 / max) * chartHeight} x2={svgWidth} y2={chartHeight - (80 / max) * chartHeight} stroke="#16A34A" strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
      <text x={gap / 2 - 2} y={chartHeight - (80 / max) * chartHeight - 3} fontSize={9} fill="#16A34A" textAnchor="end">≥80</text>
    </svg>
  )
}

export default async function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'assessments:read')) redirect('/dashboard')

  const assessment = await prisma.assessment.findUnique({ where: { id } })
  if (!assessment) notFound()

  const allAssessments = await prisma.assessment.findMany({
    where: { status: 'SIGNED_OFF', effectivenessScore: { not: null } },
    orderBy: { period: 'asc' },
    select: { id: true, period: true, effectivenessScore: true },
  })

  const currentIndex = allAssessments.findIndex(a => a.id === assessment.id)
  const isFirst = currentIndex === 0 || (currentIndex === -1 && allAssessments.length === 0)
  const previousScore = currentIndex > 0 ? allAssessments[currentIndex - 1].effectivenessScore : null

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/assessments" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Assessments
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{assessment.reference}</span>
          <StatusBadge status={assessment.status} />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Compliance Programme Assessment — {assessment.period}
        </h1>
      </div>

      {/* About section */}
      <CollapsibleAbout title="About the Compliance Programme Assessment">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Compliance Programme Assessment (CPA) is the annual evaluation of the organisation&apos;s anti-corruption programme effectiveness. It produces the primary Art. 16(c) evidence package — the document that demonstrates to regulators that the programme is genuine, proportionate, and actively implemented (Recital 29).
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The effectiveness score (0–100) is computed from four weighted inputs: Obligation Coverage (×30%), Policy Acknowledgement (×20%), Training Completion (×25%), and Control Effectiveness (×25%), minus a penalty for open CRITICAL (−5 pts each) and HIGH (−2 pts each) incidents. A score ≥80 supports a strong mitigation argument. Below 40, regulators are unlikely to accept the programme as genuine.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          CCO sign-off locks the assessment permanently. Once signed off, it cannot be amended — it is an evidential document. Use the notes field to record any material caveats, outstanding actions, or context that a regulator would need to understand the score.
        </p>
      </CollapsibleAbout>

      {/* Score overview */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Effectiveness Score</h2>
          {assessment.effectivenessScore != null && (
            <span className={`text-4xl font-bold font-mono ${assessment.effectivenessScore >= 80 ? 'text-green-700' : assessment.effectivenessScore >= 66 ? 'text-amber-600' : 'text-red-600'}`}>
              {assessment.effectivenessScore}
              <span className="text-lg text-[#94A3B8]">/100</span>
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Obligation Coverage (×0.30)', value: assessment.obligationCovPct },
            { label: 'Policy Acknowledgement (×0.20)', value: assessment.policyAckPct },
            { label: 'Training Completion (×0.25)', value: assessment.trainingPct },
            { label: 'Control Effectiveness (×0.25)', value: assessment.controlEffPct },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-[#475569] text-xs">{label}</span>
                <span className="font-semibold text-xs">{value?.toFixed(0) ?? '—'}%</span>
              </div>
              <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#1D5FAB]" style={{ width: `${value ?? 0}%` }} />
              </div>
            </div>
          ))}
        </div>
        {(assessment.openCriticalCount > 0 || assessment.openHighCount > 0) && (
          <div className="mt-4 pt-4 border-t border-[#F1F5F9] text-sm text-red-600">
            <strong>Penalty deduction:</strong> {assessment.openCriticalCount} critical (−{assessment.openCriticalCount * 5}pts) + {assessment.openHighCount} high (−{assessment.openHighCount * 2}pts) = −{assessment.scorePenalty}pts
          </div>
        )}
      </div>

      {/* Year-on-year trend */}
      {allAssessments.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Year-on-Year Score Trend</h2>
          <YearOnYearChart assessments={allAssessments} />
          <p className="text-xs text-[#94A3B8] mt-3">Green dashed line = ≥80 threshold for strong Art. 16(c) argument. Signed-off assessments only.</p>
        </div>
      )}

      {/* Recital 29 checklist */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-1">Recital 29 Adequacy Checklist</h2>
        <p className="text-xs text-[#94A3B8] mb-4">Four criteria a regulator will assess to determine whether the programme is genuine.</p>
        <Recital29Checklist
          obligationCovPct={assessment.obligationCovPct}
          trainingPct={assessment.trainingPct}
          controlEffPct={assessment.controlEffPct}
          score={assessment.effectivenessScore}
          previousScore={previousScore ?? null}
          isFirst={isFirst}
        />
      </div>

      {/* Art. 16(c) genuineness */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Art. 16(c) Genuineness Narrative</h2>
        <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-4">
          <strong>Recital 29:</strong> Programme must be genuine, duly assessed, and not mere window dressing.
        </div>
        {assessment.genuineness ? (
          <div className="bg-[#F8FAFC] rounded-lg p-4">
            <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">{assessment.genuineness}</p>
          </div>
        ) : (
          <p className="text-sm text-[#94A3B8] italic">No genuineness narrative recorded.</p>
        )}
      </div>

      {/* Key dates */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Key Dates</h2>
        <dl className="grid grid-cols-3 gap-4 text-sm">
          {[
            { label: 'CO Submitted', date: assessment.cocSubmitDate },
            { label: 'CCO Review', date: assessment.ccoReviewDate },
            { label: 'CCO Sign-off', date: assessment.ccoSignOffDate },
          ].map(({ label, date }) => (
            <div key={label}>
              <dt className="text-[#94A3B8] text-xs mb-1">{label}</dt>
              <dd className="font-mono text-sm">{date ? formatDate(date) : '—'}</dd>
            </div>
          ))}
        </dl>
      </div>

      {assessment.notes && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Notes</h2>
          <p className="text-sm text-[#475569] leading-relaxed">{assessment.notes}</p>
        </div>
      )}

      {hasPermission(session.user.role, 'assessments:signoff') && assessment.status === 'CCO_REVIEW' && (
        <AssessmentActions assessmentId={assessment.id} />
      )}
    </div>
  )
}
