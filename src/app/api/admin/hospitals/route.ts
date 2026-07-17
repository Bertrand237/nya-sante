import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/hospitals — Super admin view of ALL hospitals on the platform
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    // Build the where clause
    const where: Record<string, unknown> = {}

    // Status filter
    if (status === 'active') {
      where.OR = [
        { isActive: true, subscriptionEndsAt: { gte: new Date() } },
        { isActive: true, subscriptionEndsAt: null },
      ]
    } else if (status === 'expired') {
      where.OR = [
        { subscriptionEndsAt: { lt: new Date() } },
        { isActive: false },
      ]
    }

    // Search filter (name or city)
    if (search) {
      const searchClause = {
        OR: [
          { name: { contains: search } },
          { city: { contains: search } },
        ],
      }
      if (where.OR) {
        // Combine with existing OR using AND
        where.AND = [
          { OR: where.OR as Record<string, unknown>[] },
          searchClause,
        ]
        delete where.OR
      } else {
        Object.assign(where, searchClause)
      }
    }

    const hospitals = await db.hospital.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        type: true,
        phone: true,
        email: true,
        ownerName: true,
        ownerPhone: true,
        isActive: true,
        subscriptionEndsAt: true,
        _count: {
          select: {
            patients: true,
            staff: true,
            departments: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            durationMonths: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(hospitals)
  } catch (error) {
    console.error('Admin hospitals fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}