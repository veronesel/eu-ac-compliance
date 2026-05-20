import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { determineGHRRouting } from '@/lib/formulas'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'gifts:submit')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    description: string; occasion: string; provider: string;
    counterpartyType: string; estimatedValue: number; eventDate: string; attendees: string;
  }

  const count = await prisma.gift.count()
  const reference = `GHR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

  const isPublicOfficial = ['PUBLIC_OFFICIAL', 'REGULATOR'].includes(body.counterpartyType)
  const routing = determineGHRRouting(body.estimatedValue, isPublicOfficial)

  let status = 'PENDING_MANAGER'
  let autoApproved = false
  if (!routing.requiresCOReview && body.estimatedValue <= 25 && !isPublicOfficial) {
    status = 'AUTO_APPROVED'
    autoApproved = true
  }

  const gift = await prisma.gift.create({
    data: {
      reference,
      description: body.description,
      occasion: body.occasion,
      provider: body.provider,
      counterpartyType: body.counterpartyType,
      estimatedValue: body.estimatedValue,
      eventDate: new Date(body.eventDate),
      attendees: body.attendees,
      submitterId: session.user.id,
      amlFlag: isPublicOfficial,
      status,
      autoApproved,
    },
  })

  return Response.json(gift, { status: 201 })
}

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'gifts:read')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const gifts = await prisma.gift.findMany({
    include: { submitter: true, manager: true },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(gifts)
}
