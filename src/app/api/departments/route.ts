import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/departments
export async function GET() {
  try {
    const departments = await db.department.findMany({
      where: { hospitalId: HOSPITAL_ID, isActive: true },
      include: {
        head: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        _count: { select: { staff: true, services: true } },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(departments)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/departments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name) {
      return NextResponse.json({ error: 'Nom du département requis' }, { status: 400 })
    }

    const department = await db.department.create({
      data: {
        hospitalId: HOSPITAL_ID,
        name: body.name,
        description: body.description || undefined,
        type: body.type || 'clinique',
        headId: body.headId || undefined,
        color: body.color || '#047857',
        sortOrder: body.sortOrder || 0,
      },
      include: {
        head: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        _count: { select: { staff: true, services: true } },
      },
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/departments
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du département requis' }, { status: 400 })
    }

    const existing = await db.department.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Département non trouvé' }, { status: 404 })
    }

    const department = await db.department.update({
      where: { id: body.id },
      data: {
        name: body.name ?? existing.name,
        description: body.description !== undefined ? body.description : existing.description,
        type: body.type ?? existing.type,
        headId: body.headId !== undefined ? body.headId : existing.headId,
        color: body.color ?? existing.color,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : existing.sortOrder,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      },
      include: {
        head: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        _count: { select: { staff: true, services: true } },
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/departments (soft-delete)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du département requis' }, { status: 400 })
    }

    const existing = await db.department.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Département non trouvé' }, { status: 404 })
    }

    await db.department.update({
      where: { id: body.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}