import Link from 'next/link'

export const metadata = { title: 'Help & Documentation | EU AC Compliance' }

export default function HelpPage() {
  const MODULES = [
    { href: '/help/incidents',     title: 'Corruption Incident Register (CIR)', desc: 'WF-01 — 7-stage workflow from Draft to Closed. Arts. 4-9.', colour: 'border-orange-400 bg-orange-50' },
    { href: '/help/gifts',         title: 'Gifts & Hospitality Register (GHR)', desc: 'WF-02 — EUR 25 threshold routing. Art. 15(2)(f).', colour: 'border-green-400 bg-green-50' },
    { href: '/help/coi',           title: 'Conflict of Interest (COI)',         desc: 'WF-03 — Annual declaration. Art. 13.', colour: 'border-blue-400 bg-blue-50' },
    { href: '/help/whistleblower', title: 'Whistleblower Reports (WR)',         desc: 'WF-04 — FLS-restricted. Arts. 20-25, Dir. 2019/1937.', colour: 'border-red-400 bg-red-50' },
    { href: '/help/ddq',           title: 'Third-Party Due Diligence (DDQ)',    desc: 'WF-05 — Risk-tiered screening. Art. 13.', colour: 'border-purple-400 bg-purple-50' },
    { href: '/help/controls',      title: 'Control Testing (CTR)',              desc: 'WF-06 — Owner/tester segregation. Art. 13.', colour: 'border-cyan-400 bg-cyan-50' },
    { href: '/help/assessment',    title: 'Compliance Programme Assessment',    desc: 'WF-07 — Annual CPA. Art. 16(c). Recital 29.', colour: 'border-amber-400 bg-amber-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Help & Documentation
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Compliance platform guide — Directive (EU) 2026/1021 Anti-Corruption
        </p>
      </div>

      {/* Regulatory basis */}
      <div className="px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900">
        <strong>Legal Basis:</strong> Directive (EU) 2026/1021 of the European Parliament and of the Council on combating corruption by means of criminal law, repealing Council Framework Decision 2003/568/JHA. Transposition deadline: June 2028.
      </div>

      {/* Step-by-step guide CTA */}
      <div className="bg-[#0F1929] rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="font-bold text-white text-base">New to the platform?</p>
          <p className="text-sm text-[#94A3B8] mt-1">
            The step-by-step guide walks through every scenario — from recording a gift to signing off the annual assessment.
          </p>
        </div>
        <Link href="/help/guide"
          className="shrink-0 ml-6 px-5 py-2.5 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] whitespace-nowrap">
          Start the Guide →
        </Link>
      </div>

      {/* Architecture link */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-base font-bold text-[#0F172A] mb-3">Solution Architecture</h2>
        <p className="text-sm text-[#475569] mb-4">
          The platform is built around the <strong>Corruption Incident Register (CIR)</strong> as the hub entity, with six operational modules feeding into it. Reference data (obligations, policies, training) provides the compliance framework, and management entities (assessments, controls, risks) measure programme effectiveness.
        </p>
        <Link href="/help/architecture"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298]">
          View Architecture Diagram →
        </Link>
      </div>

      {/* Module grid */}
      <div>
        <h2 className="text-base font-bold text-[#0F172A] mb-3">Compliance Modules</h2>
        <div className="grid grid-cols-2 gap-4">
          {MODULES.map(m => (
            <Link key={m.href} href={m.href}
              className={`block rounded-xl border-l-4 p-4 hover:shadow-sm transition-shadow ${m.colour}`}>
              <p className="font-semibold text-[#0F172A] text-sm">{m.title}</p>
              <p className="text-xs text-[#475569] mt-1">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Formulas */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Scoring Formulas</h2>
            <p className="text-xs text-[#475569] mt-1">Effectiveness score, penalty exposure, DDQ scoring, rapidity classification</p>
          </div>
          <Link href="/help/formulas"
            className="px-3 py-1.5 border border-[#E2E8F0] text-sm text-[#475569] rounded-lg hover:bg-[#F8FAFC]">
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}
