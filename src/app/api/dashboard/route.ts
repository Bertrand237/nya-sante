import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      totalPatients,
      totalStaff,
      totalDepartments,
      todayAppointments,
      pendingInvoices,
      totalRevenue,
      lowStockMedications,
      recentPatients,
      todayAppointmentsList,
    ] = await Promise.all([
      db.patient.count({ where: { hospitalId: HOSPITAL_ID } }),
      db.staff.count({ where: { hospitalId: HOSPITAL_ID, isActive: true } }),
      db.department.count({ where: { hospitalId: HOSPITAL_ID, isActive: true } }),
      db.appointment.count({
        where: { hospitalId: HOSPITAL_ID, date: { gte: today, lt: tomorrow } },
      }),
      db.invoice.count({
        where: {
          hospitalId: HOSPITAL_ID,
          status: { in: ['impayee', 'partiellement_payee'] },
        },
      }),
      db.payment.aggregate({
        _sum: { amount: true },
        where: { hospitalId: HOSPITAL_ID },
      }),
      db.medication.count({
        where: {
          hospitalId: HOSPITAL_ID,
          isActive: true,
          stockQuantity: { lte: db.medication.fields.minStockAlert },
        },
      }),
      db.patient.findMany({
        where: { hospitalId: HOSPITAL_ID },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.appointment.findMany({
        where: { hospitalId: HOSPITAL_ID, date: { gte: today, lt: tomorrow } },
        include: {
          patient: true,
          staff: { select: { firstName: true, lastName: true, specialty: true } },
        },
        orderBy: { date: 'asc' },
      }),
    ])

    // Weekly appointments count for chart
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const weeklyAppointments = await db.appointment.groupBy({
      by: ['date'],
      where: { hospitalId: HOSPITAL_ID, date: { gte: sevenDaysAgo } },
      _count: { id: true },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({
      stats: {
        totalPatients,
        totalStaff,
        totalDepartments,
        todayAppointments,
        pendingInvoices,
        totalRevenue: totalRevenue._sum.amount || 0,
        lowStockMedications,
      },
      recentPatients,
      todayAppointments: todayAppointmentsList,
      weeklyAppointments: weeklyAppointments.map((a) => ({
        date: a.date.toISOString().split('T')[0],
        count: a._count.id,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}