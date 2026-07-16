import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/consultations?patientId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json({ error: 'ID du patient requis' }, { status: 400 })
    }

    const consultations = await db.consultation.findMany({
      where: { hospitalId: HOSPITAL_ID, patientId },
      include: {
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        department: { select: { id: true, name: true } },
        prescriptions: {
          include: {
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(consultations)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/consultations
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId || !body.staffId) {
      return NextResponse.json(
        { error: 'Patient et personnel sont requis' },
        { status: 400 }
      )
    }

    const consultation = await db.consultation.create({
      data: {
        hospitalId: HOSPITAL_ID,
        patientId: body.patientId,
        staffId: body.staffId,
        appointmentId: body.appointmentId || undefined,
        departmentId: body.departmentId || undefined,
        type: body.type || 'premiere_consultation',
        chiefComplaint: body.chiefComplaint || undefined,
        historyOfPresentIllness: body.historyOfPresentIllness || undefined,
        pastMedicalHistory: body.pastMedicalHistory || undefined,
        physicalExam: body.physicalExam || undefined,
        diagnosis: body.diagnosis || undefined,
        plan: body.plan || undefined,
        notes: body.notes || undefined,
        status: body.status || 'en_cours',
      },
      include: {
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        department: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(consultation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/consultations
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID de la consultation requis' }, { status: 400 })
    }

    const existing = await db.consultation.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Consultation non trouvée' }, { status: 404 })
    }

    const consultation = await db.consultation.update({
      where: { id: body.id },
      data: {
        type: body.type ?? existing.type,
        chiefComplaint: body.chiefComplaint !== undefined ? body.chiefComplaint : existing.chiefComplaint,
        historyOfPresentIllness: body.historyOfPresentIllness !== undefined ? body.historyOfPresentIllness : existing.historyOfPresentIllness,
        pastMedicalHistory: body.pastMedicalHistory !== undefined ? body.pastMedicalHistory : existing.pastMedicalHistory,
        physicalExam: body.physicalExam !== undefined ? body.physicalExam : existing.physicalExam,
        diagnosis: body.diagnosis !== undefined ? body.diagnosis : existing.diagnosis,
        plan: body.plan !== undefined ? body.plan : existing.plan,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        status: body.status ?? existing.status,
      },
      include: {
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        department: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(consultation)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}