import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, 'risks:write')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { category, title, description, likelihood, impact, currentControls, owner, reviewDate, status, residualLikelihood, residualImpact } = body

  if (!category || !title || !description || !likelihood || !impact || !currentControls || !owner || !reviewDate || !status) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const l = Number(likelihood)
    const i = Number(impact)
    const rl = Number(residualLikelihood ?? 1)
    const ri = Number(residualImpact ?? 1)

    const risk = await prisma.risk.create({
      data: {
        category,
        title,
        description,
        likelihood: l,
        impact: i,
        inherentScore: l * i,
        currentControls,
        residualLikelihood: rl,
        residualImpact: ri,
        residualScore: rl * ri,
        owner,
        reviewDate: new Date(reviewDate),
        status,
      },
    })
    return Response.json(risk, { status: 201 })
  } catch {
    return Response.json({ error: 'Create failed' }, { status: 500 })
  }
}
