'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { ThemeProvider, useTheme } from 'next-themes'
import { useAppStore } from '@/lib/store'
import { getAllowedViews, getWelcomeMessage } from '@/lib/permissions'
import { Toaster } from '@/components/ui/sonner'
import { PWAInstallPrompt, PWAStatusBadge } from '@/components/PWAInstallPrompt'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
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
  ChevronRight,
  Phone,
  Lock,
  UserCircle,
  FileHeart,
  FileText,
  Microscope,
  Shield,
  Cloud,
  Info,
  Send,
  Sun,
  Moon,
} from 'lucide-react'

const DashboardView = dynamic(() => import('@/components/views/DashboardView'), { loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full" /></div> })
const PatientsView = dynamic(() => import('@/components/views/PatientsView'), { ssr: false })
const DmeView = dynamic(() => import('@/components/views/DmeView'), { ssr: false })
const DepartmentsView = dynamic(() => import('@/components/views/DepartmentsView'), { ssr: false })
const StaffView = dynamic(() => import('@/components/views/StaffView'), { ssr: false })
const AppointmentsView = dynamic(() => import('@/components/views/AppointmentsView'), { ssr: false })
const ConsultationsView = dynamic(() => import('@/components/views/ConsultationsView'), { ssr: false })
const PrescriptionsView = dynamic(() => import('@/components/views/PrescriptionsView'), { ssr: false })
const InvoicesView = dynamic(() => import('@/components/views/InvoicesView'), { ssr: false })
const MedicationsView = dynamic(() => import('@/components/views/MedicationsView'), { ssr: false })
const LaboView = dynamic(() => import('@/components/views/LaboView'), { ssr: false })
const AuditView = dynamic(() => import('@/components/views/AuditView'), { ssr: false })
const SettingsView = dynamic(() => import('@/components/views/SettingsView'), { ssr: false })
const PlatformsView = dynamic(() => import('@/components/views/PlatformsView'), { ssr: false })
const TransfersView = dynamic(() => import('@/components/views/TransfersView'), { ssr: false })
const AdminPanelView = dynamic(() => import('@/components/views/AdminPanelView'), { ssr: false })

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'patients', label: 'Patients', icon: Heart },
  { key: 'dme', label: 'DME', icon: FileHeart },
  { key: 'departments', label: 'Départements', icon: Building2 },
  { key: 'staff', label: 'Personnel', icon: Users },
  { key: 'appointments', label: 'Rendez-vous', icon: Calendar },
  { key: 'consultations', label: 'Consultations', icon: Stethoscope },
  { key: 'prescriptions', label: 'Ordonnances', icon: FileText },
  { key: 'invoices', label: 'Facturation', icon: Receipt },
  { key: 'medications', label: 'Pharmacie', icon: Pill },
  { key: 'labs', label: 'Laboratoire', icon: Microscope },
  { key: 'audit', label: "Journal d'audit", icon: Shield },
  { key: 'transfers', label: 'Transferts', icon: Send },
  { key: 'admin', label: 'SaaS Admin', icon: Shield },
  { key: 'settings', label: 'Paramètres', icon: Settings },
  { key: 'platforms', label: 'Plateformes', icon: Cloud },
]

