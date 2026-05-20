import Link from 'next/link'

const HELP_NAV = [
  { href: '/help',                label: 'Overview',              group: null },
  { href: '/help/guide',          label: 'Step-by-Step Guide',    group: null },
  { href: '/help/architecture',   label: 'Architecture',          group: 'Reference' },
  { href: '/help/regulatory',     label: 'Regulatory Framework',  group: 'Reference' },
  { href: '/help/formulas',       label: 'Scoring Formulas',      group: 'Reference' },
  { href: '/help/incidents',      label: 'Incidents (CIR)',        group: 'Modules' },
  { href: '/help/gifts',          label: 'Gifts (GHR)',            group: 'Modules' },
  { href: '/help/coi',            label: 'Conflicts (COI)',        group: 'Modules' },
  { href: '/help/whistleblower',  label: 'Whistleblower (WR)',     group: 'Modules' },
  { href: '/help/ddq',            label: 'Due Diligence (DDQ)',    group: 'Modules' },
  { href: '/help/controls',       label: 'Controls (CTR)',         group: 'Modules' },
  { href: '/help/assessment',     label: 'Assessment (CPA)',       group: 'Modules' },
]

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 h-full">
      {/* Sub-nav */}
      <aside className="w-48 shrink-0">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 sticky top-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] px-2 mb-2">Help Topics</p>
          <nav className="space-y-0.5">
            {HELP_NAV.map((item, i) => {
              const prevGroup = i > 0 ? HELP_NAV[i - 1].group : undefined
              const showHeading = item.group && item.group !== prevGroup
              return (
                <div key={item.href}>
                  {showHeading && (
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#CBD5E1] px-3 pt-3 pb-1">
                      {item.group}
                    </p>
                  )}
                  <Link
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </div>
              )
            })}
          </nav>
        </div>
      </aside>
      {/* Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
