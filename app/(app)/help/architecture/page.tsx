import ArchitectureERD from '@/components/diagrams/ArchitectureERD'
import DiagramViewer from '@/components/diagrams/DiagramViewer'

export const metadata = { title: 'Architecture | Help | EU AC Compliance' }

// ── Small primitives ─────────────────────────────────────────────────

function LayerBadge({ name, colour }: { name: string; colour: string }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colour}`}>
      {name}
    </span>
  )
}

function RelBadge({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-slate-100 text-[#0F172A] px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  )
}

function Field({ name, type, desc }: { name: string; type: string; desc: string }) {
  return (
    <tr className="border-t border-[#F1F5F9]">
      <td className="py-1.5 pr-3 align-top">
        <code className="text-xs text-[#1D5FAB] font-mono">{name}</code>
      </td>
      <td className="py-1.5 pr-3 align-top">
        <span className="text-[10px] text-[#94A3B8] font-mono">{type}</span>
      </td>
      <td className="py-1.5 text-xs text-[#475569]">{desc}</td>
    </tr>
  )
}

interface EntityCardProps {
  id: string
  abbr: string
  name: string
  layer: string
  layerColour: string
  borderColour: string
  what: string
  why: string
  how: string
  fields: [string, string, string][]
  relations: { label: string; entity: string; nature: string }[]
}

function EntityCard({ id, abbr, name, layer, layerColour, borderColour, what, why, how, fields, relations }: EntityCardProps) {
  return (
    <div id={id} className={`bg-white rounded-xl border-l-4 border border-[#E2E8F0] ${borderColour} overflow-hidden`}>
      <div className="px-5 py-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-lg font-black text-[#0F172A] font-mono">{abbr}</span>
          <LayerBadge name={layer} colour={layerColour} />
        </div>
        <p className="text-sm font-semibold text-[#0F172A]">{name}</p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* What / Why / How */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">What it is</p>
            <p className="text-[#475569]">{what}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Why it's needed</p>
            <p className="text-[#475569]">{why}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">How it's used</p>
            <p className="text-[#475569]">{how}</p>
          </div>
        </div>

        {/* Key fields */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Key fields</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {fields.map(([f, t, d]) => <Field key={f} name={f} type={t} desc={d} />)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relationships */}
        {relations.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Relationships</p>
            <div className="flex flex-wrap gap-2">
              {relations.map(r => (
                <div key={r.entity} className="flex items-center gap-1.5 text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5">
                  <span>{r.label}</span>
                  <RelBadge>{r.entity}</RelBadge>
                  <span className="text-[#94A3B8]">— {r.nature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Solution Architecture — Entity Relationship Model
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Platform data model — CIR as hub · Reference, Management, Operational, and Sub-form layers
        </p>
      </div>

      <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>Art. 13:</strong> Legal persons must implement adequate compliance programmes. Arts. 16(b)-(c): prior compliance measures are mitigation factors in penalty assessment. The data model maps directly to these requirements — every entity exists to generate or support documentary evidence.
      </div>

      {/* ERD Diagram */}
      <DiagramViewer title="Solution Architecture — Entity Relationship Diagram" filename="erd-architecture">
        <ArchitectureERD />
      </DiagramViewer>

      {/* Layer overview */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Four-Layer Architecture</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Reference Data', 'bg-blue-100 text-blue-800', 'ROL, APL, TC, TPR', 'The normative inputs — what the law requires and what the organisation has committed to do. These entities are read-only in normal operation and updated during policy refresh cycles.'],
            ['Management', 'bg-slate-100 text-slate-700', 'CRR, CPA, CTR', 'Measure how well the programme is working. These entities aggregate data from the Operational layer and generate the Art. 16(c) evidence package for regulatory proceedings.'],
            ['Operational', 'bg-green-100 text-green-800', 'GHR, COI, CIR, WR, DDQ', 'Day-to-day compliance events. Every gift received, every conflict declared, every incident reported flows through this layer. CIR is the hub — it can originate from or link to any other operational module.'],
            ['Sub-forms', 'bg-slate-100 text-slate-700', 'Finding, Disclosure, Remediation', 'Dependent forms that extend the CIR record. Each sub-form captures a distinct phase of the incident lifecycle and produces a distinct piece of the evidence chain required for Art. 16(d) disclosure arguments.'],
          ].map(([name, badge, entities, desc]) => (
            <div key={name} className="rounded-lg border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge}`}>{name}</span>
                <span className="text-xs text-[#94A3B8] font-mono">{entities}</span>
              </div>
              <p className="text-[#475569]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-jump TOC */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">Jump to entity</p>
        <div className="grid grid-cols-4 gap-x-4 gap-y-1.5">
          {[
            ['#rol', 'ROL — Regulatory Obligation Library'],
            ['#apl', 'APL — Policy Library'],
            ['#tc',  'TC — Training Curriculum'],
            ['#tpr', 'TPR — Third-Party Registry'],
            ['#crr', 'CRR — Corruption Risk Register'],
            ['#cpa', 'CPA — Programme Assessment'],
            ['#ctr', 'CTR — Control Testing Record'],
            ['#ghr', 'GHR — Gifts & Hospitality'],
            ['#coi', 'COI — Conflict of Interest'],
            ['#cir', 'CIR — Incident Register (hub)'],
            ['#wr',  'WR — Whistleblower Report'],
            ['#ddq', 'DDQ — Due Diligence'],
            ['#finding',     'Sub: Investigation Finding'],
            ['#disclosure',  'Sub: Voluntary Disclosure'],
            ['#remediation', 'Sub: Remediation Action'],
            ['#cross',       'Cross-cutting: User, Notification, AuditLog'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-xs text-[#1D5FAB] hover:underline truncate">
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── REFERENCE LAYER ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-[#0F172A]">Reference Data Layer</h2>
          <LayerBadge name="Reference" colour="bg-blue-100 text-blue-800" />
        </div>
        <div className="space-y-4">

          <EntityCard id="rol" abbr="ROL" name="Regulatory Obligation Library"
            layer="Reference" layerColour="bg-blue-100 text-blue-800"
            borderColour="border-l-[#2E75B6]"
            what="A catalogue of every legal obligation the organisation must fulfil under Directive (EU) 2026/1021 and related instruments. Each record maps to a specific Article reference."
            why="Art. 13 requires an adequate compliance programme — which means the organisation must know exactly what it is obliged to do. The ROL is the master list against which completeness of the programme is measured. Without it there is no basis for the obligationCovPct metric that feeds the Art. 16(c) score."
            how="The CO maintains the ROL during initial implementation and updates it when the Directive is amended or transposed into national law. Each obligation is classified (CRIMINAL / PROCEDURAL / PREVENTIVE), assigned a probability/impact score, and linked to the policies and controls that address it. The CPA reads obligationCovPct = count(obligations with ≥1 control) / total obligations."
            fields={[
              ['articleRef',     'String',   'The Directive article number (e.g. "Art. 13(2)(b)") — the authoritative legal source.'],
              ['title',          'String',   'Short plain-language title of the obligation.'],
              ['obligationType', 'String',   'CRIMINAL (offence definition) / PROCEDURAL (process requirement) / PREVENTIVE (programme element).'],
              ['classification', 'String',   'Severity class: PRIMARY (core obligation) or SECONDARY (ancillary).'],
              ['status',         'String',   'Implementation status: NOT_STARTED / IN_PROGRESS / COMPLIANT / PARTIAL.'],
              ['probability',    'Int 1-5',  'Likelihood that the obligation is relevant to the organisation\'s risk profile.'],
              ['impact',         'Int 1-5',  'Severity of non-compliance with this obligation.'],
              ['policies',       'JSON[]',   'Array of policy identifiers from the APL that address this obligation.'],
              ['controls',       'JSON[]',   'Array of control references from the CTR that operationalise this obligation.'],
            ]}
            relations={[
              { label: 'Feeds', entity: 'CPA', nature: 'obligationCovPct input to effectiveness score' },
              { label: 'Linked to', entity: 'APL', nature: 'via policies[] JSON field' },
              { label: 'Linked to', entity: 'CTR', nature: 'via controls[] JSON field' },
              { label: 'Informs', entity: 'CRR', nature: 'obligation gaps drive risk register entries' },
            ]}
          />

          <EntityCard id="apl" abbr="APL" name="Anti-Corruption Policy Library"
            layer="Reference" layerColour="bg-blue-100 text-blue-800"
            borderColour="border-l-[#2E75B6]"
            what="The organisation's internal policy documents that implement the obligations in the ROL — codes of conduct, gift policies, whistleblower procedures, third-party standards, and so on. In the data model, policies are stored as references within the Obligation entity's policies[] field rather than as a separate table."
            why="Art. 13(2)(a)-(c) requires documented prevention measures. Regulators look for a clear chain from legal obligation → internal policy → operational control. The APL provides the middle link. policyAckPct (what % of staff have acknowledged the current policies) is one of the four inputs to the Art. 16(c) effectiveness score."
            how="Policies are referenced from Obligation records via the policies[] JSON array. Each policy reference carries an acknowledgement version number and a list of roles in scope. The training curriculum (TC) maps training modules to the policies they cover, ensuring that policy awareness is supported by formal learning."
            fields={[
              ['policies[]',  'JSON (on Obligation)', 'Array of policy IDs stored on the parent Obligation. Each entry references a versioned policy document.'],
              ['policyAckPct','Float (on Assessment)', 'Computed at CPA time: acknowledged staff / in-scope staff. Contributes 20% to the effectiveness score.'],
            ]}
            relations={[
              { label: 'Stored within', entity: 'ROL', nature: 'policies[] field on Obligation' },
              { label: 'Feeds', entity: 'CPA', nature: 'policyAckPct input to effectiveness score' },
              { label: 'Taught via', entity: 'TC',  nature: 'training modules cover specific policies' },
            ]}
          />

          <EntityCard id="tc" abbr="TC" name="Training Curriculum"
            layer="Reference" layerColour="bg-blue-100 text-blue-800"
            borderColour="border-l-[#2E75B6]"
            what="The set of mandatory anti-corruption training modules assigned to in-scope staff. Like the APL, training data is referenced within the Obligation model rather than stored in a dedicated table — each obligation can specify the training modules that bring staff into compliance with it."
            why="Art. 13(2)(d) requires organisations to provide regular training on anti-corruption. Training completion is the third input (trainingPct, weighted 25%) to the effectiveness score. Regulators specifically check whether training is documented, role-appropriate, and genuinely completed — not just assigned."
            how="Training completion records are tracked externally (LMS) and the aggregate percentage is entered into the CPA form at assessment time. The CO validates the figure against LMS reports before entering it. The TC informs which staff groups need what training — mapped via the Obligation's obligationType and classification fields."
            fields={[
              ['trainingPct', 'Float (on Assessment)', 'Completed training / assigned training × 100. Contributes 25% to the effectiveness score.'],
              ['controls[]',  'JSON (on Obligation)', 'Training-related controls reference back to TC modules via the controls[] array on Obligation.'],
            ]}
            relations={[
              { label: 'Referenced by', entity: 'ROL', nature: 'obligations specify which training modules address them' },
              { label: 'Feeds', entity: 'CPA', nature: 'trainingPct input to effectiveness score' },
              { label: 'Supports', entity: 'APL', nature: 'training embeds policy content for staff awareness' },
            ]}
          />

          <EntityCard id="tpr" abbr="TPR" name="Third-Party Registry"
            layer="Reference" layerColour="bg-blue-100 text-blue-800"
            borderColour="border-l-[#2E75B6]"
            what="The master registry of all third parties (agents, intermediaries, joint-venture partners, high-risk suppliers) that the organisation has screened or is due to screen. Each ThirdParty record is the parent for one or more DDQ questionnaire records."
            why="Art. 12 requires organisations to assess the corruption risk posed by third parties acting on their behalf — particularly in high-risk jurisdictions or sectors. The TPR is the authoritative list of who has been screened, when, and to what standard. Gaps in the registry are a common regulatory finding."
            how="The CO or business owner creates a ThirdParty record when a new counterparty relationship is initiated. The system assigns an initial risk tier based on jurisdiction (FATF grey/black list), sector (defence, energy, government contracting), and contract value. A DDQ is then dispatched. The TPR is also the source for the dashboard's Overdue DDQs metric — any third party past their nextDDQDate appears as a flag."
            fields={[
              ['name',         'String',   'Legal name of the third-party entity.'],
              ['type',         'String',   'Relationship type: AGENT / INTERMEDIARY / JV_PARTNER / SUPPLIER / CONSULTANT.'],
              ['jurisdiction', 'String',   'Country of registration — used to apply FATF and EU transparency list risk factors.'],
              ['riskTier',     'String?',  'Assigned tier: CRITICAL / HIGH / MEDIUM / LOW — determines DDQ depth and review frequency.'],
              ['riskScore',    'Float?',   'Aggregate numeric score from the most recent completed DDQ (0–100, higher = lower risk).'],
              ['ddqStatus',    'String',   'Current screening status: NOT_STARTED / SENT / RECEIVED / APPROVED / REJECTED / OVERDUE.'],
              ['nextDDQDate',  'DateTime?','Date by which the next refresh DDQ must be completed. System flags overdue entries.'],
            ]}
            relations={[
              { label: 'Parent of', entity: 'DDQ', nature: 'one ThirdParty has many DDQ questionnaire records (one per cycle)' },
              { label: 'Risk feeds', entity: 'CRR', nature: 'high-risk third parties generate or link to risk register entries' },
              { label: 'Feeds', entity: 'CPA', nature: 'DDQ completion rates inform programme adequacy narrative' },
            ]}
          />

        </div>
      </div>

      {/* ── MANAGEMENT LAYER ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-[#0F172A]">Management Layer</h2>
          <LayerBadge name="Management" colour="bg-slate-100 text-slate-700" />
        </div>
        <div className="space-y-4">

          <EntityCard id="crr" abbr="CRR" name="Corruption Risk Register"
            layer="Management" layerColour="bg-slate-100 text-slate-700"
            borderColour="border-l-[#C5922B]"
            what="A structured catalogue of the organisation's corruption-specific risks — the threats that, if they materialised, would constitute offences under Arts. 3-9. Each Risk record carries inherent and residual risk scores, an owner, and a review date."
            why="Regulators assess whether the compliance programme is risk-based. A programme that applies the same controls to every risk, regardless of severity, is not 'adequate' under Recital 29. The CRR is the evidence that the organisation has conducted a structured risk assessment and has prioritised accordingly."
            how="The CCO or CO creates risk records during the annual risk assessment cycle. Likelihood (1-5) × Impact (1-5) = inherentScore (1-25). After assigning current controls, residualLikelihood and residualImpact are reassessed to produce the residualScore. Risks with high residual scores drive control testing priority in the CTR. Incidents link back to the risk that materialised — closing the feedback loop."
            fields={[
              ['category',           'String',   'Risk category: BRIBERY / FACILITATION_PAYMENTS / CONFLICT_OF_INTEREST / THIRD_PARTY / TRADING_IN_INFLUENCE / OTHER.'],
              ['likelihood',         'Int 1-5',  'Inherent likelihood before controls.'],
              ['impact',             'Int 1-5',  'Inherent impact before controls.'],
              ['inherentScore',      'Int 1-25', 'likelihood × impact — the gross risk.'],
              ['currentControls',    'String',   'Narrative description of controls currently in place.'],
              ['residualLikelihood', 'Int 1-5',  'Likelihood after applying current controls.'],
              ['residualImpact',     'Int 1-5',  'Impact after applying current controls.'],
              ['residualScore',      'Int 1-25', 'residualLikelihood × residualImpact — the net risk.'],
              ['owner',              'String',   'Named individual responsible for managing and monitoring this risk.'],
              ['reviewDate',         'DateTime', 'Next scheduled review — system flags overdue reviews.'],
            ]}
            relations={[
              { label: 'Linked from', entity: 'CIR', nature: 'incidents link to the risk that materialised (riskId)' },
              { label: 'Informed by', entity: 'ROL', nature: 'obligation gaps in the ROL generate corresponding risk entries' },
              { label: 'Tested by', entity: 'CTR', nature: 'high-residual-score risks drive control testing priority' },
              { label: 'Summarised in', entity: 'CPA', nature: 'risk register is reviewed as part of the annual assessment' },
            ]}
          />

          <EntityCard id="cpa" abbr="CPA" name="Compliance Programme Assessment"
            layer="Management" layerColour="bg-slate-100 text-slate-700"
            borderColour="border-l-[#C5922B]"
            what="The annual assessment that produces the Art. 16(c) evidence package — a scored, signed-off evaluation of the organisation's compliance programme. The Assessment model aggregates metrics from all other entities into a single effectiveness score and CCO-certified narrative."
            why="Art. 16(c) of the Directive explicitly provides that a genuine and effective compliance programme is a mitigating factor in penalty proceedings. The CPA is the document a legal team would table in those proceedings. Without a signed-off CPA, the organisation cannot credibly claim mitigation. Recital 29 requires the programme to be adequate, proportionate, and actively implemented — the CPA provides evidence on all three points."
            how="The CO initiates the CPA annually. The system auto-populates the four metric inputs from live data: obligationCovPct from the ROL, policyAckPct from policy acknowledgement records, trainingPct from LMS data, and controlEffPct from completed CTR records. The CO adds a Recital 29 narrative, submits for CCO review, and the CCO signs off — locking the record permanently. The score formula is: (Obl×30 + Pol×20 + Tr×25 + Ctrl×25) − (criticals×5 + highs×2, capped at 30)."
            fields={[
              ['period',             'String',   'Assessment period (e.g. "2026" or "H1 2026").'],
              ['effectivenessScore', 'Float?',   'Computed 0–100 score. ≥80 = strong mitigation; <40 = no credible claim.'],
              ['obligationCovPct',   'Float?',   '% of ROL obligations with ≥1 mapped control. Weight: 30%.'],
              ['policyAckPct',       'Float?',   '% of in-scope staff who have acknowledged current policies. Weight: 20%.'],
              ['trainingPct',        'Float?',   '% of required training completed by in-scope staff. Weight: 25%.'],
              ['controlEffPct',      'Float?',   '% of tested controls rated Effective in the current period. Weight: 25%.'],
              ['openCriticalCount',  'Int',      'Open CRITICAL-severity incidents — each deducts 5 points from the score.'],
              ['openHighCount',      'Int',      'Open HIGH-severity incidents — each deducts 2 points from the score.'],
              ['genuineness',        'String?',  'CCO narrative on programme adequacy addressing all four Recital 29 criteria.'],
              ['ccoSignOffDate',     'DateTime?','Date the CCO formally signed off — locks the record permanently.'],
              ['signedOffBy',        'String?',  'Name of the CCO who signed. Included in the Art. 16(c) evidence package.'],
            ]}
            relations={[
              { label: 'Aggregates', entity: 'ROL', nature: 'obligationCovPct — obligation coverage' },
              { label: 'Aggregates', entity: 'CTR', nature: 'controlEffPct — control effectiveness' },
              { label: 'Aggregates', entity: 'CRR', nature: 'open incident counts (CRITICAL/HIGH) for score penalty' },
              { label: 'Aggregates', entity: 'CIR', nature: 'open finding counts feed the score penalty deduction' },
              { label: 'Signed by',  entity: 'User', nature: 'CCO User record signs off and locks the assessment' },
            ]}
          />

          <EntityCard id="ctr" abbr="CTR" name="Control Testing Record"
            layer="Management" layerColour="bg-slate-100 text-slate-700"
            borderColour="border-l-[#C5922B]"
            what="A record of the independent testing of a specific compliance control — documenting what was tested, how, by whom, and whether the control operated effectively. The Control model enforces a mandatory segregation of duties: the control owner and the control tester must be different people."
            why="Art. 13(2)(e) requires ongoing monitoring of the effectiveness of compliance measures. The CTR is the evidence that monitoring actually happened. Self-certification (owner = tester) is treated by regulators as a red flag that the programme is not genuinely implemented. Independent testing results are the fourth input (controlEffPct) to the Art. 16(c) effectiveness score."
            how="The SCHEDULER or CO assigns a test to a named tester who is different from the control owner (FR-25 validation blocks same-person assignment). The tester executes the test — walkthrough, sample testing, or re-performance — and documents evidence and a draft effectiveness rating. The CO reviews and approves. An Ineffective rating auto-creates a Remediation record linked to a CIR incident. Results roll up to the CPA at year-end."
            fields={[
              ['reference',       'String',   'Unique control reference (e.g. "CTR-001").'],
              ['controlType',     'String',   'PREVENTIVE (stops the event) / DETECTIVE (identifies it) / CORRECTIVE (fixes it after the fact).'],
              ['owner',           'String',   'The person who operates this control in day-to-day work. Cannot equal tester (FR-25).'],
              ['tester',          'String?',  'The independent person who evaluates the control. Must differ from owner.'],
              ['status',          'String',   'ASSIGNED / IN_PROGRESS / UNDER_REVIEW / EFFECTIVE / INEFFECTIVE / REMEDIATION.'],
              ['testResult',      'String?',  'EFFECTIVE / PARTIALLY_EFFECTIVE / INEFFECTIVE — the CO\'s final verdict.'],
              ['evidenceRefs',    'JSON[]',   'References to documents, screenshots, or samples used as evidence during testing.'],
              ['remediationPlan', 'String?',  'Required when testResult = INEFFECTIVE. What will be done to fix the control.'],
              ['remediationDue',  'DateTime?','Deadline for completing the remediation plan.'],
            ]}
            relations={[
              { label: 'Linked to', entity: 'ROL', nature: 'each control maps to ≥1 obligation via Obligation.controls[] field' },
              { label: 'Feeds', entity: 'CPA', nature: 'controlEffPct = effective controls / all tested controls' },
              { label: 'Escalates to', entity: 'CIR', nature: 'INEFFECTIVE result auto-creates an incident remediation action' },
              { label: 'Assigned by', entity: 'User', nature: 'owner and tester are User records (different persons, FR-25)' },
            ]}
          />

        </div>
      </div>

      {/* ── OPERATIONAL LAYER ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-[#0F172A]">Operational Layer</h2>
          <LayerBadge name="Operational" colour="bg-green-100 text-green-800" />
        </div>
        <div className="space-y-4">

          <EntityCard id="ghr" abbr="GHR" name="Gift & Hospitality Register"
            layer="Operational" layerColour="bg-green-100 text-green-800"
            borderColour="border-l-[#2E7D32]"
            what="A record of every gift, hospitality, or other advantage offered, promised, or received by employees or agents of the organisation. The Gift model enforces the EUR 25 threshold routing rule and the public-official escalation path."
            why="Art. 7 prohibits offering or giving advantages to public officials. Art. 6 extends this to the private sector when the advantage is intended to induce a breach of duty. Without a systematic register, the organisation cannot demonstrate that it monitors and controls gifts — a basic requirement of any adequate anti-bribery programme."
            how="An employee submits a gift record. The system evaluates two routing conditions: (1) value ≤EUR 25 AND counterparty is private sector → auto-approve; (2) any other combination → route to CO, and if public official → also CCO. The decision chain (manager → CO → CCO) is captured with timestamps, decision notes, and a final status. Rejected gifts require a return-confirmation note. All approved gifts feed into the CPA evidence base."
            fields={[
              ['reference',       'String',   'Unique gift reference (e.g. "GHR-042").'],
              ['estimatedValue',  'Float',    'Monetary value in EUR. The EUR 25 threshold is evaluated against this field.'],
              ['counterpartyType','String',   'PRIVATE or PUBLIC_OFFICIAL — the primary routing determinant.'],
              ['autoApproved',    'Boolean',  'True when value ≤EUR 25 and counterpartyType = PRIVATE. No human review required.'],
              ['status',          'String',   'PENDING_MANAGER / PENDING_CO / PENDING_CCO / APPROVED / REJECTED.'],
              ['coDecision',      'String?',  'APPROVED or REJECTED, with the date and notes recorded by the CO.'],
              ['amlFlag',         'Boolean',  'Set when the gift involves a known PEP or sanctioned entity — triggers enhanced review.'],
              ['occasion',        'String',   'Business context for the gift (e.g. "Contract signing", "Conference").'],
            ]}
            relations={[
              { label: 'Submitted by', entity: 'User', nature: 'submitter is an Employee or Line Manager User' },
              { label: 'Reviewed by', entity: 'User', nature: 'manager and CO are separate User records in the approval chain' },
              { label: 'Can escalate to', entity: 'CIR', nature: 'suspicious gifts can be linked to or trigger a CIR incident' },
              { label: 'Feeds', entity: 'CPA', nature: 'gift volume and approval patterns inform Recital 29 narrative' },
              { label: 'Logged in', entity: 'AuditLog', nature: 'every status change is immutably recorded' },
            ]}
          />

          <EntityCard id="coi" abbr="COI" name="Conflict of Interest"
            layer="Operational" layerColour="bg-green-100 text-green-800"
            borderColour="border-l-[#2E7D32]"
            what="A formal declaration by an employee or manager that they hold an outside interest that could compromise their independent judgment in carrying out their organisational role. The COI model tracks the full lifecycle from declaration through CO assessment, mitigation plan, CCO approval, monitoring, and closure."
            why="Art. 10 of the Directive recognises undisclosed conflicts of interest as a contributing factor to corruption offences. An undisclosed COI that facilitates a bribery offence under Arts. 3-5 can be an aggravating factor in sentencing. Annual declarations and active management demonstrate the organisation takes this seriously."
            how="The employee or line manager submits a COI declaration. The CO assesses the severity (LOW or HIGH) and drafts a mitigation plan: recusal from specific decisions, an information firewall, or divestment of the conflicting interest. HIGH-severity cases require CCO sign-off. The system schedules a 90-day monitoring review. When the conflict is resolved, the CO closes the record. Annual renewal prompts ensure declarations remain current."
            fields={[
              ['interestType',       'String',   'FINANCIAL_INTEREST / PERSONAL_RELATIONSHIP / OUTSIDE_DIRECTORSHIP / FORMER_EMPLOYMENT / OTHER.'],
              ['counterparty',       'String',   'The entity or person with whom the conflict exists.'],
              ['coAssessment',       'String?',  'CO\'s written severity assessment and reasoning.'],
              ['managementDecision', 'String?',  'Agreed management approach: RECUSAL / FIREWALL / DIVESTMENT / MONITORED_CONTINUATION.'],
              ['remediationPlan',    'String?',  'Detailed description of the mitigation steps and responsible parties.'],
              ['nextReviewDate',     'DateTime?','System-scheduled 90-day review. Overdue reviews appear in the CO\'s alert feed.'],
              ['annualRenewals',     'Int',      'Count of annual renewals — demonstrates the declaration is actively maintained.'],
            ]}
            relations={[
              { label: 'Declared by', entity: 'User', nature: 'the declarant is an Employee or Line Manager User' },
              { label: 'Can link to', entity: 'CIR', nature: 'an undisclosed COI that resulted in an offence links to the incident' },
              { label: 'Feeds', entity: 'CPA', nature: 'active COI count and management quality inform programme narrative' },
              { label: 'Logged in', entity: 'AuditLog', nature: 'every stage transition is recorded for Art. 16(c) evidence' },
            ]}
          />

          <EntityCard id="cir" abbr="CIR" name="Corruption Incident Register"
            layer="Operational" layerColour="bg-green-100 text-green-800"
            borderColour="border-l-[#C55A11]"
            what="The central hub of the entire platform — a record of every suspected or confirmed corruption offence, near-miss, or compliance breach. The Incident model is the most complex in the system, supporting a 7-stage workflow and spawning three sub-form types. It links to almost every other entity."
            why="An incident register is the most direct evidence that the organisation takes corruption seriously and responds to it effectively. Arts. 16(c) and (d) provide mitigation credit for organisations that maintain genuine compliance programmes and make rapid voluntary disclosures. Without a structured incident record, neither can be demonstrated. The incident's allegationType, discovery date, and disclosure timing feed directly into the Art. 14(3) penalty and Art. 16(d) rapidity calculations."
            how="Any staff member can raise a Draft incident. The CO triages it within 5 days (substantiated or not). If substantiated, an investigator (CONF_INV) is assigned and has 30 days to produce findings. The CO reviews findings, then the CCO makes a Disclosure Decision within 14 days (Art. 16(d) rapidity window). The outcome is either voluntary disclosure to the competent authority or a documented decision not to disclose. Remediation actions close the loop. The entire lifecycle — with timestamps at every stage — constitutes the Art. 16(d) evidence chain."
            fields={[
              ['reference',          'String',   'Unique incident reference (e.g. "CIR-007").'],
              ['allegationType',     'String',   'Offence article: ART_4 through ART_9 — determines the penalty band under Art. 14(3).'],
              ['severity',           'String',   'LOW / MEDIUM / HIGH / CRITICAL — drives investigator priority and CPA score penalty.'],
              ['status',             'String',   'DRAFT / TRIAGE / INVESTIGATION / FINDINGS_REVIEW / DISCLOSURE_DECISION / REMEDIATION / CLOSED.'],
              ['discoveryDate',      'DateTime?','When the organisation first became aware. Used to calculate rapidity under Art. 16(d).'],
              ['investigatorId',     'String?',  'FK to the CONF_INV User assigned to conduct the investigation.'],
              ['publicOfficialFlag', 'Boolean',  'Whether a public official is involved — affects Art. 7 / Art. 4 classification.'],
              ['estimatedLoss',      'Float?',   'Estimated financial value of the alleged offence — used in penalty exposure calculation.'],
              ['worldwideTurnover',  'Float?',   'Organisation\'s annual worldwide turnover — used as the base for Art. 14(3) % penalty.'],
              ['amlFlag',            'Boolean',  'Triggers parallel notification requirement under AML/CFT obligations.'],
            ]}
            relations={[
              { label: 'Investigated by', entity: 'User', nature: 'investigatorId → CONF_INV role User' },
              { label: 'Links to', entity: 'CRR', nature: 'riskId — the risk that materialised to cause this incident' },
              { label: 'Has', entity: 'Finding', nature: '0-many IncidentFinding sub-form records' },
              { label: 'Has', entity: 'Disclosure', nature: '0-1 IncidentDisclosure sub-form record (Art. 16(d))' },
              { label: 'Has', entity: 'Remediation', nature: '0-many IncidentRemediation sub-form records' },
              { label: 'Triggered by', entity: 'GHR', nature: 'suspicious gift can escalate to a CIR incident' },
              { label: 'Triggered by', entity: 'WR',  nature: 'substantiated whistleblower report escalates to CIR' },
              { label: 'Triggered by', entity: 'CTR', nature: 'INEFFECTIVE control result creates a remediation-linked incident' },
              { label: 'Affects', entity: 'CPA', nature: 'CRITICAL/HIGH open incidents deduct from effectiveness score' },
              { label: 'Logged in', entity: 'AuditLog', nature: 'every stage transition is immutably timestamped' },
            ]}
          />

          <EntityCard id="wr" abbr="WR" name="Whistleblower Report"
            layer="Operational" layerColour="bg-green-100 text-green-800"
            borderColour="border-l-[#C00000]"
            what="A confidential report submitted by an employee, contractor, or third party alleging a corruption concern. The WRCase model implements First-Level Sensitivity (FLS) protection — the reporter's identity is visible only to the CONF_INV role and is masked as ████████ for all other roles."
            why="Art. 11 requires organisations to maintain confidential internal reporting channels. Dir. 2019/1937 (EU Whistleblower Protection Directive) mandates acknowledgement within 7 days and feedback within 3 months, and prohibits any form of retaliation. A functioning whistleblower channel is a key indicator of programme genuineness under Recital 29 — regulators look for evidence that it is actually used, not just documented."
            how="The reporter accesses an unauthenticated intake form at /whistleblower/report. The CONF_INV investigates with a strict information barrier — all access to the record is audit-logged. If the concern is substantiated, the CONF_INV escalates to the CIR by creating a linked Incident record. The linkedIncidentId field connects the WRCase to the resulting CIR record. The reporter receives anonymised outcome feedback within the 3-month SLA."
            fields={[
              ['reporterName',      'String?',  'Reporter\'s name — visible only to CONF_INV. Masked as ████████ for all other roles (FLS).'],
              ['reporterContact',   'String?',  'Reporter\'s contact details — FLS-restricted. Used for acknowledgement and feedback.'],
              ['allegation',        'String',   'Plain-language description of the concern.'],
              ['category',          'String',   'Concern type: BRIBERY / FRAUD / MISCONDUCT / RETALIATION / DATA_BREACH / OTHER.'],
              ['detailsRestricted', 'String',   'Full case details — accessible only to CONF_INV (FLS field).'],
              ['detailsPublic',     'String',   'Sanitised summary visible to CO and CCO — excludes identifying information.'],
              ['status',            'String',   'RECEIVED / ACKNOWLEDGED / INVESTIGATION / CLOSED_SUBSTANTIATED / CLOSED_UNSUBSTANTIATED.'],
              ['acknowledgedDate',  'DateTime?','Date of acknowledgement — must be within 7 days of receipt (Dir. 2019/1937).'],
              ['feedbackDate',      'DateTime?','Date feedback was sent to reporter — must be within 3 months of receipt.'],
              ['linkedIncidentId',  'String?',  'FK to CIR Incident — set when the report is escalated to formal investigation.'],
            ]}
            relations={[
              { label: 'Investigated by', entity: 'User', nature: 'investigatorId → CONF_INV role User (FLS access)' },
              { label: 'Escalates to', entity: 'CIR', nature: 'substantiated reports create a linked Incident (linkedIncidentId)' },
              { label: 'Submitted by', entity: 'User', nature: 'reporterUserId (optional — anonymous submissions have no FK)' },
            ]}
          />

          <EntityCard id="ddq" abbr="DDQ" name="Due Diligence Questionnaire"
            layer="Operational" layerColour="bg-green-100 text-green-800"
            borderColour="border-l-[#6A3EA1]"
            what="A structured questionnaire sent to a third party to assess their anti-corruption controls, ownership transparency, PEP connections, and past incident history. Each DDQ record belongs to a ThirdParty (TPR) record. A third party may have multiple DDQ records — one per review cycle."
            why="Art. 12 requires proportionate due diligence on third parties. Regulators specifically look for evidence that due diligence was actually conducted — not just that a policy exists. The DDQ's rawScore, riskTier, and enhancedDDQRequired flags are the documentary evidence that the screening was substantive and risk-proportionate."
            how="The CO sends the DDQ to the third party via the platform. The third party's responses are recorded in the responses JSON field. The system calculates a rawScore from the answers. The CO reviews the score alongside external checks (sanctions, adverse media, PEP screening) and records a riskTier verdict. HIGH or CRITICAL results set enhancedDDQRequired = true and require CCO counter-signature. Approved DDQs set the next review date on the parent ThirdParty record."
            fields={[
              ['reference',          'String',   'Unique DDQ reference (e.g. "DDQ-2026-012").'],
              ['sentDate',           'DateTime?','When the questionnaire was dispatched. The 14-day response deadline is measured from here.'],
              ['responseDate',       'DateTime?','When the third party completed the questionnaire.'],
              ['responses',          'JSON',     'Key-value store of all questionnaire answers — structured by section (ownership, controls, history).'],
              ['rawScore',           'Float?',   'Computed score 0–100 (higher = lower risk) from weighted questionnaire responses.'],
              ['riskTier',           'String?',  'CO\'s final verdict: CRITICAL / HIGH / MEDIUM / LOW.'],
              ['enhancedDDQRequired','Boolean',  'True for CRITICAL/HIGH — triggers additional document requests and CCO sign-off.'],
              ['reviewNotes',        'String?',  'CO\'s narrative on findings, adverse media, and approval rationale.'],
            ]}
            relations={[
              { label: 'Belongs to', entity: 'TPR', nature: 'thirdPartyId — the parent ThirdParty registry record' },
              { label: 'Updates', entity: 'TPR', nature: 'verdict updates ddqStatus, riskScore, and nextDDQDate on the ThirdParty' },
              { label: 'Feeds', entity: 'CPA', nature: 'DDQ completion and risk tier distribution inform programme narrative' },
            ]}
          />

        </div>
      </div>

      {/* ── SUB-FORM LAYER ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-[#0F172A]">Sub-form Layer</h2>
          <LayerBadge name="Sub-forms" colour="bg-slate-100 text-slate-700" />
          <span className="text-xs text-[#94A3B8]">All sub-forms are children of CIR (Incident)</span>
        </div>
        <div className="space-y-4">

          <EntityCard id="finding" abbr="Sub-01" name="Investigation Finding"
            layer="Sub-form" layerColour="bg-slate-100 text-slate-700"
            borderColour="border-l-[#C55A11]"
            what="A structured record of a single investigative finding produced during the Investigation stage of a CIR incident. One incident can have multiple findings — one per distinct line of inquiry or evidence strand."
            why="The investigation finding is the core of the Art. 16(c) evidence chain. It documents what the investigator found, the evidence supporting it, and the recommendation for action. Without documented findings, the organisation cannot demonstrate that its incident response was substantive rather than superficial."
            how="The CONF_INV creates Finding records from the incident detail page during the Investigation stage. Each finding has a summary, a list of evidence references (documents, emails, interview notes), a recommendation (disciplinary action, policy change, control enhancement), and the author and date. Findings are reviewed by the CO in the Findings Review stage before advancing to Disclosure."
            fields={[
              ['incidentId',   'String',   'FK to the parent Incident — one Incident has 0-many Findings.'],
              ['summary',      'String',   'Factual summary of what was found — written by the investigator.'],
              ['evidenceRefs', 'JSON[]',   'References to evidence documents (file names, system IDs, interview codes).'],
              ['recommendation','String',  'Investigator\'s recommended action: disciplinary / policy update / control change / disclosure.'],
              ['findingDate',  'DateTime', 'Date the finding was recorded.'],
              ['author',       'String',   'Name of the investigator who recorded this finding (CONF_INV role).'],
            ]}
            relations={[
              { label: 'Child of', entity: 'CIR', nature: 'incidentId — many Findings belong to one Incident' },
              { label: 'Reviewed by', entity: 'User', nature: 'CO reviews all Findings before the Findings Review stage completes' },
            ]}
          />

          <EntityCard id="disclosure" abbr="Sub-02" name="Voluntary Disclosure"
            layer="Sub-form" layerColour="bg-slate-100 text-slate-700"
            borderColour="border-l-[#C55A11]"
            what="A record of the CCO's decision on whether to make a voluntary disclosure of the incident to the competent authority, and if so, the timing of that disclosure. There is at most one Disclosure record per Incident. The rapidity classification (RAPID / PROMPT / DELAYED) is computed from the discovery-to-decision timeline."
            why="Art. 16(d) explicitly provides mitigation credit for organisations that voluntarily disclose offences rapidly. The Disclosure record is the documentary proof of that disclosure — or of the reasoned decision not to disclose. The rapidity classification directly affects the strength of the mitigation argument: RAPID (≤14 days from discovery to decision) earns the maximum credit."
            how="The Disclosure record is created automatically when an Incident enters the Disclosure Decision stage. The CCO records whether legal review was completed, the decision (disclose or not), the decision date, and the actual disclosure date (if applicable). The system computes rapidityClass = RAPID if decision ≤14 days from discoveryDate, PROMPT if ≤30 days, DELAYED if >30 days. This classification is shown prominently in the incident detail view."
            fields={[
              ['incidentId',      'String',   'FK to the parent Incident — exactly one Disclosure per Incident.'],
              ['legalReviewDone', 'Boolean',  'Confirms legal counsel reviewed the disclosure decision (best practice under Art. 16).'],
              ['legalReviewDate', 'DateTime?','Date of legal review completion.'],
              ['ccoDecision',     'String?',  'DISCLOSE or NO_DISCLOSURE — the CCO\'s formal decision.'],
              ['decisionDate',    'DateTime?','Date the CCO made the decision — the trigger for rapidity calculation.'],
              ['disclosureDate',  'DateTime?','Date the actual disclosure was made to the competent authority (if applicable).'],
              ['rapidityClass',   'String?',  'Computed: RAPID (≤14d) / PROMPT (≤30d) / DELAYED (>30d) from discoveryDate to decisionDate.'],
              ['notes',           'String?',  'CCO\'s narrative rationale for the decision — required for NO_DISCLOSURE.'],
            ]}
            relations={[
              { label: 'Child of', entity: 'CIR', nature: 'incidentId — exactly one Disclosure per Incident (unique constraint)' },
              { label: 'Decided by', entity: 'User', nature: 'CCO User records the decision' },
              { label: 'Informs', entity: 'CPA', nature: 'disclosure history informs the Recital 29 programme adequacy narrative' },
            ]}
          />

          <EntityCard id="remediation" abbr="Sub-03" name="Remediation Action"
            layer="Sub-form" layerColour="bg-slate-100 text-slate-700"
            borderColour="border-l-[#C55A11]"
            what="An individual corrective action to be completed following an incident investigation. One incident typically has multiple Remediation records — one per distinct corrective measure (policy update, disciplinary action, process redesign, enhanced control, additional training)."
            why="Demonstrating that incidents lead to genuine corrective action is central to the Art. 16(c) genuineness test. A compliance programme that identifies incidents but takes no corrective action is not 'adequate' under Recital 29. The Remediation records — with named owners, due dates, and completion status — prove that the organisation learns from failures."
            how="The CO creates Remediation records during the Remediation stage of the CIR workflow. Each action is assigned to a named owner with a due date. The 90-day SLA is tracked from the start of the Remediation stage. The CO monitors completion status. When all remediations are marked COMPLETE, the CCO can close the Incident. Completed remediations are referenced in the next CPA's Recital 29 narrative as evidence of continuous improvement."
            fields={[
              ['incidentId',     'String',   'FK to the parent Incident — one Incident has 0-many Remediations.'],
              ['action',         'String',   'Description of the specific corrective measure to be taken.'],
              ['owner',          'String',   'Named individual responsible for completing this action.'],
              ['dueDate',        'DateTime', 'Deadline for completion. 90-day SLA measured from Remediation stage start.'],
              ['completedDate',  'DateTime?','Date the action was completed. Null = still open.'],
              ['status',         'String',   'OPEN / IN_PROGRESS / COMPLETE / OVERDUE (computed when dueDate passes).'],
            ]}
            relations={[
              { label: 'Child of', entity: 'CIR', nature: 'incidentId — many Remediations belong to one Incident' },
              { label: 'Feeds', entity: 'CPA', nature: 'completed remediations demonstrate continuous improvement (Recital 29)' },
              { label: 'Can trigger', entity: 'CTR', nature: 'a remediation may require a new or enhanced control to be created and tested' },
            ]}
          />

        </div>
      </div>

      {/* ── CROSS-CUTTING ────────────────────────────────────────────── */}
      <div id="cross">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-[#0F172A]">Cross-Cutting Entities</h2>
          <span className="text-xs text-[#94A3B8]">Present in all layers — not shown in ERD for clarity</span>
        </div>
        <div className="space-y-4">

          <EntityCard id="user" abbr="User" name="User"
            layer="Cross-cutting" layerColour="bg-indigo-100 text-indigo-800"
            borderColour="border-l-[#4338CA]"
            what="The authenticated identity of every actor in the system. Each User record carries a role that determines what the actor can see and do across all modules via the RBAC permission matrix."
            why="RBAC (Role-Based Access Control) is required to enforce Art. 11 FLS restrictions on whistleblower identity, Art. 13 segregation of duties on control testing, and the principle of least privilege across all sensitive compliance data. The User is the single identity anchor for all audit trail entries."
            how="Users are provisioned by the administrator. The role field drives the entire permission system — checked on every API route and UI render. The User record is the FK anchor for every actor relationship across all entities: incident investigator, gift submitter, COI declarer, audit log actor, and notification recipient."
            fields={[
              ['email',        'String (unique)', 'Primary identifier — used for authentication and notification delivery.'],
              ['role',         'String',          'CCO / CO / LINE_MANAGER / EMPLOYEE / CONF_INV / AUDIT / SCHEDULER — determines all permissions.'],
              ['passwordHash', 'String',          'bcrypt hash of the user\'s password. Never exposed via API.'],
            ]}
            relations={[
              { label: 'Acts in', entity: 'CIR', nature: 'investigator and subject FK fields' },
              { label: 'Submits', entity: 'GHR', nature: 'submitter FK' },
              { label: 'Declares', entity: 'COI', nature: 'declarer FK' },
              { label: 'Reports', entity: 'WR',  nature: 'reporter FK (optional — anonymous submissions excluded)' },
              { label: 'Receives', entity: 'Notification', nature: 'userId FK — all notifications target a specific User' },
              { label: 'Logged in', entity: 'AuditLog', nature: 'actorId FK — every log entry records who did what' },
            ]}
          />

          <EntityCard id="notification" abbr="Notification" name="Notification"
            layer="Cross-cutting" layerColour="bg-indigo-100 text-indigo-800"
            borderColour="border-l-[#4338CA]"
            what="A role-targeted alert generated by the system when an action requires attention — SLA breach warnings, pending approvals, overdue reviews, and process completions. Notifications appear in the dashboard alert feed and the top-bar bell icon."
            why="Automated SLA monitoring is essential to the compliance programme's ability to meet the Art. 16(d) rapidity requirements. Without notifications, SLA breaches go undetected and the rapidity class degrades from RAPID to PROMPT or DELAYED — losing mitigation credit. Notifications also ensure the right person is prompted to act without the programme depending on memory or manual follow-up."
            how="The system generates notifications when: a gift is submitted (→ CO), an incident enters Triage (→ CO), a disclosure decision is pending (→ CCO), a DDQ deadline passes (→ CO), and more. Each notification has a severity (INFO / WARNING / CRITICAL) and links to the specific entity (entityType + entityId). The user marks notifications read via the bell icon. Unread counts are shown in the top bar."
            fields={[
              ['userId',     'String',   'FK to the User who should see this notification (role-targeted).'],
              ['type',       'String',   'Event type: SLA_BREACH / APPROVAL_REQUIRED / OVERDUE_REVIEW / etc.'],
              ['severity',   'String',   'INFO / WARNING / CRITICAL — displayed with colour coding in the alert feed.'],
              ['entityType', 'String?',  'The entity this notification relates to (INCIDENT / GIFT / COI / etc.).'],
              ['entityId',   'String?',  'FK to the specific record — clicking the notification navigates to this record.'],
              ['read',       'Boolean',  'False until the user explicitly marks it read. Unread count shown in top bar.'],
            ]}
            relations={[
              { label: 'Targets', entity: 'User', nature: 'userId — notifications are role-specific, not broadcast' },
              { label: 'References', entity: 'CIR', nature: 'entityId — incident notifications link to a specific Incident' },
            ]}
          />

          <EntityCard id="auditlog" abbr="AuditLog" name="Audit Log"
            layer="Cross-cutting" layerColour="bg-indigo-100 text-indigo-800"
            borderColour="border-l-[#4338CA]"
            what="An immutable, append-only record of every state-changing action taken on any entity in the system. Every status transition, decision, approval, and rejection is captured with the actor's identity, a timestamp, and the before/after state."
            why="The audit trail is the backbone of the Art. 16(c) evidence package. It is the proof that processes were followed, that decisions were made by the right people at the right time, and that the programme was genuinely operated rather than merely documented. Regulators and courts rely on audit trails in proceedings. Tampering with the audit log would itself constitute an Art. 9 (obstruction of justice) offence."
            how="The AuditLog is written automatically by the system on every API mutation — it is never written directly by users. Each entry captures: actorId (who), action (what: STATUS_CHANGE / APPROVAL / REJECTION / etc.), entityType and entityId (which record), prevState and newState (the before and after), and a timestamp. The audit timeline is displayed at the bottom of every CIR, GHR, and COI detail page."
            fields={[
              ['actorId',    'String',   'FK to the User who performed the action. Never null — anonymous actions are not permitted.'],
              ['action',     'String',   'What happened: STATUS_CHANGE / APPROVED / REJECTED / DISCLOSURE_DECISION / etc.'],
              ['entityType', 'String',   'The type of record affected: INCIDENT / GIFT / COI / CONTROL / ASSESSMENT.'],
              ['entityId',   'String',   'FK to the specific record affected.'],
              ['prevState',  'String?',  'JSON snapshot of the relevant fields before the change.'],
              ['newState',   'String?',  'JSON snapshot of the relevant fields after the change.'],
              ['notes',      'String?',  'Optional human-readable note added by the actor at the time of the action.'],
            ]}
            relations={[
              { label: 'Authored by', entity: 'User', nature: 'actorId — every log entry is attributed to a specific authenticated user' },
              { label: 'References', entity: 'CIR', nature: 'entityId — incident audit entries link to the Incident record' },
              { label: 'References', entity: 'GHR', nature: 'entityId — gift audit entries link to the Gift record' },
              { label: 'References', entity: 'COI', nature: 'entityId — COI audit entries link to the COI record' },
            ]}
          />

        </div>
      </div>

    </div>
  )
}
