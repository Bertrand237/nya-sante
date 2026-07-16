import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'

// GET /api/medications?q=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''

    const where: Record<string, unknown> = { hospitalId: HOSPITAL_ID, isActive: true }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { genericName: { contains: q } },
        { category: { contains: q } },
      ]
    }

    const medications = await db.medication.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    const data = medications.map((med) => ({
      ...med,
      isLowStock: med.stockQuantity <= med.minStockAlert,
    }))

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/medications
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name || body.unitPrice === undefined || body.salePrice === undefined) {
      return NextResponse.json(
        { error: 'Nom, prix unitaire et prix de vente sont requis' },
        { status: 400 }
      )
    }

    const medication = await db.medication.create({
      data: {
        hospitalId: HOSPITAL_ID,
        name: body.name,
        genericName: body.genericName || undefined,
        category: body.category || undefined,
        form: body.form || undefined,
        dosageForm: body.dosageForm || undefined,
        unit: body.unit || 'unite',
        stockQuantity: body.stockQuantity || 0,
        minStockAlert: body.minStockAlert || 10,
        unitPrice: body.unitPrice,
        salePrice: body.salePrice,
        supplier: body.supplier || undefined,
        batchNumber: body.batchNumber || undefined,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      },
    })

    return NextResponse.json({
      ...medication,
      isLowStock: medication.stockQuantity <= medication.minStockAlert,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/medications
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du médicament requis' }, { status: 400 })
    }

    const existing = await db.medication.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Médicament non trouvé' }, { status: 404 })
    }

    const medication = await db.medication.update({
      where: { id: body.id },
      data: {
        name: body.name ?? existing.name,
        genericName: body.genericName !== undefined ? body.genericName : existing.genericName,
        category: body.category !== undefined ? body.category : existing.category,
        form: body.form !== undefined ? body.form : existing.form,
        dosageForm: body.dosageForm !== undefined ? body.dosageForm : existing.dosageForm,
        unit: body.unit ?? existing.unit,
        stockQuantity: body.stockQuantity !== undefined ? body.stockQuantity : existing.stockQuantity,
        minStockAlert: body.minStockAlert !== undefined ? body.minStockAlert : existing.minStockAlert,
        unitPrice: body.unitPrice !== undefined ? body.unitPrice : existing.unitPrice,
        salePrice: body.salePrice !== undefined ? body.salePrice : existing.salePrice,
        supplier: body.supplier !== undefined ? body.supplier : existing.supplier,
        batchNumber: body.batchNumber !== undefined ? body.batchNumber : existing.batchNumber,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : existing.expiryDate,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      },
    })

    return NextResponse.json({
      ...medication,
      isLowStock: medication.stockQuantity <= medication.minStockAlert,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/medications (soft-delete)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'ID du médicament requis' }, { status: 400 })
    }

    const existing = await db.medication.findFirst({
      where: { id: body.id, hospitalId: HOSPITAL_ID },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Médicament non trouvé' }, { status: 404 })
    }

    await db.medication.update({
      where: { id: body.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}