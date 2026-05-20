/* WF-02: Gift & Hospitality Register — 4 lanes, 5 stages */
const NAVY = '#0F1929'
const BLUE = '#1D5FAB'
const LIGHT_BLUE = '#DBEAFE'
const AMBER_FILL = '#FEF3C7'
const AMBER_STROKE = '#D97706'
const GREEN_FILL = '#D1FAE5'
const GREEN_STROKE = '#059669'
const PURPLE_FILL = '#EDE9FE'
const PURPLE_STROKE = '#7C3AED'
const ARROW = '#64748B'
const TEXT = '#0F172A'
const LANE_ALT = '#F8FAFC'

type BoxProps = { cx: number; cy: number; label: string; sub?: string }
type DiamondProps = { cx: number; cy: number; label: string }
type PillProps = { cx: number; cy: number; label: string; fill: string; stroke: string }
type ArrowProps = { d: string }

function Box({ cx, cy, label, sub }: BoxProps) {
  return (
    <g>
      <rect x={cx - 58} y={cy - 22} width={116} height={sub ? 48 : 38} rx={8}
        fill={LIGHT_BLUE} stroke={BLUE} strokeWidth={1.5} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={11} fontWeight={600} fill={TEXT}>{label}</text>
      {sub && <text x={cx} y={cy + 14} textAnchor="middle" fontSize={9} fill="#475569">{sub}</text>}
    </g>
  )
}

