'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsView() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const { user } = useAppStore()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings')
        setSettings(await res.json())
      } catch { toast.error('Erreur de chargement') } finally { setLoading(false) }
    }
    load()
  }, [])

  const settingLabels: Record<string, string> = {
    hospital_name: 'Nom de l\'hôpital',
    hospital_address: 'Adresse',
    hospital_phone: 'Téléphone',
    hospital_email: 'Email',
    hospital_city: 'Ville',
    hospital_country: 'Pays',
    currency: 'Devise',
    language: 'Langue',
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Configuration de l&apos;établissement</p>
      </div>

      {/* Hospital Info */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Informations de l&apos;établissement</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nom</Label>
                <p className="text-sm font-medium">{user?.hospital?.name || settings.hospital_name || 'Clinique Centrale NYA'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Ville</Label>
                <p className="text-sm font-medium">{user?.hospital?.city || settings.hospital_city || 'Douala'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Téléphone</Label>
                <p className="text-sm font-medium">{settings.hospital_phone || '—'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium">{settings.hospital_email || '—'}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Adresse</Label>
                <p className="text-sm font-medium">{settings.hospital_address || '—'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Settings */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Configuration système</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : Object.keys(settings).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{settingLabels[key] || key}</span>
                  <span className="text-sm font-medium">{value || '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun paramètre configuré
            </p>
          )}
        </CardContent>
      </Card>

      {/* Connected User Info */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Profil connecté</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nom complet</Label>
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Téléphone</Label>
              <p className="text-sm font-medium">{user?.phone}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Rôle</Label>
              <p className="text-sm font-medium">{user?.role?.label || user?.role?.name || '—'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Spécialité</Label>
              <p className="text-sm font-medium">{user?.specialty || '—'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Département</Label>
              <p className="text-sm font-medium">{user?.department?.name || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}