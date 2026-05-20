import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

const STATUS_DATE_MAP: Record<string, string> = {
  TRIAGE:          'triageDate',
  INVESTIGATION:   'investigationStartDate',
  FINDINGS_REVIEW: 'findingsDate',
  CLOSED:          'closedDate',
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:write')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json() as { status?: string; notes?: string }

  const incident = await prisma.incident.findUnique({ where: { id } })
  if (!incident) return Response.json({ error: 'Not found' }, { status: 404 })

  const updateData: Record<string, unknown> = {}
  if (body.status) {
    updateData.status = body.status
    const dateField = STATUS_DATE_MAP[body.status]
    if (dateField) updateData[dateField] = new Date()
  }

  const updated = await prisma.incident.update({ where: { id }, data: updateData })

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId:    session.user.id,
      action:     'STATUS_CHANGE',
      entityType: 'INCIDENT',
      entityId:   id,
      prevState:  JSON.stringify({ status: incident.status }),
      newState:   JSON.stringify({ status: body.status }),
      notes:      body.notes,
    },
  })

  return Response.json(updated)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:read')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const incident = await prisma.incident.findUnique({
    where: { id },
    include: { investigator: true, findings: true, disclosure: true, remediations: true },
  })
  if (!incident) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(incident)
}
