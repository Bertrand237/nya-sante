'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

import {
  Heart, Calendar, CreditCard, DollarSign, Activity, Clock,
  TrendingUp, Building2, Pill, BarChart3,
  PieChart as PieChartIcon, UserPlus, ClipboardList, Wallet,
} from 'lucide-react'

import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import { fmtCurrency, fmtDate, fmtTime } from '@/lib/helpers'
import { STATUS_APPOINTMENT } from '@/lib/constants'
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeletons'

// Color palette for charts — emerald/teal healthcare theme
const CHART_COLORS = ['#047857', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1']
const STACK_COLORS: Record<string, string> = {
  en_attente: '#eab308',
  confirme: '#0ea5e9',
  en_cours: '#f97316',
  termine: '#047857',
  annule: '#ef4444',
}
const STACK_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  confirme: 'Confirmé',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
}

// Custom tooltip for FCFA amounts
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {fmtCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

// Custom tooltip for count-based charts
function CountTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

// Custom pie/department tooltip
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-semibold">{d.name}</p>
      <p style={{ color: d.payload.fill }}>{d.value} rendez-vous</p>
    </div>
  )
}

// Custom pie label
const renderPieLabel = ({ name, percent }: any) =>
  `${name} (${(percent * 100).toFixed(0)}%)`

