import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/appointments?date=...&status=...&patientId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')
    const status = searchParams.get('status')
    const patientId = searchParams.get('patientId')

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID }

    if (dateStr) {
      const startOfDay = new Date(dateStr)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(startOfDay)
      endOfDay.setDate(endOfDay.getDate() + 1)
      where.date = { gte: startOfDay, lt: endOfDay }
    }

    if (status) {
      where.status = status
    }

    if (patientId) {
      where.patientId = patientId
    }

    const appointments = await db.appointment.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId || !body.staffId || !body.date) {
      return NextResponse.json(
        { error: 'Patient, personnel et date sont requis' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.create({
      data: {
        hospitalId: HOSPITAL_ID,
        patientId: body.patientId,
        staffId: body.staffId,
        departmentId: body.departmentId || undefined,
        date: new Date(body.date),
        duration: body.duration || 30,
        status: body.status || 'en_attente',
        type: body.type || 'consultation',
        reason: body.reason || undefined,
        notes: body.notes || undefined,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/appointments
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du rendez-vous requis' }, { status: 400 })
    }

    const existing = await db.appointment.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    const appointment = await db.appointment.update({
      where: { id: body.id },
      data: {
        patientId: body.patientId ?? existing.patientId,
        staffId: body.staffId ?? existing.staffId,
        departmentId: body.departmentId !== undefined ? body.departmentId : existing.departmentId,
        date: body.date ? new Date(body.date) : existing.date,
        duration: body.duration ?? existing.duration,
        status: body.status ?? existing.status,
        type: body.type ?? existing.type,
        reason: body.reason !== undefined ? body.reason : existing.reason,
        notes: body.notes !== undefined ? body.notes : existing.notes,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/appointments (cancel - set status to 'annule')
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du rendez-vous requis' }, { status: 400 })
    }

    const existing = await db.appointment.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    await db.appointment.update({
      where: { id: body.id },
      data: { status: 'annule' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}