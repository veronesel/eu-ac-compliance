import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'
import { ArrowLeft, Lock } from 'lucide-react'

export const metadata = { title: 'WR Case | EU AC Compliance' }

export default async function WRDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const canReadFull = session && hasPermission(session.user.role, 'wr:read')
  const canReadMasked = session && hasPermission(session.user.role, 'wr:read:masked')
  if (!session || (!canReadFull && !canReadMasked)) redirect('/dashboard')

  const wrCase = await prisma.wRCase.findUnique({ where: { id } })
  if (!wrCase) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/whistleblower" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Whistleblower Cases
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-[#1D5FAB] font-semibold">{wrCase.reference}</span>
          <StatusBadge status={wrCase.status} />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {wrCase.category} — {wrCase.allegation.slice(0, 60)}{wrCase.allegation.length > 60 ? '…' : ''}
        </h1>
      </div>

      {/* FLS restriction banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <Lock size={16} className="text-red-600 mt-0.5 shrink-0" />
        <p className="text-xs text-red-800">
          <strong>Reporter Identity — FLS Restricted (Dir. 2019/1937 / Art. 25(1)):</strong>{' '}
          {canReadFull
            ? 'You are viewing full reporter details as Confidential Investigator.'
            : 'Reporter identity is masked. Only the Confidential Investigator can view identifying information.'}
        </p>
      </div>

      {/* Reporter identity */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Reporter Information</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Reporter Name</dt>
            <dd className="font-medium">
              {canReadFull ? (
                <span className="text-[#0F172A]">{wrCase.reporterName ?? 'Anonymous'}</span>
              ) : (
                <span className="font-mono tracking-widest text-[#94A3B8] flex items-center gap-1">
                  <Lock size={12} /> ████████
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[#94A3B8] text-xs mb-1">Contact</dt>
            <dd className="font-medium">
              {canReadFull ? (
                <span className="text-[#0F172A]">{wrCase.reporterContact ?? 'Not provided'}</span>
              ) : (
                <span className="font-mono tracking-widest text-[#94A3B8] flex items-center gap-1">
                  <Lock size={12} /> ████████
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Allegation */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Allegation</h2>
        <div className="text-sm text-[#0F172A] leading-relaxed">
          <p className="mb-3">{canReadFull ? wrCase.detailsRestricted : wrCase.detailsPublic}</p>
          {!canReadFull && (
            <p className="text-xs text-[#94A3B8] italic">
              Full allegation details restricted to Confidential Investigator only.
            </p>
          )}
        </div>
      </div>

      {/* Key dates */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Timeline</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Received', date: wrCase.createdAt },
            { label: 'Acknowledged', date: wrCase.acknowledgedDate },
            { label: 'Feedback Sent', date: wrCase.feedbackDate },
          ].map(({ label, date }) => date && (
            <div key={label} className="flex justify-between">
              <span className="text-[#94A3B8]">{label}</span>
              <span className="font-mono text-xs">{formatDate(date)}</span>
            </div>
          ))}
          {wrCase.linkedIncidentId && (
            <div className="pt-2 border-t border-[#F1F5F9]">
              <span className="text-[#94A3B8] text-xs">Linked Incident: </span>
              <Link href={`/incidents/${wrCase.linkedIncidentId}`} className="text-xs text-[#1D5FAB] hover:underline font-mono">
                View CIR →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
