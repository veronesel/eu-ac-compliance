'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputCls = 'w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]/30 focus:border-[#1D5FAB]'
const labelCls = 'block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1'

const CATEGORIES = ['Bribery', 'Third-Party', 'Conflict of Interest', 'Trading in Influence', 'Facilitation Payments', 'Other']
const STATUSES = ['ACTIVE', 'MITIGATED', 'ACCEPTED', 'CLOSED']

export default function RiskNewForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    category: 'Bribery',
    title: '',
    description: '',
    likelihood: '2',
    impact: '3',
    currentControls: '',
    residualLikelihood: '1',
    residualImpact: '2',
    owner: '',
    reviewDate: '',
    status: 'ACTIVE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const computedInherent = Number(form.likelihood) * Number(form.impact)
  const computedResidual = Number(form.residualLikelihood) * Number(form.residualImpact)

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          likelihood: Number(form.likelihood),
          impact: Number(form.impact),
          residualLikelihood: Number(form.residualLikelihood),
          residualImpact: Number(form.residualImpact),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Create failed')
      } else {
        router.push('/risks')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const scoreStyle = (s: number) => s >= 15 ? 'bg-purple-100 text-purple-700' : s >= 9 ? 'bg-red-100 text-red-700' : s >= 4 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
  const scoreLabel = (s: number) => s >= 15 ? 'CRITICAL' : s >= 9 ? 'HIGH' : s >= 4 ? 'MEDIUM' : 'LOW'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Risk Details</h2>

        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category} onChange={e => handleChange('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Title <span className="text-red-500">*</span></label>
          <input className={inputCls} required value={form.title} onChange={e => handleChange('title', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>Description <span className="text-red-500">*</span></label>
          <textarea className={inputCls} rows={3} required value={form.description} onChange={e => handleChange('description', e.target.value)} />
        </div>

        {/* Inherent risk */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Inherent Risk (before controls)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Likelihood (1–5)</label>
              <select className={inputCls} value={form.likelihood} onChange={e => handleChange('likelihood', e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Impact (1–5)</label>
              <select className={inputCls} value={form.impact} onChange={e => handleChange('impact', e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#475569]">Inherent Score:</span>
            <span className={`inline-flex px-3 py-0.5 rounded font-bold text-sm ${scoreStyle(computedInherent)}`}>
              {computedInherent} — {scoreLabel(computedInherent)}
            </span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Current Controls <span className="text-red-500">*</span></label>
          <textarea className={inputCls} rows={3} required value={form.currentControls} onChange={e => handleChange('currentControls', e.target.value)} placeholder="Describe the controls currently in place..." />
        </div>

        {/* Residual risk */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Residual Risk (after controls)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Residual Likelihood (1–5)</label>
              <select className={inputCls} value={form.residualLikelihood} onChange={e => handleChange('residualLikelihood', e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Residual Impact (1–5)</label>
              <select className={inputCls} value={form.residualImpact} onChange={e => handleChange('residualImpact', e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#475569]">Residual Score:</span>
            <span className={`inline-flex px-3 py-0.5 rounded font-bold text-sm ${scoreStyle(computedResidual)}`}>
              {computedResidual} — {scoreLabel(computedResidual)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Owner <span className="text-red-500">*</span></label>
            <input className={inputCls} required value={form.owner} onChange={e => handleChange('owner', e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label className={labelCls}>Review Date <span className="text-red-500">*</span></label>
            <input type="date" className={inputCls} required value={form.reviewDate} onChange={e => handleChange('reviewDate', e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={e => handleChange('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-5 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50">
          {loading ? 'Creating…' : 'Create Risk'}
        </button>
        <button type="button" onClick={() => router.push('/risks')} className="px-5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-lg hover:bg-[#F1F5F9]">
          Cancel
        </button>
      </div>
    </form>
  )
}
