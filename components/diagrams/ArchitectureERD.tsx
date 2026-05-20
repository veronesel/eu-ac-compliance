export default function ArchitectureERD() {
  return (
    <svg
      viewBox="0 0 1000 590"
      width="100%"
      style={{ maxWidth: 1000 }}
      role="img"
      aria-label="Solution Architecture Entity Relationship Diagram"
      fontFamily="DM Sans, sans-serif"
    >
      <title>EU AC Compliance — Solution Architecture ERD</title>

      {/* ── Layer bands ─────────────────────────────────────── */}
      {/* Layer 1 Reference (y 50-155) */}
      <rect x={0} y={50} width={1000} height={105} fill="#DDEEFF" stroke="#2E75B6" strokeWidth={1} />
      {/* Layer 2 Management (y 185-295) */}
      <rect x={0} y={185} width={1000} height={110} fill="#F5F5F5" stroke="#888" strokeWidth={1} />
      {/* Layer 3 Operational (y 315-455) */}
      <rect x={0} y={315} width={1000} height={140} fill="#EBF5EB" stroke="#2E7D32" strokeWidth={1} />
      {/* Layer 4 Sub-forms (y 475-565) */}
      <rect x={0} y={475} width={1000} height={90} fill="#F5F5F5" stroke="#999" strokeWidth={1} />

      {/* ── Layer labels (vertical, rotated) ────────────────── */}
      <text x={14} y={120} fontSize={11} fill="#5A7DB5" transform="rotate(-90,14,120)" textAnchor="middle">REFERENCE</text>
      <text x={14} y={250} fontSize={11} fill="#888" transform="rotate(-90,14,250)" textAnchor="middle">MANAGEMENT</text>
      <text x={14} y={390} fontSize={11} fill="#2E7D32" transform="rotate(-90,14,390)" textAnchor="middle">OPERATIONAL</text>
      <text x={14} y={525} fontSize={11} fill="#888" transform="rotate(-90,14,525)" textAnchor="middle">SUB-FORMS</text>

      {/* ── Arrow marker definitions ─────────────────────────── */}
      <defs>
        <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#2E7D32" />
        </marker>
        <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#2E75B6" />
        </marker>
        <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#C55A11" />
        </marker>
        <marker id="arrowGrey" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#888" />
        </marker>
        <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6A3EA1" />
        </marker>
      </defs>

      {/* ── ENTITY BOXES ─────────────────────────────────────── */}

      {/* ROL — Reference layer, cx=185, cy=95, 150×60 */}
      <EntityBox x={110} y={65} w={150} h={60} fill="#FFF" stroke="#2E75B6" sw={2}
        id="ROL" name="Regulatory Obligation Library" />

      {/* APL */}
      <EntityBox x={280} y={65} w={150} h={60} fill="#FFF" stroke="#2E75B6" sw={2}
        id="APL" name="Anti-Corruption Policy Library" />

      {/* TC */}
      <EntityBox x={450} y={65} w={150} h={60} fill="#FFF" stroke="#2E75B6" sw={2}
        id="TC" name="Training Curriculum" />

      {/* TPR */}
      <EntityBox x={720} y={65} w={150} h={60} fill="#FFF" stroke="#6A3EA1" sw={2}
        id="TPR" name="Third-Party Registry" />

      {/* CRR */}
      <EntityBox x={70} y={200} w={160} h={60} fill="#FFF" stroke="#C5922B" sw={2}
        id="CRR" name="Corruption Risk Register" />

      {/* CPA */}
      <EntityBox x={395} y={200} w={190} h={60} fill="#FFF" stroke="#C5922B" sw={2}
        id="CPA" name="Compliance Programme Assessment" />

      {/* CTR */}
      <EntityBox x={750} y={200} w={160} h={60} fill="#FFF" stroke="#C5922B" sw={2}
        id="CTR" name="Control Testing Record" />

      {/* GHR */}
      <EntityBox x={40} y={333} w={120} h={58} fill="#FFF" stroke="#2E7D32" sw={2}
        id="GHR" name="Gifts & Hospitality Register" />

      {/* COI */}
      <EntityBox x={180} y={333} w={120} h={58} fill="#FFF" stroke="#2E7D32" sw={2}
        id="COI" name="Conflict of Interest" />

      {/* CIR — hub, bold orange */}
      <EntityBox x={303} y={317} w={200} h={82} fill="#FCE8D9" stroke="#C55A11" sw={2.5}
        id="CIR" name="Corruption Incident Register" hub />

      {/* WR */}
      <EntityBox x={512} y={333} w={120} h={58} fill="#FFF5F5" stroke="#C00000" sw={2}
        id="WR" name="Whistleblower Report" />

      {/* DDQ */}
      <EntityBox x={672} y={328} w={132} h={58} fill="#F3EEFF" stroke="#6A3EA1" sw={1.5}
        id="DDQ" name="Due Diligence Questionnaire" />

      {/* Sub-01 */}
      <EntityBox x={230} y={492} w={150} h={50} fill="#FFF" stroke="#C55A11" sw={1.5}
        id="Sub-01" name="Investigation Finding" />

      {/* Sub-02 */}
      <EntityBox x={400} y={492} w={150} h={50} fill="#FFF" stroke="#C55A11" sw={1.5}
        id="Sub-02" name="Voluntary Disclosure" />

      {/* Sub-03 */}
      <EntityBox x={580} y={492} w={150} h={50} fill="#FFF" stroke="#C55A11" sw={1.5}
        id="Sub-03" name="Remediation Action" />

      {/* ── ARROWS ───────────────────────────────────────────── */}

      {/* GHR → CIR (green, horizontal) */}
      <Arrow d={`M 160,362 L 303,362`} colour="#2E7D32" marker="arrowGreen" />

      {/* COI → CIR (green, route below both boxes to avoid 3px gap) */}
      <Arrow d={`M 240,391 L 240,415 L 403,415 L 403,399`} colour="#2E7D32" marker="arrowGreen" />

      {/* WR → CIR (green, route above both boxes to avoid 9px gap) */}
      <Arrow d={`M 572,333 L 572,307 L 503,307 L 503,317`} colour="#2E7D32" marker="arrowGreen" />

      {/* DDQ → TPR (purple, straight up — DDQ cx=738 falls inside TPR x-range 720-870) */}
      <Arrow d={`M 738,328 L 738,125`} colour="#6A3EA1" marker="arrowPurple" />

      {/* CIR → Sub-01 (grey) */}
      <Arrow d={`M 353,399 L 353,460 L 305,460 L 305,492`} colour="#888" marker="arrowGrey" />

      {/* CIR → Sub-02 (grey) */}
      <Arrow d={`M 403,399 L 403,460 L 475,460 L 475,492`} colour="#888" marker="arrowGrey" />

      {/* CIR → Sub-03 (grey) */}
      <Arrow d={`M 453,399 L 453,460 L 655,460 L 655,492`} colour="#888" marker="arrowGrey" />

      {/* CRR → ROL (dashed blue, straight up) */}
      <Arrow d={`M 150,200 L 150,125`} colour="#2E75B6" marker="arrowBlue" dashed />

      {/* CPA → CRR (dashed blue) */}
      <Arrow d={`M 395,230 L 230,230`} colour="#2E75B6" marker="arrowBlue" dashed />

      {/* CPA → CTR (dashed blue) */}
      <Arrow d={`M 585,230 L 750,230`} colour="#2E75B6" marker="arrowBlue" dashed />

      {/* CPA → TC (dashed blue, up through inter-layer gap) */}
      <Arrow d={`M 490,200 L 490,165 L 525,165 L 525,125`} colour="#2E75B6" marker="arrowBlue" dashed />

      {/* CIR → ROL (dashed blue, up through inter-layer gap then far-left margin — avoids GHR) */}
      <Arrow d={`M 305,317 L 305,300 L 28,300 L 28,95 L 110,95`} colour="#2E75B6" marker="arrowBlue" dashed />

      {/* CIR → CRR (dashed blue, down below Operational entities then far-left margin — avoids COI/GHR) */}
      <Arrow d={`M 305,399 L 305,420 L 33,420 L 33,230 L 70,230`} colour="#2E75B6" marker="arrowBlue" dashed />

      {/* ── LEGEND ───────────────────────────────────────────── */}
      <rect x={800} y={480} width={175} height={100} fill="white" stroke="#E2E8F0" strokeWidth={1} rx={6} />
      <text x={812} y={497} fontSize={9} fontWeight="bold" fill="#475569">LEGEND</text>
      <line x1={812} y1={506} x2={840} y2={506} stroke="#2E7D32" strokeWidth={2} markerEnd="url(#arrowGreen)" />
      <text x={845} y={510} fontSize={9} fill="#475569">Escalation / Creation</text>
      <line x1={812} y1={520} x2={840} y2={520} stroke="#2E75B6" strokeWidth={1.5} strokeDasharray="4,2" markerEnd="url(#arrowBlue)" />
      <text x={845} y={524} fontSize={9} fill="#475569">Cross-Reference</text>
      <rect x={812} y={531} width={12} height={8} fill="#FCE8D9" stroke="#C55A11" strokeWidth={1.5} />
      <text x={828} y={539} fontSize={9} fill="#475569">Hub Application (CIR)</text>
      <rect x={812} y={545} width={12} height={8} fill="#FFF5F5" stroke="#C00000" strokeWidth={1.5} />
      <text x={828} y={553} fontSize={9} fill="#475569">FLS Restricted (WR)</text>
      <rect x={812} y={559} width={12} height={8} fill="#F3EEFF" stroke="#6A3EA1" strokeWidth={1.5} />
      <text x={828} y={567} fontSize={9} fill="#475569">Questionnaire (DDQ)</text>
    </svg>
  )
}

