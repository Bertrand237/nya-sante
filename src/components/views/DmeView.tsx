'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { CardSkeleton } from '@/components/ui/skeletons'
import {
  Heart, Search, ArrowLeft, UserCircle, Stethoscope, Pill, Receipt,
  Activity, Microscope, Send, Loader2, FileText, ChevronRight,
  AlertCircle, Building2,
} from 'lucide-react'

import { fmtCurrency, fmtDate, fmtDateTime } from '@/lib/helpers'
import { STATUS_INVOICE, STATUS_LAB } from '@/lib/constants'

type TabKey = 'infos' | 'consultations' | 'ordonnances' | 'laboratoire' | 'factures' | 'constantes'

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'infos', label: 'Informations', icon: UserCircle },
  { key: 'consultations', label: 'Consultations', icon: Stethoscope },
  { key: 'ordonnances', label: 'Ordonnances', icon: Pill },
  { key: 'laboratoire', label: 'Laboratoire', icon: Microscope },
  { key: 'factures', label: 'Factures', icon: Receipt },
  { key: 'constantes', label: 'Constantes', icon: Activity },
]

export default function DmeView() {
  const { selectedPatientId, setSelectedPatientId, setCurrentView, user } = useAppStore()

  // Mode A state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [searching, setSearching] = useState(false)

  // Mode B state
  const [patient, setPatient] = useState<any>(null)
  const [loadingDossier, setLoadingDossier] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('infos')
  const [expandedConsultation, setExpandedConsultation] = useState<string | null>(null)

  // Transfer dialog state
  const [transferOpen, setTransferOpen] = useState(false)
  const [hospitals, setHospitals] = useState<any[]>([])
  const [transferReason, setTransferReason] = useState('')
  const [transferHospitalId, setTransferHospitalId] = useState('')
  const [transferSending, setTransferSending] = useState(false)

  // ─── Check store on mount ───
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDossier(selectedPatientId)
      setSelectedPatientId(null)
    }
  }, [])

  // ─── Mode A: Search ───
  const loadPatientList = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(searchQuery)}&limit=50`)
      const data = await res.json()
      setSearchResults(data.data || [])
    } catch {
      setSearchResults([])
    } finally {
      setLoadingList(false)
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchQuery.length >= 2 && !patient) {
      const timer = setTimeout(loadPatientList, 300)
      return () => clearTimeout(timer)
    } else if (searchQuery.length < 2) {
      setSearchResults([])
    }
  }, [searchQuery, loadPatientList, patient])

  const handleSearch = (val: string) => {
    if (patient) {
      // If in dossier mode and user types in search, go back to list
      setPatient(null)
      setActiveTab('infos')
    }
    setSearchQuery(val)
  }

  // ─── Load dossier ───
  const loadPatientDossier = async (id: string) => {
    setLoadingDossier(true)
    setPatient(null)
    try {
      const res = await fetch(`/api/patients/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPatient(data)
        setActiveTab('infos')
        setSearchQuery(`${data.firstName} ${data.lastName} (${data.folderNumber})`)
      } else {
        toast.error('Patient non trouvé')
      }
    } catch {
      toast.error('Erreur de chargement du dossier')
    } finally {
      setLoadingDossier(false)
    }
  }

  const openDossier = (p: any) => {
    loadPatientDossier(p.id)
  }

  const goBack = () => {
    setPatient(null)
    setActiveTab('infos')
    setSearchQuery('')
  }

  // ─── Transfer ───
  const openTransferDialog = async () => {
    setTransferOpen(true)
    setTransferReason('')
    setTransferHospitalId('')
    try {
      const res = await fetch('/api/hospitals')
      if (res.ok) setHospitals(await res.json())
    } catch { /* ignore */ }
  }

  const sendTransfer = async () => {
    if (!transferHospitalId || !patient) return
    setTransferSending(true)
    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          toHospitalId: transferHospitalId,
          reason: transferReason,
          requestedBy: user?.id,
        }),
      })
      if (res.ok) {
        toast.success('Demande de transfert envoyée avec succès')
        setTransferOpen(false)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de l\'envoi')
      }
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setTransferSending(false)
    }
  }

  // ─── Helpers ───
  const getAge = (dob: string | null) => {
    if (!dob) return '—'
    const d = new Date(dob)
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
    return `${age} ans`
  }

  const getLastVitals = () => {
    if (!patient?.vitals?.length) return null
    return patient.vitals[0]
  }

  // ─── Render: Mode A (Patient List) ───
  if (!patient && !loadingDossier) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center gap-3">
          {/* Hidden back button in list mode */}
          <Button variant="ghost" size="icon" className="invisible">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Dossier Médical Électronique</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Rechercher un patient pour accéder à son dossier complet
            </p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou numéro de dossier..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {loadingList && <CardSkeleton />}

        {!loadingList && searchQuery.length >= 2 && (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">N° Dossier</TableHead>
                      <TableHead className="text-xs">Nom</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Téléphone</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Sexe</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Groupe Sanguin</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Date Création</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <Search className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">Aucun patient trouvé</p>
                        </TableCell>
                      </TableRow>
                    )}
                    {searchResults.map((p: any) => (
                      <TableRow
                        key={p.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openDossier(p)}
                      >
                        <TableCell className="text-xs font-mono font-medium">{p.folderNumber}</TableCell>
                        <TableCell className="text-xs font-medium">
                          {p.lastName} {p.firstName}
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell">{p.phone}</TableCell>
                        <TableCell className="text-xs hidden md:table-cell">
                          {p.gender === 'M' ? 'Masculin' : 'Féminin'}
                        </TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">{p.bloodType || '—'}</TableCell>
                        <TableCell className="text-xs hidden md:table-cell">{fmtDate(p.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {!loadingList && searchQuery.length < 2 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
            <p className="text-muted-foreground text-sm">
              Saisissez au moins 2 caractères pour rechercher un patient
            </p>
          </div>
        )}
      </div>
    )
  }

  // ─── Render: Loading dossier ───
  if (loadingDossier) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Dossier Médical Électronique</h1>
          </div>
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  // ─── Render: Mode B (Full Dossier) ───
  const lastVitals = getLastVitals()
  const totalRemaining = (patient?.invoices || []).reduce(
    (sum: number, inv: any) => sum + (inv.totalAmount - inv.paidAmount),
    0
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5 font-mono">
              {patient.folderNumber}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={openTransferDialog}
        >
          <Send className="w-4 h-4 mr-2" />
          Transférer
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {/* ─── Tab: Informations ─── */}
        {activeTab === 'infos' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-sky-600" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nom complet</p>
                  <p className="text-sm font-medium">{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">N° Dossier</p>
                  <p className="text-sm font-mono font-medium">{patient.folderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Âge</p>
                  <p className="text-sm font-medium">{getAge(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sexe</p>
                  <p className="text-sm font-medium">{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Groupe Sanguin</p>
                  <p className="text-sm font-medium">{patient.bloodType || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="text-sm font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Adresse</p>
                  <p className="text-sm font-medium">{patient.address || '—'}{patient.city ? `, ${patient.city}` : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assurance</p>
                  <p className="text-sm font-medium">
                    {patient.insuranceProvider || '—'}{' '}
                    {patient.insuranceNumber ? `(${patient.insuranceNumber})` : ''}
                  </p>
                </div>
              </div>
              {(patient.allergies || patient.medicalHistory || patient.emergencyContact) && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  {patient.allergies && (
                    <div>
                      <p className="text-xs text-muted-foreground">Allergies</p>
                      <p className="text-sm font-medium text-red-700">{patient.allergies}</p>
                    </div>
                  )}
                  {patient.medicalHistory && (
                    <div>
                      <p className="text-xs text-muted-foreground">Antécédents médicaux</p>
                      <p className="text-sm">{patient.medicalHistory}</p>
                    </div>
                  )}
                  {patient.emergencyContact && (
                    <div>
                      <p className="text-xs text-muted-foreground">Contact d&apos;urgence</p>
                      <p className="text-sm font-medium">
                        {patient.emergencyContact}{' '}
                        {patient.emergencyPhone && (
                          <span className="text-muted-foreground">— {patient.emergencyPhone}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── Tab: Consultations ─── */}
        {activeTab === 'consultations' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Consultations ({patient.consultations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!patient.consultations || patient.consultations.length === 0) ? (
                <div className="text-center py-12">
                  <Stethoscope className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Aucune consultation</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-8"></TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Médecin</TableHead>
                        <TableHead className="text-xs">Motif</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Diagnostic</TableHead>
                        <TableHead className="text-xs">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.consultations.map((c: any) => {
                        const isExpanded = expandedConsultation === c.id
                        return (
                          <>
                            <TableRow
                              key={c.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setExpandedConsultation(isExpanded ? null : c.id)}
                            >
                              <TableCell className="text-xs p-2 w-8">
                                <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </TableCell>
                              <TableCell className="text-xs">{fmtDateTime(c.createdAt)}</TableCell>
                              <TableCell className="text-xs hidden sm:table-cell">
                                Dr. {c.staff?.firstName} {c.staff?.lastName}
                              </TableCell>
                              <TableCell className="text-xs max-w-[150px] truncate">{c.chiefComplaint || '—'}</TableCell>
                              <TableCell className="text-xs max-w-[150px] truncate hidden md:table-cell">{c.diagnosis || '—'}</TableCell>
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
                            {isExpanded && (
                              <TableRow key={`${c.id}-detail`}>
                                <TableCell colSpan={6} className="bg-muted/30 p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {c.historyOfPresentIllness && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Histoire de la maladie</p>
                                        <p className="text-sm whitespace-pre-wrap">{c.historyOfPresentIllness}</p>
                                      </div>
                                    )}
                                    {c.physicalExam && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Examen physique</p>
                                        <p className="text-sm whitespace-pre-wrap">{c.physicalExam}</p>
                                      </div>
                                    )}
                                    {c.diagnosis && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Diagnostic</p>
                                        <p className="text-sm font-medium">{c.diagnosis}</p>
                                      </div>
                                    )}
                                    {c.plan && (
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Plan de traitement</p>
                                        <p className="text-sm whitespace-pre-wrap">{c.plan}</p>
                                      </div>
                                    )}
                                    {c.notes && (
                                      <div className="md:col-span-2">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                                        <p className="text-sm whitespace-pre-wrap">{c.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── Tab: Ordonnances ─── */}
        {activeTab === 'ordonnances' && (
          <div className="space-y-4">
            {(!patient.prescriptions || patient.prescriptions.length === 0) ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Pill className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Aucune ordonnance</p>
                </CardContent>
              </Card>
            ) : (
              patient.prescriptions.map((rx: any) => (
                <Card key={rx.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-600" />
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        Ordonnance du {fmtDateTime(rx.createdAt)}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Dr. {rx.staff?.firstName} {rx.staff?.lastName}</span>
                        {rx.consultation?.diagnosis && (
                          <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">
                            {rx.consultation.diagnosis}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {rx.items && rx.items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Médicament</TableHead>
                              <TableHead className="text-xs">Posologie</TableHead>
                              <TableHead className="text-xs hidden sm:table-cell">Fréquence</TableHead>
                              <TableHead className="text-xs hidden md:table-cell">Durée</TableHead>
                              <TableHead className="text-xs hidden lg:table-cell">Instructions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rx.items.map((item: any, i: number) => (
                              <TableRow key={i}>
                                <TableCell className="text-xs font-medium">{item.medicationName}</TableCell>
                                <TableCell className="text-xs">{item.dosage}</TableCell>
                                <TableCell className="text-xs hidden sm:table-cell">{item.frequency}</TableCell>
                                <TableCell className="text-xs hidden md:table-cell">{item.duration}</TableCell>
                                <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{item.instructions || '—'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-muted-foreground">
                        Aucun médicament détaillé
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* ─── Tab: Laboratoire ─── */}
        {activeTab === 'laboratoire' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Microscope className="w-4 h-4 text-emerald-600" />
                Examens de Laboratoire ({patient.labRequests?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!patient.labRequests || patient.labRequests.length === 0) ? (
                <div className="text-center py-12">
                  <Microscope className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Aucun examen de laboratoire</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Type d&apos;analyse</TableHead>
                        <TableHead className="text-xs">Statut</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Résultats</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Médecin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.labRequests.map((lab: any) => {
                        const st = STATUS_LAB[lab.status] || STATUS_LAB.en_attente
                        return (
                          <TableRow key={lab.id}>
                            <TableCell className="text-xs">{fmtDateTime(lab.requestedAt)}</TableCell>
                            <TableCell className="text-xs font-medium">{lab.analysisType}</TableCell>
                            <TableCell className="text-xs">
                              <Badge variant="outline" className={st.className}>{st.label}</Badge>
                            </TableCell>
                            <TableCell className="text-xs max-w-[200px] truncate hidden sm:table-cell">
                              {lab.results || '—'}
                            </TableCell>
                            <TableCell className="text-xs hidden md:table-cell">
                              Dr. {lab.staff?.firstName} {lab.staff?.lastName}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── Tab: Factures ─── */}
        {activeTab === 'factures' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Factures ({patient.invoices?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!patient.invoices || patient.invoices.length === 0) ? (
                <div className="text-center py-12">
                  <Receipt className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Aucune facture</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">N° Facture</TableHead>
                          <TableHead className="text-xs">Montant</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">Payé</TableHead>
                          <TableHead className="text-xs">Statut</TableHead>
                          <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patient.invoices.map((inv: any) => {
                          const st = STATUS_INVOICE[inv.status] || STATUS_INVOICE.impayee
                          return (
                            <TableRow key={inv.id}>
                              <TableCell className="text-xs font-mono">{inv.invoiceNumber}</TableCell>
                              <TableCell className="text-xs font-medium">{fmtCurrency(inv.totalAmount)}</TableCell>
                              <TableCell className="text-xs hidden sm:table-cell">{fmtCurrency(inv.paidAmount)}</TableCell>
                              <TableCell className="text-xs">
                                <Badge variant="outline" className={st.className}>{st.label}</Badge>
                              </TableCell>
                              <TableCell className="text-xs hidden md:table-cell">{fmtDate(inv.createdAt)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  {totalRemaining > 0 && (
                    <div className="px-4 py-3 border-t bg-red-50 flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700">Total restant à payer</span>
                      <span className="text-sm font-bold text-red-700">{fmtCurrency(totalRemaining)}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── Tab: Constantes ─── */}
        {activeTab === 'constantes' && (
          <div className="space-y-4">
            {/* Last vitals highlight card */}
            {lastVitals && (
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Dernières constantes — {fmtDateTime(lastVitals.createdAt)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Poids</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.weight != null ? `${lastVitals.weight}` : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">kg</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Taille</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.height != null ? `${lastVitals.height}` : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">cm</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Température</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.temperature != null ? `${lastVitals.temperature}` : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">°C</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">TA</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.bloodPressureSystolic != null
                          ? `${lastVitals.bloodPressureSystolic}/${lastVitals.bloodPressureDiastolic}`
                          : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">mmHg</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">FC</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.heartRate != null ? `${lastVitals.heartRate}` : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">bpm</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.oxygenSaturation != null ? `${lastVitals.oxygenSaturation}` : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">%</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">FR</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {lastVitals.respiratoryRate != null ? `${lastVitals.respiratoryRate}` : '—'}
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">/min</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vitals history table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Historique des constantes ({patient.vitals?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {(!patient.vitals || patient.vitals.length === 0) ? (
                  <div className="text-center py-12">
                    <Activity className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Aucune mesure enregistrée</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Poids</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">Taille</TableHead>
                          <TableHead className="text-xs">Temp.</TableHead>
                          <TableHead className="text-xs">TA</TableHead>
                          <TableHead className="text-xs hidden md:table-cell">FC</TableHead>
                          <TableHead className="text-xs hidden md:table-cell">SpO2</TableHead>
                          <TableHead className="text-xs hidden lg:table-cell">FR</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patient.vitals.map((v: any) => (
                          <TableRow key={v.id}>
                            <TableCell className="text-xs">{fmtDateTime(v.createdAt)}</TableCell>
                            <TableCell className="text-xs">{v.weight != null ? `${v.weight} kg` : '—'}</TableCell>
                            <TableCell className="text-xs hidden sm:table-cell">{v.height != null ? `${v.height} cm` : '—'}</TableCell>
                            <TableCell className="text-xs">{v.temperature != null ? `${v.temperature} °C` : '—'}</TableCell>
                            <TableCell className="text-xs">
                              {v.bloodPressureSystolic != null ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}` : '—'}
                            </TableCell>
                            <TableCell className="text-xs hidden md:table-cell">
                              {v.heartRate != null ? `${v.heartRate} bpm` : '—'}
                            </TableCell>
                            <TableCell className="text-xs hidden md:table-cell">
                              {v.oxygenSaturation != null ? `${v.oxygenSaturation}%` : '—'}
                            </TableCell>
                            <TableCell className="text-xs hidden lg:table-cell">
                              {v.respiratoryRate != null ? `${v.respiratoryRate}/min` : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ─── Transfer Dialog ─── */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Transférer le dossier
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Hôpital de destination *</Label>
              <Select value={transferHospitalId} onValueChange={setTransferHospitalId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un hôpital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((h: any) => (
                    <SelectItem key={h.id} value={h.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        {h.name} {h.city ? `— ${h.city}` : ''}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Motif du transfert</Label>
              <Textarea
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="Raison du transfert du dossier..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>Annuler</Button>
            <Button
              onClick={sendTransfer}
              disabled={!transferHospitalId || transferSending}
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {transferSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}