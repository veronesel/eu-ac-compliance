import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowCPA from '@/components/diagrams/WorkflowCPA'

export const metadata = { title: 'Programme Assessment Guide | Help | EU AC Compliance' }

export default function HelpAssessmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-07: Compliance Programme Assessment (CPA)
        </h1>
        <p className="text-sm text-[#475569] mt-1">Annual assessment — Art. 16(c) — Recital 29</p>
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Art. 16(c) provides that a genuine and effective compliance programme is a mitigating factor in penalty assessment. Recital 29 clarifies that the programme must be adequate, proportionate, and actively implemented — not merely paper-based. The annual CPA produces the primary documentary evidence for this mitigation claim.
      </div>

      <DiagramViewer title="WF-07 — CPA Swimlane Diagram" filename="wf-07-cpa">
        <WorkflowCPA />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          'Draft → CO initiates annual CPA; system auto-populates current metrics: obligationCovPct, policyAckPct, trainingPct, controlEffPct, open findings',
          'CO Review → Compliance Officer reviews auto-calculated effectiveness score (FR-17), validates inputs, and adds narrative commentary on programme adequacy',
          'CCO Review → Chief Compliance Officer reviews the full assessment package, challenges findings, and determines overall programme rating',
          'Signed Off → CCO formally signs off the CPA; score and rating locked; Art. 16(c) evidence package generated as PDF with digital signature',
          'Archived → Signed CPA stored in immutable record; accessible for regulatory proceedings; feeds into next year\'s baseline',
        ].map((s, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C5922B] text-white text-xs flex items-center justify-center shrink-0 font-bold">
              {i + 1}
            </span>
            <p>{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        <strong>Score Bands (FR-17):</strong> Green ≥ 80 — Strong mitigation claim · Lime 66–79 — Moderate · Amber 40–65 — Weak · Red &lt; 40 — No mitigation claim; programme inadequate
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A] mb-2">Recital 29 Adequacy Criteria</h2>
        <p>The CPA narrative must address all four Recital 29 criteria to support an Art. 16(c) claim:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Top-level commitment — board and senior management tone</li>
          <li>Proportionality — programme scope matched to organisation size and risk profile</li>
          <li>Active implementation — training completion rates, control testing results</li>
          <li>Continuous improvement — findings from prior year addressed</li>
        </ul>
      </div>
    </div>
  )
}
