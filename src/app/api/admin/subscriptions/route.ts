import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/subscriptions — List all subscriptions with hospital & validator info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get('hospitalId')

    const where: Record<string, unknown> = {}
    if (hospitalId) {
      where.hospitalId = hospitalId
    }

    const subscriptions = await db.subscription.findMany({
      where,
      select: {
        id: true,
        durationMonths: true,
        startDate: true,
        endDate: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        hospital: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        validator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Admin subscriptions fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/admin/subscriptions — Validate/create a new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hospitalId, durationMonths, notes, validatedBy } = body

    // Validate required fields
    if (!hospitalId || !durationMonths || !validatedBy) {
      return NextResponse.json(
        { error: 'hospitalId, durationMonths et validatedBy sont requis' },
        { status: 400 }
      )
    }

    if (typeof durationMonths !== 'number' || durationMonths < 1 || durationMonths > 12) {
      return NextResponse.json(
        { error: 'durationMonths doit être un nombre entre 1 et 12' },
        { status: 400 }
      )
    }

    // Verify hospital exists
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalId },
    })

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hôpital introuvable' },
        { status: 404 }
      )
    }

    const now = new Date()
    const endDate = new Date(now)
    endDate.setMonth(endDate.getMonth() + durationMonths)

    // Create subscription and update hospital in a transaction
    const subscription = await db.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          hospitalId,
          durationMonths,
          startDate: now,
          endDate,
          status: 'actif',
          validatedBy,
          notes: notes || null,
        },
        include: {
          hospital: {
            select: { id: true, name: true, city: true },
          },
          validator: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      })

      await tx.hospital.update({
        where: { id: hospitalId },
        data: {
          subscriptionEndsAt: endDate,
          isActive: true,
        },
      })

      return sub
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Admin subscription create error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/subscriptions — Extend or revoke a subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, durationMonths, validatedBy, notes } = body

    if (!id || !action || !validatedBy) {
      return NextResponse.json(
        { error: 'id, action et validatedBy sont requis' },
        { status: 400 }
      )
    }

    if (action !== 'extend' && action !== 'revoke') {
      return NextResponse.json(
        { error: 'action doit être "extend" ou "revoke"' },
        { status: 400 }
      )
    }

    // Verify subscription exists
    const existing = await db.subscription.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Abonnement introuvable' },
        { status: 404 }
      )
    }

    if (action === 'extend') {
      if (!durationMonths || durationMonths < 1 || durationMonths > 12) {
        return NextResponse.json(
          { error: 'durationMonths doit être un nombre entre 1 et 12 pour l\'extension' },
          { status: 400 }
        )
      }

      const newEndDate = new Date(existing.endDate)
      newEndDate.setMonth(newEndDate.getMonth() + durationMonths)

      const updated = await db.$transaction(async (tx) => {
        const sub = await tx.subscription.update({
          where: { id },
          data: {
            endDate: newEndDate,
            notes: notes || existing.notes,
          },
          include: {
            hospital: {
              select: { id: true, name: true, city: true },
            },
            validator: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        })

        await tx.hospital.update({
          where: { id: existing.hospitalId },
          data: {
            subscriptionEndsAt: newEndDate,
            isActive: true,
          },
        })

        return sub
      })

      return NextResponse.json(updated)
    }

    // action === 'revoke'
    const revoked = await db.$transaction(async (tx) => {
      const sub = await tx.subscription.update({
        where: { id },
        data: {
          status: 'expire',
          notes: notes || existing.notes,
        },
        include: {
          hospital: {
            select: { id: true, name: true, city: true },
          },
          validator: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      })

      await tx.hospital.update({
        where: { id: existing.hospitalId },
        data: {
          isActive: false,
        },
      })

      return sub
    })

    return NextResponse.json(revoked)
  } catch (error) {
    console.error('Admin subscription update error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}