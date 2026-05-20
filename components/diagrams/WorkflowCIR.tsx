/* WF-01: Corruption Incident Register — 5 lanes, 7 stages */
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
  const w = 52, h = 28
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
      <rect x={cx - 42} y={cy - 11} width={84} height={22} rx={11} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={stroke}>{label}</text>
    </g>
  )
}

function Arrow({ d }: ArrowProps) {
  return (
    <path d={d} fill="none" stroke={ARROW} strokeWidth={1.5}
      markerEnd="url(#arrowHead)" strokeLinejoin="round" />
  )
}

function DashedLine({ d }: ArrowProps) {
  return (
    <path d={d} fill="none" stroke="#94A3B8" strokeWidth={1}
      strokeDasharray="4 3" strokeLinejoin="round" />
  )
}

export default function WorkflowCIR() {
  // Layout constants
  const W = 1140, H = 556
  const LABEL_W = 128
  const TITLE_H = 40
  const LANE_H = 103
  const LANES = 5
  // Stage x-centres (7 stages in content width 1012)
  const stageW = (W - LABEL_W) / 7
  const sx = (i: number) => LABEL_W + stageW * i + stageW / 2
  // Lane y-centres
  const ly = (i: number) => TITLE_H + LANE_H * i + LANE_H / 2

  const S = [0, 1, 2, 3, 4, 5, 6].map(sx)
  const L = [0, 1, 2, 3, 4].map(ly)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="WF-01 CIR Swimlane Workflow">
      <defs>
        <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={ARROW} />
        </marker>
      </defs>

      {/* Lane backgrounds */}
      {[0, 2, 4].map(i => (
        <rect key={i} x={LABEL_W} y={TITLE_H + LANE_H * i} width={W - LABEL_W} height={LANE_H} fill={LANE_ALT} />
      ))}

      {/* Title bar */}
      <rect x={0} y={0} width={W} height={TITLE_H} fill={NAVY} />
      <text x={W / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill="white" fontFamily="Syne, sans-serif">
        WF-01: Corruption Incident Register (CIR) — 7 Stages · Arts. 4-9, 14(3), 16(c)/(d)
      </text>

      {/* Stage headers */}
      {['1 · Draft', '2 · Triage', '3 · Investigate', '4 · Findings', '5 · Disclosure', '6 · Remediation', '7 · Closed'].map((label, i) => (
        <text key={i} x={S[i]} y={TITLE_H + 13} textAnchor="middle" fontSize={9} fill="#94A3B8">{label}</text>
      ))}

      {/* Stage separator lines */}
      {[1, 2, 3, 4, 5, 6].map(i => (
        <line key={i} x1={LABEL_W + stageW * i} y1={TITLE_H} x2={LABEL_W + stageW * i} y2={H}
          stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 3" />
      ))}

      {/* Lane borders */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line key={i} x1={0} y1={TITLE_H + LANE_H * i} x2={W} y2={TITLE_H + LANE_H * i} stroke="#E2E8F0" strokeWidth={1} />
      ))}

      {/* Lane label column */}
      <rect x={0} y={TITLE_H} width={LABEL_W} height={H - TITLE_H} fill={NAVY} />
      {[
        ['Employee /\nReporter', L[0]],
        ['Compliance\nOfficer (CO)', L[1]],
        ['Investigator\n(CONF_INV)', L[2]],
        ['CCO', L[3]],
        ['System', L[4]],
      ].map(([label, y], i) => (
        <text key={i} x={LABEL_W / 2} y={+(y as number) - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">
          {(label as string).split('\n').map((line, j) => (
            <tspan key={j} x={LABEL_W / 2} dy={j === 0 ? 0 : 14}>{line}</tspan>
          ))}
        </text>
      ))}

      {/* ── Activities ── */}
      {/* S1 Draft - Employee */}
      <Box cx={S[0]} cy={L[0]} label="Draft Report" sub="CO or Employee" />
      {/* S2 Triage - CO */}
      <Box cx={S[1]} cy={L[1]} label="Triage" sub="5-day SLA" />
      {/* S3 Investigate - CONF_INV */}
      <Box cx={S[2]} cy={L[2]} label="Investigate" sub="30-day SLA" />
      {/* S4 Findings Review - CO */}
      <Box cx={S[3]} cy={L[1]} label="Review Findings" />
      {/* S5 Disclosure Decision - CCO */}
      <Diamond cx={S[4]} cy={L[3]} label="Disclose?" />
      {/* S6 Remediation - CO */}
      <Box cx={S[5]} cy={L[1]} label="Remediation" sub="90-day SLA" />
      {/* S7 Closed - CCO */}
      <Box cx={S[6]} cy={L[3]} label="Close Case" />

      {/* SLA pills - System lane */}
      <Pill cx={S[1]} cy={L[4]} label="SLA: 5d" fill={GREEN_FILL} stroke={GREEN_STROKE} />
      <Pill cx={S[2]} cy={L[4]} label="SLA: 30d" fill={GREEN_FILL} stroke={GREEN_STROKE} />
      <Pill cx={S[4]} cy={L[4]} label="SLA: 14d" fill={GREEN_FILL} stroke={GREEN_STROKE} />
      <Pill cx={S[5]} cy={L[4]} label="SLA: 90d" fill={GREEN_FILL} stroke={GREEN_STROKE} />

      {/* Notification pills */}
      <Pill cx={S[1]} cy={L[4] - 28} label="Notify: CONF_INV" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />
      <Pill cx={S[4]} cy={L[4] - 28} label="Notify: CCO" fill={PURPLE_FILL} stroke={PURPLE_STROKE} />

      {/* ── Arrows ── */}
      {/* Draft → Triage (cross lane: Employee→CO) */}
      <Arrow d={`M ${S[0] + 58},${L[0]} H ${(S[0] + S[1]) / 2} V ${L[1]} H ${S[1] - 58}`} />
      {/* Triage → Investigate (cross lane: CO→CONF_INV) */}
      <Arrow d={`M ${S[1] + 58},${L[1]} H ${(S[1] + S[2]) / 2} V ${L[2]} H ${S[2] - 58}`} />
      {/* Investigate → Findings Review (cross lane: CONF_INV→CO) */}
      <Arrow d={`M ${S[2] + 58},${L[2]} H ${(S[2] + S[3]) / 2} V ${L[1]} H ${S[3] - 58}`} />
      {/* Findings Review → Disclosure Decision (cross lane: CO→CCO) */}
      <Arrow d={`M ${S[3] + 58},${L[1]} H ${(S[3] + S[4]) / 2} V ${L[3]} H ${S[4] - 52}`} />
      {/* Disclosure Yes → Remediation */}
      <Arrow d={`M ${S[4] + 52},${L[3]} H ${(S[4] + S[5]) / 2} V ${L[1]} H ${S[5] - 58}`} />
      {/* Disclosure No → Remediation (direct, shown as a note) */}
      {/* Remediation → Close Case (cross lane: CO→CCO) */}
      <Arrow d={`M ${S[5] + 58},${L[1]} H ${(S[5] + S[6]) / 2} V ${L[3]} H ${S[6] - 58}`} />

      {/* Dashed SLA connectors */}
      <DashedLine d={`M ${S[1]},${L[4] - 11} V ${L[1] + 22}`} />
      <DashedLine d={`M ${S[2]},${L[4] - 11} V ${L[2] + 22}`} />
      <DashedLine d={`M ${S[4]},${L[4] - 11} V ${L[3] + 28}`} />
      <DashedLine d={`M ${S[5]},${L[4] - 11} V ${L[1] + 26}`} />

      {/* Decision labels */}
      <text x={S[4] + 62} y={L[3] - 12} fontSize={9} fill={AMBER_STROKE} fontWeight={600}>Yes</text>
      <text x={S[4] - 5} y={L[3] + 44} fontSize={9} fill={AMBER_STROKE} fontWeight={600}>No</text>
      <Arrow d={`M ${S[4]},${L[3] + 28} V ${L[3] + 55} H ${S[5] - 58} V ${L[1] + 22}`} />

      {/* Outer border */}
      <rect x={0} y={0} width={W} height={H} fill="none" stroke="#E2E8F0" strokeWidth={1} />
    </svg>
  )
}
