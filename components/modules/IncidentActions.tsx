'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Role } from '@/lib/rbac'

interface Props {
  incidentId: string
  currentStatus: string
  userRole: Role
}

const TRANSITIONS: Record<string, string> = {
  DRAFT:           'TRIAGE',
  TRIAGE:          'INVESTIGATION',
  INVESTIGATION:   'FINDINGS_REVIEW',
  FINDINGS_REVIEW: 'DISCLOSURE',
  DISCLOSURE:      'REMEDIATION',
  REMEDIATION:     'CLOSED',
}

const TRANSITION_LABELS: Record<string, string> = {
  TRIAGE:          'Move to Triage',
  INVESTIGATION:   'Start Investigation',
  FINDINGS_REVIEW: 'Submit for Findings Review',
  DISCLOSURE:      'Initiate Disclosure Decision',
  REMEDIATION:     'Begin Remediation',
  CLOSED:          'Close Incident',
}

export default function IncidentActions({ incidentId, currentStatus, userRole }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const nextStatus = TRANSITIONS[currentStatus]
  if (!nextStatus) return null

  async function handleTransition() {
    setLoading(true)
    const res = await fetch(`/api/incidents/${incidentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, notes }),
    })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Optional notes for transition..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="flex-1 text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]"
      />
      <button
        onClick={handleTransition}
        disabled={loading}
        className="px-4 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? 'Updating…' : TRANSITION_LABELS[nextStatus]}
      </button>
    </div>
  )
}
