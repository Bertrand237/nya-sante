import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/prescriptions?patientId=...&search=...&dateFrom=...&dateTo=...&page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')
    const search = searchParams.get('search')?.trim() || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    const where: Prisma.PrescriptionWhereInput = { hospitalId: HOSPITAL_ID }

    if (patientId) {
      where.patientId = patientId
    }

    if (search) {
      where.patient = {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { folderNumber: { contains: search } },
        ],
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = toDate
      }
    }

    const [prescriptions, total] = await Promise.all([
      db.prescription.findMany({
        where,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, folderNumber: true, phone: true } },
          staff: { select: { id: true, firstName: true, lastName: true, specialty: true, licenseNumber: true } },
          consultation: { select: { id: true, diagnosis: true } },
          items: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.prescription.count({ where }),
    ])

    return NextResponse.json({
      data: prescriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Prescriptions GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}