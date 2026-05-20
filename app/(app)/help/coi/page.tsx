import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowCOI from '@/components/diagrams/WorkflowCOI'

export const metadata = { title: 'Conflicts of Interest Guide | Help | EU AC Compliance' }

export default function HelpCOIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-03: Conflict of Interest (COI)
        </h1>
        <p className="text-sm text-[#475569] mt-1">Annual declaration workflow — Art. 13</p>
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Art. 10 requires organisations to manage conflicts of interest that could facilitate corruption. Undisclosed conflicts that facilitate bribery attract criminal liability under Arts. 3-5. Recusal and firewall controls are the primary mitigations.
      </div>

      <DiagramViewer title="WF-03 — COI Swimlane Diagram" filename="wf-03-coi">
        <WorkflowCOI />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          ['Declare', 'Employee or manager submits COI declaration — outside interests, directorships, financial holdings, and personal relationships relevant to their role.'],
          ['Assess Severity', 'CO reviews declared interests against role responsibilities. Low-severity conflicts proceed to mitigation planning; high-severity conflicts escalate to CCO.'],
          ['Mitigation Plan', 'CO drafts a mitigation plan: recusal from specific decisions, information firewall, or divestment requirement.'],
          ['CCO Approve', 'CCO formally approves the mitigation plan and signs off. High-severity cases require board notification.'],
          ['Monitor', 'Conflict remains under active management. Periodic 90-day reviews scheduled automatically. Material changes trigger re-assessment.'],
          ['Closed', 'Conflict eliminated (divestment, role change). Record archived and contributes to Art. 16(c) evidence package.'],
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        <strong>Annual Cycle:</strong> All staff in scope must submit declarations annually and update within 30 days of any material change in interests.
      </div>
    </div>
  )
}
