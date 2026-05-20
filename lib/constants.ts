export const SLA = {
  TRIAGE_DAYS: parseInt(process.env.NEXT_PUBLIC_SLA_TRIAGE_DAYS ?? '5'),
  INVESTIGATION_DAYS: parseInt(process.env.NEXT_PUBLIC_SLA_INVESTIGATION_DAYS ?? '30'),
  DISCLOSURE_DAYS: parseInt(process.env.NEXT_PUBLIC_SLA_DISCLOSURE_DAYS ?? '14'),
  WR_ACK_DAYS: parseInt(process.env.NEXT_PUBLIC_SLA_WR_ACK_DAYS ?? '7'),
  WR_FEEDBACK_DAYS: parseInt(process.env.NEXT_PUBLIC_SLA_WR_FEEDBACK_DAYS ?? '90'),
} as const

export const GHR_THRESHOLD_EUR = parseFloat(process.env.NEXT_PUBLIC_GHR_THRESHOLD_EUR ?? '25')
export const DEFAULT_WORLDWIDE_TURNOVER = parseFloat(process.env.NEXT_PUBLIC_WORLDWIDE_TURNOVER ?? '2500000000')

export const INCIDENT_STATUSES = ['DRAFT', 'TRIAGE', 'INVESTIGATION', 'FINDINGS_REVIEW', 'DISCLOSURE', 'REMEDIATION', 'CLOSED'] as const
export type IncidentStatus = typeof INCIDENT_STATUSES[number]

export const GIFT_STATUSES = ['PENDING_MANAGER', 'PENDING_CO', 'APPROVED', 'REJECTED', 'RETURNED', 'AUTO_APPROVED'] as const
export type GiftStatus = typeof GIFT_STATUSES[number]

export const COI_STATUSES = ['DRAFT', 'PENDING_CO', 'NO_CONFLICT', 'MANAGEABLE', 'ACTUAL', 'ACTIVE_MANAGED', 'RESOLVED'] as const
export type COIStatus = typeof COI_STATUSES[number]

export const WR_STATUSES = ['RECEIVED', 'ACKNOWLEDGED', 'TRIAGE', 'INVESTIGATION', 'FEEDBACK_SENT', 'CLOSED'] as const
export type WRStatus = typeof WR_STATUSES[number]

export const DDQ_STATUSES = ['DRAFT', 'SENT', 'RECEIVED', 'CO_REVIEW', 'APPROVED', 'REJECTED', 'ENHANCED'] as const
export const CONTROL_STATUSES = ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'EFFECTIVE', 'REMEDIATION', 'CLOSED'] as const
export const ASSESSMENT_STATUSES = ['DRAFT', 'CO_REVIEW', 'CCO_REVIEW', 'SIGNED_OFF', 'ARCHIVED'] as const

export const SEVERITY_COLOURS = {
  CRITICAL: { bg: '#EDE9FE', text: '#6D28D9', border: '#6D28D9' },
  HIGH:     { bg: '#FEE2E2', text: '#B91C1C', border: '#B91C1C' },
  MEDIUM:   { bg: '#FEF3C7', text: '#B45309', border: '#B45309' },
  LOW:      { bg: '#F1F5F9', text: '#64748B', border: '#64748B' },
} as const

export const ALLEGATION_TYPES = ['Bribery', 'Trading in Influence', 'Misappropriation', 'Obstruction', 'Other'] as const
export const COUNTERPARTY_TYPES = ['PRIVATE', 'PUBLIC_OFFICIAL', 'REGULATOR'] as const
export const INTEREST_TYPES = ['Financial', 'Personal', 'Professional', 'Other'] as const
export const THIRD_PARTY_TYPES = ['Agent', 'Distributor', 'Consultant', 'JV Partner', 'Lobbyist'] as const
export const CONTROL_TYPES = ['Preventive', 'Detective', 'Corrective'] as const
export const RISK_CATEGORIES = ['Bribery', 'Trading in Influence', 'Misappropriation', 'Third-Party', 'Emerging'] as const
