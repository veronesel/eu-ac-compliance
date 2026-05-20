'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function COIActions({ coiId }: { coiId: string }) {
  const router = useRouter()
  const [assessment, setAssessment] = useState('NO_CONFLICT')
  const [decision, setDecision] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    await fetch(`/api/coi/${coiId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coAssessment: assessment, managementDecision: decision }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
      <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">CO Assessment</h2>
      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Classification</label>
        <select value={assessment} onChange={e => setAssessment(e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]">
          <option value="NO_CONFLICT">No Conflict</option>
          <option value="MANAGEABLE">Manageable Conflict</option>
          <option value="ACTUAL">Actual Conflict</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Management Decision</label>
        <textarea value={decision} onChange={e => setDecision(e.target.value)} rows={3}
          placeholder="Describe the management decision and any remediation required..."
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      </div>
      <button onClick={handleSubmit} disabled={loading}
        className="px-6 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50">
        {loading ? 'Submitting…' : 'Submit Assessment'}
      </button>
    </div>
  )
}
