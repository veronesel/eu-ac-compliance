export const metadata = { title: 'Scoring Formulas | Help | EU AC Compliance' }

export default function FormulasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Scoring Formulas Reference
        </h1>
        <p className="text-sm text-[#475569] mt-1">All quantitative formulas used in the compliance platform</p>
      </div>

      {/* Effectiveness Score */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Compliance Programme Effectiveness Score (FR-17)</h2>
        <div className="px-4 py-3 bg-[#0F1929] rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`score = (
  obligationCovPct  × 0.30 +
  policyAckPct      × 0.20 +
  trainingPct       × 0.25 +
  controlEffPct     × 0.25
) − min(openCritical × 5 + openHigh × 2, 30)

Range: 0 – 100
Green: ≥ 80 | Lime: 66–79 | Amber: 40–65 | Red: < 40`}</pre>
        </div>
        <p className="text-sm text-[#475569]">The penalty cap of 30 points prevents a single critical incident from wiping the entire score. Each critical open finding deducts 5 points; each high deducts 2 points.</p>
      </div>

      {/* Penalty Exposure */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Art. 14(3) Maximum Penalty Exposure (FR-16)</h2>
        <div className="px-4 py-3 bg-[#0F1929] rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`Arts. 3-5 (Bribery, Misappropriation):
  maxPenalty = MAX(turnover × 5%, EUR 40,000,000)

Arts. 6, 8, 9 (Other offences):
  maxPenalty = MAX(turnover × 3%, EUR 24,000,000)`}</pre>
        </div>
        <p className="text-sm text-[#475569]">The regulation takes whichever is higher: the percentage of worldwide annual turnover or the flat EUR amount. This protects against very large or very small organisations being under/over-penalised.</p>
      </div>

      {/* Rapidity */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Art. 16(d) Rapidity Classification (FR-21)</h2>
        <div className="px-4 py-3 bg-[#0F1929] rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`days = discoveryDate → disclosureDecisionDate

RAPID  : days ≤ 14  → Strong mitigation claim
PROMPT : days ≤ 30  → Moderate mitigation
DELAYED: days > 30  → Limited / no mitigation`}</pre>
        </div>
      </div>

      {/* GHR Routing */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">GHR EUR 25 Threshold Routing (FR-18)</h2>
        <div className="px-4 py-3 bg-[#0F1929] rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`IF isPublicOfficial:
  → CO review required (Art. 15(2)(f))
ELIF value > EUR 25:
  → Manager + CO review required
ELSE:
  → Manager review only → auto-approve`}</pre>
        </div>
      </div>

      {/* DDQ Score */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">DDQ Third-Party Risk Score (FR-15)</h2>
        <div className="px-4 py-3 bg-[#0F1929] rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`score = Σ(response[i] × weight[i]) / Σ(5 × weight[i]) × 100

Lower score = higher risk (responses are adverse indicators)
CRITICAL: < 40 | HIGH: 40-64 | MEDIUM: 65-79 | LOW: ≥ 80`}</pre>
        </div>
      </div>
    </div>
  )
}
