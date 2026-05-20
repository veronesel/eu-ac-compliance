import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate, formatEUR, daysElapsed } from '@/lib/formulas'
import { Plus } from 'lucide-react'

export const metadata = { title: 'Gifts & Hospitality | EU AC Compliance' }

export default async function GiftsPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'gifts:read')) redirect('/dashboard')

  const gifts = await prisma.gift.findMany({
    include: { submitter: true, manager: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Gifts & Hospitality Register
          </h1>
          <p className="text-sm text-[#475569] mt-1">Art. 15(2)(f) — GHR · EUR 25 threshold · {gifts.length} records</p>
        </div>
        {hasPermission(session.user.role, 'gifts:submit') && (
          <Link href="/gifts/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298]">
            <Plus size={16} /> New Entry
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Ref</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Counterparty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Event Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Submitted By</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">Days Pending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {gifts.map(g => {
              const pending = ['PENDING_MANAGER', 'PENDING_CO'].includes(g.status)
              const days = pending ? daysElapsed(g.createdAt) : null
              const overThreshold = g.estimatedValue > 25
              return (
                <tr key={g.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3">
                    <Link href={`/gifts/${g.id}`} className="font-mono text-xs text-[#1D5FAB] font-semibold hover:underline">
                      {g.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/gifts/${g.id}`} className="text-[#0F172A] hover:text-[#1D5FAB] line-clamp-1">{g.description}</Link>
                    {g.amlFlag && <span className="ml-2 text-xs text-amber-700 bg-amber-100 px-1 rounded">AML</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    <span className={overThreshold ? 'text-amber-700 font-semibold' : 'text-[#0F172A]'}>
                      {formatEUR(g.estimatedValue)}
                    </span>
                    {overThreshold && <span className="ml-1 text-xs text-amber-600">↑</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${g.counterpartyType === 'PUBLIC_OFFICIAL' ? 'bg-red-100 text-red-700' : g.counterpartyType === 'REGULATOR' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                      {g.counterpartyType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{formatDate(g.eventDate)}</td>
                  <td className="px-4 py-3 text-xs text-[#475569]">{g.submitter.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-3 text-right text-xs font-mono">
                    {days != null ? <span className={days > 5 ? 'text-red-600 font-semibold' : 'text-[#475569]'}>{days}d</span> : '—'}
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
