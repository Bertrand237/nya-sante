import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/audit?action=...&entity=...&userId=...&dateFrom=...&dateTo=...&search=...&page=1&limit=50
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const entity = searchParams.get('entity')
    const userId = searchParams.get('userId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID }

    if (action) {
      where.action = action
    }

    if (entity) {
      where.entity = entity
    }

    if (userId) {
      where.staffId = userId
    }

    if (dateFrom || dateTo) {
      where.createdAt = {} as Record<string, unknown>
      if (dateFrom) {
        (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom)
      }
      if (dateTo) {
        // Include the end of the day
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        ;(where.createdAt as Record<string, unknown>).lte = end
      }
    }

    if (search) {
      where.OR = [
        { details: { contains: search } },
        { staff: { OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }] } },
      ]
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        include: {
          staff: {
            select: { id: true, firstName: true, lastName: true, phone: true, role: { select: { label: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.auditLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Audit log error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}