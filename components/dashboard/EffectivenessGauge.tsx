'use client'

interface GaugeProps {
  score: number
  components: {
    obligation: number
    policy: number
    training: number
    control: number
  }
}

function getColour(score: number): string {
  if (score >= 80) return '#15803D'
  if (score >= 66) return '#84cc16'
  if (score >= 40) return '#B45309'
  return '#B91C1C'
}

export default function EffectivenessGauge({ score, components }: GaugeProps) {
  // Arc: centre (110, 105), radius 80, sweep 240° from 210° clockwise
  const cx = 110, cy = 105, r = 80
  const startAngle = 210 * (Math.PI / 180)
  const sweep = 240 * (Math.PI / 180)
  const endAngle = startAngle + sweep

  const toXY = (angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  })

  const start = toXY(startAngle)
  const end = toXY(endAngle)
  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`

  const pct = Math.max(0, Math.min(100, score)) / 100
  const fillAngle = startAngle + sweep * pct
  const fillEnd = toXY(fillAngle)
  const large = pct > 0.5 ? 1 : 0
  const fillPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${fillEnd.x} ${fillEnd.y}`

  const colour = getColour(score)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 160" width="200" height="145" role="img" aria-label={`Compliance effectiveness score: ${score} out of 100`}>
        <title>Compliance Programme Effectiveness Score</title>
        {/* Track */}
        <path d={trackPath} fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
        {/* Fill */}
        <path d={fillPath} fill="none" stroke={colour} strokeWidth="14" strokeLinecap="round" />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fontSize="32"
          fontWeight="800"
          fill="#0F172A"
          fontFamily="Syne, sans-serif"
        >
          {score}
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="11" fill="#94A3B8">
          / 100
        </text>
        <text x={cx} y={cy - 18} textAnchor="middle" fontSize="9" fill="#475569">
          Effectiveness Score
        </text>
      </svg>
    </div>
  )
}
