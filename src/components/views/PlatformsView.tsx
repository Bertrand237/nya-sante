'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Globe, Smartphone, Monitor, Cloud, Shield, WifiOff,
  CheckCircle, ArrowRight, Zap, HardDrive, Wifi, Server,
  Package, ChevronRight,
} from 'lucide-react'

const PLATFORMS = [
  {
    id: 'web',
    title: 'Version Web',
    subtitle: 'Application Web Progressive (PWA)',
    icon: Globe,
    status: 'active',
    statusLabel: '✅ Disponible',
    color: 'emerald',
    description: 'Dashboard complet accessible depuis n\'importe quel navigateur. Optimisé pour Chrome, Firefox, Safari et Edge.',
    features: [
      'Responsive mobile, tablette et desktop',
      'PWA installable sur téléphone (ajouter à l\'écran d\'accueil)',
      'Mise en cache intelligente (Service Worker)',
      'Mode sombre / clair automatique',
      'Authentification PIN sécurisée',
      'Tous les 9 modules fonctionnels',
      'Export PDF pour factures et ordonnances',
      'Notifications en temps réel (WebSocket)',
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    deployment: {
      provider: 'Fly.io',
      region: 'Paris (CDG) — latence optimale pour l\'Afrique',
      url: 'https://nya-sante.fly.dev',
      protocol: 'HTTPS (TLS 1.3)',
      cdn: 'Fly.io Edge Network',
    },
    size: '~2 MB (première charge)',
    requirements: 'Navigateur moderne (Chrome 90+, Safari 15+, Firefox 90+)',
  },
  {
    id: 'apk-patient',
    title: 'APK Patient',
    subtitle: 'Application Android native hors-ligne',
    icon: Smartphone,
    status: 'planned',
    statusLabel: '🚧 Planifié (Phase 2)',
    color: 'blue',
    description: 'Application Android dédiée aux patients. Fonctionne 100% hors-ligne avec synchronisation automatique quand la connexion est disponible.',
    features: [
      '100% hors-ligne (SQLite + Room + SQLCipher)',
      'Prise de rendez-vous et rappels',
      'Historique médical personnel',
      'Ordonnances et résultats de labo',
      'Paiement Mobile Money intégré',
      'QR Code patient pour identification rapide',
      'Notifications de rappel de consultation',
      'Synchronisation Delta Sync (< 1 MB / sync)',
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Room DB', 'SQLCipher', 'WorkManager', 'Ktor Client'],
    deployment: {
      provider: 'Google Play Store + APK Direct',
      method: 'Distribution directe (APK) + Play Store',
      minApi: 'Android 7.0 (API 24)',
      targetApi: 'Android 14 (API 34)',
      size: '< 15 MB (APK)',
    },
    size: '< 15 MB',
    requirements: 'Android 7.0+ (API 24), 2 GB RAM minimum',
  },
  {
    id: 'apk-staff',
    title: 'APK Personnel Médical',
    subtitle: 'Application Android pour médecins et infirmiers',
    icon: Smartphone,
    status: 'planned',
    statusLabel: '🚧 Planifié (Phase 2)',
    color: 'teal',
    description: 'Application Android pour le personnel médical. Consultations, ordonnances et DME accessibles même sans connexion internet.',
    features: [
      'Consultations 100% hors-ligne',
      'Création d\'ordonnances sans connexion',
      'Dossier Médical Électronique (DME) local',
      'Constantes vitales avec saisie rapide',
      'Capture photo (caméra intégrée)',
      'Dictée vocale des notes médicales',
      'Gestion des rendez-vous du jour',
      'Synchronisation CRDT (résolution de conflits)',
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Room DB', 'SQLCipher', 'CRDT', 'CameraX'],
    deployment: {
      provider: 'Distribution interne (MDM)',
      method: 'APK direct ou MDM (Mobile Device Manager)',
      minApi: 'Android 7.0 (API 24)',
      targetApi: 'Android 14 (API 34)',
      size: '< 15 MB (APK)',
    },
    size: '< 15 MB',
    requirements: 'Android 7.0+, caméra, 3 GB RAM recommandé',
  },
  {
    id: 'apk-admin',
    title: 'APK Administrateur',
    subtitle: 'Application Android pour gestionnaires et propriétaires',
    icon: Smartphone,
    status: 'planned',
    statusLabel: '🚧 Planifié (Phase 2)',
    color: 'purple',
    description: 'Application de gestion pour les propriétaires et administrateurs d\'hôpitaux. Création de départements, rapports financiers et gestion du personnel.',
    features: [
      'Création de départements et services',
      'Gestion du personnel et des rôles (RBAC)',
      'Tableaux de bord financiers',
      'Rapports PDF (revenus, statistiques)',
      'Gestion multi-établissements',
      'Configuration de l\'hôpital hors-ligne',
      'Audit trail et journal des actions',
      'Sauvegarde/restauration des données',
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Room DB', 'SQLCipher', 'DataStore'],
    deployment: {
      provider: 'Distribution interne uniquement',
      method: 'APK direct via portail d\'administration',
      minApi: 'Android 7.0 (API 24)',
      size: '< 15 MB (APK)',
    },
    size: '< 15 MB',
    requirements: 'Android 7.0+, rôle super_admin requis',
  },
  {
    id: 'windows',
    title: 'Version Windows',
    subtitle: 'Application desktop native Windows',
    icon: Monitor,
    status: 'planned',
    statusLabel: '🚧 Planifié (Phase 3)',
    color: 'sky',
    description: 'Application de bureau pour Windows. Idéale pour les postes de réception, les laboratoires et les stations de facturation avec imprimantes connectées.',
    features: [
      'Installation standard Windows (.exe / .msi)',
      'Fonctionnement hors-ligne complet',
      'Impression directe (ordonnances, factures, étiquettes)',
      'Connexion matérielle (balance, tensiomètre Bluetooth)',
      'Multi-fenêtres et raccourcis clavier',
      'Intégration carte d\'identité biométrique',
      'Export automatique vers clé USB (sauvegarde)',
      'Mise à jour automatique silencieuse',
    ],
    tech: ['Tauri 2.0', 'Rust', 'React', 'TypeScript', 'SQLite', 'Bluetooth LE'],
    deployment: {
      provider: 'Distribution directe',
      method: 'Installateur .exe (Tauri) + Auto-update',
      targetOs: 'Windows 10/11 (64-bit)',
      size: '~8 MB (installateur)',
    },
    size: '~8 MB installé (~25 MB avec Rust runtime)',
    requirements: 'Windows 10+, 4 GB RAM, 500 MB disque',
  },
]

const FLY_INFO = {
  cost: 'À partir de ~5$/mois (512 MB RAM, 1 CPU partagé)',
  database: 'SQLite sur Volume Persistant (3 GB gratuit)',
  bandwidth: '160 GB/mois inclus (plan Hobby)',
  scaling: 'Auto-scaling possible (256 MB → 16 GB RAM)',
  regions: '35+ régions — Paris (CDG) recommandé pour l\'Afrique Centrale/Ouest',
  ssl: 'Certificat SSL automatique (Let\'s Encrypt via Fly.io)',
  deployCmd: 'fly launch && fly deploy',
  deployTime: '~2-3 minutes',
}

const SYNC_ARCHITECTURE = [
  { step: 1, title: 'Saisie hors-ligne', desc: 'Les données sont enregistrées localement dans SQLite chiffré (AES-256)', icon: HardDrive },
  { step: 2, title: 'Détection connexion', desc: 'WorkManager (Android) / Navigator.onLine (Web) détecte le retour de connexion', icon: Wifi },
  { step: 3, title: 'Delta Sync', desc: 'Seules les modifications depuis la dernière sync sont envoyées (< 1 MB)', icon: Zap },
  { step: 4, title: 'Résolution CRDT', desc: 'Les conflits sont résolus automatiquement (dernière écriture gagne ou merge intelligent)', icon: Server },
  { step: 5, title: 'Confirmation', desc: 'Chaque opération reçoit un accusé de réception du serveur', icon: CheckCircle },
]

export default function PlatformsView() {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>('web')

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Plateformes & Déploiement</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Architecture multi-plateforme de NYA Santé — Web, Android (3 APK) et Windows
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { icon: Globe, label: 'Version Web', sub: 'PWA', color: 'text-emerald-600 bg-emerald-50' },
          { icon: Smartphone, label: 'APK Patient', sub: 'Android', color: 'text-blue-600 bg-blue-50' },
          { icon: Smartphone, label: 'APK Personnel', sub: 'Android', color: 'text-teal-600 bg-teal-50' },
          { icon: Smartphone, label: 'APK Admin', sub: 'Android', color: 'text-purple-600 bg-purple-50' },
          { icon: Monitor, label: 'Windows', sub: 'Desktop', color: 'text-sky-600 bg-sky-50' },
        ].map((p) => (
          <Card key={p.label} className="text-center p-3">
            <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center mx-auto mb-2`}>
              <p.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold leading-tight">{p.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{p.sub}</p>
          </Card>
        ))}
      </div>

      {/* Sync Architecture */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-orange-500" />
            Architecture Hors-Ligne (Offline-First)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {SYNC_ARCHITECTURE.map((s) => (
              <div key={s.step} className="text-center relative">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
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
        </CardContent>
      </Card>

      {/* Detailed Platform Cards */}
      <div className="space-y-3">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon
          const isExpanded = expandedPlatform === platform.id
          const colorMap: Record<string, string> = {
            emerald: 'border-emerald-200 bg-emerald-50/50',
            blue: 'border-blue-200 bg-blue-50/50',
            teal: 'border-teal-200 bg-teal-50/50',
            purple: 'border-purple-200 bg-purple-50/50',
            sky: 'border-sky-200 bg-sky-50/50',
          }
          const iconColorMap: Record<string, string> = {
            emerald: 'text-emerald-600 bg-emerald-100',
            blue: 'text-blue-600 bg-blue-100',
            teal: 'text-teal-600 bg-teal-100',
            purple: 'text-purple-600 bg-purple-100',
            sky: 'text-sky-600 bg-sky-100',
          }

          return (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isExpanded ? 'ring-2 ring-emerald-300' : ''}`}
              onClick={() => setExpandedPlatform(isExpanded ? null : platform.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${iconColorMap[platform.color]} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-sm font-bold">{platform.title}</CardTitle>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {platform.statusLabel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{platform.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Features */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Fonctionnalités
                      </h4>
                      <ul className="space-y-1.5">
                        {platform.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack & Deployment */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Stack Technique
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {platform.tech.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Déploiement
                        </h4>
                        <div className={`rounded-lg border p-3 space-y-1.5 ${colorMap[platform.color]}`}>
                          {Object.entries(platform.deployment).map(([key, val]) => {
                            const labels: Record<string, string> = {
                              provider: 'Hébergeur',
                              region: 'Région',
                              url: 'URL',
                              protocol: 'Protocole',
                              cdn: 'CDN',
                              method: 'Méthode',
                              minApi: 'API Minimum',
                              targetApi: 'API Cible',
                              targetOs: 'OS Cible',
                            }
                            return (
                              <div key={key} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{labels[key] || key}</span>
                                <span className="font-medium">{val}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Taille</span>
                        <span className="font-medium">{platform.size}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-muted-foreground shrink-0">Prérequis</span>
                        <span className="font-medium">{platform.requirements}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Fly.io Deployment Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-600" />
            Déploiement fly.io — Configuration Prête
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Coût estimé', value: FLY_INFO.cost },
              { label: 'Base de données', value: FLY_INFO.database },
              { label: 'Bande passante', value: FLY_INFO.bandwidth },
              { label: 'Scaling', value: FLY_INFO.scaling },
              { label: 'Région conseillée', value: FLY_INFO.regions },
              { label: 'SSL', value: FLY_INFO.ssl },
              { label: 'Commande déploiement', value: FLY_INFO.deployCmd, mono: true },
              { label: 'Temps de déploiement', value: FLY_INFO.deployTime },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{item.label}</p>
                <p className={`text-xs font-medium ${item.mono ? 'font-mono bg-white/60 px-2 py-1 rounded border' : ''}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg">
              <Package className="w-4 h-4" />
              <span><strong>Dockerfile</strong> et <strong>fly.toml</strong> déjà configurés dans le projet</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-100 px-3 py-2 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>Volume persistant pour la base de données SQLite</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Deploy Steps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Déploiement Rapide (5 étapes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { step: 1, cmd: 'npm install -g flyctl', desc: 'Installer le CLI Fly.io' },
              { step: 2, cmd: 'fly auth login', desc: 'Se connecter à son compte Fly.io' },
              { step: 3, cmd: 'fly launch', desc: 'Créer l\'app (le fly.toml est déjà prêt)' },
              { step: 4, cmd: 'fly volumes create nya_sante_data --size 3', desc: 'Créer le volume persistant pour SQLite' },
              { step: 5, cmd: 'fly deploy', desc: 'Déployer l\'application !' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">{s.cmd}</code>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}