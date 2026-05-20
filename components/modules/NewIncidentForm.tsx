'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ALLEGATION_TYPES = ['Bribery', 'Trading in Influence', 'Misappropriation', 'Obstruction', 'Other']
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function NewIncidentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', allegationType: ALLEGATION_TYPES[0], severity: 'MEDIUM',
    description: '', discoveryDate: '', amlFlag: false, publicOfficialFlag: false,
    worldwideTurnover: '2500000000',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json() as { id: string }
      router.push(`/incidents/${data.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Title *</label>
        <input required value={form.title} onChange={e => set('title', e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Allegation Type *</label>
          <select value={form.allegationType} onChange={e => set('allegationType', e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]">
            {ALLEGATION_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Severity *</label>
          <select value={form.severity} onChange={e => set('severity', e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]">
            {SEVERITIES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Description *</label>
        <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={4}
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0F172A] mb-1">Discovery Date</label>
        <input type="date" value={form.discoveryDate} onChange={e => set('discoveryDate', e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]" />
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.amlFlag} onChange={e => set('amlFlag', e.target.checked)} className="w-4 h-4" />
          <span>Art. 15(2)(f) AML Flag</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.publicOfficialFlag} onChange={e => set('publicOfficialFlag', e.target.checked)} className="w-4 h-4" />
          <span>Public Official Involved</span>
        </label>
      </div>
      <div className="pt-2 flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 border border-[#E2E8F0] text-sm font-medium rounded-lg hover:bg-[#F8FAFC]">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-6 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50">
          {loading ? 'Creating…' : 'Create Incident'}
        </button>
      </div>
    </form>
  )
}
