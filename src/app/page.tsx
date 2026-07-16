'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Toaster } from '@/components/ui/sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LayoutDashboard,
  Heart,
  Building2,
  Users,
  Calendar,
  Stethoscope,
  Receipt,
  Pill,
  Settings,
  LogOut,
  Menu,
  Loader2,
  Search,
  Plus,
  ChevronRight,
  Phone,
  Lock,
  UserCircle,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

const fmtCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'

const fmtDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const fmtDateTime = (date: string | Date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const fmtTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

const STATUS_APPOINTMENT: Record<string, { label: string; className: string }> = {
  en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  confirme: { label: 'Confirmé', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  en_cours: { label: 'En cours', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  termine: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  annule: { label: 'Annulé', className: 'bg-red-100 text-red-800 border-red-300' },
}

const STATUS_INVOICE: Record<string, { label: string; className: string }> = {
  impayee: { label: 'Impayée', className: 'bg-red-100 text-red-800 border-red-300' },
  partiellement_payee: { label: 'Partielle', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  payee: { label: 'Payée', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const DEPT_TYPES = ['clinique', 'chirurgical', 'laboratoire', 'imagerie', 'pharmacie', 'administration', 'urgence', 'maternite', 'pediatrie', 'autre']

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'patients', label: 'Patients', icon: Heart },
  { key: 'departments', label: 'Départements', icon: Building2 },
  { key: 'staff', label: 'Personnel', icon: Users },
  { key: 'appointments', label: 'Rendez-vous', icon: Calendar },
  { key: 'consultations', label: 'Consultations', icon: Stethoscope },
  { key: 'invoices', label: 'Facturation', icon: Receipt },
  { key: 'medications', label: 'Pharmacie', icon: Pill },
  { key: 'settings', label: 'Paramètres', icon: Settings },
]

/* ═══════════════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════════════ */

function LoginScreen() {
  const [phone, setPhone] = useState('655443322')
  const [pin, setPin] = useState('123456')
  const [loading, setLoading] = useState(false)
  const { setUser, setCurrentView } = useAppStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Identifiants incorrects')
        return
      }
      const user = await res.json()
      setUser(user)
      setCurrentView('dashboard')
      toast.success(`Bienvenue, Dr. ${user.lastName} !`)
    } catch {
      toast.error('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen nya-gradient nya-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 py-8">
        <CardHeader className="items-center gap-4 pb-2">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center overflow-hidden border-2 border-emerald-100">
            <img src="/nya-logo.png" alt="NYA Santé" className="w-16 h-16 object-contain" />
          </div>
          <div className="text-center">
            <CardTitle className="text-xl font-bold text-emerald-900">
              Clinique Centrale NYA
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Système de Gestion Hospitalière
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                <Phone className="inline w-4 h-4 mr-1 -mt-0.5" />
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="6XXXXXXXX"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-sm font-medium">
                <Lock className="inline w-4 h-4 mr-1 -mt-0.5" />
                Code PIN
              </Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Se connecter
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-6">
            Compte démo : 655443322 / 123456 (Dr. Amina Nya)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════ */

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { currentView, setCurrentView, user, setUser } = useAppStore()

  const handleNav = (key: string) => {
    setCurrentView(key)
    onClose?.()
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('dashboard')
    toast.success('Déconnexion réussie')
  }

  return (
    <div className="flex flex-col h-full bg-emerald-900 text-white">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-emerald-800">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
          <img src="/nya-logo.png" alt="NYA" className="w-8 h-8 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight truncate">Clinique Centrale NYA</p>
          <p className="text-emerald-300 text-xs">Système de Gestion</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3 px-3">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.key
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-700/60 text-white shadow-sm'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="truncate">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User info */}
      <div className="border-t border-emerald-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
            <UserCircle className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-emerald-400 truncate">
              {user?.role?.label || user?.role?.name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-emerald-300 hover:text-white hover:bg-emerald-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════ */

function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </Card>
  )
}

/* ═══════════════════════════════════════════════════
   DASHBOARD VIEW
   ═══════════════════════════════════════════════════ */

function DashboardView() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [recentPatients, setRecentPatients] = useState<any[]>([])
  const [todayAppts, setTodayAppts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard')
        const data = await res.json()
        setStats(data.stats)
        setRecentPatients(data.recentPatients || [])
        setTodayAppts(data.todayAppointments || [])
      } catch {
        toast.error('Erreur de chargement du tableau de bord')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const kpiCards = [
    {
      label: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      icon: Heart,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      label: "RDV Aujourd'hui",
      value: stats?.todayAppointments ?? 0,
      icon: Calendar,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      label: 'Personnel Actif',
      value: stats?.totalStaff ?? 0,
      icon: Users,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      label: 'Revenus Totaux',
      value: stats?.totalRevenue ?? 0,
      icon: DollarSign,
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      isCurrency: true,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : kpiCards.map((kpi) => {
              const Icon = kpi.icon
              return (
                <Card key={kpi.label} className="p-5 card-hover">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground font-medium">{kpi.label}</span>
                      <div className={`w-9 h-9 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-4.5 h-4.5 ${kpi.iconColor}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      {kpi.isCurrency ? fmtCurrency(kpi.value) : kpi.value.toLocaleString('fr-FR')}
                    </p>
                    {kpi.isCurrency && (
                      <p className="text-xs text-muted-foreground mt-1">Chiffre d&apos;affaires cumulé</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
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
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {todayAppts.map((appt: any) => {
                  const st = STATUS_APPOINTMENT[appt.status] || STATUS_APPOINTMENT.en_attente
                  return (
                    <div
                      key={appt.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="text-center min-w-[48px]">
                        <p className="text-xs font-semibold text-emerald-700">{fmtTime(appt.date)}</p>
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
        <Card>
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

/* ═══════════════════════════════════════════════════
   PATIENTS VIEW
   ═══════════════════════════════════════════════════ */

function PatientsView() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', dateOfBirth: '',
    gender: 'M', bloodType: '', address: '', city: '', allergies: '',
    emergencyContact: '', emergencyPhone: '', insuranceProvider: '', insuranceNumber: '',
  })

  const loadPatients = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(search)}`)
      const data = await res.json()
      setPatients(data.data || [])
    } catch {
      toast.error('Erreur de chargement des patients')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { loadPatients() }, [loadPatients])

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.phone) {
      toast.error('Prénom, nom et téléphone sont requis')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la création')
        return
      }
      toast.success('Patient créé avec succès')
      setDialogOpen(false)
      setForm({
        firstName: '', lastName: '', phone: '', email: '', dateOfBirth: '',
        gender: 'M', bloodType: '', address: '', city: '', allergies: '',
        emergencyContact: '', emergencyPhone: '', insuranceProvider: '', insuranceNumber: '',
      })
      loadPatients()
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {patients.length} patient{patients.length > 1 ? 's' : ''} enregistré{patients.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Dossier</TableHead>
                  <TableHead className="text-xs">Nom</TableHead>
                  <TableHead className="text-xs">Prénom</TableHead>
                  <TableHead className="text-xs">Téléphone</TableHead>
                  <TableHead className="text-xs">Sexe</TableHead>
                  <TableHead className="text-xs">Groupe Sanguin</TableHead>
                  <TableHead className="text-xs">Date Création</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs font-mono font-medium">{p.folderNumber}</TableCell>
                    <TableCell className="text-xs font-medium">{p.lastName}</TableCell>
                    <TableCell className="text-xs">{p.firstName}</TableCell>
                    <TableCell className="text-xs">{p.phone}</TableCell>
                    <TableCell className="text-xs">{p.gender === 'M' ? 'Masculin' : 'Féminin'}</TableCell>
                    <TableCell className="text-xs">{p.bloodType || '—'}</TableCell>
                    <TableCell className="text-xs">{fmtDate(p.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucun patient trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Patient Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau Patient</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Prénom *</Label>
              <Input value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nom *</Label>
              <Input value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Téléphone *</Label>
              <Input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de naissance</Label>
              <Input type="date" value={form.dateOfBirth} onChange={(e) => updateForm('dateOfBirth', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sexe</Label>
              <Select value={form.gender} onValueChange={(v) => updateForm('gender', v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Groupe sanguin</Label>
              <Select value={form.bloodType} onValueChange={(v) => updateForm('bloodType', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((bt) => (
                    <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ville</Label>
              <Input value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Adresse</Label>
              <Input value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Allergies</Label>
              <Input value={form.allergies} onChange={(e) => updateForm('allergies', e.target.value)} placeholder="Séparer par des virgules" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Contact d&apos;urgence</Label>
              <Input value={form.emergencyContact} onChange={(e) => updateForm('emergencyContact', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tél. d&apos;urgence</Label>
              <Input value={form.emergencyPhone} onChange={(e) => updateForm('emergencyPhone', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Assurance</Label>
              <Input value={form.insuranceProvider} onChange={(e) => updateForm('insuranceProvider', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">N° Assurance</Label>
              <Input value={form.insuranceNumber} onChange={(e) => updateForm('insuranceNumber', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   DEPARTMENTS VIEW
   ═══════════════════════════════════════════════════ */

function DepartmentsView() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'clinique', description: '', color: '#047857' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/departments')
      setDepartments(await res.json())
    } catch {
      toast.error('Erreur de chargement des départements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.name) { toast.error('Nom requis'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return }
      toast.success('Département créé')
      setDialogOpen(false)
      setForm({ name: '', type: 'clinique', description: '', color: '#047857' })
      load()
    } catch { toast.error('Erreur serveur') } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Départements</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {departments.length} département{departments.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Département
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept: any) => (
            <Card key={dept.id} className="card-hover overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: dept.color || '#047857' }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{dept.name}</h3>
                  <Badge variant="outline" className="text-xs capitalize">
                    {dept.type}
                  </Badge>
                </div>
                {dept.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{dept.description}</p>
                )}
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {dept._count?.staff || 0} membre{(dept._count?.staff || 0) > 1 ? 's' : ''}
                  </span>
                  {dept.head && (
                    <span>
                      Chef : Dr. {dept.head.firstName} {dept.head.lastName}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {departments.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              Aucun département enregistré
            </div>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nouveau Département</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nom *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPT_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Couleur</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="flex-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   STAFF VIEW
   ═══════════════════════════════════════════════════ */

function StaffView() {
  const [staffList, setStaffList] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', gender: 'M',
    departmentId: '', roleId: '', specialty: '', licenseNumber: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, dRes] = await Promise.all([fetch('/api/staff'), fetch('/api/departments')])
      const sData = await sRes.json()
      const dData = await dRes.json()
      setStaffList(sData)
      setDepartments(dData)
      // Extract unique roles from staff
      const roleMap = new Map<string, any>()
      sData.forEach((s: any) => {
        if (s.role && !roleMap.has(s.role.id)) roleMap.set(s.role.id, s.role)
      })
      setRoles(Array.from(roleMap.values()))
    } catch {
      toast.error('Erreur de chargement du personnel')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.roleId) {
      toast.error('Prénom, nom, téléphone et rôle sont requis')
      return
    }
    setSaving(true)
    try {
      const body: Record<string, string> = { ...form }
      if (!body.departmentId) delete body.departmentId
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return }
      toast.success('Membre du personnel ajouté')
      setDialogOpen(false)
      setForm({ firstName: '', lastName: '', phone: '', email: '', gender: 'M', departmentId: '', roleId: '', specialty: '', licenseNumber: '' })
      load()
    } catch { toast.error('Erreur serveur') } finally { setSaving(false) }
  }

  const updateForm = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Personnel</h1>
          <p className="text-muted-foreground text-sm mt-1">{staffList.length} membre{staffList.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Membre
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nom</TableHead>
                  <TableHead className="text-xs">Prénom</TableHead>
                  <TableHead className="text-xs">Téléphone</TableHead>
                  <TableHead className="text-xs">Rôle</TableHead>
                  <TableHead className="text-xs">Département</TableHead>
                  <TableHead className="text-xs">Spécialité</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs font-medium">{s.lastName}</TableCell>
                    <TableCell className="text-xs">{s.firstName}</TableCell>
                    <TableCell className="text-xs">{s.phone}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="text-xs">{s.role?.label || s.role?.name}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{s.department?.name || '—'}</TableCell>
                    <TableCell className="text-xs">{s.specialty || '—'}</TableCell>
                    <TableCell className="text-xs">
                      <Badge className={s.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'} variant="outline">
                        {s.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {staffList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucun personnel enregistré
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Nouveau Membre du Personnel</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Prénom *</Label>
              <Input value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nom *</Label>
              <Input value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Téléphone *</Label>
              <Input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sexe</Label>
              <Select value={form.gender} onValueChange={(v) => updateForm('gender', v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Département</Label>
              <Select value={form.departmentId} onValueChange={(v) => updateForm('departmentId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rôle *</Label>
              <Select value={form.roleId} onValueChange={(v) => updateForm('roleId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {roles.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>{r.label || r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Spécialité</Label>
              <Input value={form.specialty} onChange={(e) => updateForm('specialty', e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">N° Licence</Label>
              <Input value={form.licenseNumber} onChange={(e) => updateForm('licenseNumber', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   APPOINTMENTS VIEW
   ═══════════════════════════════════════════════════ */

function AppointmentsView() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    patientId: '', staffId: '', date: '', type: 'consultation', reason: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [aRes, pRes, sRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients?limit=100'),
        fetch('/api/staff'),
      ])
      setAppointments(await aRes.json())
      const pData = await pRes.json()
      setPatients(pData.data || [])
      setStaffList(await sRes.json())
    } catch {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.patientId || !form.staffId || !form.date) {
      toast.error('Patient, médecin et date sont requis')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return }
      toast.success('Rendez-vous créé')
      setDialogOpen(false)
      setForm({ patientId: '', staffId: '', date: '', type: 'consultation', reason: '' })
      load()
    } catch { toast.error('Erreur serveur') } finally { setSaving(false) }
  }

  const updateForm = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast.success('Rendez-vous annulé')
        load()
      }
    } catch { toast.error('Erreur') }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rendez-vous</h1>
          <p className="text-muted-foreground text-sm mt-1">{appointments.length} rendez-vous</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rendez-vous
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Patient</TableHead>
                  <TableHead className="text-xs">Médecin</TableHead>
                  <TableHead className="text-xs">Département</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs">Motif</TableHead>
                  <TableHead className="text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((a: any) => {
                  const st = STATUS_APPOINTMENT[a.status] || STATUS_APPOINTMENT.en_attente
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs">{fmtDateTime(a.date)}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {a.patient?.firstName} {a.patient?.lastName}
                      </TableCell>
                      <TableCell className="text-xs">
                        Dr. {a.staff?.firstName} {a.staff?.lastName}
                      </TableCell>
                      <TableCell className="text-xs">—</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={st.className}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{a.reason || '—'}</TableCell>
                      <TableCell className="text-xs">
                        {a.status === 'en_attente' && (
                          <Button variant="ghost" size="sm" onClick={() => handleCancel(a.id)} className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucun rendez-vous
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Nouveau Rendez-vous</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Patient *</Label>
              <Select value={form.patientId} onValueChange={(v) => updateForm('patientId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner un patient" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {patients.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.folderNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Médecin *</Label>
              <Select value={form.staffId} onValueChange={(v) => updateForm('staffId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner un médecin" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {staffList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      Dr. {s.firstName} {s.lastName} {s.specialty ? `— ${s.specialty}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date et heure *</Label>
              <Input type="datetime-local" value={form.date} onChange={(e) => updateForm('date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={(v) => updateForm('type', v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="suivi">Suivi</SelectItem>
                  <SelectItem value="urgence">Urgence</SelectItem>
                  <SelectItem value="controle">Contrôle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Motif</Label>
              <Input value={form.reason} onChange={(e) => updateForm('reason', e.target.value)} placeholder="Motif de la visite" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CONSULTATIONS VIEW
   ═══════════════════════════════════════════════════ */

function ConsultationsView() {
  const [patients, setPatients] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    patientId: '', staffId: '', chiefComplaint: '', diagnosis: '', plan: '',
  })

  // Load patients and staff on mount
  useEffect(() => {
    const loadBase = async () => {
      try {
        const [pRes, sRes] = await Promise.all([fetch('/api/patients?limit=100'), fetch('/api/staff')])
        const pData = await pRes.json()
        setPatients(pData.data || [])
        setStaffList(await sRes.json())
      } catch { toast.error('Erreur de chargement') }
    }
    loadBase()
  }, [])

  // Load consultations when patient selected
  useEffect(() => {
    if (!selectedPatient) {
      setConsultations([])
      setLoaded(false)
      return
    }
    const loadConsultations = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/consultations?patientId=${selectedPatient}`)
        if (res.ok) setConsultations(await res.json())
        else setConsultations([])
      } catch { setConsultations([]) } finally { setLoading(false); setLoaded(true) }
    }
    loadConsultations()
  }, [selectedPatient])

  const handleSave = async () => {
    if (!form.patientId || !form.chiefComplaint) {
      toast.error('Patient et motif de consultation sont requis')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return }
      toast.success('Consultation enregistrée')
      setDialogOpen(false)
      setForm({ patientId: '', staffId: '', chiefComplaint: '', diagnosis: '', plan: '' })
      if (form.patientId) {
        setSelectedPatient(form.patientId)
      }
    } catch { toast.error('Erreur serveur') } finally { setSaving(false) }
  }

  const updateForm = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Consultations</h1>
          <p className="text-muted-foreground text-sm mt-1">Historique des consultations</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Consultation
        </Button>
      </div>

      {/* Patient selector */}
      <div className="max-w-md">
        <Label className="text-xs mb-1.5 block">Sélectionner un patient</Label>
        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un patient pour voir ses consultations" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {patients.map((p: any) => (
              <SelectItem key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.folderNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Consultations table */}
      <Card>
        <CardContent className="p-0">
          {!selectedPatient ? (
            <div className="text-center py-16 text-muted-foreground">
              <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Sélectionnez un patient pour voir ses consultations</p>
            </div>
          ) : loading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Médecin</TableHead>
                  <TableHead className="text-xs">Motif Principal</TableHead>
                  <TableHead className="text-xs">Diagnostic</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-xs">{fmtDateTime(c.createdAt)}</TableCell>
                    <TableCell className="text-xs">
                      Dr. {c.staff?.firstName} {c.staff?.lastName}
                    </TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{c.chiefComplaint || '—'}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{c.diagnosis || '—'}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className={
                        c.status === 'termine' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        c.status === 'en_cours' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                        'bg-blue-100 text-blue-800 border-blue-300'
                      }>
                        {c.status === 'termine' ? 'Terminée' : c.status === 'en_cours' ? 'En cours' : 'Planifiée'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {loaded && consultations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucune consultation pour ce patient
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Nouvelle Consultation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Patient *</Label>
              <Select value={form.patientId} onValueChange={(v) => updateForm('patientId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {patients.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Médecin</Label>
              <Select value={form.staffId} onValueChange={(v) => updateForm('staffId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {staffList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      Dr. {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Motif de consultation *</Label>
              <Input value={form.chiefComplaint} onChange={(e) => updateForm('chiefComplaint', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Diagnostic</Label>
              <Input value={form.diagnosis} onChange={(e) => updateForm('diagnosis', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Plan de traitement</Label>
              <Input value={form.plan} onChange={(e) => updateForm('plan', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   INVOICES VIEW
   ═══════════════════════════════════════════════════ */

function InvoicesView() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/invoices')
        setInvoices(await res.json())
      } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Facturation</h1>
        <p className="text-muted-foreground text-sm mt-1">{invoices.length} facture{invoices.length > 1 ? 's' : ''}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">N° Facture</TableHead>
                  <TableHead className="text-xs">Patient</TableHead>
                  <TableHead className="text-xs">Montant</TableHead>
                  <TableHead className="text-xs">Payé</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs">Méthode</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv: any) => {
                  const st = STATUS_INVOICE[inv.status] || STATUS_INVOICE.impayee
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="text-xs font-mono font-medium">{inv.invoiceNumber}</TableCell>
                      <TableCell className="text-xs">
                        {inv.patient?.firstName} {inv.patient?.lastName}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{fmtCurrency(inv.totalAmount)}</TableCell>
                      <TableCell className="text-xs">{fmtCurrency(inv.paidAmount)}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={st.className}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{inv.paymentMethod || '—'}</TableCell>
                      <TableCell className="text-xs">{fmtDate(inv.createdAt)}</TableCell>
                    </TableRow>
                  )
                })}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucune facture
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MEDICATIONS / PHARMACY VIEW
   ═══════════════════════════════════════════════════ */

function MedicationsView() {
  const [medications, setMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/medications?q=${encodeURIComponent(search)}`)
      setMedications(await res.json())
    } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Pharmacie</h1>
        <p className="text-muted-foreground text-sm mt-1">{medications.length} médicament{medications.length > 1 ? 's' : ''}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un médicament..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Médicament</TableHead>
                  <TableHead className="text-xs">Stock</TableHead>
                  <TableHead className="text-xs">Prix Vente</TableHead>
                  <TableHead className="text-xs">Fournisseur</TableHead>
                  <TableHead className="text-xs">Péremption</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med: any) => (
                  <TableRow key={med.id} className={med.isLowStock ? 'bg-red-50/50' : ''}>
                    <TableCell className="text-xs">
                      <div className="font-medium">{med.name}</div>
                      {med.genericName && <div className="text-muted-foreground">{med.genericName}</div>}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className={med.isLowStock ? 'font-bold text-red-700' : ''}>
                        {med.stockQuantity}
                      </span>
                      <span className="text-muted-foreground ml-1">({med.minStockAlert} min)</span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{fmtCurrency(med.salePrice)}</TableCell>
                    <TableCell className="text-xs">{med.supplier || '—'}</TableCell>
                    <TableCell className="text-xs">{med.expiryDate ? fmtDate(med.expiryDate) : '—'}</TableCell>
                    <TableCell className="text-xs">
                      {med.isLowStock ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Stock bas
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          En stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {medications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Pill className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucun médicament trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SETTINGS VIEW
   ═══════════════════════════════════════════════════ */

function SettingsView() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const { user } = useAppStore()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings')
        setSettings(await res.json())
      } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
    }
    load()
  }, [])

  const settingLabels: Record<string, string> = {
    hospital_name: 'Nom de l\'hôpital',
    hospital_address: 'Adresse',
    hospital_phone: 'Téléphone',
    hospital_email: 'Email',
    hospital_city: 'Ville',
    hospital_country: 'Pays',
    currency: 'Devise',
    language: 'Langue',
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Configuration de l&apos;établissement</p>
      </div>

      {/* Hospital Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations de l&apos;établissement</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nom</Label>
                <p className="text-sm font-medium">{user?.hospital?.name || settings.hospital_name || 'Clinique Centrale NYA'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Ville</Label>
                <p className="text-sm font-medium">{user?.hospital?.city || settings.hospital_city || 'Douala'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Téléphone</Label>
                <p className="text-sm font-medium">{settings.hospital_phone || '—'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium">{settings.hospital_email || '—'}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Adresse</Label>
                <p className="text-sm font-medium">{settings.hospital_address || '—'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuration système</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : Object.keys(settings).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{settingLabels[key] || key}</span>
                  <span className="text-sm font-medium">{value || '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun paramètre configuré
            </p>
          )}
        </CardContent>
      </Card>

      {/* Connected User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil connecté</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nom complet</Label>
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Téléphone</Label>
              <p className="text-sm font-medium">{user?.phone}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Rôle</Label>
              <p className="text-sm font-medium">{user?.role?.label || user?.role?.name || '—'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Spécialité</Label>
              <p className="text-sm font-medium">{user?.specialty || '—'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Département</Label>
              <p className="text-sm font-medium">{user?.department?.name || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */

export default function HomePage() {
  const { isAuthenticated, currentView } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginScreen />
  }

  const viewTitle = NAV_ITEMS.find((n) => n.key === currentView)?.label || 'Tableau de bord'

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />
      case 'patients': return <PatientsView />
      case 'departments': return <DepartmentsView />
      case 'staff': return <StaffView />
      case 'appointments': return <AppointmentsView />
      case 'consultations': return <ConsultationsView />
      case 'invoices': return <InvoicesView />
      case 'medications': return <MedicationsView />
      case 'settings': return <SettingsView />
      default: return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:shrink-0 lg:flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">{viewTitle}</h2>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6">
          {renderView()}
        </div>
      </main>

      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}