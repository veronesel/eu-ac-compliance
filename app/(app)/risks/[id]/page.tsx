import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/formulas'
import RiskEditForm from '@/components/modules/RiskEditForm'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Risk Detail | EU AC Compliance' }

function scoreLabel(s: number) {
  if (s >= 15) return { label: 'CRITICAL', style: 'text-purple-700 bg-purple-100' }
  if (s >= 9) return { label: 'HIGH', style: 'text-red-700 bg-red-100' }
  if (s >= 4) return { label: 'MEDIUM', style: 'text-amber-700 bg-amber-100' }
  return { label: 'LOW', style: 'text-slate-600 bg-slate-100' }
}

function HeatMap({ likelihood, impact, residualLikelihood, residualImpact }: {
  likelihood: number; impact: number; residualLikelihood: number; residualImpact: number
}) {
  const cellSize = 28
  const gridSize = 5
  const svgSize = cellSize * gridSize

  const cells = []
  for (let l = 5; l >= 1; l--) {
    for (let i = 1; i <= 5; i++) {
      const score = l * i
      const fill = score >= 15 ? '#EDE9FE' : score >= 9 ? '#FEE2E2' : score >= 4 ? '#FEF3C7' : '#F0FDF4'
      cells.push(
        <rect
          key={`${l}-${i}`}
          x={(i - 1) * cellSize}
          y={(5 - l) * cellSize}
          width={cellSize - 1}
          height={cellSize - 1}
          fill={fill}
          stroke="#E2E8F0"
          strokeWidth={0.5}
        />
      )
    }
  }

  const inherentX = (impact - 1) * cellSize + cellSize / 2
  const inherentY = (5 - likelihood) * cellSize + cellSize / 2
  const residualX = (residualImpact - 1) * cellSize + cellSize / 2
  const residualY = (5 - residualLikelihood) * cellSize + cellSize / 2

  return (
    <div className="flex items-start gap-6">
      <div>
        <svg width={svgSize} height={svgSize}>
          {cells}
          <circle cx={inherentX} cy={inherentY} r={8} fill="#F97316" opacity={0.9} />
          <circle cx={residualX} cy={residualY} r={8} fill="#22C55E" opacity={0.9} />
        </svg>
        <div className="flex items-center gap-4 mt-2 text-xs text-[#475569]">
          <span className="text-center w-full">Impact (1→5)</span>
        </div>
      </div>
      <div className="space-y-2 text-xs text-[#475569]">
        <p className="font-semibold text-[#0F172A] text-sm">Legend</p>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> Inherent (before controls)</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Residual (after controls)</div>
        <p className="mt-3 text-[#94A3B8]">Y-axis: Likelihood (1–5)<br />X-axis: Impact (1–5)</p>
      </div>
    </div>
  )
}

export default async function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect('/dashboard')

  const risk = await prisma.risk.findUnique({ where: { id } })
  if (!risk) notFound()

  const incidents = await prisma.incident.findMany({ where: { riskId: id }, select: { id: true, title: true, reference: true, severity: true } })

  const inherent = scoreLabel(risk.inherentScore)
  const residual = scoreLabel(risk.residualScore)
  const reduction = risk.inherentScore - risk.residualScore
  const canEdit = hasPermission(session.user.role, 'risks:write')

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/risks" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Risk Register
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{risk.category}</span>
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${risk.status === 'ACTIVE' ? 'bg-red-100 text-red-700' : risk.status === 'MITIGATED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {risk.status}
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {risk.title}
        </h1>
      </div>

      {/* About section */}
      <CollapsibleAbout title="About the Corruption Risk Register">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Corruption Risk Register (CRR) is the organisation&apos;s structured assessment of the corruption threats it faces. Each risk maps to one or more Directive offence categories (Arts. 3-9), carries inherent and residual risk scores, and is assigned to a named owner responsible for keeping controls current. The CRR is the evidence that the compliance programme is risk-based — a core Recital 29 adequacy criterion. Regulators contrast the CRR with the control landscape to assess whether controls are proportionate to the actual risks faced.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Use this record to: document the threat scenario, set inherent scores before controls, assess residual scores after controls, and link the current control measures. Review risk records at least annually or after any material incident in the same category.
        </p>
      </CollapsibleAbout>

      {/* Heat map */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Risk Heat Map</h2>
        <HeatMap
          likelihood={risk.likelihood}
          impact={risk.impact}
          residualLikelihood={risk.residualLikelihood}
          residualImpact={risk.residualImpact}
        />
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">Inherent Score</p>
          <p className="text-xs text-[#475569] mb-2">{risk.likelihood} × {risk.impact}</p>
          <span className={`inline-flex px-3 py-1 rounded-lg text-xl font-bold ${inherent.style}`}>
            {risk.inherentScore}
          </span>
          <p className="text-xs font-semibold mt-1 text-[#475569]">{inherent.label}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">Residual Score</p>
          <p className="text-xs text-[#475569] mb-2">{risk.residualLikelihood} × {risk.residualImpact}</p>
          <span className={`inline-flex px-3 py-1 rounded-lg text-xl font-bold ${residual.style}`}>
            {risk.residualScore}
          </span>
          <p className="text-xs font-semibold mt-1 text-[#475569]">{residual.label}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">Risk Reduction</p>
          <p className="text-xs text-[#475569] mb-2">{risk.inherentScore} − {risk.residualScore}</p>
          <span className={`inline-flex px-3 py-1 rounded-lg text-xl font-bold ${reduction > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {reduction}
          </span>
          <p className="text-xs font-semibold mt-1 text-[#475569]">points mitigated</p>
        </div>
      </div>

      {/* Current controls */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Current Controls</h2>
        <p className="text-sm text-[#0F172A] leading-relaxed">{risk.currentControls}</p>
        <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-xs text-[#94A3B8] mb-1">Owner</dt><dd className="font-medium text-[#0F172A]">{risk.owner}</dd></div>
          <div><dt className="text-xs text-[#94A3B8] mb-1">Review Date</dt><dd className="font-medium text-[#0F172A]">{formatDate(risk.reviewDate)}</dd></div>
        </div>
      </div>

      {/* Linked incidents */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">
          Linked Incidents <span className="ml-2 text-xs font-normal text-[#94A3B8]">({incidents.length})</span>
        </h2>
        {incidents.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No incidents linked to this risk.</p>
        ) : (
          <ul className="space-y-2">
            {incidents.map(inc => (
              <li key={inc.id} className="flex items-center gap-3 text-sm">
                <Link href={`/incidents/${inc.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">{inc.reference}</Link>
                <span className="text-[#0F172A]">{inc.title}</span>
                <span className={`ml-auto inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${inc.severity === 'CRITICAL' ? 'bg-purple-100 text-purple-700' : inc.severity === 'HIGH' ? 'bg-red-100 text-red-700' : inc.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {inc.severity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit form */}
      {canEdit ? (
        <RiskEditForm
          id={risk.id}
          category={risk.category}
          title={risk.title}
          description={risk.description}
          likelihood={risk.likelihood}
          impact={risk.impact}
          currentControls={risk.currentControls}
          residualLikelihood={risk.residualLikelihood}
          residualImpact={risk.residualImpact}
          owner={risk.owner}
          reviewDate={risk.reviewDate.toISOString().split('T')[0]}
          status={risk.status}
        />
      ) : (
        <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          Editing requires CO or CCO role.
        </div>
      )}
    </div>
  )
}
