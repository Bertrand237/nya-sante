import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/settings
export async function GET() {
  try {
    const settings = await db.hospitalSetting.findMany({
      where: { hospitalId: HOSPITAL_ID },
      orderBy: { key: 'asc' },
    })

    // Convert to key-value object
    const settingsMap: Record<string, string> = {}
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value
    }

    return NextResponse.json(settingsMap)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.key) {
      return NextResponse.json({ error: 'Clé de paramètre requise' }, { status: 400 })
    }

    const setting = await db.hospitalSetting.upsert({
      where: {
        hospitalId_key: {
          hospitalId: HOSPITAL_ID,
          key: body.key,
        },
      },
      update: {
        value: body.value ?? '',
      },
      create: {
        hospitalId: HOSPITAL_ID,
        key: body.key,
        value: body.value ?? '',
      },
    })

    return NextResponse.json({
      key: setting.key,
      value: setting.value,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}