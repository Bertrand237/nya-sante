'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Stethoscope, Plus, Loader2, FileText, Thermometer, Activity, CalendarDays, X } from 'lucide-react'

import { fmtDateTime } from '@/lib/helpers'
import { TableSkeleton } from '@/components/ui/skeletons'

export default function ConsultationsView() {
  const [patients, setPatients] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingVitals, setSavingVitals] = useState(false)
  const [lastVitals, setLastVitals] = useState<any>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [form, setForm] = useState({
    patientId: '', staffId: '', chiefComplaint: '', diagnosis: '', plan: '',
  })
  const [vitalsForm, setVitalsForm] = useState({
    weight: '', height: '', temperature: '', systolic: '', diastolic: '',
    heartRate: '', oxygenSaturation: '', respiratoryRate: '',
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

  // Load consultations and last vitals when patient selected
  useEffect(() => {
    setLastVitals(null)
    if (!selectedPatient) {
      setConsultations([])
      setLoaded(false)
      return
    }
    const loadData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ patientId: selectedPatient })
        if (dateFrom) params.set('dateFrom', dateFrom)
        if (dateTo) params.set('dateTo', dateTo)
        const [cRes, vRes] = await Promise.all([
          fetch(`/api/consultations?${params.toString()}`),
          fetch(`/api/vitals?patientId=${selectedPatient}`),
        ])
        if (cRes.ok) setConsultations(await cRes.json())
        else setConsultations([])
        if (vRes.ok) {
          const vitalsData = await vRes.json()
          if (Array.isArray(vitalsData) && vitalsData.length > 0) {
            setLastVitals(vitalsData[0])
          }
        }
      } catch { setConsultations([]) } finally { setLoading(false); setLoaded(true) }
    }
    loadData()
  }, [selectedPatient, dateFrom, dateTo])

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

  const handleSaveVitals = async () => {
    if (!selectedPatient) return
    const hasValue = Object.values(vitalsForm).some((v) => v !== '')
    if (!hasValue) { toast.error('Renseignez au moins une constante vitale'); return }
    setSavingVitals(true)
    try {
      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          weight: vitalsForm.weight || undefined,
          height: vitalsForm.height || undefined,
          temperature: vitalsForm.temperature || undefined,
          bloodPressureSystolic: vitalsForm.systolic || undefined,
          bloodPressureDiastolic: vitalsForm.diastolic || undefined,
          heartRate: vitalsForm.heartRate || undefined,
          oxygenSaturation: vitalsForm.oxygenSaturation || undefined,
          respiratoryRate: vitalsForm.respiratoryRate || undefined,
        }),
      })
      if (res.ok) {
        toast.success('Constantes vitales enregistrées')
        setVitalsForm({ weight: '', height: '', temperature: '', systolic: '', diastolic: '', heartRate: '', oxygenSaturation: '', respiratoryRate: '' })
        const vRes = await fetch(`/api/vitals?patientId=${selectedPatient}`)
        if (vRes.ok) {
          const vitalsData = await vRes.json()
          if (Array.isArray(vitalsData) && vitalsData.length > 0) {
            setLastVitals(vitalsData[0])
          }
        }
      }
    } catch { toast.error('Erreur serveur') } finally { setSavingVitals(false) }
  }

  const updateForm = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))
  const updateVitals = (f: string, v: string) => setVitalsForm((p) => ({ ...p, [f]: v }))
  const hasDateFilter = dateFrom || dateTo
  const clearDateFilter = () => { setDateFrom(''); setDateTo('') }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Consultations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loaded && consultations.length > 0 ? `${consultations.length} consultation${consultations.length > 1 ? 's' : ''}` : 'Historique des consultations'}
          </p>
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

      {/* Date filter (shown when patient selected) */}
      {selectedPatient && (
        <div className="flex flex-wrap items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[150px]" />
          <span className="text-xs text-muted-foreground">→</span>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[150px]" />
          {hasDateFilter && (
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearDateFilter}>
              <X className="w-3 h-3 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      )}

      {/* Last Vitals Display */}
      {selectedPatient && lastVitals && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-600" />
              Dernières constantes vitales
              <span className="text-xs font-normal text-muted-foreground ml-2">{fmtDateTime(lastVitals.createdAt)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {lastVitals.weight != null && <span>Poids : <strong>{lastVitals.weight} kg</strong></span>}
              {lastVitals.height != null && <span>Taille : <strong>{lastVitals.height} cm</strong></span>}
              {lastVitals.temperature != null && <span>T° : <strong>{lastVitals.temperature} °C</strong></span>}
              {lastVitals.bloodPressureSystolic != null && <span>TA : <strong>{lastVitals.bloodPressureSystolic}/{lastVitals.bloodPressureDiastolic} mmHg</strong></span>}
              {lastVitals.heartRate != null && <span>FC : <strong>{lastVitals.heartRate} bpm</strong></span>}
              {lastVitals.oxygenSaturation != null && <span>SpO2 : <strong>{lastVitals.oxygenSaturation}%</strong></span>}
              {lastVitals.respiratoryRate != null && <span>FR : <strong>{lastVitals.respiratoryRate}/min</strong></span>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vital Signs Recording */}
      {selectedPatient && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Constantes Vitales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Poids (kg)</Label>
                <Input type="number" step="0.1" value={vitalsForm.weight} onChange={(e) => updateVitals('weight', e.target.value)} placeholder="70" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Taille (cm)</Label>
                <Input type="number" step="0.1" value={vitalsForm.height} onChange={(e) => updateVitals('height', e.target.value)} placeholder="170" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Température (°C)</Label>
                <Input type="number" step="0.1" value={vitalsForm.temperature} onChange={(e) => updateVitals('temperature', e.target.value)} placeholder="37.0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">TA systolique (mmHg)</Label>
                <Input type="number" value={vitalsForm.systolic} onChange={(e) => updateVitals('systolic', e.target.value)} placeholder="120" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">TA diastolique (mmHg)</Label>
                <Input type="number" value={vitalsForm.diastolic} onChange={(e) => updateVitals('diastolic', e.target.value)} placeholder="80" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">FC (bpm)</Label>
                <Input type="number" value={vitalsForm.heartRate} onChange={(e) => updateVitals('heartRate', e.target.value)} placeholder="72" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Saturation O2 (%)</Label>
                <Input type="number" value={vitalsForm.oxygenSaturation} onChange={(e) => updateVitals('oxygenSaturation', e.target.value)} placeholder="98" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">FR (/min)</Label>
                <Input type="number" value={vitalsForm.respiratoryRate} onChange={(e) => updateVitals('respiratoryRate', e.target.value)} placeholder="16" />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={handleSaveVitals} disabled={savingVitals} size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                {savingVitals && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Enregistrer les constantes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultations table */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {!selectedPatient ? (
            <div className="text-center py-16 text-muted-foreground">
              <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Sélectionnez un patient pour voir ses consultations</p>
            </div>
          ) : loading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : (
            <div className="overflow-x-auto">
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
            </div>
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