export default function DashboardView() {
  const { setCurrentView, user } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [trends, setTrends] = useState<any>(null)
  const [recentPatients, setRecentPatients] = useState<any[]>([])
  const [todayAppts, setTodayAppts] = useState<any[]>([])
  const [weeklyAppointments, setWeeklyAppointments] = useState<any[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [departmentLoad, setDepartmentLoad] = useState<any[]>([])
  const [topMedications, setTopMedications] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard')
        const data = await res.json()
        setStats(data.stats)
        setTrends(data.trends || null)
        setRecentPatients(data.recentPatients || [])
        setTodayAppts(data.todayAppointments || [])
        setWeeklyAppointments(data.weeklyAppointments || [])
        setMonthlyRevenue(data.monthlyRevenue || [])
        setDepartmentLoad(data.departmentLoad || [])
        setTopMedications(data.topMedications || [])
      } catch {
        toast.error('Erreur de chargement du tableau de bord')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // KPI cards with gradient backgrounds, type-based colors, and trend indicators
  const kpiCards = [
    {
      label: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      icon: Heart,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #ffffff 100%)',
      glowColor: 'rgba(4, 120, 87, 0.12)',
      demoTrend: { value: 12, label: 'vs mois dernier' },
      trend: trends?.newPatients,
      trendLabel: 'cette semaine',
    },
    {
      label: "RDV Aujourd'hui",
      value: stats?.todayAppointments ?? 0,
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #ffffff 100%)',
      glowColor: 'rgba(37, 99, 235, 0.12)',
      demoTrend: { value: 8, label: 'vs semaine dernière' },
      trend: trends?.appointments,
      trendLabel: 'vs semaine dernière',
    },
    {
      label: 'Factures en attente',
      value: stats?.pendingInvoices ?? 0,
      icon: CreditCard,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      gradient: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 40%, #ffffff 100%)',
      glowColor: 'rgba(220, 38, 38, 0.12)',
      demoTrend: { value: -5, label: 'vs mois dernier' },
    },
    {
      label: 'Revenus Totaux',
      value: stats?.totalRevenue ?? 0,
      icon: DollarSign,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #ffffff 100%)',
      glowColor: 'rgba(217, 119, 6, 0.12)',
      isCurrency: true,
      demoTrend: { value: 18, label: 'vs mois dernier' },
      trend: trends?.revenue,
      trendLabel: 'cette semaine',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Bonjour, {user?.firstName ?? 'Dr.'} {user?.lastName ?? 'Médecin'}
          </h1>
          <p className="text-emerald-100 text-sm mt-1.5">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — Voici le résumé de votre journée
          </p>
        </div>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute top-2 left-1/3 w-16 h-16 rounded-full bg-white/5" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : kpiCards.map((kpi) => {
              const Icon = kpi.icon
              const trendVal = kpi.trend?.change
              const displayTrend = trendVal ?? kpi.demoTrend?.value ?? 0
              const displayLabel = trendVal !== undefined ? kpi.trendLabel : (kpi.demoTrend?.label ?? '')
              return (
                <Card
                  key={kpi.label}
                  className="p-5 card-hover rounded-xl shadow-sm border-0 overflow-hidden"
                  style={{ background: kpi.gradient }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm text-muted-foreground font-medium">{kpi.label}</span>
                      <div className={`w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center shadow-sm`}>
                        <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                      </div>
                    </div>
                    <div
                      className="pulse-glow inline-block rounded-lg px-1 -mx-1 mb-2"
                      style={{ '--pulse-glow-color': kpi.glowColor } as React.CSSProperties}
                    >
                      <p className="text-2xl font-bold tracking-tight">
                        {kpi.isCurrency ? fmtCurrency(kpi.value) : kpi.value.toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {displayTrend !== 0 && (
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            displayTrend > 0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          }`}
                        >
                          {displayTrend > 0 ? '\u2191' : '\u2193'} {Math.abs(displayTrend).toFixed(0)}%
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {displayLabel}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Actions rapides</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Nouveau Patient',
              icon: UserPlus,
              color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 qa-emerald dark:qa-emerald',
              view: 'patients',
            },
            {
              label: 'Nouveau Rendez-vous',
              icon: Calendar,
              color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 qa-blue dark:qa-blue',
              view: 'appointments',
            },
            {
              label: 'Enregistrer un Paiement',
              icon: Wallet,
              color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200 qa-amber dark:qa-amber',
              view: 'invoices',
            },
            {
              label: 'Nouvelle Consultation',
              icon: ClipboardList,
              color: 'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200 qa-teal dark:qa-teal',
              view: 'consultations',
            },
          ].map((action) => {
            const ActionIcon = action.icon
            return (
              <Card
                key={action.label}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${action.color} rounded-xl shadow-sm p-4 group`}
                onClick={() => setCurrentView(action.view)}
              >
                <CardContent className="p-0 flex flex-col items-center gap-2.5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">{action.label}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Charts Row 1: Weekly Appointments + Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments Stacked Bar Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Rendez-vous de la semaine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : weeklyAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground text-sm">
                <BarChart3 className="w-8 h-8 mb-2 opacity-40" />
                Aucune donnée de rendez-vous
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyAppointments} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<CountTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    formatter={(value: string) => STACK_LABELS[value] || value}
                  />
                  {Object.entries(STACK_COLORS).map(([key, color]) => (
                    <Bar key={key} dataKey={key} stackId="a" fill={color} radius={[0, 0, 0, 0]} maxBarSize={40} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue Area Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Revenus mensuels
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : monthlyRevenue.every((m) => m.revenue === 0) ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground text-sm">
                <DollarSign className="w-8 h-8 mb-2 opacity-40" />
                Aucun revenu enregistré
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#047857" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenus"
                    stroke="#047857"
                    strokeWidth={2.5}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Department Distribution + Top Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Load Donut Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Répartition par département
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : departmentLoad.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground text-sm">
                <PieChartIcon className="w-8 h-8 mb-2 opacity-40" />
                Aucune donnée départementale
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={departmentLoad}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label={renderPieLabel}
                    labelLine={true}
                  >
                    {departmentLoad.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Medications Horizontal Bar */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              Médicaments les plus prescrits
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : topMedications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground text-sm">
                <Pill className="w-8 h-8 mb-2 opacity-40" />
                Aucune ordonnance enregistrée
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={topMedications}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    width={120}
                  />
                  <Tooltip content={<CountTooltip />} />
                  <Bar dataKey="count" name="Prescriptions" fill="#0d9488" radius={[0, 6, 6, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Today's Appointments + Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Rendez-vous du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={3} cols={3} />
            ) : todayAppts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Aucun rendez-vous aujourd&apos;hui
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {todayAppts.map((appt: any) => {
                  const st = STATUS_APPOINTMENT[appt.status] || STATUS_APPOINTMENT.en_attente
                  const borderClass =
                    appt.status === 'confirme' || appt.status === 'termine'
                      ? 'border-l-emerald-500'
                      : appt.status === 'annule'
                        ? 'border-l-red-500'
                        : 'border-l-amber-400'
                  const avatarClass =
                    appt.status === 'confirme' || appt.status === 'termine'
                      ? 'bg-emerald-100 text-emerald-700'
                      : appt.status === 'annule'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                  const initials = (
                    (appt.patient?.firstName || '')[0] + (appt.patient?.lastName || '')[0]
                  ).toUpperCase()
                  return (
                    <div
                      key={appt.id}
                      className={`flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors border-l-4 ${borderClass}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${avatarClass} flex items-center justify-center text-xs font-bold shrink-0`}
                      >
                        {initials || '?'}
                      </div>
                      <div className="text-center min-w-[52px]">
                        <p className="text-xs font-semibold text-muted-foreground">
                          {fmtTime(appt.date).replace(':', 'h')}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {appt.patient?.firstName} {appt.patient?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dr. {appt.staff?.firstName} {appt.staff?.lastName}
                        </p>
                      </div>
                      <Badge variant="outline" className={st.className}>
                        {st.label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Patients récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Dossier</TableHead>
                    <TableHead className="text-xs">Nom</TableHead>
                    <TableHead className="text-xs">Téléphone</TableHead>
                    <TableHead className="text-xs">Créé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPatients.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs font-mono">{p.folderNumber}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {p.firstName} {p.lastName}
                      </TableCell>
                      <TableCell className="text-xs">{p.phone}</TableCell>
                      <TableCell className="text-xs">{fmtDate(p.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {recentPatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-8">
                        Aucun patient enregistré
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}