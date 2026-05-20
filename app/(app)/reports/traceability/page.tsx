import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Traceability Matrix | EU AC Compliance' }

export default async function TraceabilityPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'reports:read')) redirect('/dashboard')

  const [obligations, controls, incidents] = await Promise.all([
    prisma.obligation.findMany({ orderBy: { articleRef: 'asc' } }),
    prisma.control.findMany(),
    prisma.incident.findMany({ where: { status: { notIn: ['CLOSED'] } } }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Regulatory Traceability Matrix
        </h1>
        <p className="text-sm text-[#475569] mt-1">Obligation → Policy → Control → Incident mapping</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Article</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Obligation</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Policies</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Controls</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {obligations.map(o => {
              const policies: string[] = JSON.parse(o.policies)
              const ctrlRefs: string[] = JSON.parse(o.controls)
              const linkedControls = controls.filter(c => ctrlRefs.includes(c.reference))
              return (
                <tr key={o.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-mono text-xs text-[#1D5FAB] font-semibold align-top">{o.articleRef}</td>
                  <td className="px-4 py-3 text-[#0F172A] font-medium align-top">{o.title}</td>
                  <td className="px-4 py-3 align-top">
                    {policies.length > 0 ? (
                      <ul className="space-y-1">
                        {policies.map(p => <li key={p} className="text-xs text-[#475569]">• {p}</li>)}
                      </ul>
                    ) : <span className="text-xs text-[#94A3B8]">None</span>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {linkedControls.length > 0 ? (
                      <ul className="space-y-1">
                        {linkedControls.map(c => (
                          <li key={c.reference} className="text-xs">
                            <span className="font-mono text-[#1D5FAB]">{c.reference}</span>
                            <span className={`ml-1 ${c.testResult === 'EFFECTIVE' ? 'text-green-600' : c.testResult === 'PARTIALLY_EFFECTIVE' ? 'text-amber-600' : 'text-[#94A3B8]'}`}>
                              {c.testResult ? `(${c.testResult.replace(/_/g, ' ')})` : '(pending)'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-xs text-[#94A3B8]">None</span>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${o.status === 'COMPLIANT' ? 'bg-green-100 text-green-700' : o.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : o.status === 'NEEDS_REVIEW' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
