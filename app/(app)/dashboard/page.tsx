import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateEffectivenessScore, formatDate, daysElapsed } from '@/lib/formulas'
import EffectivenessGauge from '@/components/dashboard/EffectivenessGauge'
import MetricCard from '@/components/dashboard/MetricCard'
import AlertFeed from '@/components/dashboard/AlertFeed'
import { IncidentTrendChart } from '@/components/dashboard/IncidentTrendChart'
import { AlertTriangle, Gift, Users, Search, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Dashboard | EU AC Compliance' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  // Fetch metrics
  const [
    incidents,
    openCriticalIncidents,
    openHighIncidents,
    pendingGifts,
    openCOIs,
    assessment,
    notifications,
    allIncidents,
  ] = await Promise.all([
    prisma.incident.count({ where: { status: { notIn: ['CLOSED'] } } }),
    prisma.incident.count({ where: { status: { notIn: ['CLOSED'] }, severity: 'CRITICAL' } }),
    prisma.incident.count({ where: { status: { notIn: ['CLOSED'] }, severity: 'HIGH' } }),
    prisma.gift.count({ where: { status: { in: ['PENDING_MANAGER', 'PENDING_CO'] } } }),
    prisma.cOI.count({ where: { status: { in: ['ACTIVE_MANAGED', 'PENDING_CO'] } } }),
    prisma.assessment.findFirst({ orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({
      where: { userId: session.user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.incident.findMany({ orderBy: { reportedDate: 'asc' } }),
  ])

  // Effectiveness score
  const score = assessment
    ? assessment.effectivenessScore ?? calculateEffectivenessScore({
        obligationCovPct: assessment.obligationCovPct ?? 0,
        policyAckPct: assessment.policyAckPct ?? 0,
        trainingPct: assessment.trainingPct ?? 0,
        controlEffPct: assessment.controlEffPct ?? 0,
        openCriticalCount: assessment.openCriticalCount,
        openHighCount: assessment.openHighCount,
      })
    : 74

  const scoreComponents = assessment ? {
    obligation: assessment.obligationCovPct ?? 80,
    policy: assessment.policyAckPct ?? 72,
    training: assessment.trainingPct ?? 68,
    control: assessment.controlEffPct ?? 76,
  } : { obligation: 80, policy: 72, training: 68, control: 76 }

  // Build monthly incident data for chart (last 6 months)
  const now = new Date()
  const monthData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
    const count = allIncidents.filter(inc => {
      const rd = new Date(inc.reportedDate)
      return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth()
    }).length
    return { month: label, incidents: count }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Compliance Dashboard
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Directive (EU) 2026/1021 — Programme Overview · FY 2026
        </p>
      </div>

      {/* Hero row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4">Programme Effectiveness</p>
          <EffectivenessGauge score={score} components={scoreComponents} />
          <p className="text-xs text-[#94A3B8] mt-2">CPA-2026-001 · Art. 16(c)</p>
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-4">
          <MetricCard
            label="Open Incidents"
            value={incidents}
            subtext={`${openCriticalIncidents} critical · ${openHighIncidents} high`}
            icon={<AlertTriangle size={20} />}
            colour="red"
            href="/incidents"
          />
          <MetricCard
            label="Pending Approvals"
            value={pendingGifts}
            subtext="Gift & Hospitality Register"
            icon={<Gift size={20} />}
            colour="amber"
            href="/gifts"
          />
          <MetricCard
            label="Active COIs"
            value={openCOIs}
            subtext="Managed / Pending assessment"
            icon={<Users size={20} />}
            colour="purple"
            href="/coi"
          />
          <MetricCard
            label="Training Completion"
            value={`${scoreComponents.training.toFixed(0)}%`}
            subtext="Policy acknowledgement 72%"
            icon={<TrendingUp size={20} />}
            colour="green"
            href="/assessments"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">Incident Trend (6 months)</h2>
          <IncidentTrendChart data={monthData} />
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">Score Components</h2>
          <div className="space-y-3">
            {[
              { label: 'Obligation Coverage', value: scoreComponents.obligation, weight: '30%' },
              { label: 'Policy Acknowledgement', value: scoreComponents.policy, weight: '20%' },
              { label: 'Training Completion', value: scoreComponents.training, weight: '25%' },
              { label: 'Control Effectiveness', value: scoreComponents.control, weight: '25%' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#475569]">{item.label}</span>
                  <span className="font-medium text-[#0F172A]">{item.value.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.value >= 80 ? '#15803D' : item.value >= 66 ? '#84cc16' : item.value >= 40 ? '#B45309' : '#B91C1C',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">Alerts & Notifications</h2>
          <AlertFeed notifications={notifications} />
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-4">Art. 16(c)/(d) Readiness</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#F0FDF4] rounded-lg border border-green-200">
              <div>
                <p className="text-sm font-medium text-green-800">Art. 16(c) Evidence Package</p>
                <p className="text-xs text-green-600 mt-0.5">CPA-2026-001 in CCO review · Score 74</p>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">READY</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FFFBEB] rounded-lg border border-amber-200">
              <div>
                <p className="text-sm font-medium text-amber-800">Art. 16(d) Voluntary Disclosures</p>
                <p className="text-xs text-amber-600 mt-0.5">CIR-2026-002 pending CCO decision</p>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">PENDING</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FEF2F2] rounded-lg border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-800">SLA Monitoring</p>
                <p className="text-xs text-red-600 mt-0.5">CIR-2026-001 investigation SLA breached</p>
              </div>
              <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">BREACH</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E2E8F0]">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Training Completion Gap</p>
                <p className="text-xs text-[#475569] mt-0.5">68% of target 90% — gap: 22pp</p>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">ACTION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
