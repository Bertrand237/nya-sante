'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useAppStore } from '@/lib/store'
import { getAllowedViews } from '@/lib/permissions'
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
  FileHeart,
  FileText,
  Microscope,
  Shield,
  Cloud,
  Send,
  UserPlus,
  CalendarPlus,
  ClipboardPlus,
  BookOpen,
  Keyboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ──────────────────────────────────────────────
   Navigation item definition (mirrors NAV_ITEMS in page.tsx)
   ────────────────────────────────────────────── */

interface NavEntry {
  key: string
  label: string
  icon: LucideIcon
  description: string
}

const NAV_ENTRIES: NavEntry[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, description: 'Vue d\'ensemble de l\'activité' },
  { key: 'patients', label: 'Patients', icon: Heart, description: 'Gestion des dossiers patients' },
  { key: 'dme', label: 'DME', icon: FileHeart, description: 'Dossier Médical Électronique' },
  { key: 'departments', label: 'Départements', icon: Building2, description: 'Services et départements' },
  { key: 'staff', label: 'Personnel', icon: Users, description: 'Gestion du personnel médical' },
  { key: 'appointments', label: 'Rendez-vous', icon: Calendar, description: 'Planification et suivi des RDV' },
  { key: 'consultations', label: 'Consultations', icon: Stethoscope, description: 'Consultations médicales' },
  { key: 'prescriptions', label: 'Ordonnances', icon: FileText, description: 'Prescriptions et traitements' },
  { key: 'invoices', label: 'Facturation', icon: Receipt, description: 'Factures et paiements' },
  { key: 'medications', label: 'Pharmacie', icon: Pill, description: 'Stock et gestion des médicaments' },
  { key: 'labs', label: 'Laboratoire', icon: Microscope, description: 'Analyses et résultats de labo' },
  { key: 'audit', label: 'Journal d\'audit', icon: Shield, description: 'Traces d\'activité système' },
  { key: 'transfers', label: 'Transferts', icon: Send, description: 'Transferts inter-services' },
  { key: 'admin', label: 'SaaS Admin', icon: Shield, description: 'Administration de la plateforme' },
  { key: 'settings', label: 'Paramètres', icon: Settings, description: 'Configuration du système' },
  { key: 'platforms', label: 'Plateformes', icon: Cloud, description: 'Gestion multi-plateformes' },
]

interface ActionEntry {
  id: string
  label: string
  icon: LucideIcon
  description: string
  shortcut?: string
}

const ACTION_ENTRIES: ActionEntry[] = [
  { id: 'new-patient', label: 'Nouveau patient', icon: UserPlus, description: 'Créer un dossier patient', shortcut: 'Alt+N' },
  { id: 'new-appointment', label: 'Nouveau RDV', icon: CalendarPlus, description: 'Prendre un rendez-vous', shortcut: 'Alt+R' },
  { id: 'new-consultation', label: 'Nouvelle consultation', icon: ClipboardPlus, description: 'Démarrer une consultation', shortcut: 'Alt+C' },
]

interface HelpEntry {
  id: string
  label: string
  icon: LucideIcon
  description: string
}

const HELP_ENTRIES: HelpEntry[] = [
  { id: 'documentation', label: 'Documentation', icon: BookOpen, description: 'Guide d\'utilisation de NYA Santé' },
  { id: 'shortcuts', label: 'Raccourcis clavier', icon: Keyboard, description: 'Liste de tous les raccourcis disponibles' },
]

/* ──────────────────────────────────────────────
   CommandPalette Component
   ────────────────────────────────────────────── */

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { user, setCurrentView, setSidebarOpen } = useAppStore()

  // Filter navigation items based on user role
  const allowedViews = useMemo(() => getAllowedViews(user?.role?.name), [user?.role?.name])
  const filteredNavEntries = useMemo(
    () => NAV_ENTRIES.filter((entry) => allowedViews.includes(entry.key)),
    [allowedViews],
  )

  // Global keyboard shortcut: Ctrl+K / Cmd+K to toggle
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    },
    [open, onOpenChange],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleNavSelect = (viewKey: string) => {
    setCurrentView(viewKey)
    onOpenChange(false)
    // On mobile, close sidebar and let the view render
    setSidebarOpen(false)
  }

  const handleActionSelect = (actionId: string) => {
    onOpenChange(false)
    switch (actionId) {
      case 'new-patient':
        setCurrentView('patients')
        // The PatientsView can listen for a trigger — for now just navigate
        toast.info('Naviguez vers Patients pour ajouter un nouveau dossier')
        break
      case 'new-appointment':
        setCurrentView('appointments')
        toast.info('Naviguez vers Rendez-vous pour planifier un nouveau RDV')
        break
      case 'new-consultation':
        setCurrentView('consultations')
        toast.info('Naviguez vers Consultations pour démarrer une consultation')
        break
    }
  }

  const handleHelpSelect = (helpId: string) => {
    onOpenChange(false)
    switch (helpId) {
      case 'documentation':
        toast.info('Documentation disponible dans les Paramètres > Aide')
        break
      case 'shortcuts':
        toast.info('Ctrl+K : Palette de commandes · Esc : Fermer')
        break
    }
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Palette de commandes"
      description="Rechercher une vue, une action ou de l'aide"
    >
      <CommandInput placeholder="Rechercher une vue, une action..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        {/* Navigation Group */}
        <CommandGroup heading="Navigation">
          {filteredNavEntries.map((entry) => {
            const Icon = entry.icon
            return (
              <CommandItem
                key={entry.key}
                value={`nav ${entry.label} ${entry.description}`}
                onSelect={() => handleNavSelect(entry.key)}
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{entry.label}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{entry.description}</span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions Group */}
        <CommandGroup heading="Actions rapides">
          {ACTION_ENTRIES.map((entry) => {
            const Icon = entry.icon
            return (
              <CommandItem
                key={entry.id}
                value={`action ${entry.label} ${entry.description}`}
                onSelect={() => handleActionSelect(entry.id)}
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">{entry.label}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{entry.description}</span>
                </div>
                {entry.shortcut && (
                  <CommandShortcut>{entry.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Help Group */}
        <CommandGroup heading="Aide">
          {HELP_ENTRIES.map((entry) => {
            const Icon = entry.icon
            return (
              <CommandItem
                key={entry.id}
                value={`help ${entry.label} ${entry.description}`}
                onSelect={() => handleHelpSelect(entry.id)}
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{entry.label}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{entry.description}</span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>

      {/* Footer hint */}
      <div className="border-t px-3 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ↑↓
            </kbd>
            Naviguer
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ↵
            </kbd>
            Sélectionner
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            Esc
          </kbd>
          Fermer
        </span>
      </div>
    </CommandDialog>
  )
}