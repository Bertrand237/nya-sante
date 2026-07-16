import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/labs?status=...&patientId=...&staffId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const patientId = searchParams.get('patientId')
    const staffId = searchParams.get('staffId')

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID }

    if (status) {
      where.status = status
    }
    if (patientId) {
      where.patientId = patientId
    }
    if (staffId) {
      where.staffId = staffId
    }

    const labs = await db.labRequest.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, folderNumber: true } },
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { requestedAt: 'desc' },
    })

    return NextResponse.json(labs)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/labs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId || !body.staffId || !body.analysisType) {
      return NextResponse.json(
        { error: 'Patient, médecin et type d\'analyse sont requis' },
        { status: 400 }
      )
    }

    const count = await db.labRequest.count({ where: { hospitalId: HOSPITAL_ID } })
    const labNumber = `LAB-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const lab = await db.labRequest.create({
      data: {
        hospitalId: HOSPITAL_ID,
        patientId: body.patientId,
        staffId: body.staffId,
        analysisType: body.analysisType,
        notes: body.notes || undefined,
        status: 'en_attente',
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, folderNumber: true } },
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
    })

    return NextResponse.json({ ...lab, labNumber }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/labs
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID de la demande requis' }, { status: 400 })
    }

    const existing = await db.labRequest.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.results !== undefined) updateData.results = body.results
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.status === 'termine') {
      updateData.completedAt = new Date()
    }

    const lab = await db.labRequest.update({
      where: { id: body.id },
      data: updateData,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, folderNumber: true } },
        staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
    })

    const count = await db.labRequest.count({
      where: { hospitalId: HOSPITAL_ID, createdAt: { lte: lab.createdAt } },
    })
    const labNumber = `LAB-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`

    return NextResponse.json({ ...lab, labNumber })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}