'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Heart, Search, Loader2, Stethoscope, Pill, Receipt, Activity } from 'lucide-react'

import { fmtCurrency, fmtDate, fmtDateTime } from '@/lib/helpers'
import { STATUS_INVOICE } from '@/lib/constants'
import { CardSkeleton } from '@/components/ui/skeletons'

export default function DmeView() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSearch = useCallback(async (q: string) => {
    setSearch(q)
    if (q.length < 2) { setSearchResults([]); setShowDropdown(false); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSearchResults(data.data || [])
      setShowDropdown(true)
    } catch { setSearchResults([]) } finally { setSearching(false) }
  }, [])

  const selectPatient = async (p: any) => {
    setSelectedPatient(null)
    setShowDropdown(false)
    setSearch(`${p.firstName} ${p.lastName}`)
    setLoading(true)
    try {
      const res = await fetch(`/api/patients/${p.id}`)
      if (res.ok) {
        setSelectedPatient(await res.json())
      } else {
        toast.error('Patient non trouvé')
      }
    } catch { toast.error('Erreur de chargement du dossier') } finally { setLoading(false) }
  }

  const getAge = (dob: string | null) => {
    if (!dob) return '—'
    const d = new Date(dob)
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
    return `${age} ans`
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Dossier Médical Électronique</h1>
        <p className="text-muted-foreground text-sm mt-1">Rechercher un patient pour accéder à son dossier complet</p>
      </div>

      {/* Patient Search */}
      <div className="relative max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou numéro de dossier..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((p: any) => (
              <button
                key={p.id}
                className="w-full text-left px-3 py-2 hover:bg-muted/80 transition-colors flex items-center gap-3 text-sm"
                onClick={() => selectPatient(p)}
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{p.firstName} {p.lastName}</span>
                  <span className="text-muted-foreground ml-2">({p.folderNumber})</span>
                </div>
                <span className="text-xs text-muted-foreground">{p.phone}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <CardSkeleton />}

      {selectedPatient && !loading && (
        <div className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nom complet</p>
                  <p className="text-sm font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">N° Dossier</p>
                  <p className="text-sm font-mono font-medium">{selectedPatient.folderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Âge</p>
                  <p className="text-sm font-medium">{getAge(selectedPatient.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sexe</p>
                  <p className="text-sm font-medium">{selectedPatient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Groupe Sanguin</p>
                  <p className="text-sm font-medium">{selectedPatient.bloodType || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="text-sm font-medium">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Adresse</p>
                  <p className="text-sm font-medium">{selectedPatient.address || '—'}{selectedPatient.city ? `, ${selectedPatient.city}` : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assurance</p>
                  <p className="text-sm font-medium">{selectedPatient.insuranceProvider || '—'} {selectedPatient.insuranceNumber ? `(${selectedPatient.insuranceNumber})` : ''}</p>
                </div>
              </div>
              {(selectedPatient.allergies || selectedPatient.medicalHistory) && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  {selectedPatient.allergies && (
                    <div>
                      <p className="text-xs text-muted-foreground">Allergies</p>
                      <p className="text-sm font-medium text-red-700">{selectedPatient.allergies}</p>
                    </div>
                  )}
                  {selectedPatient.medicalHistory && (
                    <div>
                      <p className="text-xs text-muted-foreground">Antécédents médicaux</p>
                      <p className="text-sm">{selectedPatient.medicalHistory}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Consultations ({selectedPatient.consultations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!selectedPatient.consultations || selectedPatient.consultations.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Aucune consultation</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Médecin</TableHead>
                      <TableHead className="text-xs">Motif</TableHead>
                      <TableHead className="text-xs">Diagnostic</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPatient.consultations.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-xs">{fmtDateTime(c.createdAt)}</TableCell>
                        <TableCell className="text-xs">Dr. {c.staff?.firstName} {c.staff?.lastName}</TableCell>
                        <TableCell className="text-xs max-w-[180px] truncate">{c.chiefComplaint || '—'}</TableCell>
                        <TableCell className="text-xs max-w-[180px] truncate">{c.diagnosis || '—'}</TableCell>
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
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                Ordonnances ({selectedPatient.prescriptions?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!selectedPatient.prescriptions || selectedPatient.prescriptions.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Aucune ordonnance</div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedPatient.prescriptions.map((rx: any) => (
                    <div key={rx.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{fmtDateTime(rx.createdAt)}</span>
                        <span className="text-muted-foreground">Dr. {rx.staff?.firstName} {rx.staff?.lastName}</span>
                      </div>
                      {rx.items && rx.items.length > 0 && (
                        <div className="text-xs space-y-1">
                          {rx.items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4">
                              <span className="font-medium">{item.medicationName}</span>
                              <span className="text-muted-foreground">{item.dosage} — {item.frequency} — {item.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Factures ({selectedPatient.invoices?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!selectedPatient.invoices || selectedPatient.invoices.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Aucune facture</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">N° Facture</TableHead>
                      <TableHead className="text-xs">Montant</TableHead>
                      <TableHead className="text-xs">Payé</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPatient.invoices.map((inv: any) => {
                      const st = STATUS_INVOICE[inv.status] || STATUS_INVOICE.impayee
                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="text-xs font-mono">{inv.invoiceNumber}</TableCell>
                          <TableCell className="text-xs font-medium">{fmtCurrency(inv.totalAmount)}</TableCell>
                          <TableCell className="text-xs">{fmtCurrency(inv.paidAmount)}</TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className={st.className}>{st.label}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">{fmtDate(inv.createdAt)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Vital Signs History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Constantes Vitales ({selectedPatient.vitals?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!selectedPatient.vitals || selectedPatient.vitals.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Aucune mesure enregistrée</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Poids</TableHead>
                        <TableHead className="text-xs">Taille</TableHead>
                        <TableHead className="text-xs">Température</TableHead>
                        <TableHead className="text-xs">TA</TableHead>
                        <TableHead className="text-xs">FC</TableHead>
                        <TableHead className="text-xs">SpO2</TableHead>
                        <TableHead className="text-xs">FR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPatient.vitals.map((v: any) => (
                        <TableRow key={v.id}>
                          <TableCell className="text-xs">{fmtDateTime(v.createdAt)}</TableCell>
                          <TableCell className="text-xs">{v.weight != null ? `${v.weight} kg` : '—'}</TableCell>
                          <TableCell className="text-xs">{v.height != null ? `${v.height} cm` : '—'}</TableCell>
                          <TableCell className="text-xs">{v.temperature != null ? `${v.temperature} °C` : '—'}</TableCell>
                          <TableCell className="text-xs">{v.bloodPressureSystolic != null ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}` : '—'}</TableCell>
                          <TableCell className="text-xs">{v.heartRate != null ? `${v.heartRate} bpm` : '—'}</TableCell>
                          <TableCell className="text-xs">{v.oxygenSaturation != null ? `${v.oxygenSaturation}%` : '—'}</TableCell>
                          <TableCell className="text-xs">{v.respiratoryRate != null ? `${v.respiratoryRate}/min` : '—'}</TableCell>
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
  )
}