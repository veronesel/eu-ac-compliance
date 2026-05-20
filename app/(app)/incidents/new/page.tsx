import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import NewIncidentForm from '@/components/modules/NewIncidentForm'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'New Incident | EU AC Compliance' }

export default async function NewIncidentPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:write')) redirect('/incidents')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          New Corruption Incident
        </h1>
        <p className="text-sm text-[#475569] mt-1">Art. 4-9 — CIR intake form</p>
      </div>

      <CollapsibleAbout title="About the Corruption Incident Register">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Corruption Incident Register (CIR) is the hub of the compliance platform. Register an incident whenever there is a reasonable suspicion of an offence under Arts. 4-9 — bribery, passive bribery, trading in influence, misappropriation, or obstruction of justice.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Early registration is critical. The Art. 16(d) rapidity timer starts from the discovery date you enter here. A voluntary disclosure decision within 14 days of discovery earns RAPID classification — the strongest available mitigation credit. Delayed registration compresses this window and risks losing the mitigation benefit.
        </p>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Once submitted, the incident moves to Triage (5-day SLA) where the CO will assess substantiation and assign an investigator.
        </p>
      </CollapsibleAbout>

      <NewIncidentForm />
    </div>
  )
}
