'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  status: string
  probability: number
  impact: number
  policies: string[]
  controls: string[]
  deadline: string
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]/30 focus:border-[#1D5FAB]'
const labelCls = 'block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1'

export default function ObligationEditForm({ id, status, probability, impact, policies, controls, deadline }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    status,
    probability: String(probability),
    impact: String(impact),
    policies: policies.join(', '),
    controls: controls.join(', '),
    deadline,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(false)
  }

  function handleReset() {
    setForm({
      status,
      probability: String(probability),
      impact: String(impact),
      policies: policies.join(', '),
      controls: controls.join(', '),
      deadline,
    })
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const parsedPolicies = form.policies ? form.policies.split(',').map(s => s.trim()).filter(Boolean) : []
    const parsedControls = form.controls ? form.controls.split(',').map(s => s.trim()).filter(Boolean) : []

    try {
      const res = await fetch(`/api/obligations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: form.status,
          probability: Number(form.probability),
          impact: Number(form.impact),
          policies: JSON.stringify(parsedPolicies),
          controls: JSON.stringify(parsedControls),
          deadline: form.deadline,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Save failed')
      } else {
        setSuccess(true)
        router.refresh()
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Edit Obligation</h2>
        <span className="text-xs text-[#94A3B8]">CO/CCO only</span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Saved successfully.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={e => handleChange('status', e.target.value)}>
            <option value="NOT_STARTED">NOT STARTED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLIANT">COMPLIANT</option>
            <option value="NEEDS_REVIEW">NEEDS REVIEW</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Probability (1–5)</label>
            <select className={inputCls} value={form.probability} onChange={e => handleChange('probability', e.target.value)}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Impact (1–5)</label>
            <select className={inputCls} value={form.impact} onChange={e => handleChange('impact', e.target.value)}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Deadline</label>
          <input className={inputCls} value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} placeholder="e.g. Jun 2028" />
        </div>

        <div>
          <label className={labelCls}>Linked Policies (comma-separated)</label>
          <textarea className={inputCls} rows={2} value={form.policies} onChange={e => handleChange('policies', e.target.value)} placeholder="Policy A, Policy B" />
        </div>

        <div>
          <label className={labelCls}>Linked Controls (comma-separated)</label>
          <textarea className={inputCls} rows={2} value={form.controls} onChange={e => handleChange('controls', e.target.value)} placeholder="CTR-2026-001, CTR-2026-002" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50">
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={handleReset} className="px-5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#F1F5F9]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
