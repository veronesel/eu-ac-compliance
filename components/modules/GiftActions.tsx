'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GiftActions({ giftId, currentStatus }: { giftId: string; currentStatus: string }) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function act(decision: string) {
    setLoading(true)
    await fetch(`/api/gifts/${giftId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, notes }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <input type="text" placeholder="Decision notes (optional)" value={notes} onChange={e => setNotes(e.target.value)}
        className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      <div className="flex gap-2">
        <button onClick={() => act('APPROVED')} disabled={loading}
          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
          Approve
        </button>
        <button onClick={() => act('REJECTED')} disabled={loading}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50">
          Reject
        </button>
        <button onClick={() => act('RETURNED')} disabled={loading}
          className="px-4 py-2 border border-[#E2E8F0] text-sm font-medium rounded-lg hover:bg-[#F8FAFC] disabled:opacity-50">
          Return for Correction
        </button>
      </div>
    </div>
  )
}
