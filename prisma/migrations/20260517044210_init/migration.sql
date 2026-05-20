-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Obligation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleRef" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "obligationType" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "probability" INTEGER NOT NULL DEFAULT 2,
    "impact" INTEGER NOT NULL DEFAULT 3,
    "policies" TEXT NOT NULL DEFAULT '[]',
    "controls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likelihood" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "inherentScore" INTEGER NOT NULL,
    "currentControls" TEXT NOT NULL,
    "residualLikelihood" INTEGER NOT NULL DEFAULT 2,
    "residualImpact" INTEGER NOT NULL DEFAULT 2,
    "residualScore" INTEGER NOT NULL DEFAULT 4,
    "owner" TEXT NOT NULL,
    "reviewDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "allegationType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "description" TEXT NOT NULL,
    "discoveryDate" DATETIME,
    "reportedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investigatorId" TEXT,
    "subjectId" TEXT,
    "amlFlag" BOOLEAN NOT NULL DEFAULT false,
    "publicOfficialFlag" BOOLEAN NOT NULL DEFAULT false,
    "estimatedLoss" REAL,
    "worldwideTurnover" REAL,
    "riskId" TEXT,
    "triageDate" DATETIME,
    "investigationStartDate" DATETIME,
    "findingsDate" DATETIME,
    "closedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Incident_investigatorId_fkey" FOREIGN KEY ("investigatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Incident_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Incident_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "Risk" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IncidentFinding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "incidentId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "evidenceRefs" TEXT NOT NULL DEFAULT '[]',
    "recommendation" TEXT NOT NULL,
    "findingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    CONSTRAINT "IncidentFinding_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IncidentDisclosure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "incidentId" TEXT NOT NULL,
    "legalReviewDone" BOOLEAN NOT NULL DEFAULT false,
    "legalReviewDate" DATETIME,
    "ccoDecision" TEXT,
    "decisionDate" DATETIME,
    "disclosureDate" DATETIME,
    "rapidityClass" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IncidentDisclosure_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IncidentRemediation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "incidentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "completedDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "IncidentRemediation_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "counterpartyType" TEXT NOT NULL,
    "amlFlag" BOOLEAN NOT NULL DEFAULT false,
    "eventDate" DATETIME NOT NULL,
    "estimatedValue" REAL NOT NULL,
    "attendees" TEXT NOT NULL,
    "submitterId" TEXT NOT NULL,
    "managerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_MANAGER',
    "managerDecision" TEXT,
    "managerNotes" TEXT,
    "managerDate" DATETIME,
    "coDecision" TEXT,
    "coNotes" TEXT,
    "coDate" DATETIME,
    "autoApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gift_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Gift_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "COI" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "declarerId" TEXT NOT NULL,
    "interestType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "counterparty" TEXT NOT NULL,
    "estimatedValue" REAL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "coAssessment" TEXT,
    "coAssessmentDate" DATETIME,
    "managementDecision" TEXT,
    "managementDate" DATETIME,
    "remediationPlan" TEXT,
    "nextReviewDate" DATETIME,
    "annualRenewals" INTEGER NOT NULL DEFAULT 0,
    "lastRenewalDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "COI_declarerId_fkey" FOREIGN KEY ("declarerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WRCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "reporterUserId" TEXT,
    "reporterName" TEXT,
    "reporterContact" TEXT,
    "allegation" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "detailsRestricted" TEXT NOT NULL,
    "detailsPublic" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "investigatorId" TEXT,
    "acknowledgedDate" DATETIME,
    "feedbackDate" DATETIME,
    "linkedIncidentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WRCase_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ThirdParty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "riskTier" TEXT,
    "riskScore" REAL,
    "ddqStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "lastDDQDate" DATETIME,
    "nextDDQDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DDQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "thirdPartyId" TEXT NOT NULL,
    "sentDate" DATETIME,
    "responseDate" DATETIME,
    "responses" TEXT NOT NULL DEFAULT '{}',
    "rawScore" REAL,
    "riskTier" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "enhancedDDQRequired" BOOLEAN NOT NULL DEFAULT false,
    "reviewNotes" TEXT,
    "reviewDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DDQ_thirdPartyId_fkey" FOREIGN KEY ("thirdPartyId") REFERENCES "ThirdParty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Control" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "controlType" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "tester" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "assignedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testStartDate" DATETIME,
    "testEndDate" DATETIME,
    "evidenceRefs" TEXT NOT NULL DEFAULT '[]',
    "testResult" TEXT,
    "reviewNotes" TEXT,
    "remediationPlan" TEXT,
    "remediationDue" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "effectivenessScore" REAL,
    "obligationCovPct" REAL,
    "policyAckPct" REAL,
    "trainingPct" REAL,
    "controlEffPct" REAL,
    "openCriticalCount" INTEGER NOT NULL DEFAULT 0,
    "openHighCount" INTEGER NOT NULL DEFAULT 0,
    "scorePenalty" REAL NOT NULL DEFAULT 0,
    "cocSubmitDate" DATETIME,
    "ccoReviewDate" DATETIME,
    "ccoSignOffDate" DATETIME,
    "signedOffBy" TEXT,
    "notes" TEXT,
    "genuineness" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Incident" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "prevState" TEXT,
    "newState" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Incident" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Gift" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "COI" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_reference_key" ON "Incident"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentDisclosure_incidentId_key" ON "IncidentDisclosure"("incidentId");

-- CreateIndex
CREATE UNIQUE INDEX "Gift_reference_key" ON "Gift"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "COI_reference_key" ON "COI"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "WRCase_reference_key" ON "WRCase"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "DDQ_reference_key" ON "DDQ"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Control_reference_key" ON "Control"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_reference_key" ON "Assessment"("reference");
