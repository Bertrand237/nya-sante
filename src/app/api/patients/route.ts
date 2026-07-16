import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/patients?q=...&page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID }

    if (q) {
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { phone: { contains: q } },
        { folderNumber: { contains: q } },
      ]
    }

    const [data, total] = await Promise.all([
      db.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.patient.count({ where }),
    ])

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/patients
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.firstName || !body.lastName || !body.phone) {
      return NextResponse.json(
        { error: 'Prénom, nom et téléphone sont requis' },
        { status: 400 }
      )
    }

    const count = await db.patient.count({ where: { hospitalId: HOSPITAL_ID } })
    const folderNumber = `PAT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const patient = await db.patient.create({
      data: {
        hospitalId: HOSPITAL_ID,
        folderNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender || 'M',
        email: body.email || undefined,
        address: body.address || undefined,
        city: body.city || undefined,
        bloodType: body.bloodType || undefined,
        allergies: body.allergies || undefined,
        medicalHistory: body.medicalHistory || undefined,
        emergencyContact: body.emergencyContact || undefined,
        emergencyPhone: body.emergencyPhone || undefined,
        insuranceProvider: body.insuranceProvider || undefined,
        insuranceNumber: body.insuranceNumber || undefined,
        notes: body.notes || undefined,
      },
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/patients
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du patient requis' }, { status: 400 })
    }

    const existing = await db.patient.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 })
    }

    const patient = await db.patient.update({
      where: { id: body.id },
      data: {
        firstName: body.firstName ?? existing.firstName,
        lastName: body.lastName ?? existing.lastName,
        phone: body.phone ?? existing.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : existing.dateOfBirth,
        gender: body.gender ?? existing.gender,
        email: body.email !== undefined ? body.email : existing.email,
        address: body.address !== undefined ? body.address : existing.address,
        city: body.city !== undefined ? body.city : existing.city,
        bloodType: body.bloodType !== undefined ? body.bloodType : existing.bloodType,
        allergies: body.allergies !== undefined ? body.allergies : existing.allergies,
        medicalHistory: body.medicalHistory !== undefined ? body.medicalHistory : existing.medicalHistory,
        emergencyContact: body.emergencyContact !== undefined ? body.emergencyContact : existing.emergencyContact,
        emergencyPhone: body.emergencyPhone !== undefined ? body.emergencyPhone : existing.emergencyPhone,
        insuranceProvider: body.insuranceProvider !== undefined ? body.insuranceProvider : existing.insuranceProvider,
        insuranceNumber: body.insuranceNumber !== undefined ? body.insuranceNumber : existing.insuranceNumber,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        isAlive: body.isAlive !== undefined ? body.isAlive : existing.isAlive,
      },
    })

    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/patients
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du patient requis' }, { status: 400 })
    }

    const existing = await db.patient.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 })
    }

    await db.patient.delete({ where: { id: body.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}