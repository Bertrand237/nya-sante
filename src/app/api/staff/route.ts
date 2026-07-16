import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/staff?departmentId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get('departmentId') || undefined

    const where: Record<string, unknown> = {
      hospitalId: HOSPITAL_ID,
      isActive: true,
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    const staff = await db.staff.findMany({
      where,
      include: {
        role: true,
        department: true,
      },
      orderBy: { lastName: 'asc' },
    })

    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/staff
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.firstName || !body.lastName || !body.phone || !body.roleId) {
      return NextResponse.json(
        { error: 'Prénom, nom, téléphone et rôle sont requis' },
        { status: 400 }
      )
    }

    const staff = await db.staff.create({
      data: {
        hospitalId: HOSPITAL_ID,
        departmentId: body.departmentId || undefined,
        roleId: body.roleId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email || undefined,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender || 'M',
        specialty: body.specialty || undefined,
        licenseNumber: body.licenseNumber || undefined,
        address: body.address || undefined,
        salary: body.salary || undefined,
        pin: body.pin || undefined,
      },
      include: { role: true, department: true },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/staff
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du personnel requis' }, { status: 400 })
    }

    const existing = await db.staff.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Personnel non trouvé' }, { status: 404 })
    }

    const staff = await db.staff.update({
      where: { id: body.id },
      data: {
        departmentId: body.departmentId !== undefined ? body.departmentId : existing.departmentId,
        roleId: body.roleId ?? existing.roleId,
        firstName: body.firstName ?? existing.firstName,
        lastName: body.lastName ?? existing.lastName,
        email: body.email !== undefined ? body.email : existing.email,
        phone: body.phone ?? existing.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : existing.dateOfBirth,
        gender: body.gender ?? existing.gender,
        specialty: body.specialty !== undefined ? body.specialty : existing.specialty,
        licenseNumber: body.licenseNumber !== undefined ? body.licenseNumber : existing.licenseNumber,
        address: body.address !== undefined ? body.address : existing.address,
        salary: body.salary !== undefined ? body.salary : existing.salary,
        pin: body.pin !== undefined ? body.pin : existing.pin,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      },
      include: { role: true, department: true },
    })

    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/staff (soft-delete)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du personnel requis' }, { status: 400 })
    }

    const existing = await db.staff.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Personnel non trouvé' }, { status: 404 })
    }

    await db.staff.update({
      where: { id: body.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}