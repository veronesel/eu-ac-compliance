import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'controls:write')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()

  if (body.owner && body.tester && body.owner === body.tester) {
    return Response.json({ error: 'FR-25: owner and tester must differ' }, { status: 400 })
  }

  try {
    const updated = await prisma.control.update({ where: { id }, data: body })
    return Response.json(updated)
  } catch {
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