function Diamond({ cx, cy, label }: DiamondProps) {
  const w = 56, h = 32
  const points = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`
  return (
    <g>
      <polygon points={points} fill={AMBER_FILL} stroke={AMBER_STROKE} strokeWidth={1.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={TEXT}>{label}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize={9} fill={AMBER_STROKE}>≤EUR 25?</text>
    </g>
  )
}

function Pill({ cx, cy, label, fill, stroke }: PillProps) {
  return (
    <g>
      <rect x={cx - 52} y={cy - 11} width={104} height={22} rx={11} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={stroke}>{label}</text>
    </g>
  )
}

function Arrow({ d }: ArrowProps) {
  return (
    <path d={d} fill="none" stroke={ARROW} strokeWidth={1.5}
      markerEnd="url(#ghArrow)" strokeLinejoin="round" />
  )
}

function DashedLine({ d }: ArrowProps) {
  return <path d={d} fill="none" stroke="#94A3B8" strokeWidth={1} strokeDasharray="4 3" />
}

export default function WorkflowGHR() {
  const W = 1140, H = 460
  const LABEL_W = 128
  const TITLE_H = 40
  const LANE_H = 105
  const stageW = (W - LABEL_W) / 5
  const sx = (i: number) => LABEL_W + stageW * i + stageW / 2
  const ly = (i: number) => TITLE_H + LANE_H * i + LANE_H / 2

  const S = [0, 1, 2, 3, 4].map(sx)
  const L = [0, 1, 2, 3].map(ly)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="WF-02 GHR Swimlane Workflow">
      <defs>
        <marker id="ghArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={ARROW} />
        </marker>
      </defs>

      {/* Lane backgrounds */}
      {[0, 2].map(i => (
        <rect key={i} x={LABEL_W} y={TITLE_H + LANE_H * i} width={W - LABEL_W} height={LANE_H} fill={LANE_ALT} />
      ))}

      {/* Title bar */}
      <rect x={0} y={0} width={W} height={TITLE_H} fill={NAVY} />
      <text x={W / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill="white" fontFamily="Syne, sans-serif">
        WF-02: Gift & Hospitality Register (GHR) — 5 Stages · EUR 25 Threshold · Art. 7
      </text>

      {/* Stage headers */}
      {['1 · Submit', '2 · Threshold Check', '3 · CO Review', '4 · CCO Approval', '5 · Archive'].map((label, i) => (
        <text key={i} x={S[i]} y={TITLE_H + 13} textAnchor="middle" fontSize={9} fill="#94A3B8">{label}</text>
      ))}

      {/* Stage separators */}
      {[1, 2, 3, 4].map(i => (
        <line key={i} x1={LABEL_W + stageW * i} y1={TITLE_H} x2={LABEL_W + stageW * i} y2={H}
          stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 3" />
      ))}

      {/* Lane borders */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={0} y1={TITLE_H + LANE_H * i} x2={W} y2={TITLE_H + LANE_H * i} stroke="#E2E8F0" strokeWidth={1} />
      ))}

      {/* Lane labels */}
      <rect x={0} y={TITLE_H} width={LABEL_W} height={H - TITLE_H} fill={NAVY} />
      {[
        ['Employee /\nManager', L[0]],
        ['Compliance\nOfficer (CO)', L[1]],
        ['CCO', L[2]],
        ['System', L[3]],
      ].map(([label, y], i) => (
        <text key={i} x={LABEL_W / 2} y={+(y as number) - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">
          {(label as string).split('\n').map((line, j) => (
            <tspan key={j} x={LABEL_W / 2} dy={j === 0 ? 0 : 14}>{line}</tspan>
          ))}
        </text>
      ))}

      {/* Activities */}
      <Box cx={S[0]} cy={L[0]} label="Submit GHR" sub="value + party type" />
      <Diamond cx={S[1]} cy={L[3]} label="Threshold" />
      <Box cx={S[2]} cy={L[1]} label="CO Review" sub="compliance check" />
      <Box cx={S[3]} cy={L[2]} label="CCO Approve" sub="public official" />
      <Box cx={S[4]} cy={L[1]} label="Archive" sub="outcome recorded" />

      {/* Auto-approve note */}
      <rect x={S[4] - 56} y={L[0] - 16} width={112} height={30} rx={6}
        fill={GREEN_FILL} stroke={GREEN_STROKE} strokeWidth={1.2} />
      <text x={S[4]} y={L[0] - 5} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={GREEN_STROKE}>Auto-Approve</text>
      <text x={S[4]} y={L[0] + 8} textAnchor="middle" fontSize={9} fill={GREEN_STROKE}>≤EUR 25, private</text>

      {/* SLA + notification pills */}
      <Pill cx={S[2]} cy={L[3]} label="Notify: CO" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />
      <Pill cx={S[3]} cy={L[3]} label="Notify: CCO" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />

      {/* Arrows */}
      {/* Submit → Threshold */}
      <Arrow d={`M ${S[0] + 58},${L[0]} H ${(S[0] + S[1]) / 2} V ${L[3]} H ${S[1] - 56}`} />
      {/* Threshold >25 or public → CO Review */}
      <Arrow d={`M ${S[1] - 8},${L[3] - 32} V ${L[1] + 22} H ${S[2] - 58}`} />
      {/* Threshold ≤25 private → Auto-Approve → Archive */}
      <Arrow d={`M ${S[1] + 56},${L[3]} H ${S[4]} V ${L[0] + 14}`} />
      {/* CO Review → CCO Approval (public official) */}
      <Arrow d={`M ${S[2] + 58},${L[1]} H ${(S[2] + S[3]) / 2} V ${L[2]} H ${S[3] - 58}`} />
      {/* CO Review → Archive (non-public official) */}
      <Arrow d={`M ${S[2] + 58},${L[1]} H ${S[4] - 58}`} />
      {/* CCO Approval → Archive */}
      <Arrow d={`M ${S[3] + 58},${L[2]} H ${(S[3] + S[4]) / 2} V ${L[1] + 22} H ${S[4] - 58}`} />

      {/* Decision labels */}
      <text x={S[1] - 62} y={L[3] - 20} fontSize={9} fill={AMBER_STROKE} fontWeight={600}>{'>'} EUR 25</text>
      <text x={S[1] + 62} y={L[3] - 4} fontSize={9} fill={GREEN_STROKE} fontWeight={600}>≤ EUR 25</text>

      <DashedLine d={`M ${S[2]},${L[3] - 11} V ${L[1] + 22}`} />
      <DashedLine d={`M ${S[3]},${L[3] - 11} V ${L[2] + 16}`} />

      <rect x={0} y={0} width={W} height={H} fill="none" stroke="#E2E8F0" strokeWidth={1} />
    </svg>
  )
}
