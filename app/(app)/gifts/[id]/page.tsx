import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate, formatEUR } from '@/lib/formulas'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import GiftActions from '@/components/modules/GiftActions'

export const metadata = { title: 'Gift Detail | EU AC Compliance' }

export default async function GiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'gifts:read')) redirect('/dashboard')

  const gift = await prisma.gift.findUnique({
    where: { id },
    include: { submitter: true, manager: true },
  })
  if (!gift) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/gifts" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Gifts
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{gift.reference}</span>
          <StatusBadge status={gift.status} />
          {gift.amlFlag && <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">Art. 15(2)(f)</span>}
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>{gift.description}</h1>
      </div>

      {/* Approval workflow */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Approval Workflow</h2>
        <div className="space-y-4">
          {/* Submission */}
          <div className="flex gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#1D5FAB] flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0F172A]">Submission</p>
              <p className="text-xs text-[#475569] mt-0.5">Submitted by {gift.submitter.name} on {formatDate(gift.createdAt)}</p>
              <p className="text-xs text-[#475569] mt-1">Value: <span className="font-mono font-semibold">{formatEUR(gift.estimatedValue)}</span> · {gift.counterpartyType.replace(/_/g, ' ')} · {gift.occasion}</p>
            </div>
            <CheckCircle size={18} className="text-green-500 shrink-0 mt-1" />
          </div>

          {/* Manager review */}
          <div className={`flex gap-4 p-4 rounded-lg border ${gift.managerDecision ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${gift.managerDecision ? 'bg-[#1D5FAB] text-white' : 'bg-amber-100 text-amber-700'}`}>2</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0F172A]">Line Manager Review</p>
              {gift.managerDecision ? (
                <>
                  <p className="text-xs text-[#475569] mt-0.5">{gift.manager?.name ?? 'Manager'} · {gift.managerDate ? formatDate(gift.managerDate) : ''}</p>
                  <p className="text-xs mt-1"><span className={gift.managerDecision === 'APPROVED' ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{gift.managerDecision}</span>{gift.managerNotes && ` — ${gift.managerNotes}`}</p>
                </>
              ) : (
                <p className="text-xs text-amber-700 mt-0.5">Awaiting line manager review</p>
              )}
            </div>
            {gift.managerDecision === 'APPROVED' ? <CheckCircle size={18} className="text-green-500 shrink-0 mt-1" /> :
             gift.managerDecision === 'REJECTED' ? <XCircle size={18} className="text-red-500 shrink-0 mt-1" /> : null}
          </div>

          {/* CO review */}
          {(gift.status === 'PENDING_CO' || gift.coDecision) && (
            <div className={`flex gap-4 p-4 rounded-lg border ${gift.coDecision ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-blue-50 border-blue-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${gift.coDecision ? 'bg-[#1D5FAB] text-white' : 'bg-blue-100 text-blue-700'}`}>3</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0F172A]">Compliance Officer Review</p>
                {gift.coDecision ? (
                  <>
                    <p className="text-xs text-[#475569] mt-0.5">{gift.coDate ? formatDate(gift.coDate) : ''}</p>
                    <p className="text-xs mt-1"><span className={gift.coDecision === 'APPROVED' ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{gift.coDecision}</span>{gift.coNotes && ` — ${gift.coNotes}`}</p>
                  </>
                ) : (
                  <p className="text-xs text-blue-700 mt-0.5">Awaiting CO review</p>
                )}
              </div>
              {gift.coDecision === 'APPROVED' ? <CheckCircle size={18} className="text-green-500 shrink-0 mt-1" /> :
               gift.coDecision === 'REJECTED' ? <XCircle size={18} className="text-red-500 shrink-0 mt-1" /> : null}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {(
          (gift.status === 'PENDING_MANAGER' && hasPermission(session.user.role, 'gifts:approve:manager')) ||
          (gift.status === 'PENDING_CO' && hasPermission(session.user.role, 'gifts:approve:co'))
        ) && (
          <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
            <GiftActions giftId={gift.id} currentStatus={gift.status} />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[#94A3B8] text-xs mb-1">Provider</dt><dd className="font-medium text-[#0F172A]">{gift.provider}</dd></div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Event Date</dt><dd className="font-medium text-[#0F172A]">{formatDate(gift.eventDate)}</dd></div>
          <div className="col-span-2"><dt className="text-[#94A3B8] text-xs mb-1">Attendees</dt><dd className="text-[#0F172A]">{gift.attendees}</dd></div>
        </dl>
      </div>
    </div>
  )
}
