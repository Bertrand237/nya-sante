import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// French day names for chart labels
const FRENCH_DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const FRENCH_MONTHS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.']

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

export async function GET() {
  try {
    const HOSPITAL_ID = process.env.HOSPITAL_ID || 'hosp_demo_001'
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // ── Core stats ──
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

    // ── Trend data: compare this week vs last week ──
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const fourteenDaysAgo = new Date(today)
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13)

    const [thisWeekAppts, lastWeekAppts, thisWeekRevenue, lastWeekRevenue, thisWeekNewPatients, lastWeekNewPatients] =
      await Promise.all([
        db.appointment.count({
          where: { hospitalId: HOSPITAL_ID, date: { gte: sevenDaysAgo, lt: tomorrow } },
        }),
        db.appointment.count({
          where: { hospitalId: HOSPITAL_ID, date: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
        }),
        db.payment.aggregate({
          _sum: { amount: true },
          where: { hospitalId: HOSPITAL_ID, createdAt: { gte: sevenDaysAgo, lt: tomorrow } },
        }),
        db.payment.aggregate({
          _sum: { amount: true },
          where: { hospitalId: HOSPITAL_ID, createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
        }),
        db.patient.count({
          where: { hospitalId: HOSPITAL_ID, createdAt: { gte: sevenDaysAgo, lt: tomorrow } },
        }),
        db.patient.count({
          where: { hospitalId: HOSPITAL_ID, createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
        }),
      ])

    const trends = {
      appointments: {
        current: thisWeekAppts,
        previous: lastWeekAppts,
        change: lastWeekAppts > 0 ? ((thisWeekAppts - lastWeekAppts) / lastWeekAppts) * 100 : 0,
      },
      revenue: {
        current: thisWeekRevenue._sum.amount || 0,
        previous: lastWeekRevenue._sum.amount || 0,
        change:
          (lastWeekRevenue._sum.amount || 0) > 0
            ? (((thisWeekRevenue._sum.amount || 0) - (lastWeekRevenue._sum.amount || 0)) /
                (lastWeekRevenue._sum.amount || 0)) *
              100
            : 0,
      },
      newPatients: {
        current: thisWeekNewPatients,
        previous: lastWeekNewPatients,
        change: lastWeekNewPatients > 0 ? ((thisWeekNewPatients - lastWeekNewPatients) / lastWeekNewPatients) * 100 : 0,
      },
    }

    // ── Weekly appointments by status (last 7 days) ──
    const weekApptsRaw = await db.appointment.findMany({
      where: { hospitalId: HOSPITAL_ID, date: { gte: sevenDaysAgo } },
      select: { date: true, status: true },
    })

    // Build day map
    const weeklyByDay: Record<
      string,
      { date: string; label: string; en_attente: number; confirme: number; termine: number; annule: number; en_cours: number }
    > = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - 6 + i)
      const key = toDateStr(d)
      weeklyByDay[key] = {
        date: key,
        label: FRENCH_DAYS[d.getDay()],
        en_attente: 0,
        confirme: 0,
        termine: 0,
        annule: 0,
        en_cours: 0,
      }
    }
    for (const a of weekApptsRaw) {
      const dayKey = toDateStr(new Date(a.date))
      if (weeklyByDay[dayKey]) {
        const status = a.status as keyof typeof weeklyByDay[string]
        if (status in weeklyByDay[dayKey]) {
          weeklyByDay[dayKey][status] = (weeklyByDay[dayKey][status] || 0) + 1
        }
      }
    }
    const weeklyAppointments = Object.values(weeklyByDay)

    // ── Monthly revenue (last 6 months) ──
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)
    const paymentsRaw = await db.payment.findMany({
      where: { hospitalId: HOSPITAL_ID, createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, createdAt: true },
    })

    const monthlyRevenue: { month: string; label: string; revenue: number }[] = []
    for (let i = 0; i < 6; i++) {
      const mDate = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1)
      const monthKey = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue.push({
        month: monthKey,
        label: FRENCH_MONTHS[mDate.getMonth()],
        revenue: 0,
      })
    }
    for (const p of paymentsRaw) {
      const pDate = new Date(p.createdAt)
      const mKey = `${pDate.getFullYear()}-${String(pDate.getMonth() + 1).padStart(2, '0')}`
      const entry = monthlyRevenue.find((m) => m.month === mKey)
      if (entry) {
        entry.revenue += p.amount
      }
    }

    // ── Department load (via appointments) ──
    const departments = await db.department.findMany({
      where: { hospitalId: HOSPITAL_ID, isActive: true },
      select: { id: true, name: true },
    })
    const deptAppts = await db.appointment.groupBy({
      by: ['departmentId'],
      where: { hospitalId: HOSPITAL_ID, departmentId: { not: null } },
      _count: { id: true },
    })
    const deptMap: Record<string, number> = {}
    for (const d of deptAppts) {
      if (d.departmentId) deptMap[d.departmentId] = d._count.id
    }
    const departmentLoad = departments
      .map((d) => ({
        name: d.name,
        count: deptMap[d.id] || 0,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count)

    // ── Top medications by usage ──
    const prescriptionItems = await db.prescriptionItem.groupBy({
      by: ['medicationName'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    })
    const topMedications = prescriptionItems.map((item) => ({
      name: item.medicationName,
      count: item._count.id,
    }))

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
      trends,
      recentPatients,
      todayAppointments: todayAppointmentsList,
      weeklyAppointments,
      monthlyRevenue,
      departmentLoad,
      topMedications,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}