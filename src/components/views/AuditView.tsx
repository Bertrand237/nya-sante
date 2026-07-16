'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Shield, RefreshCw, Search } from 'lucide-react'

import { fmtDateTime } from '@/lib/helpers'
import { TableSkeleton } from '@/components/ui/skeletons'

const ACTION_BADGES: Record<string, { label: string; className: string }> = {
  CREATE: { label: 'Création', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  UPDATE: { label: 'Modification', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  DELETE: { label: 'Suppression', className: 'bg-red-100 text-red-800 border-red-300' },
  LOGIN: { label: 'Connexion', className: 'bg-purple-100 text-purple-800 border-purple-300' },
  PAYMENT: { label: 'Paiement', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  CREATE_PAYMENT: { label: 'Paiement', className: 'bg-amber-100 text-amber-800 border-amber-300' },
}

const ENTITY_LABELS: Record<string, string> = {
  Invoice: 'Facture',
  Payment: 'Paiement',
  Patient: 'Patient',
  Staff: 'Personnel',
  Appointment: 'Rendez-vous',
  Consultation: 'Consultation',
  Prescription: 'Ordonnance',
  Medication: 'Médicament',
  Department: 'Département',
  LabRequest: 'Analyse',
  VitalSign: 'Constantes',
  AuditLog: 'Audit',
}

export default function AuditView() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  // Filters
  const [filterAction, setFilterAction] = useState('')
  const [filterEntity, setFilterEntity] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterAction) params.set('action', filterAction)
      if (filterEntity) params.set('entity', filterEntity)
      if (search) params.set('search', search)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      params.set('page', String(page))
      params.set('limit', '50')

      const res = await fetch(`/api/audit?${params.toString()}`)
      const data = await res.json()
      setLogs(data.logs || [])
      setTotal(data.pagination?.total || 0)
    } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
  }, [filterAction, filterEntity, search, dateFrom, dateTo, page])

  useEffect(() => { loadLogs() }, [loadLogs])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => { loadLogs() }, 30000)
    return () => clearInterval(interval)
  }, [loadLogs])

  const totalPages = Math.ceil(total / 50)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Journal d&apos;audit</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} entrée{total > 1 ? 's' : ''} • Actualisation automatique toutes les 30s</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={filterAction} onValueChange={(v) => { setFilterAction(v === 'all' ? '' : v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                <SelectItem value="CREATE">Création</SelectItem>
                <SelectItem value="UPDATE">Modification</SelectItem>
                <SelectItem value="DELETE">Suppression</SelectItem>
                <SelectItem value="LOGIN">Connexion</SelectItem>
                <SelectItem value="PAYMENT">Paiement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEntity} onValueChange={(v) => { setFilterEntity(v === 'all' ? '' : v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Entité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entités</SelectItem>
                {Object.entries(ENTITY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} placeholder="Du" />
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} placeholder="Au" />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {loading && logs.length === 0 ? (
            <TableSkeleton rows={10} cols={5} />
          ) : (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="text-xs">Date/Heure</TableHead>
                    <TableHead className="text-xs">Utilisateur</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                    <TableHead className="text-xs">Entité</TableHead>
                    <TableHead className="text-xs">Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => {
                    const actionBadge = ACTION_BADGES[log.action] || { label: log.action, className: 'bg-gray-100 text-gray-800 border-gray-300' }
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs whitespace-nowrap">
                          <div className="font-medium">{fmtDateTime(log.createdAt)}</div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {log.staff ? (
                            <div>
                              <span className="font-medium">{log.staff.firstName} {log.staff.lastName}</span>
                              {log.staff.role?.label && (
                                <div className="text-muted-foreground">{log.staff.role.label}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Système</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className={actionBadge.className}>
                            {actionBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {ENTITY_LABELS[log.entity] || log.entity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate" title={log.details || ''}>
                          {log.details || '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground mb-1">Aucune entrée dans le journal d&apos;audit</p>
                        <p className="text-xs text-muted-foreground/70">Les actions des utilisateurs apparaîtront ici</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages} ({total} entrées)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}