import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'assessments:signoff')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json() as { action: string }
  if (body.action === 'signoff') {
    const updated = await prisma.assessment.update({
      where: { id },
      data: { status: 'SIGNED_OFF', ccoSignOffDate: new Date(), signedOffBy: session.user.name },
    })
    return Response.json(updated)
  }
  return Response.json({ error: 'Unknown action' }, { status: 400 })
}
