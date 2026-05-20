import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowCIR from '@/components/diagrams/WorkflowCIR'

export const metadata = { title: 'Incidents Guide | Help | EU AC Compliance' }

export default function HelpIncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-01: Corruption Incident Register (CIR)
        </h1>
        <p className="text-sm text-[#475569] mt-1">7-stage workflow — Arts. 4-9, 14(3), 16(c)/(d)</p>
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Arts. 4-9 define criminal offences. Art. 14(3) sets maximum penalties. Art. 16(c) requires genuine compliance programme evidence. Art. 16(d) incentivises rapid voluntary disclosure (RAPID ≤14d earns mitigation credit).
      </div>

      <DiagramViewer title="WF-01 — CIR Swimlane Diagram" filename="wf-01-cir">
        <WorkflowCIR />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          ['Draft', 'Initial report captured by CO or employee. Fields: nature of offence (Arts. 4-9), parties, estimated value.'],
          ['Triage', 'CO assesses substantiation and assigns a severity rating. SLA: 5 business days. Unsubstantiated cases are closed with rationale.'],
          ['Investigation', 'CONF_INV investigator assigned. Gathers evidence, interviews witnesses. SLA: 30 days. Produces Investigation Finding record.'],
          ['Findings Review', 'CO reviews investigative conclusions and signs off. Triggers Disclosure Decision stage.'],
          ['Disclosure Decision', 'CCO decides on voluntary disclosure to competent authority (Art. 16(d)). SLA: 14 days from decision date. Classification: RAPID ≤14d, PROMPT ≤30d, DELAYED >30d.'],
          ['Remediation', 'CO tracks remediation actions to prevent recurrence. SLA: 90 days. Generates Art. 16(c) evidence.'],
          ['Closed', 'All findings and remediations complete. Case archived and contributes to CPA score.'],
        ].map(([stage, desc], i) => (
          <div key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#1D5FAB] text-white text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-[#0F172A]">{stage}</p>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">SLA Reference</p>
          <ul className="space-y-0.5">
            <li>Triage: 5 business days</li>
            <li>Investigation: 30 days</li>
            <li>Disclosure decision: 14 days</li>
            <li>Remediation: 90 days</li>
          </ul>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-sm text-purple-900">
          <p className="font-semibold mb-1">Art. 14(3) Penalty Exposure</p>
          <ul className="space-y-0.5">
            <li>Arts. 3-5: MAX(5% turnover, EUR 40M)</li>
            <li>Arts. 6,8,9: MAX(3% turnover, EUR 24M)</li>
            <li>Rapid voluntary disclosure → mitigation</li>
            <li>Genuine programme → Art. 16(c) defence</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
