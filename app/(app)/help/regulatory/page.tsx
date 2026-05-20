export const metadata = { title: 'Regulatory Framework | Help | EU AC Compliance' }

export default function RegulatoryPage() {
  const articles = [
    { ref: 'Art. 3', title: 'Active bribery', classification: 'Criminalisation', notes: 'Mandatory criminal offence — private sector bribery' },
    { ref: 'Art. 4', title: 'Passive bribery', classification: 'Criminalisation', notes: 'Including trading in influence' },
    { ref: 'Art. 5', title: 'Other offences', classification: 'Criminalisation', notes: 'Misappropriation, obstruction' },
    { ref: 'Art. 6', title: 'Penalties — natural persons', classification: 'Sanctions', notes: 'Max 5 years imprisonment for top offences' },
    { ref: 'Art. 8', title: 'Corporate liability', classification: 'Liability', notes: 'Legal persons liable for offences by benefit-seekers' },
    { ref: 'Art. 9', title: 'Penalties — legal persons', classification: 'Sanctions', notes: 'Max 5% turnover or EUR 40M; 3% / EUR 24M for others' },
    { ref: 'Art. 13', title: 'Prevention measures', classification: 'Prevention', notes: 'Compliance programmes, risk assessments, training, DDQ' },
    { ref: 'Art. 14', title: 'Mitigating factors', classification: 'Mitigation', notes: 'Prior compliance programme, voluntary disclosure, cooperation' },
    { ref: 'Art. 15', title: 'Reporting obligations', classification: 'Reporting', notes: 'AML integration (Art. 15(2)(f)), suspicious activity reporting' },
    { ref: 'Art. 16', title: 'Mitigation — voluntary disclosure', classification: 'Mitigation', notes: '16(c): genuine programme; 16(d): rapidity classification' },
    { ref: 'Art. 20', title: 'Whistleblower channels', classification: 'Prevention', notes: 'Confidential reporting channel obligation' },
    { ref: 'Art. 25', title: 'Non-retaliation', classification: 'Prevention', notes: 'Protected disclosures — Dir. 2019/1937 applies' },
  ]

  const classStyle: Record<string, string> = {
    Criminalisation: 'bg-red-100 text-red-700',
    Sanctions:       'bg-purple-100 text-purple-700',
    Liability:       'bg-orange-100 text-orange-700',
    Prevention:      'bg-green-100 text-green-700',
    Mitigation:      'bg-amber-100 text-amber-700',
    Reporting:       'bg-blue-100 text-blue-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Regulatory Framework
        </h1>
        <p className="text-sm text-[#475569] mt-1">Directive (EU) 2026/1021 — Article Map</p>
      </div>

      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Transposition deadline:</strong> June 2028. Member States must adopt implementing measures and communicate them to the Commission.
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider w-24">Article</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Classification</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {articles.map(a => (
              <tr key={a.ref} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-mono text-sm font-semibold text-[#1D5FAB]">{a.ref}</td>
                <td className="px-4 py-3 font-medium text-[#0F172A]">{a.title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${classStyle[a.classification] ?? 'bg-slate-100 text-slate-600'}`}>
                    {a.classification}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
