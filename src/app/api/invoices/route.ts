import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/invoices?status=...&patientId=...&q=...&dateFrom=...&dateTo=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const patientId = searchParams.get('patientId')
    const q = searchParams.get('q') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID }

    if (status) {
      where.status = status
    }

    if (patientId) {
      where.patientId = patientId
    }

    if (q) {
      where.OR = [
        { invoiceNumber: { contains: q } },
        { patient: { firstName: { contains: q } } },
        { patient: { lastName: { contains: q } } },
        { patient: { folderNumber: { contains: q } } },
      ]
    }

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, unknown> = {}
      if (dateFrom) dateFilter.gte = new Date(dateFrom)
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        dateFilter.lte = end
      }
      where.createdAt = dateFilter
    }

    const [invoices, summary] = await Promise.all([
      db.invoice.findMany({
        where,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, phone: true, folderNumber: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.invoice.aggregate({
        where: { hospitalId: HOSPITAL_ID, status: { in: ['impayee', 'partiellement_payee', 'payee'] } },
        _sum: { totalAmount: true, paidAmount: true },
        _count: true,
      }),
    ])

    const totalInvoiced = summary._sum.totalAmount || 0
    const totalPaid = summary._sum.paidAmount || 0

    return NextResponse.json({
      data: invoices,
      summary: {
        totalInvoiced,
        totalPaid,
        totalRemaining: totalInvoiced - totalPaid,
        count: summary._count,
      },
    })
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