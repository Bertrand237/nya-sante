import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/invoices?status=...&patientId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const patientId = searchParams.get('patientId')

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID }

    if (status) {
      where.status = status
    }

    if (patientId) {
      where.patientId = patientId
    }

    const invoices = await db.invoice.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/invoices
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId || body.amount === undefined) {
      return NextResponse.json(
        { error: 'Patient et montant sont requis' },
        { status: 400 }
      )
    }

    const count = await db.invoice.count({ where: { hospitalId: HOSPITAL_ID } })
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const discount = body.discount || 0
    const totalAmount = body.amount - discount

    const invoice = await db.invoice.create({
      data: {
        hospitalId: HOSPITAL_ID,
        patientId: body.patientId,
        consultationId: body.consultationId || undefined,
        invoiceNumber,
        amount: body.amount,
        discount,
        totalAmount,
        paidAmount: body.paidAmount || 0,
        status: body.status || 'impayee',
        paymentMethod: body.paymentMethod || undefined,
        paymentProvider: body.paymentProvider || undefined,
        notes: body.notes || undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        items: body.items
          ? {
              create: body.items.map((item: { label: string; description?: string; quantity: number; unitPrice: number; total: number }) => ({
                label: item.label,
                description: item.description || undefined,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              })),
            }
          : undefined,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
        items: true,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/invoices
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID de la facture requis' }, { status: 400 })
    }

    const existing = await db.invoice.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 })
    }

    const invoice = await db.invoice.update({
      where: { id: body.id },
      data: {
        amount: body.amount !== undefined ? body.amount : existing.amount,
        discount: body.discount !== undefined ? body.discount : existing.discount,
        totalAmount: body.totalAmount !== undefined ? body.totalAmount : existing.totalAmount,
        paidAmount: body.paidAmount !== undefined ? body.paidAmount : existing.paidAmount,
        status: body.status ?? existing.status,
        paymentMethod: body.paymentMethod !== undefined ? body.paymentMethod : existing.paymentMethod,
        paymentProvider: body.paymentProvider !== undefined ? body.paymentProvider : existing.paymentProvider,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
        paidAt: body.paidAt ? new Date(body.paidAt) : existing.paidAt,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
        items: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}