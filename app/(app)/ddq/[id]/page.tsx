import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/modules/StatusBadge'
import { formatDate } from '@/lib/formulas'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Third-Party Profile | EU AC Compliance' }

export default async function DDQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'ddq:read')) redirect('/dashboard')

  const tp = await prisma.thirdParty.findUnique({
    where: { id },
    include: { ddqQuestionnaires: { orderBy: { createdAt: 'desc' } } },
  })
  if (!tp) notFound()

  const tierStyle: Record<string, string> = {
    CRITICAL: 'bg-purple-100 text-purple-700 border-purple-300',
    HIGH:     'bg-red-100 text-red-700 border-red-300',
    MEDIUM:   'bg-amber-100 text-amber-700 border-amber-300',
    LOW:      'bg-green-100 text-green-700 border-green-300',
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/ddq" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Due Diligence
        </Link>
        <div className="flex items-center gap-3 mb-1">
          {tp.riskTier && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${tierStyle[tp.riskTier] ?? ''}`}>
              {tp.riskTier}
            </span>
          )}
          <StatusBadge status={tp.ddqStatus} />
          {tp.ddqStatus === 'ENHANCED' && (
            <AlertTriangle size={16} className="text-red-500" aria-label="Enhanced DDQ required" />
          )}
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {tp.name}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Profile</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[#94A3B8] text-xs mb-1">Type</dt><dd className="font-medium text-[#0F172A]">{tp.type}</dd></div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Jurisdiction</dt><dd className="font-medium text-[#0F172A]">{tp.jurisdiction}</dd></div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Risk Score</dt>
            <dd>
              {tp.riskScore != null ? (
                <span className={`font-mono font-bold text-lg ${tp.riskScore >= 70 ? 'text-red-600' : tp.riskScore >= 40 ? 'text-amber-600' : 'text-green-600'}`}>
                  {tp.riskScore.toFixed(0)}
                </span>
              ) : '—'}
            </dd>
          </div>
          <div><dt className="text-[#94A3B8] text-xs mb-1">Next DDQ Due</dt><dd className="font-mono text-xs">{tp.nextDDQDate ? formatDate(tp.nextDDQDate) : '—'}</dd></div>
        </dl>
      </div>

      {/* DDQ history */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">DDQ History</h2>
        {tp.ddqQuestionnaires.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No questionnaires on record.</p>
        ) : (
          <div className="space-y-3">
            {tp.ddqQuestionnaires.map(ddq => (
              <div key={ddq.id} className="flex items-start gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-[#1D5FAB] font-semibold">{ddq.reference}</span>
                    <StatusBadge status={ddq.status} />
                    {ddq.enhancedDDQRequired && <span className="text-xs text-red-600 font-semibold">Enhanced Required</span>}
                  </div>
                  {ddq.rawScore != null && (
                    <p className="text-sm"><span className="text-[#94A3B8]">Score: </span>
                      <span className={`font-bold font-mono ${ddq.rawScore >= 70 ? 'text-red-600' : ddq.rawScore >= 40 ? 'text-amber-600' : 'text-green-600'}`}>
                        {ddq.rawScore.toFixed(0)}
                      </span>
                      {ddq.riskTier && <span className="ml-2 text-xs text-[#94A3B8]">({ddq.riskTier})</span>}
                    </p>
                  )}
                  {ddq.reviewNotes && <p className="text-xs text-[#475569] mt-1">{ddq.reviewNotes}</p>}
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Sent: {ddq.sentDate ? formatDate(ddq.sentDate) : '—'} ·
                    Response: {ddq.responseDate ? formatDate(ddq.responseDate) : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
