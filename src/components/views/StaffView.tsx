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
import { Users, Plus, Loader2, X, Pencil, Power, PowerOff, Info, ShieldCheck } from 'lucide-react'

import { TableSkeleton } from '@/components/ui/skeletons'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  medecin_chef: 'Médecin Chef',
  medecin: 'Médecin',
  infirmier: 'Infirmier(e)',
  laborantin: 'Laborantin',
  pharmacien: 'Pharmacien(ne)',
  recepteur: 'Réceptionniste',
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800 border-purple-300',
  medecin_chef: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  medecin: 'bg-teal-100 text-teal-800 border-teal-300',
  infirmier: 'bg-sky-100 text-sky-800 border-sky-300',
  laborantin: 'bg-amber-100 text-amber-800 border-amber-300',
  pharmacien: 'bg-lime-100 text-lime-800 border-lime-300',
  recepteur: 'bg-gray-100 text-gray-700 border-gray-300',
}

type StaffForm = {
  firstName: string
  lastName: string
  phone: string
  pin: string
  email: string
  gender: string
  roleId: string
  departmentId: string
  specialty: string
  licenseNumber: string
}

const emptyForm: StaffForm = {
  firstName: '', lastName: '', phone: '', pin: '', email: '', gender: 'M',
  roleId: '', departmentId: '', specialty: '', licenseNumber: '',
}

