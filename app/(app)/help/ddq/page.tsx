import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowDDQ from '@/components/diagrams/WorkflowDDQ'

export const metadata = { title: 'Due Diligence Guide | Help | EU AC Compliance' }

export default function HelpDDQPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-05: Third-Party Due Diligence (DDQ)
        </h1>
        <p className="text-sm text-[#475569] mt-1">Risk-tiered screening — Art. 13</p>
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Art. 12 requires organisations to screen third parties (agents, intermediaries, JV partners, suppliers in high-risk jurisdictions) as part of an adequate compliance programme. Tier assignment determines questionnaire depth and review frequency. HIGH risk third parties require enhanced due diligence and CCO sign-off.
      </div>

      <DiagramViewer title="WF-05 — DDQ Swimlane Diagram" filename="wf-05-ddq">
        <WorkflowDDQ />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          'Draft → Business owner initiates DDQ for new or renewal third-party; risk tier pre-assigned based on jurisdiction, sector, and contract value',
          'Sent → DDQ questionnaire dispatched to third party via secure portal; 21-day response deadline',
          'Received → Third party responses recorded; automated risk score calculated (FR-15)',
          'CO Review → Compliance Officer reviews score, adverse media, sanctions screening, and PEP checks',
          'Approved → CO approves engagement; third party registered in TPR with next review date',
          'Enhanced Due Diligence → CRITICAL or HIGH risk triggers additional document requests, site visits, or legal opinion; CCO sign-off required',
        ].map((s, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#6A3EA1] text-white text-xs flex items-center justify-center shrink-0 font-bold">
              {i + 1}
            </span>
            <p>{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-sm text-purple-900">
        <strong>Risk Tiers (FR-15):</strong> CRITICAL: score &lt; 40 — CCO sign-off + enhanced DD · HIGH: 40–64 — CO sign-off + additional checks · MEDIUM: 65–79 — Standard CO review · LOW: ≥ 80 — Manager approval only
      </div>
    </div>
  )
}
