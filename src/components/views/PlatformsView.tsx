'use client'

import { useState } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { PWAStatusBadge } from '@/components/PWAInstallPrompt'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Globe, Smartphone, Monitor, Cloud, Shield, WifiOff,
  CheckCircle, ArrowRight, Zap, HardDrive, Wifi, Server,
  Package, ChevronRight, Download, Info,
  MonitorSmartphone, Layers, RefreshCw, Compass, CircleDot,
} from 'lucide-react'

const SYNC_ARCHITECTURE = [
  { step: 1, title: 'Saisie en ligne', desc: 'Les données sont envoyées au serveur en temps réel', icon: Wifi },
  { step: 2, title: 'Cache intelligent', desc: 'Le Service Worker met en cache les données consultées', icon: HardDrive },
  { step: 3, title: 'Hors-ligne partiel', desc: 'Navigation et données récentes accessibles sans connexion', icon: WifiOff },
  { step: 4, title: 'Synchronisation auto', desc: 'Dès le retour en ligne, les données se synchronisent', icon: RefreshCw },
  { step: 5, title: 'Même serveur', desc: 'Web et Android partagent le même backend et les mêmes données', icon: Server },
]

const BROWSER_SUPPORT = [
  { name: 'Chrome', version: '90+', icon: CircleDot, supported: true, note: 'Installation PWA complète' },
  { name: 'Edge', version: '90+', icon: Globe, supported: true, note: 'Installation PWA complète' },
  { name: 'Samsung Internet', version: '15+', icon: Compass, supported: true, note: 'Installation PWA complète' },
  { name: 'Firefox', version: '90+', icon: Globe, supported: true, note: 'PWA fonctionnelle (pas d\'install)' },
  { name: 'Safari', version: '15+', icon: Compass, supported: true, note: 'Ajout à l\'écran d\'accueil' },
]

