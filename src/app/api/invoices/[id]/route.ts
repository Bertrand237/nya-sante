import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/invoices/[id] — single invoice with items + payment history
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await db.invoice.findFirst({
      where: { id, hospitalId: HOSPITAL_ID },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            folderNumber: true,
            address: true,
            city: true,
          },
        },
        items: { orderBy: { createdAt: 'asc' } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/invoices/[id]/pay — record a payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const { amount, method, reference, provider, phone: paymentPhone, userId } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Le montant est requis et doit être positif' }, { status: 400 })
    }

    const validMethods = ['espece', 'mobile_money', 'carte', 'virement']
    if (!method || !validMethods.includes(method)) {
      return NextResponse.json(
        { error: 'Méthode de paiement invalide' },
        { status: 400 }
      )
    }

    const invoice = await db.invoice.findFirst({
      where: { id, hospitalId: HOSPITAL_ID },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 })
    }

    if (invoice.status === 'payee') {
      return NextResponse.json({ error: 'Cette facture est déjà payée intégralement' }, { status: 400 })
    }

    const remaining = invoice.totalAmount - invoice.paidAmount
    if (amount > remaining + 0.01) {
      return NextResponse.json(
        { error: `Le montant dépasse le solde restant (${new Intl.NumberFormat('fr-FR').format(Math.ceil(remaining))} FCFA)` },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        hospitalId: HOSPITAL_ID,
        invoiceId: id,
        amount,
        method,
        provider: provider || undefined,
        phone: paymentPhone || undefined,
        reference: reference || undefined,
        status: 'reussi',
        receivedBy: userId || undefined,
      },
    })

    // Update invoice
    const newPaidAmount = invoice.paidAmount + amount
    let newStatus = invoice.status

    if (newPaidAmount >= invoice.totalAmount - 0.01) {
      newStatus = 'payee'
    } else if (newPaidAmount > 0) {
      newStatus = 'partiellement_payee'
    }

    const updatedInvoice = await db.invoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
        paymentMethod: method,
        paymentProvider: provider || method,
        paidAt: newStatus === 'payee' ? new Date() : invoice.paidAt,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            folderNumber: true,
            address: true,
            city: true,
          },
        },
        items: { orderBy: { createdAt: 'asc' } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        hospitalId: HOSPITAL_ID,
        staffId: userId || undefined,
        action: 'PAYMENT',
        entity: 'Payment',
        entityId: payment.id,
        details: `Paiement de ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA sur facture ${invoice.invoiceNumber} (${method}${provider ? ' - ' + provider : ''})`,
      },
    })

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}