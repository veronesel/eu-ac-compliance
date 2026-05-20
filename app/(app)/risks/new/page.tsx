import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RiskNewForm from '@/components/modules/RiskNewForm'
import CollapsibleAbout from '@/components/ui/CollapsibleAbout'

export const metadata = { title: 'New Risk | EU AC Compliance' }

export default async function NewRiskPage() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'risks:write')) redirect('/risks')

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/risks" className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#1D5FAB] mb-3">
          <ArrowLeft size={14} /> Back to Risk Register
        </Link>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          New Corruption Risk
        </h1>
        <p className="text-sm text-[#475569] mt-1">Art. 13 — Corruption Risk Register entry</p>
      </div>

      {/* About */}
      <CollapsibleAbout title="About the Corruption Risk Register">
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          The Corruption Risk Register (CRR) is the organisation&apos;s structured assessment of the corruption threats it faces. Each risk maps to one or more Directive offence categories (Arts. 3-9), carries inherent and residual risk scores, and is assigned to a named owner responsible for keeping controls current. Document the threat scenario, set inherent scores before controls, assess residual scores after controls, and link the current control measures. Review risk records at least annually or after any material incident in the same category.
        </p>
      </CollapsibleAbout>

      <RiskNewForm />
    </div>
  )
}
