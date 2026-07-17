'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Heart, Search, Plus, Loader2, ArrowUpDown, X, FileHeart } from 'lucide-react'
import { useAppStore } from '@/lib/store'

import { fmtDate } from '@/lib/helpers'
import { BLOOD_TYPES } from '@/lib/constants'
import { TableSkeleton } from '@/components/ui/skeletons'

export default function PatientsView() {
  const [patients, setPatients] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [bloodFilter, setBloodFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { setSelectedPatientId, setCurrentView } = useAppStore()

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', dateOfBirth: '',
    gender: 'M', bloodType: '', address: '', city: '', allergies: '',
    emergencyContact: '', emergencyPhone: '', insuranceProvider: '', insuranceNumber: '',
  })

  const loadPatients = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (genderFilter) params.set('gender', genderFilter)
      if (bloodFilter) params.set('bloodType', bloodFilter)
      if (statusFilter) params.set('status', statusFilter)
      params.set('sortBy', sortBy)
      params.set('sortDir', sortDir)
      params.set('limit', '100')
      const res = await fetch(`/api/patients?${params.toString()}`)
      const data = await res.json()
      setPatients(data.data || [])
      setTotalCount(data.total || 0)
    } catch {
      toast.error('Erreur de chargement des patients')
    } finally {
      setLoading(false)
    }
  }, [search, genderFilter, bloodFilter, statusFilter, sortBy, sortDir])

  useEffect(() => { loadPatients() }, [loadPatients])

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const hasActiveFilters = genderFilter || bloodFilter || statusFilter
  const clearFilters = () => { setGenderFilter(''); setBloodFilter(''); setStatusFilter('') }
  const sortLabels: Record<string, string> = { createdAt: 'Date', lastName: 'Nom', folderNumber: 'Dossier' }

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

  const openDossier = (p: any) => {
    setSelectedPatientId(p.id)
    setCurrentView('dme')
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalCount} patient{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
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

      {/* Search + Filters row */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter || 'all'} onValueChange={(v) => setGenderFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sexe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="M">Homme</SelectItem>
              <SelectItem value="F">Femme</SelectItem>
            </SelectContent>
          </Select>
          <Select value={bloodFilter || 'all'} onValueChange={(v) => setBloodFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Groupe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {BLOOD_TYPES.map((bt) => (
                <SelectItem key={bt} value={bt}>{bt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Trier :</span>
          {['lastName', 'createdAt', 'folderNumber'].map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                sortBy === field
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
              }`}
            >
              {sortLabels[field]}
              <ArrowUpDown className={`w-3 h-3 ${sortBy === field ? 'opacity-100' : 'opacity-40'}`} />
              {sortBy === field && (
                <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          ))}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearFilters}>
              <X className="w-3 h-3 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="overflow-x-auto">
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
                  <TableHead className="text-xs w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p: any) => (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDossier(p)}>
                    <TableCell className="text-xs font-mono font-medium">{p.folderNumber}</TableCell>
                    <TableCell className="text-xs font-medium">{p.lastName}</TableCell>
                    <TableCell className="text-xs">{p.firstName}</TableCell>
                    <TableCell className="text-xs">{p.phone}</TableCell>
                    <TableCell className="text-xs">{p.gender === 'M' ? 'Masculin' : 'Féminin'}</TableCell>
                    <TableCell className="text-xs">{p.bloodType || '—'}</TableCell>
                    <TableCell className="text-xs">{fmtDate(p.createdAt)}</TableCell>
                    <TableCell className="text-xs p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={(e) => { e.stopPropagation(); openDossier(p) }}
                        title="Voir dossier"
                      >
                        <FileHeart className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground mb-1">Aucun patient enregistré</p>
                      <p className="text-xs text-muted-foreground/70 mb-4">Commencez par ajouter le premier patient</p>
                      <Button size="sm" onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Créer un patient
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
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