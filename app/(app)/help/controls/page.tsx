import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowCTR from '@/components/diagrams/WorkflowCTR'

export const metadata = { title: 'Control Testing Guide | Help | EU AC Compliance' }

export default function HelpControlsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-06: Control Testing (CTR)
        </h1>
        <p className="text-sm text-[#475569] mt-1">Owner/tester segregation — Art. 13 — FR-25</p>
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Art. 13(2)(e) requires ongoing monitoring of compliance controls. FR-25 enforces mandatory segregation of duties: the control owner and the control tester must be different persons. This prevents self-certification and is an essential element of the Art. 16(c) evidence package.
      </div>

      <DiagramViewer title="WF-06 — CTR Swimlane Diagram" filename="wf-06-ctr">
        <WorkflowCTR />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          'Assigned → Control testing task assigned to tester (must differ from control owner per FR-25); testing period and methodology specified',
          'In Progress → Tester gathers evidence, samples transactions, and documents observations against control objectives',
          'Under Review → CO reviews testing workpapers, evidence sufficiency, and draft effectiveness rating',
          'Effective → Control rated effective; result recorded in CPA scoring (contributes to controlEffPct in FR-17)',
          'Remediation → Control rated ineffective; remediation action created in CIR sub-form; re-test scheduled within 90 days',
          'Closed → Testing cycle complete; results archived; next scheduled test date set based on risk rating',
        ].map((s, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#0891B2] text-white text-xs flex items-center justify-center shrink-0 font-bold">
              {i + 1}
            </span>
            <p>{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        <strong>FR-25 Segregation Rule:</strong> System enforces that tester ≠ owner at save. Attempts to self-certify are blocked and logged. CO can grant an exception with documented justification for controls with a single qualified person (rare).
      </div>
    </div>
  )
}
