'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Receipt, Search, Eye, AlertTriangle, CheckCircle2, CreditCard, Loader2, Printer, X, DollarSign, Smartphone } from 'lucide-react'

import { fmtCurrency, fmtDate, fmtDateTime } from '@/lib/helpers'
import { STATUS_INVOICE } from '@/lib/constants'
import { TableSkeleton } from '@/components/ui/skeletons'

const PAYMENT_METHODS = [
  { value: 'espece', label: 'Espèces', icon: DollarSign },
  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
  { value: 'carte', label: 'Carte bancaire', icon: CreditCard },
  { value: 'virement', label: 'Virement', icon: DollarSign },
]

const MM_OPERATORS = [
  { value: 'MTN Mobile Money', label: 'MTN Mobile Money', color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
  { value: 'Orange Money', label: 'Orange Money', color: 'bg-orange-50 border-orange-300 text-orange-800' },
]

export default function InvoicesView() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Payment dialog state
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [payInvoice, setPayInvoice] = useState<any>(null)
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('espece')
  const [payProvider, setPayProvider] = useState('MTN Mobile Money')
  const [payPhone, setPayPhone] = useState('')
  const [payReference, setPayReference] = useState('')
  const [payLoading, setPayLoading] = useState(false)

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailInvoice, setDetailInvoice] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const { user } = useAppStore()

  const loadInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('q', search)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      const res = await fetch(`/api/invoices?${params.toString()}`)
      const json = await res.json()
      setInvoices(json.data || json)
      setSummary(json.summary || null)
    } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
  }, [statusFilter, search, dateFrom, dateTo])

  useEffect(() => { loadInvoices() }, [loadInvoices])

  const hasFilters = statusFilter || search || dateFrom || dateTo
  const clearFilters = () => { setStatusFilter(''); setSearch(''); setDateFrom(''); setDateTo('') }

  const openPayDialog = (inv: any) => {
    const remaining = Math.ceil(inv.totalAmount - inv.paidAmount)
    setPayInvoice(inv)
    setPayAmount(String(remaining))
    setPayMethod('espece')
    setPayProvider('MTN Mobile Money')
    setPayPhone('')
    setPayReference('')
    setPayDialogOpen(true)
  }

  const handlePay = async () => {
    const amount = parseFloat(payAmount)
    if (!amount || amount <= 0) {
      toast.error('Veuillez entrer un montant valide')
      return
    }
    if (payMethod === 'mobile_money' && !payPhone) {
      toast.error('Veuillez entrer le numéro de téléphone')
      return
    }

    setPayLoading(true)
    try {
      const res = await fetch(`/api/invoices/${payInvoice.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          method: payMethod,
          provider: payMethod === 'mobile_money' ? payProvider : undefined,
          phone: payMethod === 'mobile_money' ? payPhone : undefined,
          reference: payReference || undefined,
          userId: user?.id,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors du paiement')
        return
      }
      toast.success(`Paiement de ${fmtCurrency(amount)} enregistré avec succès`)
      setPayDialogOpen(false)
      loadInvoices()
    } catch {
      toast.error('Erreur de connexion')
    } finally { setPayLoading(false) }
  }

  const openDetail = async (inv: any) => {
    setDetailInvoice(inv)
    setDetailDialogOpen(true)
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/invoices/${inv.id}`)
      const data = await res.json()
      setDetailInvoice(data)
    } catch { toast.error('Erreur de chargement') } finally { setDetailLoading(false) }
  }

  const handlePrint = () => {
    window.print()
  }

  const remaining = payInvoice ? Math.ceil(payInvoice.totalAmount - payInvoice.paidAmount) : 0

  // Computed totals from current filtered invoices
  const totalFiltered = invoices.reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const paidFiltered = invoices.reduce((s: number, i: any) => s + (i.paidAmount || 0), 0)
  const remainingFiltered = totalFiltered - paidFiltered

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Facturation</h1>
          <p className="text-muted-foreground text-sm mt-1">{invoices.length} facture{invoices.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Summary cards */}
      {!loading && summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Facturé</p>
                <p className="text-lg font-bold mt-1">{fmtCurrency(summary.totalInvoiced || totalFiltered)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Payé</p>
                <p className="text-lg font-bold mt-1 text-emerald-600">{fmtCurrency(summary.totalPaid || paidFiltered)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Restant</p>
                <p className="text-lg font-bold mt-1 text-red-600">{fmtCurrency(summary.totalRemaining || remainingFiltered)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters row */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par patient ou N°..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="impayee">Impayées</SelectItem>
              <SelectItem value="partiellement_payee">Partiellement payées</SelectItem>
              <SelectItem value="payee">Payées</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[150px]" placeholder="Du" />
            <span className="text-xs text-muted-foreground">→</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[150px]" placeholder="Au" />
          </div>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearFilters}>
            <X className="w-3 h-3 mr-1" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">N° Facture</TableHead>
                    <TableHead className="text-xs">Patient</TableHead>
                    <TableHead className="text-xs">Montant</TableHead>
                    <TableHead className="text-xs">Payé</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                    <TableHead className="text-xs">Méthode</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv: any) => {
                    const st = STATUS_INVOICE[inv.status] || STATUS_INVOICE.impayee
                    const canPay = inv.status === 'impayee' || inv.status === 'partiellement_payee'
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="text-xs font-mono font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell className="text-xs">
                          {inv.patient?.firstName} {inv.patient?.lastName}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{fmtCurrency(inv.totalAmount)}</TableCell>
                        <TableCell className="text-xs">{fmtCurrency(inv.paidAmount)}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className={st.className}>{st.label}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{inv.paymentMethod || '—'}</TableCell>
                        <TableCell className="text-xs">{fmtDate(inv.createdAt)}</TableCell>
                        <TableCell className="text-xs text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openDetail(inv)}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {canPay && (
                              <Button variant="default" size="sm" className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => openPayDialog(inv)}>
                                Payer
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        Aucune facture
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ PAYMENT DIALOG ═══ */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Enregistrer un paiement
            </DialogTitle>
          </DialogHeader>

          {payInvoice && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Facture</span>
                  <span className="font-mono font-medium">{payInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Patient</span>
                  <span className="font-medium">{payInvoice.patient?.firstName} {payInvoice.patient?.lastName}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant total</span>
                  <span className="font-medium">{fmtCurrency(payInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Déjà payé</span>
                  <span className="font-medium text-emerald-600">{fmtCurrency(payInvoice.paidAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Reste à payer</span>
                  <span className="text-red-600">{fmtCurrency(remaining)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Montant du paiement (FCFA)</Label>
                <Input
                  type="number"
                  min={1}
                  max={remaining}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={String(remaining)}
                />
              </div>

              <div className="space-y-2">
                <Label>Méthode de paiement</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPayMethod(m.value)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        payMethod === m.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {payMethod === 'mobile_money' && (
                <div className="space-y-3 p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                  <p className="text-xs font-medium text-amber-700">Détails Mobile Money</p>
                  <div className="space-y-2">
                    <Label className="text-xs">Opérateur</Label>
                    <div className="flex gap-2">
                      {MM_OPERATORS.map((op) => (
                        <button
                          key={op.value}
                          type="button"
                          onClick={() => setPayProvider(op.value)}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                            payProvider === op.value
                              ? `${op.color} border-current`
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Numéro de téléphone</Label>
                    <Input
                      type="tel"
                      placeholder="6XXXXXXXX"
                      value={payPhone}
                      onChange={(e) => setPayPhone(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Référence <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
                <Input
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  placeholder="N° de reçu ou de transaction"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPayDialogOpen(false)}>Annuler</Button>
                <Button
                  onClick={handlePay}
                  disabled={payLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {payLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Enregistrer le paiement
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══ INVOICE DETAIL / PAYMENT HISTORY DIALOG ═══ */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                {detailInvoice?.invoiceNumber}
              </DialogTitle>
              <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
                <Printer className="w-4 h-4 mr-1" />
                Imprimer la facture
              </Button>
            </div>
          </DialogHeader>

          {detailLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : detailInvoice && (
            <div className="space-y-6 print:space-y-4" id="invoice-print">
              <div className="hidden print:block text-center border-b pb-4 mb-4">
                <h1 className="text-xl font-bold">Clinique Centrale NYA</h1>
                <p className="text-sm text-muted-foreground">Douala, Cameroun</p>
                <p className="text-lg font-semibold mt-2">FACTURE</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{detailInvoice.patient?.firstName} {detailInvoice.patient?.lastName}</p>
                  <p className="text-xs text-muted-foreground">Dossier: {detailInvoice.patient?.folderNumber}</p>
                  {detailInvoice.patient?.phone && (
                    <p className="text-xs text-muted-foreground">Tél: {detailInvoice.patient?.phone}</p>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">N° Facture</p>
                  <p className="font-mono font-medium">{detailInvoice.invoiceNumber}</p>
                  <p className="text-muted-foreground">Date: <span className="text-foreground">{fmtDate(detailInvoice.createdAt)}</span></p>
                  <Badge variant="outline" className={STATUS_INVOICE[detailInvoice.status]?.className}>
                    {STATUS_INVOICE[detailInvoice.status]?.label}
                  </Badge>
                </div>
              </div>

              <Separator />

              {detailInvoice.items && detailInvoice.items.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Détails de la facture</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Description</TableHead>
                        <TableHead className="text-xs text-right">Qté</TableHead>
                        <TableHead className="text-xs text-right">Prix unitaire</TableHead>
                        <TableHead className="text-xs text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailInvoice.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs">
                            <div className="font-medium">{item.label}</div>
                            {item.description && <div className="text-muted-foreground">{item.description}</div>}
                          </TableCell>
                          <TableCell className="text-xs text-right">{item.quantity}</TableCell>
                          <TableCell className="text-xs text-right">{fmtCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-xs text-right font-medium">{fmtCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 print:bg-gray-100">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{fmtCurrency(detailInvoice.amount)}</span>
                </div>
                {detailInvoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Remise</span>
                    <span>- {fmtCurrency(detailInvoice.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{fmtCurrency(detailInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Payé</span>
                  <span>{fmtCurrency(detailInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-red-600">
                  <span>Reste</span>
                  <span>{fmtCurrency(Math.ceil(detailInvoice.totalAmount - detailInvoice.paidAmount))}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-3">Historique des paiements</p>
                {detailInvoice.payments && detailInvoice.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Montant</TableHead>
                        <TableHead className="text-xs">Méthode</TableHead>
                        <TableHead className="text-xs">Opérateur</TableHead>
                        <TableHead className="text-xs">Référence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailInvoice.payments.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs">{fmtDateTime(p.createdAt)}</TableCell>
                          <TableCell className="text-xs font-medium text-emerald-600">{fmtCurrency(p.amount)}</TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className="text-xs">
                              {p.method === 'espece' ? 'Espèces' : p.method === 'mobile_money' ? 'Mobile Money' : p.method === 'carte' ? 'Carte' : 'Virement'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{p.provider || '—'}</TableCell>
                          <TableCell className="text-xs font-mono">{p.reference || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">Aucun paiement enregistré</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}