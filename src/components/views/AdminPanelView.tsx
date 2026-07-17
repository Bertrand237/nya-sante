'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CardSkeleton } from '@/components/ui/skeletons'
import { Building2, Users, Heart, CheckCircle, AlertCircle, Calendar, Shield, Loader2, UserCircle, Stethoscope } from 'lucide-react'
import { fmtDate, fmtDateTime } from '@/lib/helpers'

interface HospitalData {
  id: string
  name: string
  type: string
  city: string
  phone: string
  ownerName: string
  patientCount: number
  staffCount: number
  departmentCount: number
  subscriptionEndsAt: string | null
  createdAt: string
}

const DURATION_BUTTONS = Array.from({ length: 12 }, (_, i) => i + 1)

const TYPE_LABELS: Record<string, string> = {
  clinique: 'Clinique',
  hopital: 'Hôpital',
  'centre de santé': 'Centre de santé',
}

const TYPE_STYLES: Record<string, string> = {
  clinique: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  hopital: 'bg-teal-100 text-teal-800 border-teal-300',
  'centre de santé': 'bg-cyan-100 text-cyan-800 border-cyan-300',
}

function getDurationButtonStyle(months: number): string {
  if (months <= 3) return 'bg-emerald-600 hover:bg-emerald-700 text-white'
  if (months <= 6) return 'bg-teal-600 hover:bg-teal-700 text-white'
  if (months <= 9) return 'bg-cyan-700 hover:bg-cyan-800 text-white'
  return 'bg-sky-700 hover:bg-sky-800 text-white'
}

function calculateEndDate(months: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d
}

function isSubscriptionActive(endsAt: string | null): boolean {
  if (!endsAt) return false
  return new Date(endsAt) > new Date()
}

export default function AdminPanelView() {
  const { user } = useAppStore()
  const [hospitals, setHospitals] = useState<HospitalData[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [notes, setNotes] = useState('')
  const [validating, setValidating] = useState(false)

  const isSuperAdmin = user?.role?.name === 'super_admin'

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/hospitals')
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      const mapped = (Array.isArray(data) ? data : []).map((h: any) => ({
        id: h.id,
        name: h.name,
        type: h.type,
        city: h.city,
        phone: h.phone,
        ownerName: h.ownerName,
        patientCount: h._count?.patients || 0,
        staffCount: h._count?.staff || 0,
        departmentCount: h._count?.departments || 0,
        subscriptionEndsAt: h.subscriptionEndsAt || null,
        createdAt: h.createdAt,
      }))
      setHospitals(mapped)
    } catch {
      toast.error('Impossible de charger les établissements')
      setHospitals([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHospitals()
  }, [fetchHospitals])

  const handleOpenDialog = (hospital: HospitalData, months: number) => {
    setSelectedHospital(hospital)
    setSelectedDuration(months)
    setNotes('')
    setDialogOpen(true)
  }

  const handleValidate = async () => {
    if (!selectedHospital) return
    setValidating(true)
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          durationMonths: selectedDuration,
          validatedBy: user?.id,
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la validation")
      }
      toast.success(`Abonnement de ${selectedDuration} mois validé pour ${selectedHospital.name}`)
      setDialogOpen(false)
      fetchHospitals()
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la validation')
    } finally {
      setValidating(false)
    }
  }

  const totalHospitals = hospitals.length
  const activeHospitals = hospitals.filter((h) => isSubscriptionActive(h.subscriptionEndsAt)).length
  const expiredHospitals = hospitals.filter((h) => !isSubscriptionActive(h.subscriptionEndsAt)).length

  const endDate = selectedHospital ? calculateEndDate(selectedDuration) : null

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Établissements</h1>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {totalHospitals} {totalHospitals > 1 ? 'établissements' : 'établissement'}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Plateforme SaaS NYA Santé — Gestion des abonnements
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-800">{totalHospitals}</p>
              <p className="text-xs text-emerald-600">Total établissements</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-800">{activeHospitals}</p>
              <p className="text-xs text-green-600">Établissements actifs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-800">{expiredHospitals}</p>
              <p className="text-xs text-red-600">Abonnements expirés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : hospitals.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">Aucun établissement enregistré</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital) => {
            const active = isSubscriptionActive(hospital.subscriptionEndsAt)
            return (
              <Card key={hospital.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold leading-tight">{hospital.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={TYPE_STYLES[hospital.type] || 'bg-gray-100 text-gray-700 border-gray-300 shrink-0'}
                    >
                      {TYPE_LABELS[hospital.type] || hospital.type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-3 pt-0">
                  {/* Location & contact */}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      {hospital.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                      {hospital.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <UserCircle className="h-3.5 w-3.5 shrink-0" />
                      {hospital.ownerName}
                    </p>
                  </div>

                  {/* Counts */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-pink-500" />
                      {hospital.patientCount} patients
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      {hospital.staffCount} pers.
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3 text-amber-500" />
                      {hospital.departmentCount} dép.
                    </span>
                  </div>

                  {/* Subscription Status */}
                  <div className="mt-auto pt-2 border-t">
                    {active ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Actif jusqu&apos;au {fmtDate(hospital.subscriptionEndsAt!)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 hover:bg-red-50">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {hospital.subscriptionEndsAt ? 'Expiré' : 'Non abonné'}
                      </Badge>
                    )}
                  </div>

                  {/* Validation Buttons (super_admin only) */}
                  {isSuperAdmin && (
                    <div className="pt-2">
                      <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">
                        <Shield className="h-3 w-3 inline mr-1 -mt-0.5" />
                        Valider l&apos;abonnement :
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {DURATION_BUTTONS.map((m) => (
                          <Button
                            key={m}
                            size="sm"
                            className={`h-7 px-2.5 text-[11px] font-medium ${getDurationButtonStyle(m)}`}
                            onClick={() => handleOpenDialog(hospital, m)}
                          >
                            {m}m
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Validation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Valider l&apos;abonnement
            </DialogTitle>
          </DialogHeader>

          {selectedHospital && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Établissement</p>
                <p className="text-sm text-muted-foreground">{selectedHospital.name}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Durée sélectionnée</p>
                <p className="text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-1">{selectedDuration} mois</Badge>
                  — jusqu&apos;au <span className="font-medium text-foreground">{endDate ? fmtDate(endDate) : '—'}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Notes (optionnel)</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Ajouter une note de validation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={validating}
            >
              Annuler
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleValidate}
              disabled={validating}
            >
              {validating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer la validation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}