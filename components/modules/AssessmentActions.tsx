'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AssessmentActions({ assessmentId }: { assessmentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOff() {
    setLoading(true)
    await fetch(`/api/assessments/${assessmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signoff' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
      <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">CCO Sign-off</h2>
      <p className="text-sm text-[#475569] mb-4">
        By signing off this assessment, you confirm it represents a genuine, duly assessed compliance programme per Art. 16(c) and Recital 29 of Directive (EU) 2026/1021.
      </p>
      <button onClick={handleSignOff} disabled={loading}
        className="px-6 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 disabled:opacity-50">
        {loading ? 'Processing…' : 'Sign Off Assessment'}
      </button>
    </div>
  )
}
