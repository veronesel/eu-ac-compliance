import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import GiftForm from '@/components/modules/GiftForm'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'New Gift Entry | EU AC Compliance' }

export default async function NewGiftPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'gifts:submit')) redirect('/gifts')
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          New Gift & Hospitality Entry
        </h1>
        <p className="text-sm text-[#475569] mt-1">Art. 15(2)(f) — EUR 25 threshold applies</p>
      </div>

      <CollapsibleAbout title="About the Gift & Hospitality Register">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Gift & Hospitality Register (GHR) ensures that all gifts, hospitality, and other advantages — whether received or given — are documented, assessed against the EUR 25 threshold, and routed appropriately for approval.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Art. 7 prohibits any advantage to a public official that could induce improper conduct, regardless of value. For private-sector counterparties, the EUR 25 threshold determines the approval path: at or below the threshold (private counterparty only), the system auto-approves; above it, CO review is required.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          When in doubt, register the gift and let the system route it. An undocumented gift is a compliance gap — a documented and rejected gift is evidence the programme works.
        </p>
      </CollapsibleAbout>

      <GiftForm />
    </div>
  )
}
