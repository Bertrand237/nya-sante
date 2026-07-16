'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { FileText, Search, Eye, Clock, Printer } from 'lucide-react'

import { fmtDate, fmtDateTime } from '@/lib/helpers'
import { STATUS_PRESCRIPTION } from '@/lib/constants'
import { TableSkeleton } from '@/components/ui/skeletons'

export default function PrescriptionsView() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [selectedRx, setSelectedRx] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const loadPrescriptions = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      const res = await fetch(`/api/prescriptions?${params}`)
      if (res.ok) {
        const json = await res.json()
        setPrescriptions(json.data || [])
        setPagination(json.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
      }
    } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
  }, [search, dateFrom, dateTo])

  useEffect(() => { loadPrescriptions(1) }, [loadPrescriptions])

  const handleSearch = () => { loadPrescriptions(1) }

  const handleClearFilters = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setTimeout(() => loadPrescriptions(1), 0)
  }

  const openDetail = (rx: any) => {
    setSelectedRx(rx)
    setDetailOpen(true)
  }

  const handlePrint = (rx: any) => {
    const patient = rx.patient
    const staff = rx.staff
    const items = rx.items || []
    const diagnosis = rx.consultation?.diagnosis || ''

    const printHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ordonnance - ${patient.firstName} ${patient.lastName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px double #047857; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; color: #047857; margin-bottom: 4px; }
    .header p { font-size: 13px; color: #555; }
    .title { text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; color: #047857; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; font-size: 13px; }
    .info-grid .label { font-weight: 600; color: #333; }
    .info-grid .value { color: #555; }
    .diagnosis { background: #f0fdf4; border-left: 3px solid #047857; padding: 10px 14px; margin-bottom: 24px; font-size: 13px; }
    .diagnosis strong { color: #047857; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { background: #047857; color: white; padding: 8px 10px; text-align: left; font-weight: 600; }
    td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #777; }
    .signature { text-align: center; margin-top: 50px; }
    .signature-line { border-top: 1px solid #333; width: 250px; padding-top: 6px; font-size: 13px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Clinique Centrale NYA</h1>
    <p>Douala, Cameroun</p>
    <p style="font-size:11px; margin-top:4px;">Tél : +237 233 456 789</p>
  </div>

  <div class="title">Ordonnance Médicale</div>

  <div class="info-grid">
    <div><span class="label">Patient :</span> <span class="value">${patient.firstName} ${patient.lastName}</span></div>
    <div><span class="label">N° Dossier :</span> <span class="value">${patient.folderNumber}</span></div>
    <div><span class="label">Médecin :</span> <span class="value">Dr. ${staff.firstName} ${staff.lastName}${staff.specialty ? ' (' + staff.specialty + ')' : ''}</span></div>
    <div><span class="label">Date :</span> <span class="value">${new Date(rx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
  </div>

  ${diagnosis ? `<div class="diagnosis"><strong>Diagnostic :</strong> ${diagnosis}</div>` : ''}

  <table>
    <thead>
      <tr>
        <th>N°</th>
        <th>Médicament</th>
        <th>Posologie</th>
        <th>Fréquence</th>
        <th>Durée</th>
        <th>Instructions</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item: any, i: number) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${item.medicationName}</strong></td>
          <td>${item.dosage}</td>
          <td>${item.frequency}</td>
          <td>${item.duration}</td>
          <td>${item.instructions || '—'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${rx.notes ? `<p style="font-size:13px; margin-bottom:20px;"><strong>Notes :</strong> ${rx.notes}</p>` : ''}

  <div class="footer">
    <div class="signature">
      <div class="signature-line">Dr. ${staff.firstName} ${staff.lastName}</div>
      <p style="margin-top:4px; font-size:11px; color:#777;">${staff.specialty || 'Médecin'}${staff.licenseNumber ? ' — N° ' + staff.licenseNumber : ''}</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:11px;">Clinique Centrale NYA</p>
      <p style="font-size:11px;">Douala, Cameroun</p>
    </div>
  </div>

  <div class="no-print" style="margin-top:30px; text-align:center;">
    <button onclick="window.print()" style="padding:10px 30px; background:#047857; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px;">
      Imprimer cette ordonnance
    </button>
  </div>
</body>
</html>`

    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (printWindow) {
      printWindow.document.write(printHtml)
      printWindow.document.close()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Ordonnances</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {loading ? 'Chargement...' : `${pagination.total} ordonnance${pagination.total > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom du patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
                placeholder="Du"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
                placeholder="Au"
              />
            </div>
            <Button onClick={handleSearch} size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0">
              <Search className="w-4 h-4 mr-1.5" />
              Rechercher
            </Button>
            {(search || dateFrom || dateTo) && (
              <Button onClick={handleClearFilters} variant="ghost" size="sm" className="shrink-0">
                Effacer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (
            <>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Patient</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Médecin</TableHead>
                      <TableHead className="text-xs">Médicaments</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((rx: any) => {
                      const st = STATUS_PRESCRIPTION[rx.status] || STATUS_PRESCRIPTION.active
                      return (
                        <TableRow
                          key={rx.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openDetail(rx)}
                        >
                          <TableCell className="text-xs">{fmtDate(rx.createdAt)}</TableCell>
                          <TableCell className="text-xs">
                            <div className="font-medium">{rx.patient?.firstName} {rx.patient?.lastName}</div>
                            <div className="text-muted-foreground text-[10px]">{rx.patient?.folderNumber}</div>
                          </TableCell>
                          <TableCell className="text-xs hidden md:table-cell">
                            Dr. {rx.staff?.firstName} {rx.staff?.lastName}
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="secondary" className="font-normal">
                              {rx.items?.length || 0} médicament{rx.items?.length > 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className={st.className}>{st.label}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7"
                              onClick={(e) => { e.stopPropagation(); openDetail(rx) }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {prescriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                          <p className="text-sm font-medium text-muted-foreground mb-1">Aucune ordonnance trouvée</p>
                          <p className="text-xs text-muted-foreground/70">Les ordonnances sont créées depuis les consultations</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    {pagination.page} / {pagination.totalPages} pages — {pagination.total} résultat{pagination.total > 1 ? 's' : ''}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={pagination.page <= 1}
                      onClick={() => loadPrescriptions(pagination.page - 1)}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadPrescriptions(pagination.page + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Prescription Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedRx && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Détails de l&apos;ordonnance
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Patient & Doctor Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Patient</p>
                    <p className="text-sm font-semibold">{selectedRx.patient?.firstName} {selectedRx.patient?.lastName}</p>
                    <p className="text-xs text-muted-foreground">Dossier : {selectedRx.patient?.folderNumber} — Tél : {selectedRx.patient?.phone || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Médecin</p>
                    <p className="text-sm font-semibold">Dr. {selectedRx.staff?.firstName} {selectedRx.staff?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{selectedRx.staff?.specialty || ''}{selectedRx.staff?.licenseNumber ? ` — N° ${selectedRx.staff.licenseNumber}` : ''}</p>
                  </div>
                </div>

                {/* Date & Status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {fmtDateTime(selectedRx.createdAt)}
                  </div>
                  <Badge variant="outline" className={STATUS_PRESCRIPTION[selectedRx.status]?.className}>
                    {STATUS_PRESCRIPTION[selectedRx.status]?.label || selectedRx.status}
                  </Badge>
                </div>

                {/* Diagnosis */}
                {selectedRx.consultation?.diagnosis && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 mb-1">Diagnostic</p>
                    <p className="text-sm">{selectedRx.consultation.diagnosis}</p>
                  </div>
                )}

                {/* Medications Table */}
                <div>
                  <p className="text-sm font-semibold mb-2">
                    Médicaments prescrits ({selectedRx.items?.length || 0})
                  </p>
                  {selectedRx.items && selectedRx.items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Médicament</TableHead>
                          <TableHead className="text-xs">Posologie</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">Fréquence</TableHead>
                          <TableHead className="text-xs">Durée</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">Instructions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRx.items.map((item: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-medium">{item.medicationName}</TableCell>
                            <TableCell className="text-xs">{item.dosage}</TableCell>
                            <TableCell className="text-xs hidden sm:table-cell">{item.frequency}</TableCell>
                            <TableCell className="text-xs">{item.duration}</TableCell>
                            <TableCell className="text-xs hidden sm:table-cell">{item.instructions || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun médicament prescrit</p>
                  )}
                </div>

                {/* Notes */}
                {selectedRx.notes && (
                  <div>
                    <p className="text-xs font-semibold mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedRx.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Fermer
                </Button>
                <Button
                  onClick={() => handlePrint(selectedRx)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}