import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowWR from '@/components/diagrams/WorkflowWR'

export const metadata = { title: 'Whistleblower Reports Guide | Help | EU AC Compliance' }

export default function HelpWhistleblowerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-04: Whistleblower Reports (WR)
        </h1>
        <p className="text-sm text-[#475569] mt-1">Arts. 20-25 — Dir. 2019/1937 — FLS Restricted</p>
      </div>
      <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900">
        <strong>Access restriction — FLS:</strong> Whistleblower reports are restricted to First-Level Supervisors (FLS) and Compliance Officers only. Reporters are never identified to line management. Access logging is mandatory for all views of this module.
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Art. 11 requires confidential internal reporting channels. Art. 25 prohibits retaliation against whistleblowers. Dir. 2019/1937 applies in full — organisations must acknowledge within 7 days and provide feedback within 3 months.
      </div>

      <DiagramViewer title="WF-04 — WR Swimlane Diagram" filename="wf-04-wr">
        <WorkflowWR />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          'Submit → Reporter submits via confidential channel; identity protected by default; anonymous submission option available',
          'Acknowledged → System sends acknowledgement within 7-day SLA (Dir. 2019/1937 Art. 9); case assigned to CO',
          'Triage → CO assesses credibility and scope; determines whether to escalate to full investigation or close as unsubstantiated',
          'Investigation → Investigator conducts inquiry with strict information barrier; all access logged',
          'Feedback Sent → CO provides outcome feedback to reporter (within 3-month SLA) without disclosing third-party details',
          'Closed → Case archived; reporter retaliation monitoring period begins (12 months)',
        ].map((s, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C00000] text-white text-xs flex items-center justify-center shrink-0 font-bold">
              {i + 1}
            </span>
            <p>{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        <strong>SLA Reference (Dir. 2019/1937):</strong> Acknowledgement: 7 days · Feedback to reporter: 3 months · Retaliation monitoring: 12 months post-closure
      </div>
    </div>
  )
}
