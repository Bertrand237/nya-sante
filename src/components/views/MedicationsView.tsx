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
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Pill, Search, X, AlertTriangle, PackageCheck, PackageX, CheckCircle2, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

import { fmtCurrency, fmtDate } from '@/lib/helpers'
import { MED_CATEGORIES, MED_FORMS } from '@/lib/constants'
import { TableSkeleton } from '@/components/ui/skeletons'

type MedForm = {
  name: string
  genericName: string
  category: string
  form: string
  stockQuantity: string
  minStockAlert: string
  unitPrice: string
  salePrice: string
  supplier: string
  batchNumber: string
  expiryDate: string
}

const emptyForm: MedForm = {
  name: '', genericName: '', category: '', form: '',
  stockQuantity: '0', minStockAlert: '10', unitPrice: '0', salePrice: '0',
  supplier: '', batchNumber: '', expiryDate: '',
}

export default function MedicationsView() {
  const [medications, setMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<MedForm>(emptyForm)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/medications?q=${encodeURIComponent(search)}`)
      const data = await res.json()
      let filtered = data
      if (stockFilter === 'rupture') {
        filtered = data.filter((m: any) => m.stockQuantity === 0)
      } else if (stockFilter === 'faible') {
        filtered = data.filter((m: any) => m.stockQuantity > 0 && m.isLowStock)
      } else if (stockFilter === 'ok') {
        filtered = data.filter((m: any) => !m.isLowStock)
      }
      setMedications(filtered)
    } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
  }, [search, stockFilter])

  useEffect(() => { load() }, [load])

  // Load all for summary counts
  const [allMeds, setAllMeds] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/medications')
      .then(r => r.json())
      .then(data => setAllMeds(data))
      .catch(() => {})
  }, [])

  const inStock = allMeds.filter((m: any) => !m.isLowStock && m.stockQuantity > 0).length
  const lowStock = allMeds.filter((m: any) => m.isLowStock && m.stockQuantity > 0).length
  const outOfStock = allMeds.filter((m: any) => m.stockQuantity === 0).length

  const hasFilters = stockFilter
  const clearFilters = () => { setStockFilter('') }

  const updateForm = (field: keyof MedForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (med: any) => {
    setEditingId(med.id)
    setForm({
      name: med.name,
      genericName: med.genericName || '',
      category: med.category || '',
      form: med.form || '',
      stockQuantity: String(med.stockQuantity),
      minStockAlert: String(med.minStockAlert),
      unitPrice: String(med.unitPrice),
      salePrice: String(med.salePrice),
      supplier: med.supplier || '',
      batchNumber: med.batchNumber || '',
      expiryDate: med.expiryDate ? med.expiryDate.slice(0, 10) : '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Le nom du médicament est requis')
      return
    }
    if (!form.unitPrice || Number(form.unitPrice) < 0) {
      toast.error('Le prix d\'achat est requis')
      return
    }
    if (!form.salePrice || Number(form.salePrice) < 0) {
      toast.error('Le prix de vente est requis')
      return
    }

    setSaving(true)
    try {
      const body = {
        name: form.name,
        genericName: form.genericName || undefined,
        category: form.category || undefined,
        form: form.form || undefined,
        stockQuantity: Number(form.stockQuantity) || 0,
        minStockAlert: Number(form.minStockAlert) || 10,
        unitPrice: Number(form.unitPrice),
        salePrice: Number(form.salePrice),
        supplier: form.supplier || undefined,
        batchNumber: form.batchNumber || undefined,
        expiryDate: form.expiryDate || undefined,
      }

      const isEdit = !!editingId
      const url = isEdit ? '/api/medications' : '/api/medications'
      const method = isEdit ? 'PUT' : 'POST'
      const payload = isEdit ? { ...body, id: editingId } : body

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || 'Erreur serveur')
        return
      }

      toast.success(isEdit ? 'Médicament mis à jour' : 'Médicament créé avec succès')
      setDialogOpen(false)
      load()
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/medications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || 'Erreur')
        return
      }
      toast.success('Médicament supprimé')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pharmacie</h1>
          <p className="text-muted-foreground text-sm mt-1">{medications.length} médicament{medications.length > 1 ? 's' : ''} affiché{medications.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un médicament
        </Button>
      </div>

      {/* Stock summary badges */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5">
          <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
          {inStock} en stock
        </Badge>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          {lowStock} stock faible
        </Badge>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1.5">
          <PackageX className="w-3.5 h-3.5 mr-1.5" />
          {outOfStock} rupture
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un médicament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={stockFilter || 'all'} onValueChange={(v) => setStockFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Stock" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="ok">En stock</SelectItem>
              <SelectItem value="faible">Stock faible</SelectItem>
              <SelectItem value="rupture">Rupture</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearFilters}>
            <X className="w-3 h-3 mr-1" />
            Réinitialiser
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
                  <TableHead className="text-xs">Médicament</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Catégorie</TableHead>
                  <TableHead className="text-xs">Stock</TableHead>
                  <TableHead className="text-xs">Prix Vente</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Fournisseur</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Péremption</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med: any) => (
                  <TableRow key={med.id} className={med.isLowStock ? 'bg-red-50/50' : ''}>
                    <TableCell className="text-xs">
                      <div className="font-medium">{med.name}</div>
                      {med.genericName && <div className="text-muted-foreground">{med.genericName}</div>}
                    </TableCell>
                    <TableCell className="text-xs hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{med.category || '—'}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className={med.isLowStock ? 'font-bold text-red-700' : ''}>
                        {med.stockQuantity}
                      </span>
                      <span className="text-muted-foreground ml-1 hidden sm:inline">({med.minStockAlert} min)</span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{fmtCurrency(med.salePrice)}</TableCell>
                    <TableCell className="text-xs hidden md:table-cell">{med.supplier || '—'}</TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">{med.expiryDate ? fmtDate(med.expiryDate) : '—'}</TableCell>
                    <TableCell className="text-xs">
                      {med.stockQuantity === 0 ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                          <PackageX className="w-3 h-3 mr-1" />
                          Rupture
                        </Badge>
                      ) : med.isLowStock ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Stock bas
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          En stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(med)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteTarget(med)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {medications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      <Pill className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucun médicament trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open) }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le médicament' : 'Créer un médicament'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Nom *</Label>
              <Input value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="ex: Paracétamol 500mg" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Nom générique</Label>
              <Input value={form.genericName} onChange={(e) => updateForm('genericName', e.target.value)} placeholder="ex: Acétaminophène" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Catégorie</Label>
              <Select value={form.category} onValueChange={(v) => updateForm('category', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {MED_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Forme</Label>
              <Select value={form.form} onValueChange={(v) => updateForm('form', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {MED_FORMS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Stock</Label>
              <Input type="number" min="0" value={form.stockQuantity} onChange={(e) => updateForm('stockQuantity', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Stock minimum (alerte)</Label>
              <Input type="number" min="0" value={form.minStockAlert} onChange={(e) => updateForm('minStockAlert', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prix d&apos;achat (FCFA)</Label>
              <Input type="number" min="0" step="1" value={form.unitPrice} onChange={(e) => updateForm('unitPrice', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prix de vente (FCFA)</Label>
              <Input type="number" min="0" step="1" value={form.salePrice} onChange={(e) => updateForm('salePrice', e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Fournisseur</Label>
              <Input value={form.supplier} onChange={(e) => updateForm('supplier', e.target.value)} placeholder="ex: LaboPharma SARL" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">N° lot</Label>
              <Input value={form.batchNumber} onChange={(e) => updateForm('batchNumber', e.target.value)} placeholder="ex: LOT-2024-001" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de péremption</Label>
              <Input type="date" value={form.expiryDate} onChange={(e) => updateForm('expiryDate', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce médicament ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.name}</strong> ?
              Cette action est réversible, le médicament sera désactivé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}