/* ═══════════════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════════════ */

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-9 w-9"
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

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
      toast.success(getWelcomeMessage(user.firstName, user.lastName, user.role?.name))
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
                placeholder="•••••••"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Se connecter
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-6">
            Compte démo : 655443322 / 123456 (Dr. Amina Nya)
          </p>
          <div className="flex items-start gap-2 mt-3 px-1">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Votre administrateur doit créer votre compte avant de vous connecter.
            </p>
          </div>
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
  const [badges, setBadges] = useState({ appointments: 0, invoices: 0, labs: 0, transfers: 0 })
  const mountedRef = useRef(true)

  // Derive allowed navigation items from role
  const allowedViews = getAllowedViews(user?.role?.name)
  const filteredNavItems = NAV_ITEMS.filter((item) => allowedViews.includes(item.key))

  // Redirect if current view is not accessible for this role
  useEffect(() => {
    if (currentView && !allowedViews.includes(currentView)) {
      setCurrentView('dashboard')
    }
  }, [allowedViews, currentView, setCurrentView])

  // Fetch notification badge counts
  useEffect(() => {
    mountedRef.current = true
    const fetchBadges = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const [aptsRes, invRes, labsRes, transfersRes] = await Promise.all([
          fetch(`/api/appointments?status=en_attente&date=${today}`),
          fetch('/api/invoices?status=impayee'),
          fetch('/api/labs?status=en_attente'),
          fetch('/api/transfers?direction=incoming'),
        ])
        if (!mountedRef.current) return
        const apts = await aptsRes.json()
        const invs = await invRes.json()
        const labList = await labsRes.json()
        const transferList = await transfersRes.json()
        setBadges({
          appointments: Array.isArray(apts) ? apts.length : 0,
          invoices: Array.isArray(invs) ? invs.length : 0,
          labs: Array.isArray(labList) ? labList.length : 0,
          transfers: Array.isArray(transferList) ? transferList.filter((t: any) => t.status === 'en_attente').length : 0,
        })
      } catch {
        // Silently fail — badges are non-critical
      }
    }
    fetchBadges()
    // Refresh every 60 seconds
    const interval = setInterval(fetchBadges, 60000)
    return () => { mountedRef.current = false; clearInterval(interval) }
  }, [])

  const handleNav = (key: string) => {
    setCurrentView(key)
    onClose?.()
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('dashboard')
    toast.success('Déconnexion réussie')
  }

  const getBadge = (key: string) => {
    if (key === 'appointments' && badges.appointments > 0) {
      return (
        <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
          {badges.appointments > 99 ? '99+' : badges.appointments}
        </span>
      )
    }
    if (key === 'invoices' && badges.invoices > 0) {
      return (
        <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none">
          {badges.invoices > 99 ? '99+' : badges.invoices}
        </span>
      )
    }
    if (key === 'labs' && badges.labs > 0) {
      return (
        <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold leading-none">
          {badges.labs > 99 ? '99+' : badges.labs}
        </span>
      )
    }
    if (key === 'transfers' && badges.transfers > 0) {
      return (
        <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-purple-500 text-white text-[10px] font-bold leading-none">
          {badges.transfers > 99 ? '99+' : badges.transfers}
        </span>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-full bg-emerald-900 text-white overflow-hidden">
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
      <ScrollArea className="flex-1 py-2 px-3">
        <nav className="space-y-px">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.key
            const badge = getBadge(item.key)
            return (
              <div key={item.key}>
                {(item.key === 'admin' || item.key === 'settings' || item.key === 'platforms') && (
                  <div className="my-2 border-t border-emerald-700/50" />
                )}
                <button
                  onClick={() => handleNav(item.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-700/60 text-white shadow-sm'
                      : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {badge || (isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />)}
                </button>
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User info — stays at bottom */}
      <div className="mt-auto border-t border-emerald-800 px-3 py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
            <UserCircle className="w-4.5 h-4.5 text-emerald-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-emerald-400 truncate">
              {user?.role?.label || user?.role?.name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-emerald-300 hover:text-white hover:bg-emerald-800 h-8 text-xs"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */

export default function HomePage() {
  const { isAuthenticated, currentView } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const viewTitle = NAV_ITEMS.find((n) => n.key === currentView)?.label || 'Tableau de bord'

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />
      case 'patients': return <PatientsView />
      case 'dme': return <DmeView />
      case 'departments': return <DepartmentsView />
      case 'staff': return <StaffView />
      case 'appointments': return <AppointmentsView />
      case 'consultations': return <ConsultationsView />
      case 'prescriptions': return <PrescriptionsView />
      case 'invoices': return <InvoicesView />
      case 'medications': return <MedicationsView />
      case 'labs': return <LaboView />
      case 'audit': return <AuditView />
      case 'transfers': return <TransfersView />
      case 'admin': return <AdminPanelView />
      case 'settings': return <SettingsView />
      case 'platforms': return <PlatformsView />
      default: return <DashboardView />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {!isAuthenticated ? <LoginScreen /> : (
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
                <div className="ml-auto flex items-center gap-2">
                  <PWAStatusBadge />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 p-4 sm:p-6">
              {renderView()}
            </div>
          </main>

          {/* Sonner Toaster */}
          <Toaster position="top-right" richColors closeButton />
          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
        </div>
      )}
    </ThemeProvider>
  )
}