'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { CardSkeleton } from '@/components/ui/skeletons'
import {
  Send, ArrowRight, ArrowLeft, Loader2, CheckCircle2, XCircle,
  Ban, Building2, UserCircle, FileText, AlertCircle,
} from 'lucide-react'

import { fmtDateTime } from '@/lib/helpers'
import { STATUS_TRANSFER } from '@/lib/constants'

export default function TransfersView() {
  const { user } = useAppStore()

  const [direction, setDirection] = useState<'outgoing' | 'incoming'>('outgoing')
  const [transfers, setTransfers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Detail dialog
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [responseNotes, setResponseNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const loadTransfers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/transfers?direction=${direction}`)
      if (res.ok) {
        const data = await res.json()
        setTransfers(Array.isArray(data) ? data : [])
      }
    } catch {
      toast.error('Erreur de chargement des transferts')
    } finally {
      setLoading(false)
    }
  }, [direction])

  useEffect(() => { loadTransfers() }, [loadTransfers])

  const openDetail = (t: any) => {
    setSelectedTransfer(t)
    setResponseNotes('')
    setDetailOpen(true)
  }

  const handleAction = async (action: 'accepte' | 'refuse' | 'annule') => {
    if (!selectedTransfer || !user) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/transfers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTransfer.id,
          action,
          respondedBy: user.id,
          responseNotes: responseNotes || undefined,
        }),
      })
      if (res.ok) {
        const labels: Record<string, string> = {
          accepte: 'Transfert accepté',
          refuse: 'Transfert refusé',
          annule: 'Transfert annulé',
        }
        toast.success(labels[action])
        setDetailOpen(false)
        setSelectedTransfer(null)
        loadTransfers()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur')
      }
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setActionLoading(false)
    }
  }

  const parsePatientData = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr)
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Transferts Inter-Hospitaliers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérer les transferts de dossiers patients entre établissements
        </p>
      </div>

      {/* Direction tabs */}
      <div className="flex gap-1">
        <button
          onClick={() => setDirection('outgoing')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            direction === 'outgoing'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Envoyés
        </button>
        <button
          onClick={() => setDirection('incoming')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            direction === 'incoming'
              ? 'bg-sky-100 text-sky-700 border border-sky-200'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Reçus
        </button>
      </div>

      {/* Table */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <CardSkeleton />
          ) : transfers.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {direction === 'outgoing'
                  ? 'Aucun transfert envoyé'
                  : 'Aucun transfert reçu'}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {direction === 'outgoing'
                  ? 'Transférez un dossier patient depuis le DME'
                  : 'Les demandes de transfert entrantes apparaîtront ici'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Patient</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">De → Vers</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Motif</TableHead>
                    <TableHead className="text-xs hidden lg:table-cell">Demandé par</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                    <TableHead className="text-xs w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((t: any) => {
                    const st = STATUS_TRANSFER[t.status] || STATUS_TRANSFER.en_attente
                    const isIncoming = direction === 'incoming'
                    const isPending = t.status === 'en_attente'
                    return (
                      <TableRow
                        key={t.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openDetail(t)}
                      >
                        <TableCell className="text-xs whitespace-nowrap">{fmtDateTime(t.requestedAt)}</TableCell>
                        <TableCell className="text-xs">
                          <div>
                            <span className="font-medium">{t.patient?.firstName} {t.patient?.lastName}</span>
                            <span className="text-muted-foreground ml-1.5 font-mono text-[10px]">
                              {t.patient?.folderNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="max-w-[100px] truncate">{t.fromHospital?.name}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="max-w-[100px] truncate">{t.toHospital?.name}</span>
                            <span className="text-muted-foreground text-[10px]">
                              ({t.toHospital?.city})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate hidden md:table-cell">
                          {t.reason || '—'}
                        </TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">
                          Dr. {t.requester?.firstName} {t.requester?.lastName}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className={st.className}>{st.label}</Badge>
                        </TableCell>
                        <TableCell className="text-xs p-1">
                          {isPending && (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              {isIncoming ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => { setSelectedTransfer(t); setResponseNotes(t.responseNotes || ''); setDetailOpen(true) }}
                                    title="Accepter"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => { setSelectedTransfer(t); setResponseNotes(t.responseNotes || ''); setDetailOpen(true) }}
                                    title="Refuser"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                  onClick={() => { setSelectedTransfer(t); setResponseNotes(t.responseNotes || ''); setDetailOpen(true) }}
                                  title="Annuler"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          )}
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

      {/* ─── Detail Dialog ─── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTransfer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Détails du transfert
                </DialogTitle>
              </DialogHeader>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={
                  STATUS_TRANSFER[selectedTransfer.status]?.className || ''
                }>
                  {STATUS_TRANSFER[selectedTransfer.status]?.label || selectedTransfer.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {fmtDateTime(selectedTransfer.requestedAt)}
                </span>
              </div>

              {/* Patient info from JSON snapshot */}
              {(() => {
                const pd = parsePatientData(selectedTransfer.patientData)
                if (!pd) return null
                return (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-sky-600" />
                        Données Patient
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-medium">{pd.firstName} {pd.lastName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">N° Dossier</p>
                          <p className="text-sm font-mono">{pd.folderNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Téléphone</p>
                          <p className="text-sm">{pd.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sexe</p>
                          <p className="text-sm">{pd.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Groupe sanguin</p>
                          <p className="text-sm">{pd.bloodType || '—'}</p>
                        </div>
                        {pd.allergies && (
                          <div>
                            <p className="text-xs text-muted-foreground">Allergies</p>
                            <p className="text-sm text-red-700">{pd.allergies}</p>
                          </div>
                        )}
                        {pd.medicalHistory && (
                          <div className="sm:col-span-2">
                            <p className="text-xs text-muted-foreground">Antécédents</p>
                            <p className="text-sm">{pd.medicalHistory}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}

              {/* Transfer info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Informations du transfert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Hôpital source</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        {selectedTransfer.fromHospital?.name}
                        {selectedTransfer.fromHospital?.city && (
                          <span className="text-muted-foreground">— {selectedTransfer.fromHospital.city}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hôpital destination</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        {selectedTransfer.toHospital?.name}
                        {selectedTransfer.toHospital?.city && (
                          <span className="text-muted-foreground">— {selectedTransfer.toHospital.city}</span>
                        )}
                      </p>
                    </div>
                    {selectedTransfer.reason && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Motif</p>
                        <p className="text-sm">{selectedTransfer.reason}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Demandé par</p>
                      <p className="text-sm">
                        Dr. {selectedTransfer.requester?.firstName} {selectedTransfer.requester?.lastName}
                        <span className="text-muted-foreground ml-1">
                          ({selectedTransfer.requester?.role?.label})
                        </span>
                      </p>
                    </div>
                    {selectedTransfer.responder && (
                      <div>
                        <p className="text-xs text-muted-foreground">Répondu par</p>
                        <p className="text-sm">
                          Dr. {selectedTransfer.responder?.firstName} {selectedTransfer.responder?.lastName}
                          {selectedTransfer.respondedAt && (
                            <span className="text-muted-foreground ml-1">
                              — {fmtDateTime(selectedTransfer.respondedAt)}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {selectedTransfer.responseNotes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Notes de réponse</p>
                        <p className="text-sm">{selectedTransfer.responseNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action buttons for pending transfers */}
              {selectedTransfer.status === 'en_attente' && (
                <div className="space-y-3 pt-2">
                  <Label className="text-xs">Notes de réponse</Label>
                  <Textarea
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    placeholder="Ajouter des notes (optionnel)..."
                    rows={2}
                  />
                  <DialogFooter>
                    {direction === 'incoming' && (
                      <>
                        <Button
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleAction('refuse')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                          Refuser
                        </Button>
                        <Button
                          className="bg-emerald-700 hover:bg-emerald-800 text-white"
                          onClick={() => handleAction('accepte')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                          Accepter
                        </Button>
                      </>
                    )}
                    {direction === 'outgoing' && (
                      <Button
                        variant="outline"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                        onClick={() => handleAction('annule')}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
                        Annuler la demande
                      </Button>
                    )}
                  </DialogFooter>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}