import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/formulas'
import Link from 'next/link'

export const metadata = { title: 'Art. 16(c) Evidence Package | EU AC Compliance' }

export default async function Art16cPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'reports:read')) redirect('/dashboard')

  const [assessment, controls, obligations] = await Promise.all([
    prisma.assessment.findFirst({ orderBy: { createdAt: 'desc' } }),
    prisma.control.findMany(),
    prisma.obligation.findMany(),
  ])

  const effectiveControls = controls.filter(c => c.testResult === 'EFFECTIVE').length
  const controlEffPct = controls.length > 0 ? Math.round((effectiveControls / controls.length) * 100) : 0
  const compliantObligations = obligations.filter(o => o.status === 'COMPLIANT').length
  const obligationCovPct = obligations.length > 0 ? Math.round((compliantObligations / obligations.length) * 100) : 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Art. 16(c) Evidence Package
          </h1>
          <p className="text-sm text-[#475569] mt-1">Directive (EU) 2026/1021 — Recital 29 — Genuineness documentation</p>
        </div>
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          Export to PDF — use browser print
        </div>
      </div>

      {/* Header note */}
      <div className="px-5 py-4 bg-blue-50 border border-blue-300 rounded-xl text-sm text-blue-900">
        <strong>Document Notice:</strong> This document constitutes the Art. 16(c) evidence package per Recital 29, Directive (EU) 2026/1021. Generated: {formatDate(new Date())}
      </div>

      {/* Section 1: Effectiveness Score */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>1. Programme Effectiveness Score</h2>
        {assessment ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-5xl font-bold font-mono text-[#1D5FAB]">{assessment.effectivenessScore ?? '—'}</p>
              <p className="text-sm text-[#475569] mt-1">Overall score / 100 · {assessment.period}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#94A3B8]">Obligation Coverage</span><span className="font-semibold">{assessment.obligationCovPct?.toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Policy Acknowledgement</span><span className="font-semibold">{assessment.policyAckPct?.toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Training Completion</span><span className="font-semibold">{assessment.trainingPct?.toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Control Effectiveness</span><span className="font-semibold">{assessment.controlEffPct?.toFixed(0)}%</span></div>
            </div>
          </div>
        ) : <p className="text-[#94A3B8]">No assessment on record.</p>}
      </div>

      {/* Section 2: Control Testing */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>2. Control Testing Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center"><p className="text-3xl font-bold text-green-700">{effectiveControls}</p><p className="text-xs text-[#475569]">Effective controls</p></div>
          <div className="text-center"><p className="text-3xl font-bold text-[#1D5FAB]">{controls.length}</p><p className="text-xs text-[#475569]">Total controls</p></div>
          <div className="text-center"><p className="text-3xl font-bold text-green-700">{controlEffPct}%</p><p className="text-xs text-[#475569]">Effectiveness rate</p></div>
        </div>
      </div>

      {/* Section 3: Obligation Coverage */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>3. Regulatory Obligation Coverage</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center"><p className="text-3xl font-bold text-green-700">{compliantObligations}</p><p className="text-xs text-[#475569]">Compliant</p></div>
          <div className="text-center"><p className="text-3xl font-bold text-[#1D5FAB]">{obligations.length}</p><p className="text-xs text-[#475569]">Total obligations</p></div>
          <div className="text-center"><p className="text-3xl font-bold">{obligationCovPct}%</p><p className="text-xs text-[#475569]">Coverage rate</p></div>
        </div>
      </div>

      {/* Section 4: Genuineness */}
      {assessment?.genuineness && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>4. Art. 16(c) Genuineness Statement</h2>
          <p className="text-sm text-[#0F172A] leading-relaxed">{assessment.genuineness}</p>
          {assessment.ccoSignOffDate && assessment.signedOffBy && (
            <div className="mt-4 pt-4 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
              Signed off by {assessment.signedOffBy} on {formatDate(assessment.ccoSignOffDate)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