export default function StaffView() {
  const [staffList, setStaffList] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deptFilter, setDeptFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [form, setForm] = useState<StaffForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (deptFilter) params.set('departmentId', deptFilter)
      if (roleFilter) params.set('roleId', roleFilter)
      if (statusFilter) params.set('status', statusFilter)
      const [sRes, dRes] = await Promise.all([
        fetch(`/api/staff?${params.toString()}`),
        fetch('/api/departments'),
      ])
      const sData = await sRes.json()
      const dData = await dRes.json()
      setStaffList(sData)
      setDepartments(dData)
      // Load roles from database
      const allRes = await fetch('/api/staff')
      const allData = await allRes.json()
      const roleMap = new Map<string, any>()
      allData.forEach((s: any) => {
        if (s.role && !roleMap.has(s.role.id)) roleMap.set(s.role.id, s.role)
      })
      setRoles(Array.from(roleMap.values()))
    } catch {
      toast.error('Erreur de chargement du personnel')
    } finally {
      setLoading(false)
    }
  }, [deptFilter, roleFilter, statusFilter])

  useEffect(() => { load() }, [load])

  const hasActiveFilters = deptFilter || roleFilter || statusFilter
  const clearFilters = () => { setDeptFilter(''); setRoleFilter(''); setStatusFilter('') }

  const updateForm = (f: keyof StaffForm, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (s: any) => {
    setEditingId(s.id)
    setForm({
      firstName: s.firstName || '',
      lastName: s.lastName || '',
      phone: s.phone || '',
      pin: s.pin || '',
      email: s.email || '',
      gender: s.gender || 'M',
      roleId: s.roleId || s.role?.id || '',
      departmentId: s.departmentId || s.department?.id || '',
      specialty: s.specialty || '',
      licenseNumber: s.licenseNumber || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.roleId) {
      toast.error('Prénom, nom, téléphone et rôle sont requis')
      return
    }
    if (!/^6\d{8}$/.test(form.phone)) {
      toast.error('Le téléphone doit commencer par 6 et comporter 9 chiffres')
      return
    }
    if (form.pin && !/^\d{6}$/.test(form.pin)) {
      toast.error('Le code PIN doit comporter exactement 6 chiffres')
      return
    }
    if (!editingId && !form.pin) {
      toast.error('Le code PIN est requis pour la création d\'un compte')
      return
    }

    setSaving(true)
    try {
      const body: Record<string, string | undefined> = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        pin: form.pin || undefined,
        email: form.email || undefined,
        gender: form.gender,
        roleId: form.roleId,
        specialty: form.specialty || undefined,
        licenseNumber: form.licenseNumber || undefined,
      }
      if (form.departmentId) body.departmentId = form.departmentId

      const isEdit = !!editingId
      const method = isEdit ? 'PUT' : 'POST'
      const payload = isEdit ? { ...body, id: editingId } : body

      const res = await fetch('/api/staff', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || 'Erreur serveur')
        return
      }
      toast.success(isEdit ? 'Employé mis à jour' : 'Compte employé créé avec succès')
      setDialogOpen(false)
      setForm(emptyForm)
      setEditingId(null)
      load()
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (s: any) => {
    setToggling(s.id)
    try {
      const res = await fetch('/api/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, isActive: !s.isActive }),
      })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || 'Erreur')
        return
      }
      toast.success(s.isActive ? 'Employé désactivé' : 'Employé réactivé')
      load()
    } catch {
      toast.error('Erreur serveur')
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Personnel</h1>
          <p className="text-muted-foreground text-sm mt-1">{staffList.length} membre{staffList.length > 1 ? 's' : ''} trouvé{staffList.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      {/* Info note about login */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          Chaque employé peut se connecter avec son numéro de téléphone et son code PIN.
          Le propriétaire de l&apos;établissement peut créer des comptes depuis cette interface.
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select value={deptFilter || 'all'} onValueChange={(v) => setDeptFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Département" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            {departments.map((d: any) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter || 'all'} onValueChange={(v) => setRoleFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Rôle" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {roles.map((r: any) => (
              <SelectItem key={r.id} value={r.id}>{ROLE_LABELS[r.name] || r.label || r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="inactif">Inactif</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground" onClick={clearFilters}>
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
                  <TableHead className="text-xs">Nom</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Téléphone</TableHead>
                  <TableHead className="text-xs">Rôle</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Département</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Spécialité</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((s: any) => {
                  const roleName = s.role?.name || ''
                  const roleLabel = ROLE_LABELS[roleName] || s.role?.label || roleName
                  const roleColor = ROLE_COLORS[roleName] || 'bg-gray-100 text-gray-700 border-gray-300'
                  return (
                    <TableRow key={s.id} className={!s.isActive ? 'opacity-60' : ''}>
                      <TableCell className="text-xs">
                        <div className="font-medium">{s.firstName} {s.lastName}</div>
                        {s.pin && (
                          <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px]">Compte actif</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs hidden sm:table-cell">{s.phone}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={roleColor}>{roleLabel}</Badge>
                      </TableCell>
                      <TableCell className="text-xs hidden md:table-cell">{s.department?.name || '—'}</TableCell>
                      <TableCell className="text-xs hidden lg:table-cell">{s.specialty || '—'}</TableCell>
                      <TableCell className="text-xs">
                        <Badge className={s.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'} variant="outline">
                          {s.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${s.isActive ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                            onClick={() => handleToggleActive(s)}
                            disabled={toggling === s.id}
                          >
                            {toggling === s.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : s.isActive ? (
                              <PowerOff className="w-3.5 h-3.5" />
                            ) : (
                              <Power className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {staffList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Aucun personnel enregistré
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
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null) } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier l\'employé' : 'Ajouter un employé'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Prénom *</Label>
              <Input value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} placeholder="ex: Amina" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nom *</Label>
              <Input value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} placeholder="ex: Nya" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Téléphone *</Label>
              <Input
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                placeholder="6XXXXXXXX"
                maxLength={9}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Code PIN {!editingId && '*'}</Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={form.pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '')
                  updateForm('pin', v)
                }}
                placeholder={editingId ? 'Laisser vide pour ne pas modifier' : '6 chiffres'}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Rôle *</Label>
              <Select value={form.roleId} onValueChange={(v) => updateForm('roleId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
                <SelectContent>
                  {roles.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>{ROLE_LABELS[r.name] || r.label || r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Département</Label>
              <Select value={form.departmentId} onValueChange={(v) => updateForm('departmentId', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Spécialité</Label>
              <Input value={form.specialty} onChange={(e) => updateForm('specialty', e.target.value)} placeholder="ex: Cardiologie" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Numéro licence</Label>
              <Input value={form.licenseNumber} onChange={(e) => updateForm('licenseNumber', e.target.value)} placeholder="ex: MED-2024-001" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="ex: amine.nya@clinique.cm" />
            </div>
            {!editingId && (
              <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-800">
                  Un code PIN de 6 chiffres sera attribué à cet employé. Il pourra se connecter avec son numéro de téléphone et ce code PIN pour accéder à son interface selon son rôle.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingId(null) }}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Mettre à jour' : 'Créer le compte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}