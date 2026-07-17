import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/patients/[id] — single patient with full medical record
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const patient = await db.patient.findFirst({
      where: { id },
      include: {
        consultations: {
          include: {
            staff: { select: { id: true, firstName: true, lastName: true, specialty: true } },
            prescriptions: {
              include: { items: true },
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        prescriptions: {
          include: {
            consultation: { select: { id: true, createdAt: true, diagnosis: true } },
            staff: { select: { id: true, firstName: true, lastName: true } },
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
        vitals: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        labRequests: {
          include: {
            staff: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}