export default function PlatformsView() {
  const { canInstall, isInstalled, isOnline, promptInstall } = usePWA()
  const [expandedSection, setExpandedSection] = useState<string | null>('web')

  const handleInstall = async () => {
    await promptInstall()
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Plateformes & Installation</h1>
            <PWAStatusBadge />
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Une seule application, deux interfaces — Web et Android (PWA) avec le même serveur et les mêmes données
        </p>
      </div>

      {/* Architecture Banner */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/30 dark:bg-emerald-900/20 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-teal-100/30 dark:bg-teal-900/20 rounded-full translate-y-1/2" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-lg">Architecture Unifiée Web + Android</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Web */}
            <div className="text-center p-4 bg-white/70 dark:bg-white/5 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
              <Monitor className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-sm">Version Web</p>
              <p className="text-xs text-muted-foreground mt-1">Accessible via URL dans le navigateur</p>
              <Badge variant="secondary" className="mt-2 text-[10px]">Actif</Badge>
            </div>
            {/* Arrow + Server */}
            <div className="hidden md:flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <ArrowRight className="w-4 h-4 text-emerald-400 rotate-180" />
                <div className="flex-1 bg-white/70 dark:bg-white/5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 p-3 text-center">
                  <Server className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Même Serveur</p>
                  <p className="text-[10px] text-muted-foreground">Mêmes données</p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[10px] text-muted-foreground text-center">Un utilisateur connecté peut utiliser les deux interfaces simultanément</p>
            </div>
            {/* Mobile arrow on mobile */}
            <div className="md:hidden flex flex-col items-center gap-1">
              <ArrowRight className="w-4 h-4 text-emerald-400 rotate-90" />
              <p className="text-[10px] text-muted-foreground text-center">Même serveur — Mêmes données</p>
              <ArrowRight className="w-4 h-4 text-emerald-400 rotate-90" />
            </div>
            {/* Android */}
            <div className="text-center p-4 bg-white/70 dark:bg-white/5 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
              <Smartphone className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-sm">Version Android (PWA)</p>
              <p className="text-xs text-muted-foreground mt-1">Installée sur l&apos;écran d&apos;accueil</p>
              {isInstalled ? (
                <Badge className="mt-2 text-[10px] bg-emerald-600">Installée</Badge>
              ) : (
                <Badge variant="outline" className="mt-2 text-[10px] border-amber-300 text-amber-700">À installer</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Install PWA Section */}
      {!isInstalled && canInstall && (
        <Card className="border-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-800">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-emerald-900/50 flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-700 shrink-0 overflow-hidden">
                <img src="/icons/icon-192x192.png" alt="NYA Santé" className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Installer NYA Santé sur votre appareil</h3>
                <p className="text-sm text-emerald-700/70 dark:text-emerald-400 mt-1">
                  Ajoutez l&apos;application à votre écran d&apos;accueil pour un accès rapide, comme une vraie application Android.
                </p>
              </div>
              <Button
                onClick={handleInstall}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shrink-0 h-11 px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Installer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Install */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MonitorSmartphone className="w-4 h-4 text-emerald-600" />
            Comment installer sur Android
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chrome on Android */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Chrome className="w-4 h-4" />
              Google Chrome (Android)
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {[
                '1. Ouvrez NYA Santé dans Chrome sur votre téléphone Android',
                '2. Appuyez sur le menu ⋮ (trois points) en haut à droite',
                '3. Sélectionnez "Installer l\'application" ou "Ajouter à l\'écran d\'accueil"',
                '4. Confirmez en appuyant sur "Installer"',
                '5. L\'icône NYA Santé apparaît sur votre écran d\'accueil !',
              ].map((step, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="font-mono text-emerald-600 shrink-0">{step.substring(0, 2)}</span>
                  <span>{step.substring(3)}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Samsung Internet */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Samsung Internet
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {[
                '1. Ouvrez NYA Santé dans Samsung Internet',
                '2. Appuyez sur le menu ☰ puis sur "Ajouter à l\'écran d\'accueil"',
                '3. Confirmez l\'installation',
              ].map((step, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="font-mono text-emerald-600 shrink-0">{step.substring(0, 2)}</span>
                  <span>{step.substring(3)}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Desktop Chrome/Edge */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Chrome / Edge (Desktop)
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {[
                '1. Ouvrez NYA Santé dans Chrome ou Edge sur votre ordinateur',
                '2. Cliquez sur l\'icône d\'installation ⊕ dans la barre d\'adresse',
                '3. Ou : menu ⋮ → "Installer NYA Santé"',
                '4. L\'application s\'ouvre dans sa propre fenêtre, sans barre d\'adresse',
              ].map((step, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="font-mono text-emerald-600 shrink-0">{step.substring(0, 2)}</span>
                  <span>{step.substring(3)}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-semibold">Important : Une seule application, deux interfaces</p>
              <p className="text-amber-700/80 dark:text-amber-400/80">
                La version web et la version Android (PWA) utilisent <strong>exactement le même serveur et les mêmes données</strong>.
                Un utilisateur peut être connecté sur les deux interfaces en même temps avec le même compte et voir les mêmes informations en temps réel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Architecture */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 cursor-pointer" onClick={() => setExpandedSection(expandedSection === 'arch' ? null : 'arch')}>
            <Server className="w-4 h-4 text-emerald-600" />
            Architecture Technique Unifiée
            <ChevronRight className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${expandedSection === 'arch' ? 'rotate-90' : ''}`} />
          </CardTitle>
        </CardHeader>
        {expandedSection === 'arch' && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
              {SYNC_ARCHITECTURE.map((s) => (
                <div key={s.step} className="text-center relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                  {s.step < 5 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 mx-auto mt-1 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Frontend (Client)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'PWA (Service Worker)'].map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Backend (Serveur)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {['Next.js API Routes', 'Prisma ORM', 'SQLite', 'Zustand', 'Server-Sent Events'].map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Browser Support */}
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Compatibilité Navigateurs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {BROWSER_SUPPORT.map((b) => (
                <div key={b.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-xs">
                  <b.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{b.name} {b.version}+</p>
                    <p className="text-[10px] text-muted-foreground">{b.note}</p>
                  </div>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Key Features Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 cursor-pointer" onClick={() => setExpandedSection(expandedSection === 'features' ? null : 'features')}>
            <Layers className="w-4 h-4 text-emerald-600" />
            Web vs Android (PWA) — Même Fonctionnalités
            <ChevronRight className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${expandedSection === 'features' ? 'rotate-90' : ''}`} />
          </CardTitle>
        </CardHeader>
        {expandedSection === 'features' && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-semibold">Fonctionnalité</th>
                    <th className="text-center py-2 px-3 font-semibold w-24">
                      <Monitor className="w-4 h-4 mx-auto mb-0.5" />
                      Web
                    </th>
                    <th className="text-center py-2 px-3 font-semibold w-24">
                      <Smartphone className="w-4 h-4 mx-auto mb-0.5" />
                      Android
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { feature: 'Connexion PIN', web: true, android: true },
                    { feature: 'Tableau de bord', web: true, android: true },
                    { feature: 'Gestion des patients', web: true, android: true },
                    { feature: 'DME (Dossier Médical)', web: true, android: true },
                    { feature: 'Consultations', web: true, android: true },
                    { feature: 'Ordonnances', web: true, android: true },
                    { feature: 'Laboratoire', web: true, android: true },
                    { feature: 'Facturation', web: true, android: true },
                    { feature: 'Pharmacie', web: true, android: true },
                    { feature: 'Transferts inter-hospitaliers', web: true, android: true },
                    { feature: 'Thème clair/sombre', web: true, android: true },
                    { feature: 'Même serveur & données', web: true, android: true },
                    { feature: 'Accès simultané multi-appareils', web: true, android: true },
                    { feature: 'Mode hors-ligne partiel', web: false, android: true },
                    { feature: 'Icône sur écran d\'accueil', web: false, android: true },
                    { feature: 'Plein écran (sans barre URL)', web: false, android: true },
                  ].map((row) => (
                    <tr key={row.feature} className="hover:bg-muted/30">
                      <td className="py-1.5 pr-4">{row.feature}</td>
                      <td className="py-1.5 text-center px-3">
                        {row.web ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-1.5 text-center px-3">
                        {row.android ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Deployment */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/50 dark:to-teal-950/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 cursor-pointer" onClick={() => setExpandedSection(expandedSection === 'deploy' ? null : 'deploy')}>
            <Cloud className="w-4 h-4 text-emerald-600" />
            Déploiement — Mise en ligne
            <ChevronRight className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${expandedSection === 'deploy' ? 'rotate-90' : ''}`} />
          </CardTitle>
        </CardHeader>
        {expandedSection === 'deploy' && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Hébergeur', value: 'Fly.io' },
                { label: 'Région', value: 'Paris (CDG) — optimal pour Afrique' },
                { label: 'SSL', value: 'Automatique (Let\'s Encrypt)' },
                { label: 'Base de données', value: 'SQLite (volume persistant)' },
                { label: 'Coût estimé', value: '~5$/mois' },
                { label: 'Bande passante', value: '160 GB/mois inclus' },
              ].map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-xs font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                5 étapes pour déployer
              </h4>
              <div className="space-y-2">
                {[
                  { step: 1, cmd: 'npm install -g flyctl', desc: 'Installer le CLI Fly.io' },
                  { step: 2, cmd: 'fly auth login', desc: 'Se connecter' },
                  { step: 3, cmd: 'fly launch', desc: 'Créer l\'app (fly.toml prêt)' },
                  { step: 4, cmd: 'fly volumes create data --size 3', desc: 'Volume pour SQLite' },
                  { step: 5, cmd: 'fly deploy', desc: 'Déployer !' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <code className="text-xs font-mono bg-white/60 dark:bg-white/10 px-2 py-1 rounded border block">{s.cmd}</code>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/30 px-3 py-2 rounded-lg">
                <Package className="w-4 h-4" />
                <span><strong>Dockerfile</strong> et <strong>fly.toml</strong> déjà configurés</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-400 bg-teal-100/70 dark:bg-teal-900/30 px-3 py-2 rounded-lg">
                <Shield className="w-4 h-4" />
                <span>PWA + HTTPS requis pour l&apos;installation Android</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            État Actuel de l&apos;Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-lg font-bold text-emerald-600">{isInstalled ? 'Installée' : 'Non installée'}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">PWA sur cet appareil</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-lg font-bold text-emerald-600">{isOnline ? 'En ligne' : 'Hors ligne'}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Connexion réseau</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-lg font-bold text-emerald-600">v1.0</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Version de l&apos;app</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-lg font-bold text-emerald-600">1 seul</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Serveur partagé</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}