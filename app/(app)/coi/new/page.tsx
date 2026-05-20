import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'Declare COI | EU AC Compliance' }

export default async function NewCOIPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'coi:submit')) redirect('/coi')
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>Declare Conflict of Interest</h1>
        <p className="text-sm text-[#475569] mt-1">Art. 13 — Annual COI declaration</p>
      </div>

      <CollapsibleAbout title="About Conflict of Interest Declarations">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          A Conflict of Interest declaration is required whenever you hold an outside interest that could — or could appear to — compromise your independent judgment in carrying out your organisational role.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Art. 10 of the Directive treats undisclosed conflicts that facilitate corruption offences as aggravating factors. The obligation to declare applies broadly: financial interests, personal relationships, outside directorships, former employment, and any other interest that a reasonable person could perceive as compromising your objectivity.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          When in doubt, declare. An over-declared interest that is reviewed and cleared is far less damaging than an undisclosed interest discovered after an incident.
        </p>
      </CollapsibleAbout>

      <COIForm />
    </div>
  )
}

function COIForm() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
      <p className="text-sm text-[#475569]">COI declaration form — use the API at POST /api/coi to submit declarations.</p>
    </div>
  )
}
