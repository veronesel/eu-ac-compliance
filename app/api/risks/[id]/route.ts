import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'risks:write')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()

  try {
    const likelihood = body.likelihood ? Number(body.likelihood) : undefined
    const impact = body.impact ? Number(body.impact) : undefined
    const residualLikelihood = body.residualLikelihood ? Number(body.residualLikelihood) : undefined
    const residualImpact = body.residualImpact ? Number(body.residualImpact) : undefined

    const updateData: Record<string, unknown> = { ...body }

    if (likelihood !== undefined && impact !== undefined) {
      updateData.inherentScore = likelihood * impact
    } else if (likelihood !== undefined) {
      const existing = await prisma.risk.findUnique({ where: { id } })
      if (existing) updateData.inherentScore = likelihood * existing.impact
    } else if (impact !== undefined) {
      const existing = await prisma.risk.findUnique({ where: { id } })
      if (existing) updateData.inherentScore = existing.likelihood * impact
    }

    if (residualLikelihood !== undefined && residualImpact !== undefined) {
      updateData.residualScore = residualLikelihood * residualImpact
    } else if (residualLikelihood !== undefined) {
      const existing = await prisma.risk.findUnique({ where: { id } })
      if (existing) updateData.residualScore = residualLikelihood * existing.residualImpact
    } else if (residualImpact !== undefined) {
      const existing = await prisma.risk.findUnique({ where: { id } })
      if (existing) updateData.residualScore = existing.residualLikelihood * residualImpact
    }

    const updated = await prisma.risk.update({ where: { id }, data: updateData })
    return Response.json(updated)
  } catch {
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
