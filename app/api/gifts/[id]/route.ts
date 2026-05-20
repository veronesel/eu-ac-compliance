import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json() as { decision: string; notes?: string }
  const gift = await prisma.gift.findUnique({ where: { id } })
  if (!gift) return Response.json({ error: 'Not found' }, { status: 404 })

  const isManagerAction = gift.status === 'PENDING_MANAGER' && hasPermission(session.user.role, 'gifts:approve:manager')
  const isCOAction = gift.status === 'PENDING_CO' && hasPermission(session.user.role, 'gifts:approve:co')
  if (!isManagerAction && !isCOAction) return Response.json({ error: 'Forbidden' }, { status: 403 })

  let newStatus = gift.status
  if (isManagerAction) {
    if (body.decision === 'APPROVED') newStatus = 'PENDING_CO'
    else if (body.decision === 'REJECTED') newStatus = 'REJECTED'
    else newStatus = 'RETURNED'
  } else {
    if (body.decision === 'APPROVED') newStatus = 'APPROVED'
    else if (body.decision === 'REJECTED') newStatus = 'REJECTED'
    else newStatus = 'RETURNED'
  }

  const updateData = isManagerAction
    ? { status: newStatus, managerDecision: body.decision, managerNotes: body.notes, managerDate: new Date() }
    : { status: newStatus, coDecision: body.decision, coNotes: body.notes, coDate: new Date() }

  const updated = await prisma.gift.update({ where: { id }, data: updateData })
  return Response.json(updated)
}
