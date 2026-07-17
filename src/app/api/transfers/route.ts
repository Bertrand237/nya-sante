import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/transfers?direction=outgoing|incoming
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const direction = searchParams.get('direction') || 'outgoing'

    const where: Record<string, unknown> = {}
    if (direction === 'outgoing') {
      where.fromHospitalId = HOSPITAL_ID
    } else {
      where.toHospitalId = HOSPITAL_ID
    }

    const transfers = await db.patientTransfer.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, folderNumber: true, phone: true, dateOfBirth: true, gender: true, bloodType: true } },
        fromHospital: { select: { id: true, name: true, city: true } },
        toHospital: { select: { id: true, name: true, city: true } },
        requester: { select: { id: true, firstName: true, lastName: true, role: { select: { label: true } } } },
        responder: { select: { id: true, firstName: true, lastName: true, role: { select: { label: true } } } },
      },
      orderBy: { requestedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(transfers)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/transfers — create a new transfer request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId || !body.toHospitalId || !body.requestedBy) {
      return NextResponse.json(
        { error: 'patientId, toHospitalId et requestedBy sont requis' },
        { status: 400 }
      )
    }

    // Fetch patient with all medical data for the snapshot
    const patient = await db.patient.findFirst({
      where: { id: body.patientId, hospitalId: HOSPITAL_ID },
      include: {
        consultations: {
          include: {
            staff: { select: { firstName: true, lastName: true, specialty: true } },
            prescriptions: { include: { items: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        prescriptions: {
          include: {
            staff: { select: { firstName: true, lastName: true } },
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        vitals: { orderBy: { createdAt: 'desc' }, take: 20 },
        labRequests: {
          include: { staff: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        invoices: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 })
    }

    if (body.toHospitalId === HOSPITAL_ID) {
      return NextResponse.json({ error: 'Impossible de transférer vers le même hôpital' }, { status: 400 })
    }

    const transfer = await db.patientTransfer.create({
      data: {
        patientId: body.patientId,
        fromHospitalId: HOSPITAL_ID,
        toHospitalId: body.toHospitalId,
        patientData: JSON.stringify(patient),
        reason: body.reason || null,
        requestedBy: body.requestedBy,
        status: 'en_attente',
      },
      include: {
        patient: { select: { firstName: true, lastName: true, folderNumber: true } },
        toHospital: { select: { name: true, city: true } },
      },
    })

    return NextResponse.json(transfer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/transfers — accept/refuse/cancel a transfer
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id || !body.action || !body.respondedBy) {
      return NextResponse.json(
        { error: 'id, action et respondedBy sont requis' },
        { status: 400 }
      )
    }

    const validActions = ['accepte', 'refuse', 'annule']
    if (!validActions.includes(body.action)) {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
    }

    const transfer = await db.patientTransfer.findFirst({
      where: { id: body.id },
    })

    if (!transfer) {
      return NextResponse.json({ error: 'Transfert non trouvé' }, { status: 404 })
    }

    if (transfer.status !== 'en_attente') {
      return NextResponse.json({ error: 'Ce transfert n\'est plus en attente' }, { status: 400 })
    }

    // Validate action against direction
    if (body.action === 'annule' && transfer.fromHospitalId !== HOSPITAL_ID) {
      return NextResponse.json({ error: 'Seul l\'hôpital expéditeur peut annuler' }, { status: 403 })
    }
    if ((body.action === 'accepte' || body.action === 'refuse') && transfer.toHospitalId !== HOSPITAL_ID) {
      return NextResponse.json({ error: 'Seul l\'hôpital destinataire peut répondre' }, { status: 403 })
    }

    const updated = await db.patientTransfer.update({
      where: { id: body.id },
      data: {
        status: body.action,
        respondedBy: body.respondedBy,
        responseNotes: body.responseNotes || null,
        respondedAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}