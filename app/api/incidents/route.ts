import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:write')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    title: string; allegationType: string; severity: string;
    description: string; discoveryDate?: string; amlFlag?: boolean;
    publicOfficialFlag?: boolean; worldwideTurnover?: string
  }

  // Generate reference
  const count = await prisma.incident.count()
  const reference = `CIR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

  const incident = await prisma.incident.create({
    data: {
      reference,
      title: body.title,
      allegationType: body.allegationType,
      severity: body.severity,
      description: body.description,
      discoveryDate: body.discoveryDate ? new Date(body.discoveryDate) : undefined,
      amlFlag: body.amlFlag ?? false,
      publicOfficialFlag: body.publicOfficialFlag ?? false,
      worldwideTurnover: body.worldwideTurnover ? parseFloat(body.worldwideTurnover) : 2_500_000_000,
      status: 'DRAFT',
    },
  })

  return Response.json(incident, { status: 201 })
}

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'incidents:read')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const incidents = await prisma.incident.findMany({
    include: { investigator: true },
    orderBy: { reportedDate: 'desc' },
  })
  return Response.json(incidents)
}
