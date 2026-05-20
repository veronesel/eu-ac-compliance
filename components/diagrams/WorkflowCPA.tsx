/* WF-07: Compliance Programme Assessment — 4 lanes, 5 stages */
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
  const w = 52, h = 30
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
      <rect x={cx - 54} y={cy - 11} width={108} height={22} rx={11} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={stroke}>{label}</text>
    </g>
  )
}

function Arrow({ d }: ArrowProps) {
  return (
    <path d={d} fill="none" stroke={ARROW} strokeWidth={1.5}
      markerEnd="url(#cpaArrow)" strokeLinejoin="round" />
  )
}

function DashedLine({ d }: ArrowProps) {
  return <path d={d} fill="none" stroke="#94A3B8" strokeWidth={1} strokeDasharray="4 3" />
}

export default function WorkflowCPA() {
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
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="WF-07 CPA Swimlane Workflow">
      <defs>
        <marker id="cpaArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={ARROW} />
        </marker>
      </defs>

      {[0, 2].map(i => (
        <rect key={i} x={LABEL_W} y={TITLE_H + LANE_H * i} width={W - LABEL_W} height={LANE_H} fill={LANE_ALT} />
      ))}

      <rect x={0} y={0} width={W} height={TITLE_H} fill={NAVY} />
      <text x={W / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill="white" fontFamily="Syne, sans-serif">
        WF-07: Compliance Programme Assessment (CPA) — 5 Stages · Art. 16(b)/(c) — Evidence Package
      </text>

      {['1 · Scope', '2 · Gather Evidence', '3 · Assess', '4 · Score & Approve', '5 · Report'].map((label, i) => (
        <text key={i} x={S[i]} y={TITLE_H + 13} textAnchor="middle" fontSize={9} fill="#94A3B8">{label}</text>
      ))}

      {[1, 2, 3, 4].map(i => (
        <line key={i} x1={LABEL_W + stageW * i} y1={TITLE_H} x2={LABEL_W + stageW * i} y2={H}
          stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 3" />
      ))}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={0} y1={TITLE_H + LANE_H * i} x2={W} y2={TITLE_H + LANE_H * i} stroke="#E2E8F0" strokeWidth={1} />
      ))}

      <rect x={0} y={TITLE_H} width={LABEL_W} height={H - TITLE_H} fill={NAVY} />
      {[
        ['Compliance\nOfficer (CO)', L[0]],
        ['CCO', L[1]],
        ['Internal\nAuditor', L[2]],
        ['System', L[3]],
      ].map(([label, y], i) => (
        <text key={i} x={LABEL_W / 2} y={+(y as number) - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">
          {(label as string).split('\n').map((line, j) => (
            <tspan key={j} x={LABEL_W / 2} dy={j === 0 ? 0 : 14}>{line}</tspan>
          ))}
        </text>
      ))}

      {/* Activities */}
      <Box cx={S[0]} cy={L[1]} label="Define Scope" sub="obligations + risks" />
      <Box cx={S[1]} cy={L[0]} label="Gather Evidence" sub="CTR, GHR, CIR data" />
      <Box cx={S[2]} cy={L[2]} label="Audit Review" sub="independent check" />
      <Diamond cx={S[3]} cy={L[1]} label="Score ≥ 80?" />
      <Box cx={S[4]} cy={L[1]} label="Issue Report" sub="Art. 16(c) package" />

      {/* Score ≥ 80: Certified */}
      <rect x={S[3] - 50} y={L[2] - 16} width={100} height={30} rx={6}
        fill={GREEN_FILL} stroke={GREEN_STROKE} strokeWidth={1.5} />
      <text x={S[3]} y={L[2] - 5} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={GREEN_STROKE}>Certified</text>
      <text x={S[3]} y={L[2] + 8} textAnchor="middle" fontSize={9} fill={GREEN_STROKE}>score ≥ 80</text>

      {/* Score < 80: Remediation Plan */}
      <rect x={S[4] - 54} y={L[0] - 16} width={108} height={30} rx={6}
        fill={RED_FILL} stroke={RED_STROKE} strokeWidth={1.5} />
      <text x={S[4]} y={L[0] - 5} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={RED_STROKE}>Remediation Plan</text>
      <text x={S[4]} y={L[0] + 8} textAnchor="middle" fontSize={9} fill={RED_STROKE}>score {'<'} 80</text>

      {/* Effectiveness score formula box */}
      <rect x={S[2] - 58} y={L[1] - 20} width={116} height={38} rx={8}
        fill={AMBER_FILL} stroke={AMBER_STROKE} strokeWidth={1.2} />
      <text x={S[2]} y={L[1] - 6} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={TEXT}>Score Formula</text>
      <text x={S[2]} y={L[1] + 7} textAnchor="middle" fontSize={8.5} fill={AMBER_STROKE}>Obl×30+Pol×20+Tr×25+Ctrl×25</text>

      {/* Pills */}
      <Pill cx={S[0]} cy={L[3]} label="Annual cycle" fill={GREEN_FILL} stroke={GREEN_STROKE} />
      <Pill cx={S[1]} cy={L[3]} label="Auto: pull data" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />
      <Pill cx={S[4]} cy={L[3]} label="Art. 16(b)/(c)" fill={LIGHT_BLUE} stroke={BLUE} />

      {/* Arrows */}
      <Arrow d={`M ${S[0] + 58},${L[1]} H ${(S[0] + S[1]) / 2} V ${L[0]} H ${S[1] - 58}`} />
      <Arrow d={`M ${S[1] + 58},${L[0]} H ${(S[1] + S[2]) / 2} V ${L[2]} H ${S[2] - 58}`} />
      <Arrow d={`M ${S[2] + 58},${L[2]} H ${(S[2] + S[3]) / 2} V ${L[1]} H ${S[3] - 52}`} />
      {/* Score ≥ 80 → Certified */}
      <Arrow d={`M ${S[3]},${L[1] + 30} V ${L[2] - 16}`} />
      {/* Score < 80 → Remediation */}
      <Arrow d={`M ${S[3] + 52},${L[1]} H ${(S[3] + S[4]) / 2} V ${L[0]} H ${S[4] - 54}`} />
      {/* Both → Report */}
      <Arrow d={`M ${S[3] + 52},${L[2]} H ${(S[3] + S[4]) / 2} V ${L[1]} H ${S[4] - 58}`} />
      <Arrow d={`M ${S[4]},${L[0] + 14} V ${L[1] - 22}`} />

      {/* Score formula → diamond */}
      <DashedLine d={`M ${S[2] + 58},${L[1]} H ${S[3] - 52}`} />

      <text x={S[3] + 8} y={L[1] + 52} fontSize={9} fill={GREEN_STROKE} fontWeight={600}>Yes ↓</text>
      <text x={S[3] + 56} y={L[1] - 4} fontSize={9} fill={RED_STROKE} fontWeight={600}>No →</text>

      <DashedLine d={`M ${S[0]},${L[3] - 11} V ${L[1] + 22}`} />
      <DashedLine d={`M ${S[1]},${L[3] - 11} V ${L[0] + 22}`} />

      <rect x={0} y={0} width={W} height={H} fill="none" stroke="#E2E8F0" strokeWidth={1} />
    </svg>
  )
}
