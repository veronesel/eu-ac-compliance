'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  title: string
  description: string
  controlType: string
  owner: string
  tester: string
  status: string
  testResult: string | null
  reviewNotes: string | null
  remediationPlan: string | null
  remediationDue: string | null
  evidenceRefs: string[]
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D5FAB]/30 focus:border-[#1D5FAB]'
const labelCls = 'block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1'

const STATUSES = ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'EFFECTIVE', 'INEFFECTIVE', 'REMEDIATION']
const TEST_RESULTS = ['', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE']
const CONTROL_TYPES = ['Preventive', 'Detective', 'Corrective']

export default function ControlEditForm(props: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: props.title,
    description: props.description,
    controlType: props.controlType,
    owner: props.owner,
    tester: props.tester ?? '',
    status: props.status,
    testResult: props.testResult ?? '',
    reviewNotes: props.reviewNotes ?? '',
    remediationPlan: props.remediationPlan ?? '',
    remediationDue: props.remediationDue ?? '',
    evidenceRefs: props.evidenceRefs.join(', '),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fr25Error = form.owner && form.tester && form.owner === form.tester
    ? 'FR-25: Owner and tester must be different individuals.'
    : null

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(false)
  }

  function handleReset() {
    setForm({
      title: props.title,
      description: props.description,
      controlType: props.controlType,
      owner: props.owner,
      tester: props.tester ?? '',
      status: props.status,
      testResult: props.testResult ?? '',
      reviewNotes: props.reviewNotes ?? '',
      remediationPlan: props.remediationPlan ?? '',
      remediationDue: props.remediationDue ?? '',
      evidenceRefs: props.evidenceRefs.join(', '),
    })
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (fr25Error) return
    setLoading(true)
    setError(null)
    setSuccess(false)

    const parsedRefs = form.evidenceRefs ? form.evidenceRefs.split(',').map(s => s.trim()).filter(Boolean) : []

    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      controlType: form.controlType,
      owner: form.owner,
      tester: form.tester || null,
      status: form.status,
      testResult: form.testResult || null,
      reviewNotes: form.reviewNotes || null,
      remediationPlan: form.testResult === 'INEFFECTIVE' ? (form.remediationPlan || null) : null,
      remediationDue: form.testResult === 'INEFFECTIVE' && form.remediationDue
        ? new Date(form.remediationDue).toISOString()
        : null,
      evidenceRefs: JSON.stringify(parsedRefs),
    }

    try {
      const res = await fetch(`/api/controls/${props.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Edit Control</h2>
        <span className="text-xs text-[#94A3B8]">CO/CCO/SCHEDULER only</span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Saved successfully.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={form.title} onChange={e => handleChange('title', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea className={inputCls} rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>Control Type</label>
          <select className={inputCls} value={form.controlType} onChange={e => handleChange('controlType', e.target.value)}>
            {CONTROL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              Owner
              <span className="ml-1 text-[#94A3B8] normal-case font-normal">(must differ from tester)</span>
            </label>
            <input
              className={`${inputCls}${fr25Error ? ' border-red-400' : ''}`}
              value={form.owner}
              onChange={e => handleChange('owner', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>
              Tester
              <span className="ml-1 text-[#94A3B8] normal-case font-normal">(must differ from owner)</span>
            </label>
            <input
              className={`${inputCls}${fr25Error ? ' border-red-400' : ''}`}
              value={form.tester}
              onChange={e => handleChange('tester', e.target.value)}
            />
          </div>
        </div>

        {fr25Error && (
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
            {fr25Error}
          </div>
        )}

        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={e => handleChange('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Test Result</label>
          <select className={inputCls} value={form.testResult} onChange={e => handleChange('testResult', e.target.value)}>
            {TEST_RESULTS.map(r => <option key={r} value={r}>{r === '' ? '—' : r.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Review Notes</label>
          <textarea className={inputCls} rows={3} value={form.reviewNotes} onChange={e => handleChange('reviewNotes', e.target.value)} />
        </div>

        {form.testResult === 'INEFFECTIVE' && (
          <>
            <div>
              <label className={labelCls}>Remediation Plan</label>
              <textarea className={inputCls} rows={3} value={form.remediationPlan} onChange={e => handleChange('remediationPlan', e.target.value)} placeholder="Describe the remediation steps..." />
            </div>
            <div>
              <label className={labelCls}>Remediation Due Date</label>
              <input type="date" className={inputCls} value={form.remediationDue} onChange={e => handleChange('remediationDue', e.target.value)} />
            </div>
          </>
        )}

        <div>
          <label className={labelCls}>Evidence References (comma-separated)</label>
          <textarea className={inputCls} rows={2} value={form.evidenceRefs} onChange={e => handleChange('evidenceRefs', e.target.value)} placeholder="Policy-ACK-2026.pdf, Test-Report.xlsx" />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !!fr25Error}
            className="px-5 py-2 bg-[#1D5FAB] text-white text-sm font-semibold rounded-lg hover:bg-[#1a5298] disabled:opacity-50"
          >
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
