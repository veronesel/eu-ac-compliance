import Link from 'next/link'

export const metadata = { title: 'User Guide | Help | EU AC Compliance' }

// ── Reusable primitives ──────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[#1D5FAB] text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {n}
      </div>
      <div className="flex-1 pb-6 border-b border-[#F1F5F9] last:border-0 last:pb-0">
        <p className="font-semibold text-[#0F172A] mb-1">{title}</p>
        <div className="text-sm text-[#475569] space-y-1">{children}</div>
      </div>
    </div>
  )
}

function Scenario({
  id, colour, label, role, title, children,
}: {
  id: string; colour: string; label: string; role: string; title: string; children: React.ReactNode
}) {
  return (
    <div id={id} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className={`px-5 py-3 flex items-center justify-between ${colour}`}>
        <div>
          <p className="font-bold text-[#0F172A] text-sm">{title}</p>
          <p className="text-xs text-[#475569] mt-0.5">{label}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-[#0F172A]">
          {role}
        </span>
      </div>
      <div className="p-5 space-y-0">{children}</div>
    </div>
  )
}

function Note({ colour, children }: { colour: 'blue' | 'amber' | 'green' | 'red' | 'purple'; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    blue:   'bg-blue-50 border-blue-200 text-blue-900',
    amber:  'bg-amber-50 border-amber-200 text-amber-900',
    green:  'bg-green-50 border-green-200 text-green-900',
    red:    'bg-red-50 border-red-200 text-red-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
  }
  return (
    <div className={`mt-4 px-4 py-3 rounded-lg border text-sm ${styles[colour]}`}>
      {children}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────

export default function HelpGuidePage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Step-by-Step User Guide
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          End-to-end walkthroughs for every compliance scenario — from first login to annual assessment sign-off.
        </p>
      </div>

      {/* Quick-jump TOC */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">Scenarios in this guide</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          {[
            ['#login',      'Getting started & role selection'],
            ['#dashboard',  'Reading the dashboard'],
            ['#ghr',        'Recording a gift or hospitality'],
            ['#cir',        'Registering a corruption incident'],
            ['#coi',        'Declaring a conflict of interest'],
            ['#wr',         'Submitting a whistleblower report'],
            ['#ddq',        'Onboarding a third party (DDQ)'],
            ['#ctr',        'Testing a compliance control'],
            ['#cpa',        'Completing the annual assessment'],
          ].map(([href, label]) => (
            <a key={href} href={href}
              className="text-[#1D5FAB] hover:underline flex items-center gap-1.5">
              <span className="text-[#94A3B8]">→</span>{label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Scenario 0: Login ─────────────────────────────────────── */}
      <div id="login" className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3 bg-[#0F1929]">
          <p className="font-bold text-white text-sm">Getting Started — First Login</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">All roles · /login</p>
        </div>
        <div className="p-5 space-y-0">
          <Step n={1} title="Open the platform">
            <p>Navigate to the platform URL. You are redirected automatically to <code className="bg-slate-100 px-1 rounded">/login</code>.</p>
          </Step>
          <Step n={2} title="Select your demo role">
            <p>The login screen shows seven demo accounts, each representing a different organisational role:</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                ['CCO',          'Sofia Martins',  'Full read/write + sign-off authority. Sees penalty exposure, programme score, all incidents.'],
                ['CO',           'Marcus Weber',   'Day-to-day compliance operations. Reviews gifts, incidents, COIs, controls, DDQs.'],
                ['LINE_MANAGER', 'Hana Novák',     'Declares COIs, approves gifts from direct reports, monitors team obligations.'],
                ['EMPLOYEE',     'Luca Bianchi',   'Submits gifts and COI declarations. Raises incidents. Read-only on most modules.'],
                ['CONF_INV',     'Ingrid Larsen',  'Confidential investigator. Full access to whistleblower reporter identity (FLS).'],
                ['AUDIT',        'Daniel Ferreira', 'Read-only across all modules for independent audit purposes.'],
                ['SCHEDULER',    'Petra Meijer',   'Manages scheduling of control tests and assessment cycles.'],
              ].map(([role, name, desc]) => (
                <div key={role} className="rounded-lg border border-[#E2E8F0] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1D5FAB]">{role}</span>
                    <span className="text-xs text-[#475569]">{name}</span>
                  </div>
                  <p className="text-xs text-[#475569]">{desc}</p>
                </div>
              ))}
            </div>
          </Step>
          <Step n={3} title="Sign in">
            <p>Click the account row to select it, then press <strong>Sign in as [Name]</strong>. All accounts use the password <code className="bg-slate-100 px-1 rounded">demo123</code>. You are taken to <code className="bg-slate-100 px-1 rounded">/dashboard</code>.</p>
          </Step>
          <Step n={4} title="Switch roles at any time">
            <p>Click your name in the top-right menu and select <strong>Sign out</strong> to return to the login screen and pick a different role. This is the primary way to experience the platform from different perspectives.</p>
          </Step>
        </div>
      </div>

      {/* ── Scenario 1: Dashboard ─────────────────────────────────── */}
      <div id="dashboard" className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <p className="font-bold text-[#0F172A] text-sm">Reading the Dashboard</p>
            <p className="text-xs text-[#475569] mt-0.5">Best viewed as CCO or CO · /dashboard</p>
          </div>
        </div>
        <div className="p-5 space-y-0">
          <Step n={1} title="Effectiveness Gauge (top-left)">
            <p>The arc gauge shows the current <strong>Compliance Programme Effectiveness Score</strong> (0–100). Colour bands: <span className="text-red-600 font-medium">Red &lt;40</span> — no Art. 16(c) defence; <span className="text-amber-600 font-medium">Amber 40–65</span> — weak; <span className="text-lime-600 font-medium">Lime 66–79</span> — moderate; <span className="text-green-600 font-medium">Green ≥80</span> — strong mitigation claim. The score is recalculated live from four inputs: obligation coverage, policy acknowledgement, training completion, and control effectiveness, minus a penalty for open critical/high findings.</p>
          </Step>
          <Step n={2} title="KPI metric cards (top row)">
            <p>Four cards show: <strong>Open Incidents</strong> (CIR in non-closed stages), <strong>Pending Gifts</strong> (GHR awaiting CO/CCO review), <strong>Active COIs</strong> (conflicts under management), and <strong>Overdue DDQs</strong> (third parties past their refresh date). Red badges flag items needing immediate attention.</p>
          </Step>
          <Step n={3} title="Incident trend chart (centre)">
            <p>A bar chart shows new CIR incidents per month over the last six months. A rising trend signals an increased corruption risk or improved detection — the narrative matters. Click any bar to filter the incidents list.</p>
          </Step>
          <Step n={4} title="Alert feed (right column)">
            <p>Notifications from the system: SLA breaches, pending approvals, and overdue reviews. Click any alert to navigate directly to the relevant record. Alerts are role-filtered — a CO sees CO-specific items, a CCO sees all.</p>
          </Step>
          <Step n={5} title="Navigation sidebar">
            <p>The left sidebar groups modules by function. <strong>Operational</strong> (Incidents, Gifts, COI, Whistleblower, Due Diligence) covers day-to-day events. <strong>Programme</strong> (Controls, Assessment) covers the assurance layer. <strong>Reference</strong> (Obligations, Risks) covers the normative framework. Press <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono">?</kbd> anywhere to open this help panel.</p>
          </Step>
        </div>
      </div>

      {/* ── Scenario 2: GHR ───────────────────────────────────────── */}
      <Scenario id="ghr" colour="bg-green-50 border-b border-green-200"
        label="WF-02 · /gifts/new · Art. 7"
        role="EMPLOYEE → CO → CCO"
        title="Recording a Gift or Hospitality (GHR)">
        <Step n={1} title="Open the new gift form">
          <p>Sign in as <strong>EMPLOYEE (Luca Bianchi)</strong>. In the sidebar, click <strong>Gifts & Hospitality</strong>, then <strong>New Gift</strong> (top-right button).</p>
        </Step>
        <Step n={2} title="Complete the mandatory fields">
          <p>Fill in: <strong>Description</strong> (what the gift/hospitality is), <strong>Value (EUR)</strong> (the monetary equivalent), <strong>Counterparty name</strong> (who gave or received it), and <strong>Direction</strong> (Received or Given). The value field drives the threshold indicator.</p>
        </Step>
        <Step n={3} title="Observe the EUR 25 threshold indicator">
          <p>A progress bar below the value field turns green when the value is ≤EUR 25. As you type, the <strong>Routing Preview</strong> panel on the right updates in real time to show whether this gift will be auto-approved or routed to CO review.</p>
        </Step>
        <Step n={4} title="Flag public official involvement">
          <p>If the counterparty is a public official (politician, civil servant, regulator, state-owned enterprise employee), check <strong>Involves a public official</strong>. This immediately routes the gift to CO review regardless of value and shows a red banner — Art. 7 applies.</p>
        </Step>
        <Step n={5} title="Submit">
          <p>Click <strong>Submit</strong>. The system evaluates the routing rule: if value ≤EUR 25 and no public official, the gift is auto-approved and archived. Otherwise, a notification is sent to the CO.</p>
        </Step>
        <Step n={6} title="CO approves or rejects (sign in as CO)">
          <p>Sign out and sign in as <strong>CO (Marcus Weber)</strong>. Navigate to <strong>Gifts & Hospitality</strong>. The new gift appears with status <em>Pending CO Review</em>. Open it, review the details, then use the <strong>Approve</strong> or <strong>Reject</strong> action button. Add a justification note.</p>
        </Step>
        <Step n={7} title="CCO approval (public official only)">
          <p>If the gift involves a public official, after CO approval it moves to <em>Pending CCO Approval</em>. Sign in as <strong>CCO (Sofia Martins)</strong> and repeat the approval step. The CCO has final authority on all public-official gifts.</p>
        </Step>
        <Note colour="amber">
          <strong>Art. 7 reminder:</strong> Offering, promising, or giving any advantage to a public official — even below EUR 25 — can constitute the offence of active bribery. When in doubt, always require CO review.
        </Note>
      </Scenario>

      {/* ── Scenario 3: CIR ───────────────────────────────────────── */}
      <Scenario id="cir" colour="bg-orange-50 border-b border-orange-200"
        label="WF-01 · /incidents/new · Arts. 4-9, 14(3), 16(c)/(d)"
        role="CO / EMPLOYEE → CONF_INV → CCO"
        title="Registering a Corruption Incident (CIR)">
        <Step n={1} title="Create a new incident">
          <p>Sign in as <strong>CO (Marcus Weber)</strong>. Navigate to <strong>Incidents</strong> → <strong>New Incident</strong>. An incident should be registered as soon as there is a reasonable suspicion of a corruption offence under Arts. 4-9.</p>
        </Step>
        <Step n={2} title="Classify the offence type">
          <p>Select the applicable Article(s): <strong>Art. 4</strong> (active bribery of public official), <strong>Art. 5</strong> (passive bribery), <strong>Art. 6</strong> (bribery in the private sector), <strong>Art. 7</strong> (trading in influence), <strong>Art. 8</strong> (misappropriation), or <strong>Art. 9</strong> (obstruction of justice). This determines the maximum penalty exposure (Art. 14(3)) shown in the detail view.</p>
        </Step>
        <Step n={3} title="Complete the incident details">
          <p>Enter: <strong>Summary</strong> (factual description), <strong>Discovery date</strong> (when the organisation first became aware), <strong>Parties involved</strong>, and <strong>Estimated value at risk</strong>. Set the severity (LOW / MEDIUM / HIGH / CRITICAL).</p>
        </Step>
        <Step n={4} title="Triage the incident (CO)">
          <p>The incident is created in <em>Draft</em> status. Open it and click <strong>Start Triage</strong>. You have a 5-day SLA. Review whether the report is substantiated. If unsubstantiated, close with rationale. If substantiated, assign an investigator and move to <em>Investigation</em>.</p>
        </Step>
        <Step n={5} title="Investigation phase (sign in as CONF_INV)">
          <p>Sign in as <strong>CONF_INV (Ingrid Larsen)</strong>. The assigned incident appears in your queue. Open it and use <strong>Add Finding</strong> to record evidence, witness accounts, and conclusions. The 30-day SLA countdown is shown at the top of the page. When complete, click <strong>Submit Findings</strong>.</p>
        </Step>
        <Step n={6} title="Findings review (CO)">
          <p>Sign back in as <strong>CO</strong>. The incident is now in <em>Findings Review</em>. Review the investigator's conclusions. Click <strong>Approve Findings</strong> to advance to the Disclosure Decision stage.</p>
        </Step>
        <Step n={7} title="Disclosure decision (CCO)">
          <p>Sign in as <strong>CCO (Sofia Martins)</strong>. The incident requires a disclosure decision: will the organisation voluntarily disclose to the competent authority? The <strong>Art. 16(d) Rapidity Timer</strong> is running — a decision within 14 days earns <em>RAPID</em> classification (strongest mitigation). Click <strong>Decide: Disclose</strong> or <strong>Decide: No Disclosure</strong> with a documented rationale.</p>
        </Step>
        <Step n={8} title="Remediation tracking (CO)">
          <p>Back as CO, open the incident in <em>Remediation</em>. Click <strong>Add Remediation Action</strong> for each corrective measure (policy update, disciplinary action, process change, training). Track completion status. The 90-day SLA applies. When all actions are complete, the CCO can close the case.</p>
        </Step>
        <Step n={9} title="Observe the Penalty Calculator">
          <p>On any open incident detail page, scroll to the <strong>Penalty Exposure</strong> panel. It calculates: <em>MAX(turnover × %, EUR flat cap)</em> based on the offence article and the organisation's turnover. This figure is the maximum fine the organisation could face without mitigation.</p>
        </Step>
        <Note colour="red">
          <strong>Art. 14(3) penalty bands:</strong> Arts. 3-5 (bribery of public officials) — MAX(5% global turnover, EUR 40M). Arts. 6, 8, 9 — MAX(3% global turnover, EUR 24M). Voluntary disclosure and a genuine compliance programme (Art. 16(b)/(c)) are the primary mitigation levers.
        </Note>
      </Scenario>

      {/* ── Scenario 4: COI ───────────────────────────────────────── */}
      <Scenario id="coi" colour="bg-blue-50 border-b border-blue-200"
        label="WF-03 · /coi/new · Art. 10"
        role="EMPLOYEE / LINE_MANAGER → CO → CCO"
        title="Declaring a Conflict of Interest (COI)">
        <Step n={1} title="Navigate to COI and create a declaration">
          <p>Sign in as <strong>EMPLOYEE (Luca Bianchi)</strong>. Click <strong>Conflicts of Interest</strong> in the sidebar, then <strong>New Declaration</strong>. COI declarations should be submitted annually and within 30 days of any material change.</p>
        </Step>
        <Step n={2} title="Describe the conflict">
          <p>Select the <strong>Type</strong> (Financial Interest, Personal Relationship, Outside Directorship, Former Employment, Other). Write a clear description of the interest and explain how it relates to your current role and responsibilities.</p>
        </Step>
        <Step n={3} title="Identify affected decisions">
          <p>List the types of organisational decisions where this interest could compromise your independent judgment (e.g. procurement decisions, hiring of a relative, approval of a counterparty transaction).</p>
        </Step>
        <Step n={4} title="Submit the declaration">
          <p>Click <strong>Submit</strong>. The CO receives a notification. The declaration is in <em>Submitted</em> status.</p>
        </Step>
        <Step n={5} title="CO assesses severity (sign in as CO)">
          <p>Sign in as <strong>CO (Marcus Weber)</strong>. Open the COI from the queue. Assess whether it is LOW or HIGH severity. LOW conflicts proceed directly to a mitigation plan. HIGH conflicts escalate to the CCO for direct involvement.</p>
        </Step>
        <Step n={6} title="Draft a mitigation plan">
          <p>As CO, click <strong>Add Mitigation Plan</strong>. Select the control type: <strong>Recusal</strong> (the declarant steps back from specific decisions), <strong>Information Firewall</strong> (they are excluded from relevant information flows), or <strong>Divestment</strong> (they dispose of the conflicting interest). Document the scope precisely.</p>
        </Step>
        <Step n={7} title="CCO approval (HIGH severity)">
          <p>For HIGH severity conflicts, the mitigation plan requires CCO sign-off. Sign in as <strong>CCO</strong>. Review the plan. If satisfied, click <strong>Approve Mitigation</strong>. The conflict moves to <em>Active — Managed</em> status.</p>
        </Step>
        <Step n={8} title="Monitor and close">
          <p>The system schedules a 90-day review automatically. When the conflict is resolved (divestment completed, role changed, relationship ended), the CO marks it <em>Closed</em>. Closed COIs are retained for Art. 16(c) evidence.</p>
        </Step>
        <Note colour="blue">
          <strong>Art. 10:</strong> An undisclosed conflict of interest that facilitates a bribery offence under Arts. 3-5 can be treated as an aggravating factor in sentencing. Declaration is the first line of defence.
        </Note>
      </Scenario>

      {/* ── Scenario 5: WR ────────────────────────────────────────── */}
      <Scenario id="wr" colour="bg-red-50 border-b border-red-200"
        label="WF-04 · /whistleblower/report (public) · Art. 11"
        role="Anonymous → CONF_INV → CO"
        title="Submitting a Whistleblower Report (WR)">
        <Step n={1} title="Access the anonymous reporting channel">
          <p>The whistleblower intake form at <code className="bg-slate-100 px-1 rounded">/whistleblower/report</code> is publicly accessible — no login required. Staff, contractors, and third parties can submit without revealing their identity. This URL can be published on the organisation's intranet or compliance portal.</p>
        </Step>
        <Step n={2} title="Describe the concern">
          <p>The reporter fills in: <strong>Nature of concern</strong> (free text), <strong>Parties involved</strong>, <strong>When it occurred</strong>, and <strong>Any supporting evidence</strong> (document references). The reporter can optionally provide contact details for follow-up — but the system masks this identity from all roles except CONF_INV.</p>
        </Step>
        <Step n={3} title="Observe the FLS mask (sign in as CO or CCO)">
          <p>Sign in as <strong>CO</strong> or <strong>CCO</strong> and navigate to <strong>Whistleblower Reports</strong>. The reporter's name and contact fields are displayed as <strong>████████</strong> with a lock icon. This is the First-Level Sensitivity (FLS) protection — only CONF_INV can see the actual identity.</p>
        </Step>
        <Step n={4} title="Acknowledge receipt (CONF_INV, 7-day SLA)">
          <p>Sign in as <strong>CONF_INV (Ingrid Larsen)</strong>. Open the report. Click <strong>Acknowledge Receipt</strong> within 7 days (Dir. 2019/1937, Art. 9). An automated acknowledgement is sent to the reporter if contact details were provided. The case moves to <em>Acknowledged</em>.</p>
        </Step>
        <Step n={5} title="Investigate (CONF_INV, 30-day SLA)">
          <p>The CONF_INV conducts the investigation with a strict information barrier. All access to the report is logged. Use <strong>Add Investigation Note</strong> to document findings. If the concern is substantiated, click <strong>Escalate to CIR</strong> — this creates a linked Corruption Incident Register entry for formal case management.</p>
        </Step>
        <Step n={6} title="Close and notify reporter">
          <p>Once the investigation is complete, click <strong>Close Case</strong>. Select the outcome: <em>Substantiated</em> (escalated to CIR), <em>Unsubstantiated</em>, or <em>Resolved internally</em>. The system sends an anonymised outcome notification to the reporter within the 3-month feedback SLA.</p>
        </Step>
        <Note colour="red">
          <strong>FLS restriction:</strong> Reporter identity is visible only to CONF_INV. Any attempt to identify a reporter through indirect means or to retaliate against a reporter is prohibited under Art. 25. All access to WR records is audit-logged.
        </Note>
      </Scenario>

      {/* ── Scenario 6: DDQ ───────────────────────────────────────── */}
      <Scenario id="ddq" colour="bg-purple-50 border-b border-purple-200"
        label="WF-05 · /ddq · Art. 12"
        role="CO → Third Party → CO → CCO"
        title="Onboarding a Third Party (DDQ)">
        <Step n={1} title="Navigate to Due Diligence">
          <p>Sign in as <strong>CO (Marcus Weber)</strong>. Click <strong>Due Diligence</strong> in the sidebar. You see the Third-Party Registry with all known counterparties and their current DDQ status.</p>
        </Step>
        <Step n={2} title="Understand the risk tiers">
          <p>Each third party is assigned a risk tier based on jurisdiction, sector, and contract value: <strong>CRITICAL</strong> (score &lt;40) — enhanced DD + CCO sign-off; <strong>HIGH</strong> (40–64) — CO sign-off + extra checks; <strong>MEDIUM</strong> (65–79) — standard CO review; <strong>LOW</strong> (≥80) — manager approval. The tier determines the depth of questioning and review frequency.</p>
        </Step>
        <Step n={3} title="Open a third-party profile">
          <p>Click any third party to open their DDQ profile. The profile shows: registered name, jurisdiction, sector, assigned risk tier, DDQ completion status, all previous questionnaire responses, and the next scheduled review date.</p>
        </Step>
        <Step n={4} title="Send the DDQ questionnaire">
          <p>If the DDQ status is <em>Pending</em> or <em>Overdue</em>, click <strong>Send DDQ</strong>. The system dispatches the questionnaire to the third party's registered contact with a 14-day deadline. The status changes to <em>Sent</em>.</p>
        </Step>
        <Step n={5} title="Review completed responses (CO)">
          <p>When the third party completes the DDQ, the status changes to <em>Received</em>. The CO opens the profile and reviews each section: ownership structure, PEP connections, sanctions screening, anti-bribery controls, and past incidents. The system calculates a risk score from the responses.</p>
        </Step>
        <Step n={6} title="Record the verdict">
          <p>Based on the review, click <strong>Approve</strong> (low risk — engagement can proceed) or <strong>Reject / Block</strong> (high risk — escalate to CCO and suspend the relationship). For CRITICAL-tier third parties, CCO must counter-sign the approval.</p>
        </Step>
        <Step n={7} title="Monitor ongoing compliance">
          <p>Approved third parties are re-queued for annual review automatically. The dashboard's <em>Overdue DDQs</em> card flags any counterparty whose refresh is past due. HIGH-risk third parties require a 6-month review cycle.</p>
        </Step>
        <Note colour="purple">
          <strong>Art. 12:</strong> Inadequate third-party screening — particularly for agents, intermediaries, and JV partners in high-risk jurisdictions — is a common aggravating factor when regulators assess whether a compliance programme was genuine.
        </Note>
      </Scenario>

      {/* ── Scenario 7: CTR ───────────────────────────────────────── */}
      <Scenario id="ctr" colour="bg-cyan-50 border-b border-cyan-200"
        label="WF-06 · /controls · Art. 13(2)(e)"
        role="SCHEDULER → Control Owner → CO → Internal Auditor"
        title="Testing a Compliance Control (CTR)">
        <Step n={1} title="Navigate to Controls">
          <p>Sign in as <strong>CO (Marcus Weber)</strong>. Click <strong>Controls</strong> in the sidebar. The list shows all compliance controls with their effectiveness status, last test date, and next scheduled test date.</p>
        </Step>
        <Step n={2} title="Open a control record">
          <p>Click any control to open its detail page. You see: the control description, the regulatory obligation it supports, the owner, the tester, the control type (Preventive / Detective / Corrective), and all historical test results.</p>
        </Step>
        <Step n={3} title="Understand the segregation of duties rule (FR-25)">
          <p>The <strong>control owner</strong> (the person who operates the control in day-to-day work) must be a <strong>different person</strong> from the <strong>control tester</strong> (who evaluates its effectiveness). If you attempt to assign the same person to both roles, the system blocks the save and displays a warning. This prevents self-certification, which regulators treat as a red flag.</p>
        </Step>
        <Step n={4} title="Schedule a test (SCHEDULER or CO)">
          <p>On the control detail page, click <strong>Schedule Test</strong>. Set the test date, testing methodology (walkthrough, sample testing, re-performance), and assign the tester (must differ from the owner). The control owner receives a notification that a test is scheduled.</p>
        </Step>
        <Step n={5} title="Execute the test (Control Owner)">
          <p>Sign in as the control owner. Open the control, click <strong>Start Test</strong>, and document the testing work: evidence reviewed, sample size, exceptions noted, and a draft effectiveness rating (Effective / Partially Effective / Ineffective).</p>
        </Step>
        <Step n={6} title="CO review">
          <p>Sign back in as <strong>CO</strong>. Review the testing workpapers and evidence. If satisfied, click <strong>Approve — Effective</strong> or <strong>Approve — Ineffective</strong>. An <em>Effective</em> rating increases the <code>controlEffPct</code> input to the CPA score. An <em>Ineffective</em> rating auto-creates a CIR remediation action.</p>
        </Step>
        <Step n={7} title="Observe the CPA score update">
          <p>Navigate to the Dashboard. The Effectiveness Gauge should reflect the updated control effectiveness percentage. Control testing results directly feed the <strong>Assessment (CPA)</strong> — the annual evidence package.</p>
        </Step>
        <Note colour="blue">
          <strong>Art. 13(2)(e):</strong> Ongoing monitoring of controls is a mandatory element of an adequate compliance programme. Regulators distinguish between controls that exist on paper and those with documented, independent testing evidence.
        </Note>
      </Scenario>

      {/* ── Scenario 8: CPA ───────────────────────────────────────── */}
      <Scenario id="cpa" colour="bg-amber-50 border-b border-amber-200"
        label="WF-07 · /assessments · Art. 16(b)/(c), Recital 29"
        role="CO → CCO"
        title="Completing the Annual Assessment (CPA)">
        <Step n={1} title="Navigate to Assessment">
          <p>Sign in as <strong>CO (Marcus Weber)</strong>. Click <strong>Assessment</strong> in the sidebar. Open the current draft assessment or create a new one for the current year.</p>
        </Step>
        <Step n={2} title="Review the auto-populated metrics">
          <p>The system pulls four live metrics into the assessment form:</p>
          <ul className="list-disc list-inside mt-1 space-y-0.5 ml-2">
            <li><strong>Obligation Coverage %</strong> — what % of regulatory obligations have at least one mapped control</li>
            <li><strong>Policy Acknowledgement %</strong> — what % of in-scope staff have acknowledged current policies</li>
            <li><strong>Training Completion %</strong> — what % of required training is completed by in-scope staff</li>
            <li><strong>Control Effectiveness %</strong> — what % of tested controls are rated Effective</li>
          </ul>
        </Step>
        <Step n={3} title="Understand the scoring formula">
          <p>The <strong>Effectiveness Score</strong> is calculated as:</p>
          <code className="block mt-2 bg-slate-100 px-3 py-2 rounded text-xs">
            Score = (Obligation Coverage × 30%) + (Policy Ack × 20%) + (Training × 25%) + (Control Eff × 25%) − penalty
          </code>
          <p className="mt-2">A deduction applies for open critical/high findings: −5 per critical, −2 per high, capped at −30. The result is clamped to 0–100.</p>
        </Step>
        <Step n={4} title="Write the Recital 29 narrative">
          <p>The four quantitative metrics are necessary but not sufficient. The assessment requires a written narrative addressing all four <strong>Recital 29 adequacy criteria</strong>:
          </p>
          <ol className="list-decimal list-inside mt-1 space-y-0.5 ml-2">
            <li>Top-level commitment — board/senior management tone-at-the-top</li>
            <li>Proportionality — programme scope matches organisational size and risk profile</li>
            <li>Active implementation — evidence from training records, control testing, incident handling</li>
            <li>Continuous improvement — prior-year findings addressed, programme updated</li>
          </ol>
        </Step>
        <Step n={5} title="CO submits for CCO review">
          <p>Once the narrative is complete and the score is reviewed, the CO clicks <strong>Submit for CCO Review</strong>. The CCO receives a notification.</p>
        </Step>
        <Step n={6} title="CCO sign-off (sign in as CCO)">
          <p>Sign in as <strong>CCO (Sofia Martins)</strong>. Open the assessment. Review the score, the narrative, and the supporting data. The CCO may send it back with comments or click <strong>Sign Off</strong>. Sign-off locks the score and narrative — they cannot be changed after this point.</p>
        </Step>
        <Step n={7} title="The Art. 16(c) evidence package">
          <p>A signed-off assessment constitutes the primary Art. 16(c) evidence package — documentary proof that the organisation had a genuine and effective compliance programme at the time of any offence. The package includes the score, narrative, supporting metrics, and CCO signature with timestamp. It is retained indefinitely in the system and can be produced in regulatory proceedings.</p>
        </Step>
        <Note colour="green">
          <strong>Art. 16(c) defence:</strong> A score ≥80 with a complete Recital 29 narrative and recent CCO sign-off gives the organisation its strongest basis for a mitigation argument. Below 40, regulators are unlikely to accept the programme as genuine. Aim for ≥80 before any potential disclosure event.
        </Note>
      </Scenario>

      {/* Closing tips */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-base font-bold text-[#0F172A] mb-4">Tips for Exploring the Demo</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
          {[
            ['Switch roles frequently', 'The platform behaves differently for each role. Sign out and back in as CCO, then EMPLOYEE, to see how RBAC restricts and reveals information.'],
            ['Check the audit trail', 'Every state transition on every record is logged. On incident and gift detail pages, scroll to the bottom to see the full audit timeline.'],
            ['Use keyboard shortcuts', 'Press ? to open Help from any page. The sidebar highlights the active module automatically as you navigate.'],
            ['Observe FLS masking', 'Open a whistleblower report as CO/CCO, then re-open it as CONF_INV. The reporter identity field changes from blocks to real data.'],
            ['Trigger the routing logic', 'Create a gift worth EUR 30 to a private company (→ CO review), then one worth EUR 10 to a public official (→ CO + CCO). Observe how the routing preview changes.'],
            ['Explore the formulas page', 'The /help/formulas page documents every calculation in the system with worked examples — penalty exposure, effectiveness score, DDQ risk score, and rapidity classification.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3">
              <span className="text-[#1D5FAB] font-bold shrink-0 mt-0.5">›</span>
              <div>
                <p className="font-semibold text-[#0F172A]">{title}</p>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex gap-3">
          <Link href="/help/formulas"
            className="px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298]">
            Scoring Formulas →
          </Link>
          <Link href="/help/regulatory"
            className="px-4 py-2 border border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#F8FAFC]">
            Regulatory Reference →
          </Link>
        </div>
      </div>

    </div>
  )
}
