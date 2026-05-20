export function calculateEffectivenessScore(params: {
  obligationCovPct: number
  policyAckPct: number
  trainingPct: number
  controlEffPct: number
  openCriticalCount: number
  openHighCount: number
}): number {
  const base =
    params.obligationCovPct * 0.30 +
    params.policyAckPct     * 0.20 +
    params.trainingPct      * 0.25 +
    params.controlEffPct    * 0.25
  const penalty = Math.min(
    params.openCriticalCount * 5 + params.openHighCount * 2,
    30
  )
  return Math.max(0, Math.round(base - penalty))
}

export function calculatePenaltyExposure(params: {
  worldwideTurnover: number
  articleGroup: '3-5' | '6-8-9'
}): { pctAmount: number; flatAmount: number; maxPenalty: number } {
  const pctRate    = params.articleGroup === '3-5' ? 0.05 : 0.03
  const flatAmount = params.articleGroup === '3-5' ? 40_000_000 : 24_000_000
  const pctAmount  = params.worldwideTurnover * pctRate
  return { pctAmount, flatAmount, maxPenalty: Math.max(pctAmount, flatAmount) }
}

export function classifyRapidity(discoveryDate: Date, decisionDate: Date): 'RAPID' | 'PROMPT' | 'DELAYED' {
  const days = Math.floor((decisionDate.getTime() - discoveryDate.getTime()) / 86_400_000)
  if (days <= 14) return 'RAPID'
  if (days <= 30) return 'PROMPT'
  return 'DELAYED'
}

export function calculateDDQScore(
  responses: Record<string, number>,
  weights: Record<string, number>
): number {
  const total = Object.entries(responses).reduce((sum, [key, value]) => {
    return sum + (value * (weights[key] ?? 1))
  }, 0)
  const maxPossible = Object.values(weights).reduce((s, w) => s + 5 * w, 0)
  if (maxPossible === 0) return 0
  return Math.round((total / maxPossible) * 100)
}

export function determineGHRRouting(value: number, isPublicOfficial: boolean): {
  requiresCOReview: boolean
  requiresManagerOnly: boolean
  reason: string
} {
  if (isPublicOfficial) return {
    requiresCOReview: true,
    requiresManagerOnly: false,
    reason: 'Public Official counterparty — CO review required regardless of value (Art. 15(2)(f))',
  }
  if (value > 25) return {
    requiresCOReview: true,
    requiresManagerOnly: false,
    reason: `Value EUR ${value.toFixed(2)} exceeds EUR 25 de minimis threshold`,
  }
  return {
    requiresCOReview: false,
    requiresManagerOnly: false,
    reason: 'Below EUR 25 threshold — auto-approve after manager review',
  }
}

export function formatEUR(amount: number): string {
  return `EUR ${amount.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysElapsed(from: Date | string, to?: Date | string): number {
  const start = typeof from === 'string' ? new Date(from) : from
  const end   = to ? (typeof to === 'string' ? new Date(to) : to) : new Date()
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000)
}
