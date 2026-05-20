/* WF-03: Conflict of Interest — 4 lanes, 6 stages */
const NAVY = '#0F1929'
const BLUE = '#1D5FAB'
const LIGHT_BLUE = '#DBEAFE'
const AMBER_FILL = '#FEF3C7'
const AMBER_STROKE = '#D97706'
const GREEN_FILL = '#D1FAE5'
const GREEN_STROKE = '#059669'
const PURPLE_FILL = '#EDE9FE'
const PURPLE_STROKE = '#7C3AED'
const RED_FILL = '#FEE2E2'
const RED_STROKE = '#DC2626'
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
  const w = 50, h = 28
  const points = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`
  return (
    <g>
      <polygon points={points} fill={AMBER_FILL} stroke={AMBER_STROKE} strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={TEXT}>{label}</text>
    </g>
  )
}

function Pill({ cx, cy, label, fill, stroke }: PillProps) {
  return (
    <g>
      <rect x={cx - 50} y={cy - 11} width={100} height={22} rx={11} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={stroke}>{label}</text>
    </g>
  )
}

function Arrow({ d }: ArrowProps) {
  return (
    <path d={d} fill="none" stroke={ARROW} strokeWidth={1.5}
      markerEnd="url(#coiArrow)" strokeLinejoin="round" />
  )
}

export default function WorkflowCOI() {
  const W = 1140, H = 460
  const LABEL_W = 128
  const TITLE_H = 40
  const LANE_H = 105
  const stageW = (W - LABEL_W) / 6
  const sx = (i: number) => LABEL_W + stageW * i + stageW / 2
  const ly = (i: number) => TITLE_H + LANE_H * i + LANE_H / 2

  const S = [0, 1, 2, 3, 4, 5].map(sx)
  const L = [0, 1, 2, 3].map(ly)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="WF-03 COI Swimlane Workflow">
      <defs>
        <marker id="coiArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={ARROW} />
        </marker>
      </defs>

      {[0, 2].map(i => (
        <rect key={i} x={LABEL_W} y={TITLE_H + LANE_H * i} width={W - LABEL_W} height={LANE_H} fill={LANE_ALT} />
      ))}

      <rect x={0} y={0} width={W} height={TITLE_H} fill={NAVY} />
      <text x={W / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill="white" fontFamily="Syne, sans-serif">
        WF-03: Conflict of Interest (COI) — 6 Stages · Art. 10 — Recusal & Mitigation
      </text>

      {['1 · Declare', '2 · Assess Severity', '3 · Mitigation Plan', '4 · Approve', '5 · Monitor', '6 · Close'].map((label, i) => (
        <text key={i} x={S[i]} y={TITLE_H + 13} textAnchor="middle" fontSize={9} fill="#94A3B8">{label}</text>
      ))}

      {[1, 2, 3, 4, 5].map(i => (
        <line key={i} x1={LABEL_W + stageW * i} y1={TITLE_H} x2={LABEL_W + stageW * i} y2={H}
          stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 3" />
      ))}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={0} y1={TITLE_H + LANE_H * i} x2={W} y2={TITLE_H + LANE_H * i} stroke="#E2E8F0" strokeWidth={1} />
      ))}

      <rect x={0} y={TITLE_H} width={LABEL_W} height={H - TITLE_H} fill={NAVY} />
      {[
        ['Employee /\nLine Manager', L[0]],
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
      <Box cx={S[0]} cy={L[0]} label="Declare COI" sub="role + nature" />
      <Diamond cx={S[1]} cy={L[1]} label="Severity?" />
      <Box cx={S[2]} cy={L[1]} label="Mitigation Plan" sub="recusal / firewall" />
      <Box cx={S[3]} cy={L[2]} label="CCO Approve" sub="sign-off required" />
      <Box cx={S[4]} cy={L[1]} label="Monitor" sub="periodic review" />
      <Box cx={S[5]} cy={L[1]} label="Closed" />

      {/* Reject / Escalate path */}
      <rect x={S[1] - 52} y={L[2] - 16} width={104} height={30} rx={6}
        fill={RED_FILL} stroke={RED_STROKE} strokeWidth={1.2} />
      <text x={S[1]} y={L[2] - 5} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={RED_STROKE}>Escalate</text>
      <text x={S[1]} y={L[2] + 8} textAnchor="middle" fontSize={9} fill={RED_STROKE}>High severity → CCO</text>

      {/* Notification pills */}
      <Pill cx={S[1]} cy={L[3]} label="Notify: CO" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />
      <Pill cx={S[3]} cy={L[3]} label="Notify: CCO" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />
      <Pill cx={S[4]} cy={L[3]} label="Review: 90d" fill={GREEN_FILL} stroke={GREEN_STROKE} />

      {/* Arrows */}
      <Arrow d={`M ${S[0] + 58},${L[0]} H ${(S[0] + S[1]) / 2} V ${L[1]} H ${S[1] - 50}`} />
      {/* Low severity: Mitigation Plan */}
      <Arrow d={`M ${S[1] + 50},${L[1]} H ${S[2] - 58}`} />
      {/* High severity: Escalate */}
      <Arrow d={`M ${S[1]},${L[1] + 28} V ${L[2] - 16}`} />
      {/* Mitigation → Approve */}
      <Arrow d={`M ${S[2] + 58},${L[1]} H ${(S[2] + S[3]) / 2} V ${L[2]} H ${S[3] - 58}`} />
      {/* Escalate → Approve */}
      <Arrow d={`M ${S[1] + 52},${L[2]} H ${(S[1] + S[3]) / 2} V ${L[2]} H ${S[3] - 58}`} />
      {/* Approve → Monitor */}
      <Arrow d={`M ${S[3] + 58},${L[2]} H ${(S[3] + S[4]) / 2} V ${L[1]} H ${S[4] - 58}`} />
      {/* Monitor → Closed */}
      <Arrow d={`M ${S[4] + 58},${L[1]} H ${S[5] - 58}`} />

      <text x={S[1] + 56} y={L[1] - 4} fontSize={9} fill={GREEN_STROKE} fontWeight={600}>Low</text>
      <text x={S[1] + 6} y={L[1] + 44} fontSize={9} fill={RED_STROKE} fontWeight={600}>High</text>

      <rect x={0} y={0} width={W} height={H} fill="none" stroke="#E2E8F0" strokeWidth={1} />
    </svg>
  )
}
