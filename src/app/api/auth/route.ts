import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { phone, pin } = await req.json()
    const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

    if (!phone || !pin) {
      return NextResponse.json({ error: 'Téléphone et PIN requis' }, { status: 400 })
    }

    const user = await db.staff.findFirst({
      where: { hospitalId: HOSPITAL_ID, phone, pin, isActive: true },
      include: { role: true, department: true, hospital: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      department: user.department,
      hospital: { name: user.hospital.name, city: user.hospital.city },
      specialty: user.specialty,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}