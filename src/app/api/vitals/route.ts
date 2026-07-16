import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/vitals?patientId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json({ error: 'ID du patient requis' }, { status: 400 })
    }

    const vitals = await db.vitalSign.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(vitals)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/vitals
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId) {
      return NextResponse.json({ error: 'ID du patient requis' }, { status: 400 })
    }

    const vital = await db.vitalSign.create({
      data: {
        patientId: body.patientId,
        staffId: body.staffId || undefined,
        weight: body.weight !== undefined ? Number(body.weight) : undefined,
        height: body.height !== undefined ? Number(body.height) : undefined,
        temperature: body.temperature !== undefined ? Number(body.temperature) : undefined,
        bloodPressureSystolic: body.bloodPressureSystolic !== undefined ? Number(body.bloodPressureSystolic) : undefined,
        bloodPressureDiastolic: body.bloodPressureDiastolic !== undefined ? Number(body.bloodPressureDiastolic) : undefined,
        heartRate: body.heartRate !== undefined ? Number(body.heartRate) : undefined,
        respiratoryRate: body.respiratoryRate !== undefined ? Number(body.respiratoryRate) : undefined,
        oxygenSaturation: body.oxygenSaturation !== undefined ? Number(body.oxygenSaturation) : undefined,
        notes: body.notes || undefined,
      },
    })

    return NextResponse.json(vital, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}