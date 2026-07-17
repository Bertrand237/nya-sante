import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/hospitals — list all hospitals except the current one
export async function GET() {
  try {
    const hospitals = await db.hospital.findMany({
      where: {
        id: { not: HOSPITAL_ID },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        phone: true,
        type: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(hospitals)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}