// ── Helper sub-components ─────────────────────────────────────────

interface EntityBoxProps {
  x: number; y: number; w: number; h: number
  fill: string; stroke: string; sw: number
  id: string; name: string; hub?: boolean
}

function EntityBox({ x, y, w, h, fill, stroke, sw, id, name, hub }: EntityBoxProps) {
  const cx = x + w / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} stroke={stroke} strokeWidth={sw} />
      <text x={cx} y={y + (hub ? 30 : 25)} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1F4E79">
        {id}
      </text>
      {/* Wrap long names */}
      <EntityName cx={cx} y={y + (hub ? 48 : 40)} name={name} />
    </g>
  )
}

function EntityName({ cx, y, name }: { cx: number; y: number; name: string }) {
  const words = name.split(' ')
  // Split into max 2 lines
  const mid = Math.ceil(words.length / 2)
  const line1 = words.slice(0, mid).join(' ')
  const line2 = words.slice(mid).join(' ')
  if (!line2) {
    return <text x={cx} y={y} textAnchor="middle" fontSize={9} fill="#666">{line1}</text>
  }
  return (
    <>
      <text x={cx} y={y - 5} textAnchor="middle" fontSize={9} fill="#666">{line1}</text>
      <text x={cx} y={y + 7} textAnchor="middle" fontSize={9} fill="#666">{line2}</text>
    </>
  )
}

interface ArrowProps {
  d: string
  colour: string
  marker: string
  dashed?: boolean
}

function Arrow({ d, colour, marker, dashed }: ArrowProps) {
  return (
    <path
      d={d}
      fill="none"
      stroke={colour}
      strokeWidth={dashed ? 1.5 : 2}
      strokeDasharray={dashed ? '5,3' : undefined}
      markerEnd={`url(#${marker})`}
    />
  )
}
