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
import { Calendar, Plus, Loader2, XCircle, X } from 'lucide-react'

import { fmtDateTime } from '@/lib/helpers'
import { STATUS_APPOINTMENT } from '@/lib/constants'
import { TableSkeleton } from '@/components/ui/skeletons'

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deptFilter, setDeptFilter] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [form, setForm] = useState({
    patientId: '', staffId: '', date: '', type: 'consultation', reason: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (deptFilter) params.set('departmentId', deptFilter)
      if (doctorFilter) params.set('staffId', doctorFilter)
      const [aRes, pRes, sRes, dRes] = await Promise.all([
        fetch(`/api/appointments?${params.toString()}`),
        fetch('/api/patients?limit=100'),
        fetch('/api/staff'),
        fetch('/api/departments'),
      ])
      setAppointments(await aRes.json())
      const pData = await pRes.json()
      setPatients(pData.data || [])
      setStaffList(await sRes.json())
      setDepartments(await dRes.json())
    } catch {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [deptFilter, doctorFilter])

  useEffect(() => { load() }, [load])

  // Status summary
  const enAttente = appointments.filter((a: any) => a.status === 'en_attente' || a.status === 'confirme').length
  const confirms = appointments.filter((a: any) => a.status === 'confirme').length
  const hasFilters = deptFilter || doctorFilter
  const clearFilters = () => { setDeptFilter(''); setDoctorFilter('') }

  // Doctors with medecin role
  const doctors = staffList.filter((s: any) => s.role?.name === 'medecin' || s.role?.name === 'medecin_chef')

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
          <p className="text-muted-foreground text-sm mt-1">
            {appointments.length} rendez-vous
            {enAttente > 0 && <span className="text-yellow-600 ml-1">— {enAttente} en attente, {confirms} confirmé{confirms > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rendez-vous
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select value={deptFilter || 'all'} onValueChange={(v) => setDeptFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Département" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            {departments.map((d: any) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
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
                      <TableCell className="text-xs">{a.staff?.department?.name || a.department?.name || '—'}</TableCell>
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
            </div>
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