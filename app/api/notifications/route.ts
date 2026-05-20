import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return Response.json(notifications)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { ids?: string[] }
  if (body.ids) {
    await prisma.notification.updateMany({
      where: { id: { in: body.ids }, userId: session.user.id },
      data: { read: true },
    })
  } else {
    await prisma.notification.updateMany({
      where: { userId: session.user.id },
      data: { read: true },
    })
  }
  return Response.json({ ok: true })
}
