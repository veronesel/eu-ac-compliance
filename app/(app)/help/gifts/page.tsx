import DiagramViewer from '@/components/diagrams/DiagramViewer'
import WorkflowGHR from '@/components/diagrams/WorkflowGHR'

export const metadata = { title: 'Gifts & Hospitality Guide | Help | EU AC Compliance' }

export default function HelpGiftsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          WF-02: Gift & Hospitality Register (GHR)
        </h1>
        <p className="text-sm text-[#475569] mt-1">5-stage workflow — Art. 7 — EUR 25 Threshold Routing</p>
      </div>
      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Regulatory basis:</strong> Art. 7 prohibits the offering, promising, or giving of advantages to public officials. Gifts ≤EUR 25 to private-sector counterparties are auto-approved. Any gift to a public official or exceeding EUR 25 requires CO review.
      </div>

      <DiagramViewer title="WF-02 — GHR Swimlane Diagram" filename="wf-02-ghr">
        <WorkflowGHR />
      </DiagramViewer>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 text-sm text-[#475569]">
        <h2 className="text-base font-bold text-[#0F172A]">Workflow Stages</h2>
        {[
          ['Submit', 'Employee records gift/hospitality: description, value in EUR, counterparty name, and whether the counterparty is a public official.'],
          ['Threshold Check', 'System evaluates: value ≤EUR 25 AND private-sector counterparty → auto-approve. Any other combination routes to CO.'],
          ['CO Review', 'Compliance Officer assesses gift appropriateness, business justification, and policy compliance. May approve or reject.'],
          ['CCO Approval', 'Required when counterparty is a public official, regardless of value. CCO has final approval authority.'],
          ['Archive', 'Outcome recorded in the register. Approved gifts feed into the CPA evidence base; rejected gifts trigger an audit log entry.'],
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
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-900">
          <p className="font-semibold mb-1">Auto-Approve Criteria</p>
          <ul className="space-y-0.5">
            <li>Value ≤ EUR 25.00</li>
            <li>Counterparty: private sector only</li>
            <li>Both conditions must be met</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-900">
          <p className="font-semibold mb-1">Always Requires CO Review</p>
          <ul className="space-y-0.5">
            <li>Any public official (any value)</li>
            <li>Value {'>'} EUR 25</li>
            <li>Hospitality events (any value)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
