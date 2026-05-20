interface SeverityBadgeProps {
  severity: string
}

const STYLES: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: '#EDE9FE', text: '#6D28D9', border: '#6D28D9' },
  HIGH:     { bg: '#FEE2E2', text: '#B91C1C', border: '#B91C1C' },
  MEDIUM:   { bg: '#FEF3C7', text: '#B45309', border: '#B45309' },
  LOW:      { bg: '#F1F5F9', text: '#64748B', border: '#64748B' },
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const s = STYLES[severity] ?? STYLES.LOW
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border-l-2"
      style={{ backgroundColor: s.bg, color: s.text, borderLeftColor: s.border }}
    >
      {severity}
    </span>
  )
}
