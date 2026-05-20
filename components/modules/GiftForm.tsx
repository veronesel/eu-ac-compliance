'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { determineGHRRouting } from '@/lib/formulas'

const COUNTERPARTY_TYPES = ['PRIVATE', 'PUBLIC_OFFICIAL', 'REGULATOR']

export default function GiftForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    description: '', occasion: '', provider: '',
    counterpartyType: 'PRIVATE', estimatedValue: '', eventDate: '', attendees: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const value = parseFloat(form.estimatedValue) || 0
  const isPublicOfficial = form.counterpartyType === 'PUBLIC_OFFICIAL' || form.counterpartyType === 'REGULATOR'
  const routing = determineGHRRouting(value, isPublicOfficial)
  const pct = Math.min(100, (value / 25) * 100)
  const barColour = value > 25 ? '#B91C1C' : value > 20 ? '#B45309' : '#15803D'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/gifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, estimatedValue: parseFloat(form.estimatedValue) }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json() as { id: string }
      router.push(`/gifts/${data.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
      {/* Public official warning */}
      {isPublicOfficial && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          ⚠ <strong>Art. 15(2)(f):</strong> Public Official counterparty detected. CO review required regardless of value.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Description *</label>
        <input required value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="e.g. Business dinner at client premises"
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Occasion *</label>
          <input required value={form.occasion} onChange={e => set('occasion', e.target.value)}
            placeholder="e.g. Client relationship maintenance"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Provider *</label>
          <input required value={form.provider} onChange={e => set('provider', e.target.value)}
            placeholder="Who is paying / providing?"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Counterparty Type *</label>
          <select value={form.counterpartyType} onChange={e => set('counterpartyType', e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]">
            {COUNTERPARTY_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Event Date *</label>
          <input required type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
        </div>
      </div>

      {/* Live threshold indicator */}
      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">
          Estimated Value (EUR) *
        </label>
        <input required type="number" step="0.01" min="0" value={form.estimatedValue} onChange={e => set('estimatedValue', e.target.value)}
          placeholder="0.00"
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
        {form.estimatedValue && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: barColour }} className="font-medium">
                EUR {parseFloat(form.estimatedValue || '0').toFixed(2)}
              </span>
              <span className="text-[#94A3B8]">EUR 25 threshold</span>
            </div>
            <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColour }}
              />
            </div>
            {value > 25 && (
              <p className="text-xs text-red-600 mt-1 font-medium">CO review required — exceeds EUR 25 threshold</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Attendees *</label>
        <input required value={form.attendees} onChange={e => set('attendees', e.target.value)}
          placeholder="Name(s) of all attendees"
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      </div>

      {/* Routing preview */}
      {form.estimatedValue && (
        <div className={`px-4 py-3 rounded-lg border text-sm ${routing.requiresCOReview ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
          <strong>Approval route:</strong> {routing.reason}
        </div>
      )}

      <div className="pt-2 flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 border border-[#E2E8F0] text-sm font-medium rounded-lg hover:bg-[#F8FAFC]">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-6 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50">
          {loading ? 'Submitting…' : 'Submit Entry'}
        </button>
      </div>
    </form>
  )
}
