interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, string> = {
  // Incident
  DRAFT:           'bg-slate-100 text-slate-600',
  TRIAGE:          'bg-blue-100 text-blue-700',
  INVESTIGATION:   'bg-purple-100 text-purple-700',
  FINDINGS_REVIEW: 'bg-amber-100 text-amber-700',
  DISCLOSURE:      'bg-orange-100 text-orange-700',
  REMEDIATION:     'bg-cyan-100 text-cyan-700',
  CLOSED:          'bg-green-100 text-green-700',
  // Gift
  PENDING_MANAGER: 'bg-amber-100 text-amber-700',
  PENDING_CO:      'bg-blue-100 text-blue-700',
  APPROVED:        'bg-green-100 text-green-700',
  REJECTED:        'bg-red-100 text-red-700',
  RETURNED:        'bg-slate-100 text-slate-600',
  AUTO_APPROVED:   'bg-green-50 text-green-600',
  // COI
  NO_CONFLICT:     'bg-green-100 text-green-700',
  MANAGEABLE:      'bg-amber-100 text-amber-700',
  ACTUAL:          'bg-red-100 text-red-700',
  ACTIVE_MANAGED:  'bg-cyan-100 text-cyan-700',
  RESOLVED:        'bg-slate-100 text-slate-600',
  // WR
  RECEIVED:        'bg-blue-100 text-blue-700',
  ACKNOWLEDGED:    'bg-amber-100 text-amber-700',
  FEEDBACK_SENT:   'bg-cyan-100 text-cyan-700',
  // DDQ
  SENT:            'bg-blue-100 text-blue-700',
  CO_REVIEW:       'bg-amber-100 text-amber-700',
  ENHANCED:        'bg-orange-100 text-orange-700',
  NOT_STARTED:     'bg-slate-100 text-slate-500',
  // Controls
  ASSIGNED:        'bg-blue-100 text-blue-700',
  IN_PROGRESS:     'bg-purple-100 text-purple-700',
  UNDER_REVIEW:    'bg-amber-100 text-amber-700',
  EFFECTIVE:       'bg-green-100 text-green-700',
  // Assessment
  CCO_REVIEW:      'bg-purple-100 text-purple-700',
  SIGNED_OFF:      'bg-green-100 text-green-700',
  ARCHIVED:        'bg-slate-100 text-slate-600',
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const cls = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'
  const label = status.replace(/_/g, ' ')
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${cls}`}>
      {label}
    </span>
  )
}
