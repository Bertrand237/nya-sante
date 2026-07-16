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
import { Microscope, Plus, Loader2, X } from 'lucide-react'

import { fmtDateTime } from '@/lib/helpers'
import { STATUS_LAB, LAB_TYPES } from '@/lib/constants'
import { TableSkeleton } from '@/components/ui/skeletons'

export default function LaboView() {
  const [labs, setLabs] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [form, setForm] = useState({
    patientId: '', staffId: '', analysisType: 'Hémogramme', notes: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (doctorFilter) params.set('staffId', doctorFilter)
      const [lRes, pRes, sRes] = await Promise.all([
        fetch(`/api/labs?${params.toString()}`),
        fetch('/api/patients?limit=100'),
        fetch('/api/staff'),
      ])
      setLabs(await lRes.json())
      const pData = await pRes.json()
      setPatients(pData.data || [])
      setStaffList(await sRes.json())
    } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
  }, [statusFilter, doctorFilter])

  useEffect(() => { load() }, [load])

  // Count by status (from all labs)
  const [statusCounts, setStatusCounts] = useState({ en_attente: 0, en_cours: 0, termine: 0 })
  useEffect(() => {
    fetch('/api/labs')
      .then(r => r.json())
      .then(data => {
        setStatusCounts({
          en_attente: data.filter((l: any) => l.status === 'en_attente').length,
          en_cours: data.filter((l: any) => l.status === 'en_cours').length,
          termine: data.filter((l: any) => l.status === 'termine').length,
        })
      })
      .catch(() => {})
  }, [])

  const doctors = staffList.filter((s: any) => s.role?.name === 'medecin' || s.role?.name === 'medecin_chef')
  const hasFilters = statusFilter || doctorFilter
  const clearFilters = () => { setStatusFilter(''); setDoctorFilter('') }

  const handleSave = async () => {
    if (!form.patientId || !form.staffId) {
      toast.error('Patient et médecin sont requis')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return }
      toast.success('Demande de laboratoire créée')
      setDialogOpen(false)
      setForm({ patientId: '', staffId: '', analysisType: 'Hémogramme', notes: '' })
      load()
    } catch { toast.error('Erreur serveur') } finally { setSaving(false) }
  }

  const updateForm = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/labs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        toast.success('Statut mis à jour')
        load()
      }
    } catch { toast.error('Erreur') }
  }

  const getLabNumber = (index: number) => {
    const year = new Date().getFullYear()
    return `LAB-${year}-${String(labs.length - index).padStart(4, '0')}`
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laboratoire</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {labs.length} demande{labs.length > 1 ? 's' : ''}
            <span className="ml-2 text-xs">
              <span className="text-yellow-600">{statusCounts.en_attente} en attente</span>
              {' · '}
              <span className="text-blue-600">{statusCounts.en_cours} en cours</span>
              {' · '}
              <span className="text-emerald-600">{statusCounts.termine} terminé{statusCounts.termine > 1 ? 's' : ''}</span>
            </span>
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="termine">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={doctorFilter || 'all'} onValueChange={(v) => setDoctorFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Médecin" /></SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">Tous les médecins</SelectItem>
            {doctors.map((s: any) => (
              <SelectItem key={s.id} value={s.id}>Dr. {s.firstName} {s.lastName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground" onClick={clearFilters}>
            <X className="w-3 h-3 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">N°</TableHead>
                  <TableHead className="text-xs">Patient</TableHead>
                  <TableHead className="text-xs">Médecin</TableHead>
                  <TableHead className="text-xs">Type d&apos;analyse</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labs.map((lab: any, idx: number) => {
                  const st = STATUS_LAB[lab.status] || STATUS_LAB.en_attente
                  return (
                    <TableRow key={lab.id}>
                      <TableCell className="text-xs font-mono font-medium">{lab.labNumber || getLabNumber(idx)}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {lab.patient?.firstName} {lab.patient?.lastName}
                      </TableCell>
                      <TableCell className="text-xs">Dr. {lab.staff?.firstName} {lab.staff?.lastName}</TableCell>
                      <TableCell className="text-xs">{lab.analysisType}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={st.className}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{fmtDateTime(lab.requestedAt)}</TableCell>
                      <TableCell className="text-xs">
                        {lab.status === 'en_attente' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(lab.id, 'en_cours')}
                            className="h-7 text-xs"
                          >
                            Démarrer
                          </Button>
                        )}
                        {lab.status === 'en_cours' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(lab.id, 'termine')}
                            className="h-7 text-xs text-emerald-700"
                          >
                            Terminer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {labs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Microscope className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucune demande de laboratoire
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Nouvelle Demande de Laboratoire</DialogTitle></DialogHeader>
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
              <Label className="text-xs">Médecin demandeur *</Label>
              <Select value={form.staffId} onValueChange={(v) => updateForm('staffId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {doctors.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      Dr. {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type d&apos;analyse *</Label>
              <Select value={form.analysisType} onValueChange={(v) => updateForm('analysisType', v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LAB_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Input value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} placeholder="Notes ou instructions" />
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