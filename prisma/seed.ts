import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Seeding database...')

  // Users
  const hash = await bcrypt.hash('demo123', 10)

  const cco = await prisma.user.upsert({
    where: { email: 'cco@demo.eu' },
    update: {},
    create: { email: 'cco@demo.eu', name: 'Sofia Martins', role: 'CCO', passwordHash: hash },
  })
  const co = await prisma.user.upsert({
    where: { email: 'co@demo.eu' },
    update: {},
    create: { email: 'co@demo.eu', name: 'Marcus Weber', role: 'CO', passwordHash: hash },
  })
  const manager = await prisma.user.upsert({
    where: { email: 'manager@demo.eu' },
    update: {},
    create: { email: 'manager@demo.eu', name: 'Priya Nair', role: 'LINE_MANAGER', passwordHash: hash },
  })
  const employee = await prisma.user.upsert({
    where: { email: 'employee@demo.eu' },
    update: {},
    create: { email: 'employee@demo.eu', name: 'Thomas Eriksson', role: 'EMPLOYEE', passwordHash: hash },
  })
  const investigator = await prisma.user.upsert({
    where: { email: 'investigator@demo.eu' },
    update: {},
    create: { email: 'investigator@demo.eu', name: 'Katya Volkov', role: 'CONF_INV', passwordHash: hash },
  })
  await prisma.user.upsert({
    where: { email: 'auditor@demo.eu' },
    update: {},
    create: { email: 'auditor@demo.eu', name: 'Jean-Pierre Moreau', role: 'AUDIT', passwordHash: hash },
  })
  await prisma.user.upsert({
    where: { email: 'scheduler@demo.eu' },
    update: {},
    create: { email: 'scheduler@demo.eu', name: 'System Scheduler', role: 'SCHEDULER', passwordHash: hash },
  })

  // Obligations (12 records)
  const obligationsData = [
    { articleRef: 'Art. 4(a)', title: 'Criminalise active bribery', obligationType: 'Mandatory', classification: 'Criminalisation', deadline: 'Jun 2028', status: 'IN_PROGRESS', probability: 2, impact: 5, policies: JSON.stringify(['Anti-Bribery Policy']), controls: JSON.stringify(['CTR-2026-001']) },
    { articleRef: 'Art. 4(b)', title: 'Criminalise passive bribery', obligationType: 'Mandatory', classification: 'Criminalisation', deadline: 'Jun 2028', status: 'IN_PROGRESS', probability: 2, impact: 5, policies: JSON.stringify(['Anti-Bribery Policy']), controls: JSON.stringify(['CTR-2026-002']) },
    { articleRef: 'Art. 5(2)', title: 'Establish corporate liability regime', obligationType: 'Mandatory', classification: 'Criminalisation', deadline: 'Jun 2028', status: 'COMPLIANT', probability: 1, impact: 4, policies: JSON.stringify(['Corporate Compliance Framework']), controls: JSON.stringify([]) },
    { articleRef: 'Art. 6', title: 'Sanctions — natural persons', obligationType: 'Mandatory', classification: 'Criminalisation', deadline: 'Jun 2028', status: 'COMPLIANT', probability: 1, impact: 4, policies: JSON.stringify(['Disciplinary Procedure']), controls: JSON.stringify([]) },
    { articleRef: 'Art. 8', title: 'Confiscation and asset recovery', obligationType: 'Mandatory', classification: 'Procedure', deadline: 'Jun 2028', status: 'NOT_STARTED', probability: 2, impact: 3, policies: JSON.stringify([]), controls: JSON.stringify([]) },
    { articleRef: 'Art. 13', title: 'Prevention measures for legal persons', obligationType: 'Mandatory', classification: 'Prevention', deadline: 'Jun 2028', status: 'IN_PROGRESS', probability: 3, impact: 5, policies: JSON.stringify(['Compliance Programme Policy', 'Third-Party Due Diligence Policy']), controls: JSON.stringify(['CTR-2026-003', 'CTR-2026-004']) },
    { articleRef: 'Art. 14', title: 'Penalties for legal persons', obligationType: 'Mandatory', classification: 'Criminalisation', deadline: 'Jun 2028', status: 'NEEDS_REVIEW', probability: 2, impact: 5, policies: JSON.stringify(['Enforcement Response Policy']), controls: JSON.stringify([]) },
    { articleRef: 'Art. 15', title: 'Reporting obligations — AML integration', obligationType: 'Mandatory', classification: 'Reporting', deadline: 'Jun 2028', status: 'IN_PROGRESS', probability: 3, impact: 4, policies: JSON.stringify(['AML-AC Integration Policy']), controls: JSON.stringify(['CTR-2026-005']) },
    { articleRef: 'Art. 16(c)', title: 'Genuine compliance programme — evidence', obligationType: 'Mandatory', classification: 'Prevention', deadline: 'Jun 2028', status: 'IN_PROGRESS', probability: 2, impact: 5, policies: JSON.stringify(['Compliance Programme Assessment Procedure']), controls: JSON.stringify(['CTR-2026-006']) },
    { articleRef: 'Art. 16(d)', title: 'Voluntary disclosure — rapidity assessment', obligationType: 'Conditional', classification: 'Reporting', deadline: 'Jun 2028', status: 'IN_PROGRESS', probability: 3, impact: 4, policies: JSON.stringify(['Voluntary Disclosure Policy']), controls: JSON.stringify([]) },
    { articleRef: 'Art. 20', title: 'Whistleblower protection measures', obligationType: 'Mandatory', classification: 'Prevention', deadline: 'Jun 2028', status: 'COMPLIANT', probability: 2, impact: 4, policies: JSON.stringify(['Whistleblower Protection Policy']), controls: JSON.stringify(['CTR-2026-007']) },
    { articleRef: 'Art. 25', title: 'Non-retaliation guarantee', obligationType: 'Mandatory', classification: 'Prevention', deadline: 'Jun 2028', status: 'COMPLIANT', probability: 1, impact: 4, policies: JSON.stringify(['Non-Retaliation Policy']), controls: JSON.stringify([]) },
  ]
  for (const o of obligationsData) {
    await prisma.obligation.create({ data: o })
  }

  // Risks
  const risk1 = await prisma.risk.create({
    data: {
      category: 'Bribery', title: 'Procurement bribery exposure', description: 'Risk of bribery in procurement processes involving public officials', likelihood: 3, impact: 5, inherentScore: 15, currentControls: 'Pre-approval controls, gift policy', residualLikelihood: 2, residualImpact: 4, residualScore: 8, owner: 'Marcus Weber', reviewDate: new Date('2026-09-01'), status: 'ACTIVE',
    },
  })
  const risk2 = await prisma.risk.create({
    data: {
      category: 'Third-Party', title: 'Third-party facilitator risk', description: 'Risk of corrupt payments via third-party agents', likelihood: 3, impact: 4, inherentScore: 12, currentControls: 'DDQ process, contract clauses', residualLikelihood: 2, residualImpact: 3, residualScore: 6, owner: 'Marcus Weber', reviewDate: new Date('2026-09-01'), status: 'ACTIVE',
    },
  })

  // Controls
  await prisma.control.createMany({
    data: [
      { reference: 'CTR-2026-001', title: 'Anti-Bribery Policy Acknowledgement', description: 'Annual policy acknowledgement by all staff', controlType: 'Preventive', owner: co.id, tester: cco.id, status: 'EFFECTIVE', assignedDate: new Date('2026-01-15'), testStartDate: new Date('2026-03-01'), testEndDate: new Date('2026-03-15'), evidenceRefs: JSON.stringify(['Policy-ACK-2026.pdf']), testResult: 'EFFECTIVE', reviewNotes: 'All staff acknowledged policy by March 15' },
      { reference: 'CTR-2026-002', title: 'Gift & Hospitality Approval Workflow', description: 'Three-tier approval workflow for gifts above EUR 25', controlType: 'Preventive', owner: co.id, tester: cco.id, status: 'EFFECTIVE', testResult: 'EFFECTIVE' },
      { reference: 'CTR-2026-003', title: 'Third-Party Due Diligence Screening', description: 'Risk-tiered DDQ process for all third parties', controlType: 'Detective', owner: co.id, tester: cco.id, status: 'UNDER_REVIEW', testResult: 'PARTIALLY_EFFECTIVE', remediationPlan: 'Enhanced screening for Tier 1 agents', remediationDue: new Date('2026-07-01') },
      { reference: 'CTR-2026-004', title: 'Corruption Risk Assessment', description: 'Annual corruption risk assessment covering all business lines', controlType: 'Detective', owner: co.id, tester: cco.id, status: 'ASSIGNED' },
      { reference: 'CTR-2026-005', title: 'AML-AC Integration Reporting', description: 'Automated flagging of AML-linked corruption incidents', controlType: 'Detective', owner: co.id, tester: cco.id, status: 'IN_PROGRESS', testStartDate: new Date('2026-04-01') },
      { reference: 'CTR-2026-006', title: 'Compliance Programme Effectiveness Assessment', description: 'Annual CPA with board sign-off', controlType: 'Detective', owner: co.id, tester: cco.id, status: 'IN_PROGRESS' },
      { reference: 'CTR-2026-007', title: 'Whistleblower Channel Operation', description: 'Confidential reporting channel with CONF_INV-only access', controlType: 'Preventive', owner: co.id, tester: cco.id, status: 'EFFECTIVE', testResult: 'EFFECTIVE' },
    ],
  })

  // Incidents
  const incident1 = await prisma.incident.create({
    data: {
      reference: 'CIR-2026-001', title: 'Hospitality offered to procurement official', allegationType: 'Bribery', severity: 'HIGH', status: 'INVESTIGATION', description: 'Report received from internal audit indicating hospitality event valued at EUR 1,850 offered to senior procurement official at municipal authority. Potential breach of Arts. 4-5.', discoveryDate: new Date('2026-03-15'), reportedDate: new Date('2026-03-16'), amlFlag: true, publicOfficialFlag: true, worldwideTurnover: 2_500_000_000, investigatorId: investigator.id, riskId: risk1.id, triageDate: new Date('2026-03-18'), investigationStartDate: new Date('2026-03-20'),
    },
  })
  const incident2 = await prisma.incident.create({
    data: {
      reference: 'CIR-2026-002', title: 'Vendor contract influence — trading in influence allegation', allegationType: 'Trading in Influence', severity: 'CRITICAL', status: 'FINDINGS_REVIEW', description: 'Allegation that senior manager leveraged personal relationship with procurement committee member to influence vendor selection for EUR 12M IT contract.', discoveryDate: new Date('2026-02-01'), reportedDate: new Date('2026-02-03'), amlFlag: false, publicOfficialFlag: false, worldwideTurnover: 2_500_000_000, investigatorId: co.id, riskId: risk2.id, triageDate: new Date('2026-02-05'), investigationStartDate: new Date('2026-02-10'), findingsDate: new Date('2026-04-15'),
    },
  })
  const incident3 = await prisma.incident.create({
    data: {
      reference: 'CIR-2026-003', title: 'Expense account misappropriation', allegationType: 'Misappropriation', severity: 'MEDIUM', status: 'TRIAGE', description: 'Repeated anomalous expense claims by team lead — EUR 8,400 over 6 months outside policy. Referred to compliance for investigation.', discoveryDate: new Date('2026-04-20'), reportedDate: new Date('2026-04-21'), amlFlag: false, publicOfficialFlag: false, worldwideTurnover: 2_500_000_000, triageDate: new Date('2026-04-22'),
    },
  })
  const incident4 = await prisma.incident.create({
    data: {
      reference: 'CIR-2026-004', title: 'Third-party facilitator payment', allegationType: 'Bribery', severity: 'HIGH', status: 'DISCLOSURE', description: 'Evidence of facilitation payments routed through agent in Southeast Asia. Investigation complete, CCO reviewing voluntary disclosure decision.', discoveryDate: new Date('2026-03-01'), reportedDate: new Date('2026-03-05'), amlFlag: true, publicOfficialFlag: true, worldwideTurnover: 2_500_000_000, investigatorId: investigator.id, riskId: risk2.id, triageDate: new Date('2026-03-03'), investigationStartDate: new Date('2026-03-07'), findingsDate: new Date('2026-04-10'),
    },
  })
  const incident5 = await prisma.incident.create({
    data: {
      reference: 'CIR-2026-005', title: 'Internal audit tip — potential bribery', allegationType: 'Bribery', severity: 'LOW', status: 'DRAFT', description: 'Tip received via internal audit suggesting possible informal payment to customs official. Requires initial triage to determine substantiation.', reportedDate: new Date('2026-05-10'),
    },
  })

  // Incident disclosures
  await prisma.incidentDisclosure.create({
    data: {
      incidentId: incident4.id, legalReviewDone: true, legalReviewDate: new Date('2026-04-12'), ccoDecision: 'DISCLOSE', decisionDate: new Date('2026-04-18'), rapidityClass: 'RAPID', notes: 'Art. 16(d) — 12 days from discovery to decision. Classified RAPID. Voluntary disclosure filed with FIU on 2026-04-20.',
    },
  })
  await prisma.incidentDisclosure.create({
    data: {
      incidentId: incident2.id, legalReviewDone: true, legalReviewDate: new Date('2026-04-16'), notes: 'Legal review complete. Awaiting CCO decision on voluntary disclosure.',
    },
  })

  // Incident findings
  await prisma.incidentFinding.create({
    data: {
      incidentId: incident2.id, summary: 'Manager maintained undisclosed personal relationship with procurement committee chair, constituting a conflict of interest.', evidenceRefs: JSON.stringify(['Email-thread-2026-01.pdf', 'Calendar-records.xlsx']), recommendation: 'Immediate removal from procurement role; mandatory ethics training; disciplinary review.', author: 'Marcus Weber',
    },
  })
  await prisma.incidentFinding.create({
    data: {
      incidentId: incident4.id, summary: 'Agent invoice analysis confirms USD 47,000 in facilitation payments over 18 months. Pattern consistent with Art. 4 bribery offence.', evidenceRefs: JSON.stringify(['Agent-invoices-2024-2025.xlsx', 'Bank-records-excerpt.pdf']), recommendation: 'Terminate agent agreement. File voluntary disclosure. Implement enhanced third-party monitoring.', author: 'Katya Volkov',
    },
  })

  // Remediation actions
  await prisma.incidentRemediation.create({
    data: {
      incidentId: incident4.id, action: 'Terminate agent agreement and notify counterparty in writing', owner: co.id, dueDate: new Date('2026-05-01'), completedDate: new Date('2026-04-28'), status: 'COMPLETED',
    },
  })
  await prisma.incidentRemediation.create({
    data: {
      incidentId: incident4.id, action: 'File voluntary disclosure with Financial Intelligence Unit', owner: cco.id, dueDate: new Date('2026-04-25'), completedDate: new Date('2026-04-20'), status: 'COMPLETED',
    },
  })
  await prisma.incidentRemediation.create({
    data: {
      incidentId: incident4.id, action: 'Conduct enhanced due diligence review of all Southeast Asia agents', owner: co.id, dueDate: new Date('2026-07-01'), status: 'IN_PROGRESS',
    },
  })

  // Gifts
  await prisma.gift.createMany({
    data: [
      { reference: 'GHR-2026-001', description: 'Business dinner at Michelin restaurant', occasion: 'Client relationship maintenance', provider: 'Internal (Marcus Weber)', counterpartyType: 'PRIVATE', eventDate: new Date('2026-04-10'), estimatedValue: 180, attendees: 'Thomas Eriksson, Client rep x2', submitterId: co.id, managerId: manager.id, status: 'PENDING_CO', managerDecision: 'APPROVED', managerNotes: 'Standard client dinner, no concerns.', managerDate: new Date('2026-04-12') },
      { reference: 'GHR-2026-002', description: 'Sporting event tickets — Champions League final', occasion: 'Relationship building', provider: 'Internal (Thomas Eriksson)', counterpartyType: 'PUBLIC_OFFICIAL', amlFlag: true, eventDate: new Date('2026-05-31'), estimatedValue: 850, attendees: 'Thomas Eriksson, Regulatory contact', submitterId: employee.id, managerId: manager.id, status: 'PENDING_CO', managerDecision: 'APPROVED', managerDate: new Date('2026-05-02') },
      { reference: 'GHR-2026-003', description: 'Holiday gift basket — festive season', occasion: 'Festive season goodwill', provider: 'Internal (Thomas Eriksson)', counterpartyType: 'PRIVATE', eventDate: new Date('2025-12-20'), estimatedValue: 22, attendees: 'Thomas Eriksson, Partner contact', submitterId: employee.id, managerId: manager.id, status: 'AUTO_APPROVED', autoApproved: true },
      { reference: 'GHR-2026-004', description: 'Golf day — exclusive club', occasion: 'Sales entertainment', provider: 'Internal (Thomas Eriksson)', counterpartyType: 'PRIVATE', eventDate: new Date('2026-04-05'), estimatedValue: 1200, attendees: 'Thomas Eriksson, Prospect x3', submitterId: employee.id, managerId: manager.id, status: 'REJECTED', managerDecision: 'REJECTED', managerNotes: 'Excessive value. Does not meet policy standards.', managerDate: new Date('2026-04-06') },
      { reference: 'GHR-2026-005', description: 'Working lunch — strategy meeting', occasion: 'Business meeting', provider: 'Internal (Priya Nair)', counterpartyType: 'PRIVATE', eventDate: new Date('2026-03-25'), estimatedValue: 48, attendees: 'Priya Nair, External advisor', submitterId: manager.id, managerId: manager.id, status: 'APPROVED', managerDecision: 'APPROVED', managerDate: new Date('2026-03-26'), coDecision: 'APPROVED', coDate: new Date('2026-03-28') },
      { reference: 'GHR-2026-006', description: 'Industry conference sponsorship table', occasion: 'Industry presence', provider: 'Internal (Marcus Weber)', counterpartyType: 'PRIVATE', eventDate: new Date('2026-06-15'), estimatedValue: 5000, attendees: 'Marcus Weber, Team x5, Clients x4', submitterId: co.id, managerId: manager.id, status: 'PENDING_MANAGER' },
      { reference: 'GHR-2026-007', description: 'Client thank-you gift — premium stationery set', occasion: 'Project completion thank you', provider: 'Internal (Thomas Eriksson)', counterpartyType: 'PRIVATE', eventDate: new Date('2026-02-28'), estimatedValue: 15, attendees: 'Thomas Eriksson', submitterId: employee.id, managerId: manager.id, status: 'AUTO_APPROVED', autoApproved: true },
      { reference: 'GHR-2026-008', description: 'Industry gala dinner — annual awards', occasion: 'Industry networking', provider: 'Internal (Marcus Weber)', counterpartyType: 'PRIVATE', eventDate: new Date('2026-05-22'), estimatedValue: 340, attendees: 'Marcus Weber, Priya Nair, Clients x2', submitterId: co.id, managerId: manager.id, status: 'PENDING_CO', managerDecision: 'APPROVED', managerDate: new Date('2026-05-15') },
    ],
  })

  // COI
  await prisma.cOI.createMany({
    data: [
      { reference: 'COI-2026-001', declarerId: employee.id, interestType: 'Financial', description: 'Holds 3.2% equity stake in Nexus Systems Ltd, an IT vendor bidding for the EUR 12M infrastructure contract.', counterparty: 'Nexus Systems Ltd', estimatedValue: 85000, status: 'ACTIVE_MANAGED', coAssessment: 'ACTUAL', coAssessmentDate: new Date('2026-02-15'), managementDecision: 'Recusal from all procurement decisions involving Nexus. Equity stake must be divested within 90 days.', managementDate: new Date('2026-02-20'), remediationPlan: 'Equity divestiture by 2026-05-20. Monthly status updates to CCO.', nextReviewDate: new Date('2026-08-20'), annualRenewals: 0 },
      { reference: 'COI-2026-002', declarerId: manager.id, interestType: 'Personal', description: 'Spouse is employed as Senior Compliance Analyst at BaFin (German Federal Financial Supervisory Authority).', counterparty: 'BaFin', status: 'PENDING_CO' },
      { reference: 'COI-2026-003', declarerId: co.id, interestType: 'Professional', description: 'Serves as non-executive board member of FinTech portfolio company InnoBank AG. Board meetings quarterly.', counterparty: 'InnoBank AG', estimatedValue: 12000, status: 'ACTIVE_MANAGED', coAssessment: 'MANAGEABLE', coAssessmentDate: new Date('2026-01-10'), managementDecision: 'Permitted with annual disclosure. Recusal from any business involving InnoBank AG.', managementDate: new Date('2026-01-15'), nextReviewDate: new Date('2027-01-10'), annualRenewals: 1, lastRenewalDate: new Date('2026-01-10') },
      { reference: 'COI-2026-004', declarerId: employee.id, interestType: 'Professional', description: 'Previously employed by PricewaterhouseCoopers (PwC) as audit manager, working on three of our current supplier accounts.', counterparty: 'PricewaterhouseCoopers', status: 'RESOLVED', coAssessment: 'NO_CONFLICT', coAssessmentDate: new Date('2026-01-20'), managementDecision: 'No conflict identified. Cooling-off period of 12 months has elapsed. No action required.', managementDate: new Date('2026-01-20') },
    ],
  })

  // WR Cases
  await prisma.wRCase.createMany({
    data: [
      { reference: 'WR-2026-001', reporterName: 'Anonymous Reporter A', reporterContact: 'secure-channel-A@wr.internal', allegation: 'Suspected bribery in procurement', category: 'Bribery', detailsRestricted: 'Reporter observed senior procurement manager meeting with vendor representative outside office hours on three occasions. Subsequently vendor was awarded contract despite higher bid. Reporter believes payment may have been made. Reporter works in procurement support team.', detailsPublic: 'Report of suspected corrupt behaviour in procurement process. Investigation initiated via CIR-2026-001.', status: 'INVESTIGATION', investigatorId: investigator.id, acknowledgedDate: new Date('2026-03-17'), linkedIncidentId: incident1.id },
      { reference: 'WR-2026-002', allegation: 'Expense fraud concern', category: 'Fraud', detailsRestricted: 'Reporter identified pattern of duplicate expense claims submitted by team lead across two cost centres. Total estimated at EUR 6,000-9,000 over 6 months. Reporter found discrepancy during budget reconciliation.', detailsPublic: 'Report of suspected expense irregularities. Under triage assessment.', status: 'ACKNOWLEDGED', acknowledgedDate: new Date('2026-04-23'), reporterName: 'Anonymous Reporter B' },
    ],
  })

  // Third parties and DDQs
  const tp1 = await prisma.thirdParty.create({
    data: {
      name: 'Southeast Asia Trading Partners Ltd', type: 'Agent', jurisdiction: 'Singapore', riskTier: 'CRITICAL', riskScore: 78, ddqStatus: 'ENHANCED', lastDDQDate: new Date('2026-03-01'), nextDDQDate: new Date('2026-09-01'),
    },
  })
  const tp2 = await prisma.thirdParty.create({
    data: {
      name: 'European Distribution Partners GmbH', type: 'Distributor', jurisdiction: 'Germany', riskTier: 'LOW', riskScore: 22, ddqStatus: 'APPROVED', lastDDQDate: new Date('2025-11-01'), nextDDQDate: new Date('2026-11-01'),
    },
  })
  await prisma.thirdParty.create({
    data: {
      name: 'Nexus Advisory Group', type: 'Consultant', jurisdiction: 'UAE', riskTier: 'HIGH', riskScore: 65, ddqStatus: 'CO_REVIEW', lastDDQDate: new Date('2026-04-01'),
    },
  })

  await prisma.dDQ.createMany({
    data: [
      { reference: 'DDQ-2026-001', thirdPartyId: tp1.id, sentDate: new Date('2026-02-15'), responseDate: new Date('2026-03-01'), responses: JSON.stringify({ Q1: 2, Q2: 1, Q3: 3, Q4: 2, Q5: 1 }), rawScore: 31, riskTier: 'CRITICAL', status: 'ENHANCED', enhancedDDQRequired: true, reviewNotes: 'High-risk jurisdiction. PEP exposure identified. Enhanced DDQ required.', reviewDate: new Date('2026-03-10') },
      { reference: 'DDQ-2026-002', thirdPartyId: tp2.id, sentDate: new Date('2025-10-15'), responseDate: new Date('2025-11-01'), responses: JSON.stringify({ Q1: 5, Q2: 4, Q3: 5, Q4: 5, Q5: 4 }), rawScore: 92, riskTier: 'LOW', status: 'APPROVED', reviewNotes: 'Clean record. ISO 37001 certified. Approved.', reviewDate: new Date('2025-11-15') },
    ],
  })

  // Assessments
  await prisma.assessment.create({
    data: {
      reference: 'CPA-2023-001', period: '2023', status: 'SIGNED_OFF', effectivenessScore: 54, obligationCovPct: 60, policyAckPct: 55, trainingPct: 50, controlEffPct: 45, openCriticalCount: 3, openHighCount: 5, scorePenalty: 25, signedOffBy: 'Sofia Martins', ccoSignOffDate: new Date('2024-01-31'),
      genuineness: 'The 2023 assessment represents the organisation\'s first structured compliance programme evaluation following the publication of the draft Directive. Obligation coverage remains partial — only 60% of identified obligations have mapped controls. Policy acknowledgement is below target due to incomplete rollout of the revised Code of Conduct. Training completion suffered from a delayed LMS migration. Three critical open incidents (two bribery allegations, one trading in influence case) impose significant score penalties. The CCO notes that programme infrastructure is in place but not yet fully operational. Priority actions for 2024: complete control mapping for uncovered obligations, achieve 80%+ policy acknowledgement, and close all critical incidents.',
      notes: 'Initial baseline assessment. Programme construction phase. Regulatory deadline (Jun 2028) provides runway for improvement but early deficiencies must be addressed systematically.',
    },
  })
  await prisma.assessment.create({
    data: {
      reference: 'CPA-2024-001', period: '2024', status: 'SIGNED_OFF', effectivenessScore: 67, obligationCovPct: 75, policyAckPct: 72, trainingPct: 68, controlEffPct: 58, openCriticalCount: 1, openHighCount: 3, scorePenalty: 11, signedOffBy: 'Sofia Martins', ccoSignOffDate: new Date('2025-01-28'),
      genuineness: 'The 2024 assessment demonstrates material improvement across all four effectiveness dimensions compared to the 2023 baseline. Obligation coverage reached 75% following the completion of the control mapping exercise initiated in Q1 2024. Policy acknowledgement improved to 72% after the revised Code of Conduct was rolled out via the new LMS platform in Q3. Training completion reached 68%, reflecting strong uptake of the mandatory anti-bribery module (94% completion) offset by lower completion rates on the third-party risk module (52%). Control effectiveness improved to 58% — 7 of 12 tested controls rated effective, with 3 partially effective and 2 ineffective (remediation plans in place). One critical open incident (CIR-2026-002 predecessor) and three high-severity incidents impose an 11-point penalty. The Recital 29 genuineness criteria are partially met: top-level commitment is strong (board resolution passed Q4 2024), proportionality is evidenced by the risk-based control framework, but active implementation evidence remains thin in the third-party screening area.',
      notes: 'Year 2 assessment. Significant improvement trajectory established. Key risks: third-party screening maturity and training completion for non-core staff groups.',
    },
  })
  await prisma.assessment.create({
    data: {
      reference: 'CPA-2025-001', period: '2025', status: 'CCO_REVIEW', effectivenessScore: 78, obligationCovPct: 88, policyAckPct: 84, trainingPct: 79, controlEffPct: 72, openCriticalCount: 1, openHighCount: 2, scorePenalty: 9, cocSubmitDate: new Date(), ccoReviewDate: new Date(),
      genuineness: 'The 2025 assessment reflects continued maturation of the compliance programme approaching the Art. 16(c) adequacy threshold. Obligation coverage reached 88% — all but two obligations (Art. 8 asset recovery and Art. 14 national transposition monitoring) now have mapped controls. Policy acknowledgement improved to 84% following the introduction of the annual digital sign-off process integrated with HR onboarding. Training completion reached 79%, with the third-party risk module now at 81% following mandatory assignment in performance review cycles. Control effectiveness reached 72% — 9 of 12 effective, 2 partially effective, 1 ineffective with remediation in progress. One remaining critical open incident (CIR-2026-002, under findings review) imposes the primary score penalty. The Recital 29 criteria are substantially met: the CCO\'s annual compliance report to the board demonstrates top-level commitment; the risk-based control framework demonstrates proportionality; training and testing evidence demonstrates active implementation; and the systematic year-on-year improvement evidences continuous improvement. The programme is approaching the \'≥80\' threshold for a strong Art. 16(c) mitigation claim.',
      notes: 'Pending CCO review and sign-off. Target: achieve ≥80 in 2026 CPA by closing CIR-2026-002 and completing Art. 8 control mapping.',
    },
  })
  await prisma.assessment.create({
    data: {
      reference: 'CPA-2026-001', period: 'FY 2026', status: 'DRAFT', obligationCovPct: 92, policyAckPct: 88, trainingPct: 83, controlEffPct: 71,
      notes: '2026 annual assessment in progress. CO has entered available metrics. Control testing for CTR-2026-004 and CTR-2026-005 outstanding. Awaiting closure of CIR-2026-002 and CIR-2026-004 before finalising penalty count. Target score: ≥80.',
    },
  })

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: co.id, type: 'SLA_WARNING', title: 'Disclosure SLA approaching', message: 'CIR-2026-002 has been awaiting CCO disclosure decision for 8 days. SLA is 14 days.', severity: 'WARNING', entityType: 'INCIDENT', entityId: incident2.id },
      { userId: cco.id, type: 'PENDING_APPROVAL', title: 'CPA pending sign-off', message: 'CPA-2026-001 (FY 2026) is awaiting CCO review and sign-off.', severity: 'INFO', entityType: 'ASSESSMENT' },
      { userId: co.id, type: 'PENDING_APPROVAL', title: 'Gift approval required', message: 'GHR-2026-002 (Sports tickets EUR 850 — Public Official) awaiting CO review.', severity: 'WARNING', entityType: 'GIFT', entityId: incident1.id },
      { userId: cco.id, type: 'SLA_BREACH', title: 'Investigation SLA breach', message: 'CIR-2026-001 has exceeded the 30-day investigation SLA. Immediate action required.', severity: 'URGENT', entityType: 'INCIDENT', entityId: incident1.id },
    ],
  })

  // Audit log entries
  await prisma.auditLog.createMany({
    data: [
      { actorId: co.id, action: 'STATUS_CHANGE', entityType: 'INCIDENT', entityId: incident1.id, prevState: JSON.stringify({ status: 'DRAFT' }), newState: JSON.stringify({ status: 'TRIAGE' }), notes: 'Incident substantiated. Moving to triage.', createdAt: new Date('2026-03-16') },
      { actorId: co.id, action: 'STATUS_CHANGE', entityType: 'INCIDENT', entityId: incident1.id, prevState: JSON.stringify({ status: 'TRIAGE' }), newState: JSON.stringify({ status: 'INVESTIGATION' }), notes: 'Assigned to Katya Volkov for investigation.', createdAt: new Date('2026-03-20') },
      { actorId: cco.id, action: 'APPROVE', entityType: 'INCIDENT', entityId: incident4.id, prevState: JSON.stringify({ ccoDecision: null }), newState: JSON.stringify({ ccoDecision: 'DISCLOSE', rapidityClass: 'RAPID' }), notes: 'CCO approved voluntary disclosure. Art. 16(d) RAPID classification.', createdAt: new Date('2026-04-18') },
    ],
  })

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
