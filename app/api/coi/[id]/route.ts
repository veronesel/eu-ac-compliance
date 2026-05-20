import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'coi:assess')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json() as { coAssessment: string; managementDecision?: string }

  const statusMap: Record<string, string> = {
    NO_CONFLICT: 'NO_CONFLICT',
    MANAGEABLE:  'ACTIVE_MANAGED',
    ACTUAL:      'ACTUAL',
  }

  const updated = await prisma.cOI.update({
    where: { id },
    data: {
      coAssessment: body.coAssessment,
      coAssessmentDate: new Date(),
      managementDecision: body.managementDecision,
      managementDate: new Date(),
      status: statusMap[body.coAssessment] ?? 'PENDING_CO',
    },
  })
  return Response.json(updated)
}
