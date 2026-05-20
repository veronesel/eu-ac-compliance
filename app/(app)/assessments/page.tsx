import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Compliance Assessments | EU AC Compliance' }

function Sparkline({ assessments }: { assessments: { period: string; effectivenessScore: number | null }[] }) {
  const signed = assessments.filter(a => a.effectivenessScore != null).sort((a, b) => a.period.localeCompare(b.period))
  if (signed.length < 2) return null

  const barW = 32
  const gap = 12
  const chartH = 60
  const svgW = signed.length * (barW + gap) + gap
  const svgH = chartH + 30

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Score Trend — Signed-off Assessments</p>
      <svg width={svgW} height={svgH}>
        {signed.map((a, i) => {
          const score = a.effectivenessScore!
          const barH = (score / 100) * chartH
          const x = i * (barW + gap) + gap
          const y = chartH - barH
          const fill = score >= 80 ? '#16A34A' : score >= 66 ? '#D97706' : '#DC2626'
          return (
            <g key={a.period}>
              <rect x={x} y={y} width={barW} height={barH} fill={fill} rx={3} opacity={0.8} />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fontWeight="bold" fill={fill}>{score}</text>
              <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={9} fill="#64748B">{a.period}</text>
            </g>
          )
        })}
        <line x1={gap / 2} y1={chartH - (80 / 100) * chartH} x2={svgW} y2={chartH - (80 / 100) * chartH} stroke="#16A34A" strokeWidth={1} strokeDasharray="3,2" opacity={0.4} />
      </svg>
    </div>
  )
}

export default async function AssessmentsPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'assessments:read')) redirect('/dashboard')

  const assessments = await prisma.assessment.findMany({ orderBy: { createdAt: 'desc' } })
  const signedOff = assessments.filter(a => a.status === 'SIGNED_OFF' && a.effectivenessScore != null)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map(a => ({ period: a.period, effectivenessScore: a.effectivenessScore }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>Compliance Programme Assessments</h1>
        <p className="text-sm text-[#475569] mt-1">Art. 16(c) — CPA · Annual effectiveness assessment</p>
      </div>

      {/* About */}
      <CollapsibleAbout title="About this Module">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Compliance Programme Assessments (CPA) are the annual evaluations required to generate the Art. 16(c) evidence package. Each assessment captures the programme&apos;s effectiveness score, the CCO&apos;s genuineness narrative (addressing the four Recital 29 adequacy criteria), and a signed-off record that can be produced in regulatory proceedings.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The score trend over multiple years demonstrates to regulators that the programme is continuously improving — a key element of the &apos;active implementation&apos; criterion. A single high-scoring assessment is less persuasive than a demonstrable upward trajectory.
        </p>
      </CollapsibleAbout>

      {/* Sparkline */}
      {signedOff.length >= 2 && <Sparkline assessments={signedOff} />}

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Period</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">CCO Sign-off</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {assessments.map(a => (
              <tr key={a.id} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <Link href={`/assessments/${a.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">{a.reference}</Link>
                </td>
                <td className="px-4 py-3 font-medium text-[#0F172A]">{a.period}</td>
                <td className="px-4 py-3 text-center">
                  {a.effectivenessScore != null ? (
                    <span className={`font-bold text-lg font-mono ${a.effectivenessScore >= 80 ? 'text-green-700' : a.effectivenessScore >= 66 ? 'text-amber-600' : 'text-red-600'}`}>
                      {a.effectivenessScore}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 text-xs text-[#475569]">{a.ccoSignOffDate ? formatDate(a.ccoSignOffDate) : a.signedOffBy ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-[#475569]">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/assessments/${a.id}`} className="text-xs text-[#1D5FAB] hover:underline font-medium">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
