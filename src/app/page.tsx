'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Eye, BookOpen, Server, Building2, Layers, Smartphone,
  Globe, Shield, CalendarDays, DollarSign, Heart, Users,
  Activity, WifiOff, Database, Cloud, Lock, Bell, FileText,
  Stethoscope, Pill, Microscope, Baby, Clock, MessageSquare,
  BarChart3, UserCog, Package, CreditCard, Calendar,
  AlertTriangle, CheckCircle2, XCircle, ArrowRight, Star,
  Target, Zap, TrendingUp, MapPin, Languages, Receipt,
  Settings, Workflow, HardDrive, Radio, RefreshCw,
  Download, Upload, ChevronRight, BedDouble, Scissors
} from 'lucide-react'

/* ─────────────────────────────────────────────
   HERO SECTION
   ───────────────────────────────────────────── */
function HeroSection() {
  return (
    <header className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/nya-hero.png"
          alt="NYA Santé - Plateforme de Santé pour l'Afrique"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 nya-hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <Image src="/nya-logo.png" alt="NYA Santé" width={56} height={56} className="rounded-xl" />
              <span className="text-white/80 text-lg font-medium tracking-wider uppercase">Cahier de Charges</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              NYA <span className="text-amber-300">Santé</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-8 leading-relaxed">
              Plateforme de gestion hospitalière nouvelle génération, conçue spécifiquement pour l&apos;Afrique.
              Meilleure que les solutions américaines et européennes, avec un fonctionnement
              <span className="text-amber-300 font-semibold"> 100% offline</span>.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/25 px-4 py-2 text-sm">
                <WifiOff className="w-4 h-4 mr-2" /> Offline-First
              </Badge>
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/25 px-4 py-2 text-sm">
                <Smartphone className="w-4 h-4 mr-2" /> Android Natif
              </Badge>
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/25 px-4 py-2 text-sm">
                <Building2 className="w-4 h-4 mr-2" /> Multi-Tenant
              </Badge>
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/25 px-4 py-2 text-sm">
                <Globe className="w-4 h-4 mr-2" /> Adapté Afrique
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {[
              { value: '16+', label: 'Modules Fonctionnels', icon: Layers },
              { value: '3', label: 'Apps Android', icon: Smartphone },
              { value: '100%', label: 'Fonctionnement Offline', icon: WifiOff },
              { value: '54', label: 'Pays Africains Ciblés', icon: MapPin },
            ].map((stat, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-amber-300" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─────────────────────────────────────────────
   SHARED UI COMPONENTS
   ───────────────────────────────────────────── */
function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
      </div>
      {subtitle && <p className="text-muted-foreground ml-13">{subtitle}</p>}
      <Separator className="mt-4" />
    </div>
  )
}

function SubTitle({ title, id }: { title: string; id?: string }) {
  return (
    <h3 id={id} className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
      <ChevronRight className="w-4 h-4 text-primary" />
      {title}
    </h3>
  )
}

function FeatureCard({ icon: Icon, title, description, tags, status }: {
  icon: React.ElementType; title: string; description: string;
  tags?: string[]; status?: 'critical' | 'high' | 'medium' | 'optional'
}) {
  const statusConfig = {
    critical: { label: 'Critique', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    high: { label: 'Priorité Haute', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    medium: { label: 'Moyenne', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    optional: { label: 'Optionnel', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  }
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {status && (
            <Badge variant="outline" className={`text-xs ${statusConfig[status].color} border-0`}>
              {statusConfig[status].label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SpecTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold border-b">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PhaseCard({ phase, title, duration, progress, items }: {
  phase: string; title: string; duration: string; progress: number; items: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-primary text-primary-foreground">{phase}</Badge>
          <span className="text-sm text-muted-foreground">{duration}</span>
        </div>
        <CardTitle>{title}</CardTitle>
        <Progress value={progress} className="mt-3 h-2" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────────────────────────────
   TAB 1: VUE D'ENSEMBLE
   ───────────────────────────────────────────── */
function SectionVueEnsemble() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Eye} title="Vue d'Ensemble" subtitle="Présentation complète du projet NYA Santé" />

      {/* Problématique */}
      <SubTitle title="1.1 Problématique" />
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <p className="text-muted-foreground leading-relaxed mb-4">
            L&apos;Afrique fait face à un défi sanitaire majeur : la majorité des hôpitaux et cliniques
            fonctionnent encore avec des <strong className="text-foreground">dossiers papier</strong>, des
            <strong className="text-foreground"> processus manuels</strong> et des systèmes d&apos;information
            fragmentés. Les solutions américaines et européennes (Epic, Cerner, Meditech) sont conçues pour des
            environnements avec connectivité permanente, des infrastructures IT solides et des budgets importants.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { stat: '60%', desc: "des hôpitaux africains n'ont pas de système d'information" },
              { stat: '75%', desc: 'de la population africaine n\'a pas d\'accès à l\'internet fiable' },
              { stat: '45%', desc: "des pertes de données médicales dues au papier" },
              { stat: '30%', desc: "d'erreurs médicamenteuses liées à la documentation manuelle" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <span className="text-2xl font-bold text-red-600">{item.stat}</span>
                <span className="text-sm text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vision */}
      <SubTitle title="1.2 Vision et Mission" />
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="nya-gradient text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" /> Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 leading-relaxed">
              Devenir la plateforme de référence pour la gestion hospitalière en Afrique,
              en offrant une solution qui dépasse les standards occidentaux par son adaptation
              aux réalités africaines : fonctionnement offline, accessibilité mobile, multilinguisme
              et intégration des systèmes de paiement locaux.
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-amber-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Zap className="w-5 h-5" /> Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Démocratiser l&apos;accès à la santé numérique en Afrique en fournissant un système
              de gestion hospitalière complet, abordable et fonctionnant sans connexion internet
              permanente. Chaque propriétaire d&apos;hôpital doit pouvoir configurer son établissement
              de manière autonome, créer ses départements et gérer son équipe.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs Stratégiques */}
      <SubTitle title="1.3 Objectifs Stratégiques" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: WifiOff, title: 'Offline-First', desc: 'Fonctionnement complet sans connexion internet, synchronisation automatique quand la connexion revient.' },
          { icon: Smartphone, title: 'Mobile-First', desc: 'Applications Android natives pour patients, médecins, infirmiers, laborantins et administrateurs.' },
          { icon: Building2, title: 'Multi-Établissement', desc: 'Chaque propriétaire gère son hôpital de manière indépendante avec ses propres départements.' },
          { icon: DollarSign, title: 'Mobile Money', desc: 'Intégration native MTN Mobile Money, Orange Money, M-Pesa et tous les systèmes de paiement locaux.' },
          { icon: Languages, title: 'Multilingue', desc: 'Français, Anglais, Arabe, Swahili, Wolof, Lingala + support de langues locales personnalisables.' },
          { icon: Shield, title: 'Conformité', desc: 'Conforme aux réglementations africaines (OHADA, CEDEAO, UA) et standards internationaux (HL7 FHIR).' },
        ].map((item, i) => (
          <FeatureCard key={i} {...item} />
        ))}
      </div>

      {/* Public Cible */}
      <SubTitle title="1.4 Public Cible et Utilisateurs" />
      <Card>
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Patients', desc: 'Prise de rendez-vous, consultations à distance, historique médical, notifications SMS.', count: '~1.4 milliard' },
              { icon: Stethoscope, title: 'Médecins', desc: 'Dossiers patients, ordonnances, résultats labo, gestion des consultations.', count: '~300 000' },
              { icon: UserCog, title: 'Administrateurs', desc: 'Configuration hôpital, départements, RH, facturation, rapports, analytics.', count: '~50 000' },
              { icon: Building2, title: 'Propriétaires', desc: 'Gestion multi-établissements, dashboard stratégique, contrôle total.', count: '~20 000' },
            ].map((user, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-muted/50">
                <user.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-1">{user.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{user.desc}</p>
                <Badge variant="outline" className="text-xs">{user.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 2: ANALYSE DE MARCHÉ
   ───────────────────────────────────────────── */
function SectionMarche() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={BookOpen} title="Analyse de Marché" subtitle="Étude comparative et positionnement stratégique" />

      <SubTitle title="2.1 Solutions Existantes (US / EU)" />
      <p className="text-muted-foreground mb-4">Analyse des principales solutions hospitalières occidentales et leurs limitations en contexte africain :</p>
      <SpecTable
        headers={['Solution', 'Origine', 'Prix/an', 'Offline', 'Mobile', 'Mobile Money', 'Langues AF']}
        rows={[
          ['Epic Systems', '🇺🇸 USA', '$1M - $5M', '❌ Non', 'Web only', '❌ Non', '❌ Non'],
          ['Cerner (Oracle)', '🇺🇸 USA', '$500K - $2M', '❌ Non', 'Limité', '❌ Non', '❌ Non'],
          ['Meditech', '🇺🇸 USA', '$200K - $1M', '⚠️ Partiel', 'Limité', '❌ Non', '❌ Non'],
          ['Dedalus (ex-CGI)', '🇮🇹 EU', '$100K - $500K', '❌ Non', 'Web only', '❌ Non', '⚠️ 3-4 langues'],
          ['Infor (Liferay)', '🇺🇸 USA', '$150K - $700K', '❌ Non', 'Web only', '❌ Non', '❌ Non'],
          ['OpenMRS', '🌍 Open Source', 'Gratuit*', '⚠️ Partiel', '⚠️ Basique', '❌ Non', '⚠️ Anglais'],
          ['NYA Santé', '🌍 Afrique', '$500 - $5 000', '✅ Oui', '✅ Natif', '✅ Oui', '✅ 10+ langues'],
        ]}
      />

      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>*OpenMRS</strong> est gratuit mais nécessite une expertise technique avancée pour le déploiement et la maintenance.
          Pas d&apos;application mobile native, pas de support Mobile Money, et la synchronisation offline est expérimentale.
        </p>
      </div>

      <SubTitle title="2.2 Pourquoi NYA Santé est Meilleur" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Vrai Offline-First', icon: WifiOff, desc: "Contrairement aux solutions US/EU qui nécessitent une connexion permanente, NYA Santé fonctionne à 100% hors-ligne. Toutes les opérations critiques (consultations, prescriptions, labo) sont disponibles sans internet.", status: 'critical' as const },
          { title: 'Mobile Natif Android', icon: Smartphone, desc: "Les solutions US/EU sont conçues pour desktop. NYA Santé offre des applications Android natives optimisées pour les smartphones courants en Afrique (même avec 2Go de RAM).", status: 'critical' as const },
          { title: 'Multi-Tenant Autonome', icon: Building2, desc: "Chaque propriétaire d'hôpital configure son établissement indépendamment. Pas besoin d'un intégrateur externe pour créer des départements, des services ou des rôles.", status: 'critical' as const },
          { title: 'Mobile Money Intégré', icon: CreditCard, desc: "Intégration native avec MTN Mobile Money, Orange Money, M-Pesa, Wave et tous les systèmes de paiement mobile africains. Les solutions US ne supportent que les cartes bancaires.", status: 'high' as const },
          { title: 'Multilinguisme Africain', icon: Languages, desc: "Interface en Français, Anglais, Arabe, Swahili, Wolof, Bambara, Lingala, Hausa, Amharique et toute langue configurable par l'utilisateur.", status: 'high' as const },
          { title: 'Prix Accessible', icon: DollarSign, desc: "Prix adapté aux réalités économiques africaines. De $500/an pour une petite clinique à $5 000/an pour un grand hôpital, contre $200K+ pour les solutions US.", status: 'high' as const },
          { title: 'Bande Passante Minimale', icon: Radio, desc: "Optimisé pour fonctionner sur des réseaux 2G/3G avec moins de 1 Mo de données par synchronisation. Les solutions US/EU consomment des Mo par page.", status: 'high' as const },
          { title: 'Notifications SMS', icon: MessageSquare, desc: "Rappels de rendez-vous, résultats de labo et alertes via SMS (pas besoin de smartphone ni d'internet). Inclus dans le prix.", status: 'medium' as const },
        ].map((item, i) => (
          <FeatureCard key={i} {...item} />
        ))}
      </div>

      <SubTitle title="2.3 Marché Cible et Opportunité" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary" />
            <div className="text-3xl font-bold text-primary">$4.2 Milliards</div>
            <p className="text-sm text-muted-foreground mt-1">Marché HIS Afrique en 2027</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Activity className="w-10 h-10 mx-auto mb-3 text-amber-600" />
            <div className="text-3xl font-bold text-amber-600">18.5%</div>
            <p className="text-sm text-muted-foreground mt-1">TCAC de croissance annuel</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
            <div className="text-3xl font-bold text-emerald-600">12 000+</div>
            <p className="text-sm text-muted-foreground mt-1">Hôpitaux et cliniques ciblés en Phase 1</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 3: ARCHITECTURE TECHNIQUE
   ───────────────────────────────────────────── */
function SectionArchitecture() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Server} title="Architecture Technique" subtitle="Architecture Offline-First, scalable et sécurisée" />

      <SubTitle title="3.1 Architecture Globale" />
      <Card>
        <CardContent className="pt-6">
          <div className="bg-muted/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground/80 leading-relaxed">{`
┌─────────────────────────────────────────────────────────────────┐
│                    COUCHE APPLICATION                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  App      │  │  App      │  │  App      │  │  Dashboard   │   │
│  │  Patient  │  │  Médical  │  │  Admin    │  │  Web Admin   │   │
│  │  Android  │  │  Android  │  │  Android  │  │  (Next.js)   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │              │                │           │
│  ┌────┴──────────────┴──────────────┴────────────────┴──────┐  │
│  │              COUCHE SYNCHRONISATION (Sync Engine)         │  │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │   │  Local DB     │  │  Conflict    │  │  Delta Sync  │   │  │
│  │   │  (SQLite)     │  │  Resolution  │  │  Protocol    │   │  │
│  │   └──────┬───────┘  └──────────────┘  └──────┬───────┘   │  │
│  └─────────┼──────────────────────────────────────┼──────────┘  │
│            │              ▲                     │             │
│            │              │ Sync (quand          │             │
│            │              │ connecté)           │             │
│            ▼              │                     ▼             │
│  ┌────────────────────────┴───────────────────────────────┐   │
│  │                 API GATEWAY + BACKEND                    │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │   │  Auth    │  │  REST    │  │  WebSocket│            │   │
│  │   │  (JWT)   │  │  API     │  │  Realtime │            │   │
│  │   └──────────┘  └──────────┘  └──────────┘            │   │
│  └─────────────────────────┬─────────────────────────────┘   │
│                            │                                  │
│  ┌─────────────────────────┴─────────────────────────────┐   │
│  │              COUCHE DONNÉES (Multi-Tenant)             │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │   │ PostgreSQL│  │  Redis   │  │  Object  │            │   │
│  │   │ (principal)│  │ (Cache)  │  │ Storage  │            │   │
│  │   └──────────┘  └──────────┘  └──────────┘            │   │
│  └───────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘`}</pre>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="3.2 Stack Technologique" />
      <SpecTable
        headers={['Composant', 'Technologie', 'Justification']}
        rows={[
          ['Backend API', 'Node.js + NestJS + TypeScript', 'Performance, écosystème riche, typage fort'],
          ['Dashboard Web', 'Next.js 16 + React 19 + TypeScript', 'SSR, performance, SEO, UI moderne'],
          ['App Android Patient', 'Kotlin + Jetpack Compose', 'Performance native, petite taille APK'],
          ['App Android Personnel', 'Kotlin + Jetpack Compose', 'Performance native, UI fluide'],
          ['App Android Admin', 'Kotlin + Jetpack Compose', 'Configuration complète sur mobile'],
          ['DB Serveur', 'PostgreSQL 16', 'Robuste, multi-tenant, JSON support'],
          ['DB Locale (offline)', 'SQLite + Room (Android)', 'Léger, fiable, synchronisation'],
          ['Cache', 'Redis', 'Sessions, cache, files d\'attente'],
          ['Sync Engine', 'Custom Delta Sync + CRDT', 'Résolution de conflits, faible bande passante'],
          ['Authentification', 'JWT + OAuth 2.0 + PIN', 'Sécurité, SSO, auth PIN pour Afrique'],
          ['Mobile Money', 'API MTN, Orange, M-Pesa, Wave', 'Paiements locaux intégrés'],
          ['SMS', 'Twilio Africa + providers locaux', 'Notifications sans internet'],
          ['Cloud / Hébergement', 'AWS (Afrique: Cape Town, Nairobi)', 'Data locality, conformité'],
          ['CI/CD', 'GitHub Actions + Fastlane', 'Automatisation builds et déploiement'],
        ]}
      />

      <SubTitle title="3.3 Mécanisme de Synchronisation Offline" />
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6 space-y-4">
          <p className="text-muted-foreground">
            Le moteur de synchronisation est le cœur de NYA Santé. Il garantit que toutes les opérations
            fonctionnent parfaitement hors-ligne et se synchronisent automatiquement.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <Download className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold text-sm mb-1">1. Opération Locale</h4>
              <p className="text-xs text-muted-foreground">
                Chaque action (consultation, prescription, etc.) est d&apos;abord enregistrée localement dans SQLite
                avec un horodatage et un ID unique.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <RefreshCw className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold text-sm mb-1">2. Détection Connectivité</h4>
              <p className="text-xs text-muted-foreground">
                Le système surveille en permanence la connectivité. Dès qu&apos;internet est disponible,
                la synchronisation démarre automatiquement en arrière-plan.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <Upload className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold text-sm mb-1">3. Delta Sync</h4>
              <p className="text-xs text-muted-foreground">
                Seuls les changements (deltas) sont envoyés, pas les données complètes.
                Résolution des conflits par CRDT (Last-Write-Wins avec règles métier).
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Performance cible :</strong> Synchronisation complète en moins de 30 secondes
              sur réseau 3G (1 Mo de données max). Support de la synchronisation partielle et de la reprise après interruption.
            </p>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="3.4 Sécurité et Conformité" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Lock, title: 'Chiffrement AES-256', desc: 'Toutes les données sont chiffrées au repos (AES-256) et en transit (TLS 1.3). La DB locale SQLite est chiffrée avec SQLCipher.' },
          { icon: Shield, title: 'RBAC Granulaire', desc: 'Contrôle d\'accès basé sur les rôles avec permissions fines. Chaque hôpital définit ses propres rôles et permissions.' },
          { icon: FileText, title: 'Audit Trail Complet', desc: 'Traçabilité de toutes les actions : qui a fait quoi, quand et depuis quel appareil. Journal immutable exportable.' },
          { icon: HardDrive, title: 'Backup Automatique', desc: 'Sauvegardes locales quotidiennes + synchronisation cloud chiffrée. Rétention de 90 jours minimum. Restauration en 1 clic.' },
        ].map((item, i) => (
          <FeatureCard key={i} {...item} status={i === 0 ? 'critical' : 'high'} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 4: MULTI-TENANT
   ───────────────────────────────────────────── */
function SectionMultiTenant() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Building2} title="Gestion Multi-Établissement" subtitle="Chaque propriétaire contrôle son hôpital de manière autonome" />

      <SubTitle title="4.1 Modèle Multi-Tenant" />
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            NYA Santé utilise un modèle <strong className="text-foreground">multi-tenant isolé par schéma</strong> (Schema-per-Tenant).
            Chaque hôpital dispose de son propre espace de données complètement isolé, garantissant la confidentialité
            et la sécurité des données médicales.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
              <Building2 className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold mb-1">Tenant = Hôpital</h4>
              <p className="text-xs text-muted-foreground">
                Un tenant représente un hôpital ou un groupe hospitalier. Données complètement isolées entre tenants.
              </p>
            </div>
            <div className="p-4 rounded-xl border-2 border-amber-300/20 bg-amber-50 dark:bg-amber-900/10">
              <Workflow className="w-8 h-8 text-amber-600 mb-3" />
              <h4 className="font-semibold mb-1">Départements Configurables</h4>
              <p className="text-xs text-muted-foreground">
                Chaque propriétaire crée ses départements, services et unités selon son organisation. Aucune limite.
              </p>
            </div>
            <div className="p-4 rounded-xl border-2 border-emerald-300/20 bg-emerald-50 dark:bg-emerald-900/10">
              <Settings className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-semibold mb-1">Configuration Autonome</h4>
              <p className="text-xs text-muted-foreground">
                Le propriétaire configure tout seul : départements, rôles, tarifs, préférences. Pas besoin de support technique.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="4.2 Hiérarchie Organisationnelle" />
      <Card>
        <CardContent className="pt-6">
          <div className="bg-muted/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground/80 leading-relaxed">{`
🏢 Groupe Hospitalier (optionnel)
  └── 🏥 Hôpital Principal
        ├── 🏗️ Département de Médecine Interne
        │     ├── 👨‍⚕️ Service de Cardiologie
        │     ├── 👨‍⚕️ Service de Pneumologie
        │     └── 👨‍⚕️ Service de Gastro-entérologie
        ├── 🏗️ Département de Chirurgie
        │     ├── 🔪 Service de Chirurgie Générale
        │     ├── 🔪 Service d'Orthopédie
        │     └── 🔪 Bloc Opératoire
        ├── 🏗️ Département de Pédiatrie
        ├── 🏗️ Département de Maternité
        │     ├── 👶 Service de Gynécologie
        │     └── 👶 Service de Néonatologie
        ├── 🏗️ Laboratoire
        ├── 🏗️ Imagerie Médicale
        ├── 🏗️ Pharmacie
        ├── 🏗️ Urgences
        ├── 🏗️ Administration & RH
        └── 🏗️ Hôpital Secondaire (même groupe)
              └── ... (même structure)`}</pre>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="4.3 Système de Rôles et Permissions" />
      <p className="text-muted-foreground mb-4">
        Le propriétaire de l&apos;hôpital peut créer des rôles personnalisés et attribuer des permissions granulaires.
        Voici les rôles prédéfinis :
      </p>
      <Accordion type="single" collapsible className="space-y-2">
        {[
          {
            role: 'Super Administrateur (Propriétaire)',
            desc: 'Accès total à toutes les fonctionnalités. Crée les départements, les rôles, gère les abonnements.',
            perms: ['Gestion complète', 'Création de départements', 'Gestion des rôles', 'Rapports stratégiques', 'Configuration système']
          },
          {
            role: 'Médecin Chef de Département',
            desc: 'Gestion de son département : planning, personnel, validation des actes médicaux.',
            perms: ['Gestion du département', 'Validation des consultations', 'Planning du service', 'Rapports départementaux', 'Gestion des files d\'attente']
          },
          {
            role: 'Médecin',
            desc: 'Consultations, ordonnances, accès aux dossiers patients de son département.',
            perms: ['Consultations', 'Ordonnances', 'Dossiers patients', 'Résultats labo', 'Demandes d\'examens']
          },
          {
            role: 'Infirmier(e)',
            desc: 'Suivi des patients, injections, constante vitales, soins infirmiers.',
            perms: ['Constantes vitales', 'Administration des soins', 'Planning infirmier', 'Alertes patients', 'Rapport de garde']
          },
          {
            role: 'Laborantin',
            desc: 'Gestion des analyses, saisie des résultats, validation technique.',
            perms: ['Réception des échantillons', 'Saisie des résultats', 'Validation technique', 'Gestion des stocks labo']
          },
          {
            role: 'Pharmacien',
            desc: 'Gestion de la pharmacie, délivrance des médicaments, gestion des stocks.',
            perms: ['Délivrance médicaments', 'Gestion des stocks', 'Alertes péremption', 'Commandes fournisseurs']
          },
          {
            role: 'Réceptionniste / Caissier',
            desc: 'Accueil, enregistrement patients, prise de rendez-vous, encaissement.',
            perms: ['Enregistrement patients', 'Prise de rendez-vous', 'Encaissement', 'Impression reçus', 'Mobile Money']
          },
          {
            role: 'Patient',
            desc: 'Application mobile pour prendre RDV, voir ses résultats, payer en ligne.',
            perms: ['Prise de rendez-vous', 'Historique médical', 'Résultats d\'analyses', 'Paiement Mobile Money', 'Notifications SMS']
          },
        ].map((item, i) => (
          <AccordionItem key={i} value={`role-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">{item.role}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.perms.map((perm, j) => (
                  <Badge key={j} variant="secondary" className="text-xs">{perm}</Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <SubTitle title="4.4 Création de Départements par le Propriétaire" />
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            Chaque propriétaire d&apos;hôpital peut créer un nombre illimité de départements personnalisés.
            L&apos;interface permet une configuration intuitive en quelques clics :
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { step: '1', title: 'Nommer le Département', desc: 'Ex: "Cardiologie", "Maternité", "Urgences", ou tout nom personnalisé.' },
              { step: '2', title: 'Définir le Type', desc: 'Clinique, Chirurgical, Technique (Labo, Imagerie), Administratif, ou Personnalisé.' },
              { step: '3', title: 'Assigner un Responsable', desc: 'Sélectionner un médecin ou un chef de service parmi le personnel existant.' },
              { step: '4', title: 'Configurer les Permissions', desc: 'Définir quels rôles ont accès aux fonctionnalités du département.' },
              { step: '5', title: 'Ajouter des Services', desc: 'Créer des sous-services (ex: Cardiologie → Consultation, ECG, Échographie).' },
              { step: '6', title: 'Paramétrer les Tarifs', desc: 'Définir les tarifs des consultations, actes et examens du département.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 5: MODULES FONCTIONNELS (PART 1)
   ───────────────────────────────────────────── */
function SectionModules() {
  const [activeModule, setActiveModule] = useState('patients')

  const modules = [
    {
      id: 'patients', icon: Heart, title: 'Gestion des Patients', status: 'critical',
      features: [
        'Inscription complète (nom, date naissance, sexe, adresse, contact, N° pièce identité)',
        'Photo du patient (prise depuis la caméra du téléphone)',
        'Génération automatique d\'un numéro de dossier unique',
        'Historique médical complet et chronologique',
        'Groupe sanguin, allergies, antécédents médicaux et chirurgicaux',
        'Contacts d\'urgence (jusqu\'à 3)',
        'Assurance maladie (numéro, type, couverture)',
        'Recherche rapide par nom, numéro, téléphone ou date',
        'Import/export de données patients (CSV, JSON)',
        'Statistiques démographiques par âge, sexe, localisation',
        'QR Code patient pour identification rapide au scanner',
        'Dossiers familiaux (liens parents-enfants)',
      ]
    },
    {
      id: 'dme', icon: FileText, title: 'Dossier Médical Électronique (DME)', status: 'critical',
      features: [
        'Dossier médical structuré et normalisé (HL7 FHIR)',
        'Notes de consultation structurées (SOAP : Subjectif, Objectif, Analyse, Plan)',
        'Antécédents médicaux, chirurgicaux, familiaux',
        'Liste des allergies et intolérances avec niveau de sévérité',
        'Vaccinations (date, vaccin, lot, prochain rappel)',
        'Mesures anthropométriques (poids, taille, IMC, tension, température)',
        'Courbes de croissance pédiatriques (OMS)',
        'Documents attachés (radios, comptes rendus externes)',
        'Historique des hospitalisations et interventions',
        'Résumé de dossier exportable (PDF, impressions)',
        'Partage sécurisé entre médecins du même département',
        'Signature électronique des médecins sur les actes',
      ]
    },
    {
      id: 'consultations', icon: Stethoscope, title: 'Consultations', status: 'critical',
      features: [
        'Prise de rendez-vous (en ligne, par téléphone, walk-in)',
        'File d\'attente virtuelle avec notifications SMS',
        'Consultation en présentiel avec template SOAP',
        'Consultation à distance (téléconsultation via app)',
        'Prescription d\'examens complémentaires (labo, imagerie)',
        'Ordonnance numérique avec envoi direct à la pharmacie',
        'Certificats médicaux (arrêt maladie, certificat de guérison, aptitude)',
        'Orientations et transferts inter-services ou inter-hôpitaux',
        'Comptes-rendus de consultation imprimables',
        'Suivi des consultations : nombre, durée, médecin, type',
        'Tarification configurable par type de consultation',
        'Rappel automatique de rendez-vous (SMS et notification app)',
      ]
    },
    {
      id: 'ordonnances', icon: Receipt, title: 'Ordonnances et Prescriptions', status: 'critical',
      features: [
        'Création d\'ordonnances avec base de données de médicaments',
        'Recherche rapide de médicaments (nom, DCI, classe thérapeutique)',
        'Posologie automatique calculée selon le poids/âge du patient',
        'Vérification des interactions médicamenteuses',
        'Alerte allergie patient vs médicament prescrit',
        'Ordonnance numérique signée électroniquement',
        'Envoi direct à la pharmacie de l\'hôpital',
        'Impression de l\'ordonnance pour pharmacie externe',
        'Renouvellement d\'ordonnance en un clic',
        'Historique complet des prescriptions par patient',
        'Modèles d\'ordonnances prédéfinis par spécialité',
        'Support des protocoles thérapeutiques nationaux',
      ]
    },
    {
      id: 'labo', icon: Microscope, title: 'Laboratoire', status: 'high',
      features: [
        'Catalogue d\'analyses configurable par l\'hôpital',
        'Prise en charge des échantillons avec code-barres/QR',
        'Saisie des résultats avec valeurs de référence',
        'Alertes automatiques si résultats critiques (flaggage)',
        'Validation technique par le laborantin puis biologique par le médecin',
        'Impression des résultats avec logo de l\'hôpital',
        'Envoi automatique des résultats au médecin prescripteur',
        'Notification SMS au patient quand résultats prêts',
        'Suivi de la chaîne de froid (température réfrigérateurs)',
        'Gestion des stocks de réactifs et consommables',
        'Statistiques : nombre d\'analyses, délais, rendement',
        'Interface avec les analyseurs automatiques (optionnel)',
      ]
    },
    {
      id: 'imagerie', icon: Eye, title: 'Imagerie Médicale', status: 'high',
      features: [
        'Demande d\'examen d\'imagerie depuis la consultation',
        'Planning de rendez-vous pour les examens',
        'Stockage des images (DICOM) avec compression',
        'Comptes-rendus radiologiques structurés',
        'Signature électronique du radiologue',
        'Visualisation des images sur tablette/smartphone',
        'Partage sécurisé avec le médecin demandeur',
        'Historique des examens par patient',
        'Gestion des contre-indications (allergie iode, grossesse)',
        'Statistiques par type d\'examen',
      ]
    },
    {
      id: 'pharmacie', icon: Pill, title: 'Pharmacie et Stocks', status: 'high',
      features: [
        'Catalogue de médicaments avec code CIP, DCI, classe',
        'Gestion des entrées (commandes, retours, transferts)',
        'Gestion des sorties (délivrance aux patients, services)',
        'Stock en temps réel par médicament et lot',
        'Alertes de seuil minimum de stock',
        'Gestion des dates de péremption (FEFO : First Expired First Out)',
        'Inventaire tournant avec tableau de bord',
        'Commandes fournisseurs automatisées',
        'Traçabilité complète (lot, fournisseur, date)',
        'Valorisation du stock (PMP, FIFO)',
        'Rapports de consommation par service/département',
        'Gestion multi-pharmacies (pharmacie principale + satellites)',
      ]
    },
    {
      id: 'facturation', icon: CreditCard, title: 'Facturation et Paiements', status: 'critical',
      features: [
        'Tarification configurable par acte, service et département',
        'Génération automatique de factures après actes',
        'Support Mobile Money (MTN, Orange, M-Pesa, Wave)',
        'Support espèces, carte bancaire, virement',
        'Paiement échelonné et suivi des impayés',
        'Reçus imprimables et envoyés par SMS',
        'Gestion des assurances maladie (tiers payant)',
        'Rabais et exonérations configurables',
        'Clôture de caisse journalière',
        'Rapports financiers : recettes, impayés, par moyen de paiement',
        'Export comptable (format OHADA)',
        'Multi-devises (FCFA, USD, EUR, devises locales)',
      ]
    },
    {
      id: 'rdv', icon: Calendar, title: 'Gestion des Rendez-vous', status: 'high',
      features: [
        'Agenda partagé par médecin et par service',
        'Prise de RDV en ligne (app patient) et au guichet',
        'Créneaux configurables par médecin (durée, type)',
        'File d\'attente avec position en temps réel',
        'Rappel SMS automatique (24h et 2h avant)',
        'Gestion des annulations et reports',
        'Statistiques de présence/absence',
        'Planning multi-médecins avec vue globale',
        'Synchronisation offline (RDV pris hors-ligne sync au retour)',
      ]
    },
    {
      id: 'hospitalisation', icon: BedDouble, title: 'Hospitalisation', status: 'high',
      features: [
        'Gestion des lits (plan de l\'hôpital, disponibilité)',
        'Admission, transfert et sortie de patients',
        'Dossier d\'hospitalisation avec suivi quotidien',
        'Prescriptions médicales continues',
        'Feuille de soins infirmiers numérisée',
        'Surveillance des constantes vitales',
        'Résumé de sortie automatique',
        'Facturation au forfait ou à l\'acte',
        'Statistiques : durée moyenne, taux d\'occupation, lits disponibles',
      ]
    },
    {
      id: 'bloc-operatoire', icon: Scissors, title: 'Bloc Opératoire et Chirurgie', status: 'medium',
      features: [
        'Planning chirurgical (programme opératoire)',
        'Gestion des salles d\'opération',
        'Check-list OMS de sécurité chirurgicale',
        'Dossiers opératoires complets',
        'Suivi du parcours chirurgical du patient',
        'Gestion du matériel chirurgical et stérilisation',
        'Comptes-rendus opératoires',
      ]
    },
    {
      id: 'urgences', icon: AlertTriangle, title: 'Urgences', status: 'critical',
      features: [
        'Triage avec classification (I à IV)',
        'Prise en charge rapide avec formulaire minimal',
        'Suivi en temps réel des patients aux urgences',
        'Transfert vers les services appropriés',
        'Statistiques d\'urgences (fréquentation, motifs, délais)',
        'Alertes et notifications en temps réel',
      ]
    },
    {
      id: 'maternite', icon: Baby, title: 'Maternité et Néonatologie', status: 'high',
      features: [
        'Suivi de grossesse (CPN, échographies, analyses)',
        'Carnet de grossesse numérique',
        'Déclaration de naissance et certificat',
        'Suivi néonatal (courbes de poids, vaccinations)',
        'Alertes de grossesse à risque',
        'Planning des accouchements',
      ]
    },
    {
      id: 'rh', icon: UserCog, title: 'Ressources Humaines', status: 'medium',
      features: [
        'Fiche employé complète (diplômes, contrats, salaires)',
        'Gestion des présences et pointages',
        'Planning de garde et congés',
        'Gestion des salaires et avances',
        'Tableau de bord RH',
        'Documents administratifs (attestations, certificats)',
      ]
    },
    {
      id: 'rapports', icon: BarChart3, title: 'Rapports et Tableaux de Bord', status: 'high',
      features: [
        'Dashboard avec KPIs en temps réel',
        'Rapports d\'activité (consultations, hospitalisations, urgences)',
        'Rapports financiers (recettes, dépenses, bénéfices)',
        'Rapports de stock (médicaments, réactifs, consommables)',
        'Rapports RH (présences, productivité)',
        'Exportation en PDF, Excel, impression',
        'Personnalisation des rapports',
        'Planification de rapports automatiques (envoi par email)',
      ]
    },
    {
      id: 'messagerie', icon: MessageSquare, title: 'Messagerie et Notifications', status: 'medium',
      features: [
        'Messagerie interne entre les membres de l\'équipe',
        'Notifications push dans l\'application',
        'Notifications SMS pour les patients (sans smartphone)',
        'Rappels de rendez-vous',
        'Alertes résultats d\'analyses',
        'Annonces et communications institutionnelles',
      ]
    },
  ]

  const activeMod = modules.find(m => m.id === activeModule)!

  return (
    <div className="space-y-6">
      <SectionTitle icon={Layers} title="Modules Fonctionnels" subtitle="16 modules couvrant 100% des besoins hospitaliers" />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Module List */}
        <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                activeModule === mod.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              <mod.icon className="w-4 h-4 shrink-0" />
              <span className="truncate font-medium">{mod.title}</span>
              {activeModule === mod.id && (
                <Badge variant="secondary" className="ml-auto text-xs bg-white/20 text-inherit border-0 shrink-0">
                  {mod.features.length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Module Detail */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <activeMod.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{activeMod.title}</CardTitle>
                  <CardDescription>{activeMod.features.length} fonctionnalités détaillées</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={
                activeMod.status === 'critical' ? 'border-red-300 text-red-700 dark:text-red-400' :
                activeMod.status === 'high' ? 'border-amber-300 text-amber-700 dark:text-amber-400' :
                'border-blue-300 text-blue-700 dark:text-blue-400'
              }>
                {activeMod.status === 'critical' ? 'Critique' : activeMod.status === 'high' ? 'Priorité Haute' : 'Moyenne'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {activeMod.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 6: APPLICATIONS ANDROID
   ───────────────────────────────────────────── */
function SectionAndroid() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Smartphone} title="Applications Android" subtitle="3 applications natives pour couvrir tous les utilisateurs" />

      <SubTitle title="6.1 Application Patient" />
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" /> Fonctionnalités
              </h4>
              <ul className="space-y-2">
                {[
                  'Inscription et authentification (téléphone + PIN)',
                  'Prise de rendez-vous en ligne (offline possible)',
                  'Historique médical personnel consultable',
                  'Résultats d\'analyses et examens',
                  'Ordonnances numériques',
                  'Paiement via Mobile Money',
                  'Notifications de rappel (push + SMS)',
                  'Carte d\'identité santé (QR Code)',
                  'Recherche de médecins et services',
                  'Chat avec le médecin (messagerie intégrée)',
                  'Téléconsultation (appels vidéo/audio)',
                  'Mode offline : consultation de l\'historique, RDV pris hors-ligne',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h5 className="font-medium text-sm mb-2">Spécifications Techniques</h5>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">Langage :</strong> Kotlin + Jetpack Compose</p>
                  <p><strong className="text-foreground">API Minimum :</strong> Android 7.0 (API 24)</p>
                  <p><strong className="text-foreground">Taille APK :</strong> &lt; 15 MB (sans données)</p>
                  <p><strong className="text-foreground">RAM Requise :</strong> 1.5 GB minimum</p>
                  <p><strong className="text-foreground">DB Locale :</strong> SQLite + Room</p>
                  <p><strong className="text-foreground">Auth :</strong> Téléphone + PIN (pas d\'email requis)</p>
                  <p><strong className="text-foreground">PWA :</strong> Oui, pour accès navigateur</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <h5 className="font-medium text-sm mb-2 text-amber-700 dark:text-amber-400">Optimisations Afrique</h5>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Interface en Français, Anglais, Arabe, Wolof, etc.</li>
                  <li>• Mode économie de données (images compressées)</li>
                  <li>• SMS fallback pour les notifications</li>
                  <li>• Fonctionne sur réseau 2G pour les messages essentiels</li>
                  <li>• Pas de compte Google requis pour l\'inscription</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="6.2 Application Personnel Médical" />
      <Card className="border-l-4 border-l-teal-500">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Stethoscope, role: 'Médecin',
                features: ['Dossiers patients (offline)', 'Consultations SOAP', 'Ordonnances numériques', 'Résultats labo & imagerie', 'Prescriptions d\'examens', 'Certificats médicaux', 'Téléconsultation', 'Agenda et planning', 'Messagerie interne']
              },
              {
                icon: Users, role: 'Infirmier(e)',
                features: ['Constantes vitales', 'Administration des soins', 'Feuille de garde', 'Planning des soins', 'Alertes patients', 'Traçabilité des actes', 'Messagerie', 'Dossiers patients (lecture)', 'Signalement médecin']
              },
              {
                icon: Microscope, role: 'Laborantin',
                features: ['Réception échantillons', 'Saisie des résultats', 'Validation technique', 'Gestion des stocks', 'Impression résultats', 'Statistiques labo', 'Chaîne de froid', 'Code-barres / QR']
              },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">{item.role}</h4>
                </div>
                <ul className="space-y-1.5">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs">
                      <ArrowRight className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SubTitle title="6.3 Application Administration" />
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            L&apos;application d&apos;administration permet au propriétaire et aux gestionnaires de piloter
            l&apos;ensemble de l&apos;hôpital depuis leur smartphone, même sans internet.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Dashboard', desc: 'KPIs en temps réel : consultations, revenus, lits occupés, files d\'attente, alertes.' },
              { title: 'Départements', desc: 'Création, modification et suppression de départements et services en toute autonomie.' },
              { title: 'Personnel', desc: 'Gestion des employés : ajout, rôles, permissions, planning, pointage.' },
              { title: 'Finance', desc: 'Recettes, dépenses, factures, impayés, clôtures de caisse, rapports.' },
              { title: 'Stock', desc: 'Pharmacie, consommables, réactifs : entrées, sorties, alertes, commandes.' },
              { title: 'Configuration', desc: 'Tarifs, langues, préférences, intégrations, sauvegardes, paramètres système.' },
            ].map((item, i) => (
              <FeatureCard key={i} icon={Settings} title={item.title} description={item.desc} />
            ))}
          </div>
        </CardContent>
      </Card>

      <SubTitle title="6.4 Fonctionnement Hors-Ligne Détaillé" />
      <Card>
        <CardContent className="pt-6">
          <SpecTable
            headers={['Fonctionnalité', 'Hors-Ligne', 'Sync Auto', 'Notes']}
            rows={[
              ['Consulter un dossier patient', '✅ Oui', '✅ Oui', 'Données locales SQLite'],
              ['Créer une consultation', '✅ Oui', '✅ Oui', 'Sync quand connexion disponible'],
              ['Rédiger une ordonnance', '✅ Oui', '✅ Oui', 'Signature différée possible'],
              ['Saisir des résultats labo', '✅ Oui', '✅ Oui', 'Validation en ligne requise'],
              ['Prendre un rendez-vous', '✅ Oui', '✅ Oui', 'Vérification conflits au sync'],
              ['Paiement Mobile Money', '❌ Non', '—', 'Requiert connexion internet'],
              ['Envoi de SMS', '⚠️ File d\'attente', '✅ Oui', 'Envoi dès connexion'],
              ['Recherche patient globale', '⚠️ Local only', '—', 'Recherche locale uniquement'],
              ['Mise à jour profil patient', '✅ Oui', '✅ Oui', 'Sync bidirectionnelle'],
              ['Génération de rapports', '✅ Oui (basiques)', '—', 'Données locales uniquement'],
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 7: ADAPTATIONS AFRICAINES
   ───────────────────────────────────────────── */
function SectionAdaptations() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Globe} title="Adaptations Africaines" subtitle="Conçu spécifiquement pour les réalités du continent africain" />

      <SubTitle title="7.1 Fonctionnement Offline-First" />
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            Le principe fondamental de NYA Santé : <strong className="text-foreground">l&apos;application doit fonctionner
            à 100% sans connexion internet</strong>. C&apos;est le différenciateur majeur par rapport à toutes les
            solutions occidentales.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Ce qui fonctionne hors-ligne
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {['Consultation de tous les dossiers patients', 'Création de consultations et ordonnances', 'Saisie des résultats de laboratoire', 'Prise de rendez-vous', 'Gestion de la file d\'attente', 'Consultation du planning', 'Recherche locale de patients', 'Saisie des constantes vitales', 'Rédaction de certificats médicaux', 'Consultation de l\'historique médical'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Ce qui nécessite internet
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {['Paiement Mobile Money', 'Envoi de SMS (file d\'attente)', 'Synchronisation des données', 'Téléconsultation vidéo', 'Mise à jour de l\'application', 'Envoi de notifications push', 'Export de rapports par email', 'Partage de dossiers inter-hôpitaux'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="7.2 Intégration Mobile Money" />
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            L&apos;intégration des paiements mobiles est native et prioritaire. En Afrique, plus de 60% des adultes
            utilisent Mobile Money, contre seulement 10-20% les comptes bancaires.
          </p>
          <SpecTable
            headers={['Opérateur', 'Pays Couverts', 'Statut', 'Fonctionnalités']}
            rows={[
              ['MTN Mobile Money', 'Cameroun, Côte d\'Ivoire, Ghana, Guinée, RDC, etc.', 'Phase 1', 'Paiement, remboursement, vérification solde'],
              ['Orange Money', 'Cameroun, CI, Sénégal, Mali, Guinée, etc.', 'Phase 1', 'Paiement, remboursement, vérification solde'],
              ['M-Pesa', 'Kenya, Tanzanie, Mozambique, RDC', 'Phase 1', 'Paiement, remboursement, vérification solde'],
              ['Wave', 'Sénégal, Côte d\'Ivoire', 'Phase 1', 'Paiement, remboursement, vérification solde'],
              ['Moov Money', 'Bénin, Togo, Burkina Faso, CI', 'Phase 2', 'Paiement, remboursement'],
              ['Airtel Money', 'Nigeria, Ouganda, Rwanda, Malawi', 'Phase 2', 'Paiement, remboursement'],
              ['EcoCash', 'Zimbabwe', 'Phase 2', 'Paiement'],
              ['Paiement Espèces', 'Tous les pays', 'Phase 1', 'Encaissement manuel, reçu imprimé'],
            ]}
          />
        </CardContent>
      </Card>

      <SubTitle title="7.3 SMS et Notifications" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Rappels de Rendez-vous', desc: 'SMS automatique 24h et 2h avant le rendez-vous. Configurable par patient et par hôpital.', icon: Bell },
          { title: 'Résultats d\'Analyses', desc: 'Notification SMS quand les résultats sont prêts. Le patient peut venir les chercher ou les consulter dans l\'app.', icon: Microscope },
          { title: 'Alertes Médicales', desc: 'Notifications pour les rappels de vaccins, suivi de grossesse, renouvellement de traitement chronique.', icon: AlertTriangle },
          { title: 'Rappels de Paiement', desc: 'Notification douce pour les impayés. Rappel avant la relance officielle. Personnalisable.', icon: Receipt },
        ].map((item, i) => (
          <FeatureCard key={i} {...item} icon={item.icon} />
        ))}
      </div>

      <SubTitle title="7.4 Multilinguisme" />
      <Card>
        <CardContent className="pt-6">
          <SpecTable
            headers={['Langue', 'Zone', 'Statut', 'Couverture']}
            rows={[
              ['Français', 'Afrique Francophone (24 pays)', 'Phase 1', 'Interface complète + données'],
              ['Anglais', 'Afrique Anglophone (21 pays)', 'Phase 1', 'Interface complète + données'],
              ['Arabe', 'Afrique du Nord (7 pays)', 'Phase 1', 'Interface complète (RTL)'],
              ['Portugais', 'PALOP (5 pays)', 'Phase 2', 'Interface complète'],
              ['Swahili', 'Est Africain (5 pays)', 'Phase 2', 'Interface complète'],
              ['Wolof', 'Sénégal', 'Phase 2', 'Interface complète'],
              ['Lingala', 'Congo, RDC', 'Phase 2', 'Interface complète'],
              ['Bambara', 'Mali', 'Phase 3', 'Interface complète'],
              ['Hausa', 'Nigeria, Niger, etc.', 'Phase 3', 'Interface complète'],
              ['Amharique', 'Éthiopie', 'Phase 3', 'Interface complète'],
              ['Perso (ajout utilisateur)', 'Toutes', 'Phase 2', 'Traduction communautaire'],
            ]}
          />
        </CardContent>
      </Card>

      <SubTitle title="7.5 Conformité Réglementaire" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'OHADA', desc: 'Conformité avec les normes comptables de l\'Organisation pour l\'Harmonisation en Afrique du Droit des Affaires.', icon: FileText },
          { title: 'CEDEAO', desc: 'Respect des directives de la Communauté Économique des États de l\'Afrique de l\'Ouest sur la santé et les données.', icon: Globe },
          { title: 'UA / OMS', desc: 'Alignement avec les stratégies de l\'Union Africaine et de l\'OMS pour la santé numérique en Afrique.', icon: Star },
          { title: 'HL7 FHIR', desc: 'Interopérabilité avec les standards internationaux de santé numérique. Export/import au format FHIR.', icon: Database },
        ].map((item, i) => (
          <FeatureCard key={i} {...item} status="high" />
        ))}
      </div>

      <SubTitle title="7.6 Optimisation Faible Bande Passante" />
      <Card className="nya-gradient text-white">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-4">Stratégies d&apos;Optimisation</h4>
              <ul className="space-y-2">
                {[
                  'Compression de toutes les données échangées (gzip/brotli)',
                  'Synchronisation delta (seuls les changements sont envoyés)',
                  'Mise en cache agressive des données fréquemment consultées',
                  'Images et documents compressés côté client avant envoi',
                  'Mode texte-only pour les connexions très lentes',
                  'Priorisation des données critiques (sync médicale avant sync admin)',
                  'Reprise automatique des transferts interrompus',
                  'Batching des requêtes pour réduire le nombre d\'appels',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/10">
                <div className="text-3xl font-bold text-amber-300">&lt; 1 Mo</div>
                <p className="text-sm text-white/70 mt-1">Données par synchronisation complète</p>
              </div>
              <div className="p-4 rounded-lg bg-white/10">
                <div className="text-3xl font-bold text-amber-300">&lt; 30 sec</div>
                <p className="text-sm text-white/70 mt-1">Temps de sync sur réseau 3G</p>
              </div>
              <div className="p-4 rounded-lg bg-white/10">
                <div className="text-3xl font-bold text-amber-300">&lt; 15 MB</div>
                <p className="text-sm text-white/70 mt-1">Taille de l\'APK Android</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 8: SÉCURITÉ
   ───────────────────────────────────────────── */
function SectionSecurite() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Shield} title="Sécurité et Confidentialité" subtitle="Protection maximale des données médicales sensibles" />

      <SubTitle title="8.1 Chiffrement et Protection des Données" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Chiffrement au Repos', desc: 'Toutes les données stockées sont chiffrées avec AES-256. La base de données locale (SQLite) est protégée par SQLCipher.', status: 'critical' },
          { title: 'Chiffrement en Transit', desc: 'Toutes les communications utilisent TLS 1.3. Les certificats sont gérés automatiquement avec renouvellement.', status: 'critical' },
          { title: 'Hachage des Mots de Passe', desc: 'Les mots de passe sont hachés avec bcrypt (cost 12). Les PIN sont hachés séparément avec un sel unique par utilisateur.', status: 'critical' },
          { title: 'Protection de la Clé de Chiffrement', desc: 'La clé maîtresse est stockée dans un HSM (Hardware Security Module) ou un KMS (Key Management Service).', status: 'high' },
        ].map((item, i) => (
          <FeatureCard key={i} icon={Lock} {...item} />
        ))}
      </div>

      <SubTitle title="8.2 Gestion des Accès" />
      <Card>
        <CardContent className="pt-6">
          <SpecTable
            headers={['Mécanisme', 'Description', 'Niveau']}
            rows={[
              ['JWT + Refresh Token', 'Authentification stateless avec token de 15 min + refresh 7 jours', 'Standard'],
              ['Auth PIN (6 chiffres)', 'Alternative pour les utilisateurs sans mot de passe complexe', 'Afrique'],
              ['Auth Biométrique', 'Empreinte digitale et reconnaissance faciale sur les appareils compatibles', 'Optionnel'],
              ['2FA SMS', 'Double authentification par code SMS pour les actions sensibles', 'Recommandé'],
              ['Verrouillage Auto', 'Verrouillage de l\'app après 2 min d\'inactivité', 'Obligatoire'],
              ['Révocation de Token', 'Révocation immédiate en cas de vol/perte d\'appareil', 'Critique'],
              ['Audit des Connexions', 'Historique de toutes les connexions (appareil, lieu, date)', 'Standard'],
            ]}
          />
        </CardContent>
      </Card>

      <SubTitle title="8.3 Audit Trail" />
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            Chaque action dans NYA Santé est enregistrée dans un journal d&apos;audit immutable :
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Users, title: 'Qui', desc: 'Utilisateur, rôle, département, appareil, adresse IP' },
              { icon: Clock, title: 'Quand', desc: 'Horodatage précis (timezone locale + UTC)' },
              { icon: FileText, title: 'Quoi', desc: 'Action effectuée, données modifiées (avant/après)' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-muted/50">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SubTitle title="8.4 Sauvegarde et Récupération" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Backup Local Quotidien', desc: 'Sauvegarde automatique quotidienne sur l\'appareil. Rétention de 30 jours. Chiffrée.' },
          { title: 'Backup Cloud Hebdomadaire', desc: 'Sauvegarde chiffrée sur le cloud (AWS S3). Multi-région. Rétention 90 jours.' },
          { title: 'Restauration en 1 Clic', desc: 'Restauration complète ou sélective depuis n\'importe quel backup. Guidée pas à pas.' },
          { title: 'Disaster Recovery', desc: 'Plan de reprise d\'activité : RTO &lt; 4h, RPO &lt; 1h. Testé trimestriellement.' },
        ].map((item, i) => (
          <FeatureCard key={i} icon={HardDrive} {...item} status="high" />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 9: PLANNING
   ───────────────────────────────────────────── */
function SectionPlanning() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={CalendarDays} title="Planning de Développement" subtitle="Roadmap en 3 phases sur 9 mois" />

      <div className="grid lg:grid-cols-3 gap-6">
        <PhaseCard
          phase="PHASE 1"
          title="MVP - Fondations"
          duration="Mois 1-3"
          progress={33}
          items={[
            'Infrastructure multi-tenant et base de données',
            'Application Android Patient (inscription, RDV, dossier)',
            'Application Android Personnel (consultations, ordonnances)',
            'Module Gestion des Patients',
            'Module Dossiers Médicaux (DME)',
            'Module Consultations',
            'Module Ordonnances',
            'Synchronisation offline (core engine)',
            'Intégration Mobile Money (MTN, Orange)',
            'Notifications SMS basiques',
            'Dashboard Web Admin (basique)',
            'Authentification (JWT + PIN)',
            'Déploiement dans 3 hôpitaux pilotes',
          ]}
        />
        <PhaseCard
          phase="PHASE 2"
          title="Fonctionnalités Avancées"
          duration="Mois 4-6"
          progress={66}
          items={[
            'Module Laboratoire complet',
            'Module Pharmacie et Gestion des Stocks',
            'Module Facturation avancée',
            'Module Hospitalisation',
            'Module Urgences avec triage',
            'Module Maternité et Néonatologie',
            'Module Bloc Opératoire',
            'Module RH (personnel, pointage)',
            'Application Android Admin complète',
            'Synchronisation avancée (CRDT, résolution conflits)',
            'Multi-langues (FR, EN, AR + 4 langues locales)',
            'Intégration M-Pesa, Wave + autres Mobile Money',
            'Rapports et tableaux de bord avancés',
            'Messagerie interne',
            'Déploiement dans 50 hôpitaux',
          ]}
        />
        <PhaseCard
          phase="PHASE 3"
          title="IA et Expansion"
          duration="Mois 7-9"
          progress={100}
          items={[
            'IA : Aide au diagnostic (symptômes → pathologies probables)',
            'IA : Prédiction de risques (réadmission, complications)',
            'IA : Optimisation du planning (prédiction de fréquentation)',
            'IA : Analyse des stocks et prévision de commande',
            'Module Imagerie (DICOM viewer, IA radiologie)',
            'Interopérabilité HL7 FHIR complète',
            'Téléconsultation vidéo/audio intégrée',
            'USSD pour les patients sans smartphone',
            'Portail Web Patient (responsive)',
            'API ouverte pour intégrations tierces',
            'Marketplace de modules (extensions)',
            'Conformité complète (OHADA, CEDEAO, UA)',
            'Certification ISO 27001 (sécurité)',
            'Déploiement dans 500+ hôpitaux',
            'Expansion dans 10+ pays africains',
          ]}
        />
      </div>

      <SubTitle title="9.1 Jalons Critiques" />
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {[
                { date: 'Mois 1', title: 'Alpha Interne', desc: 'Première version testable en interne. Core engine + auth + patients + consultations.' },
                { date: 'Mois 2', title: 'Bêta Privée', desc: 'Déploiement dans 1 hôpital pilote. Tests réels avec patients et personnel.' },
                { date: 'Mois 3', title: 'Lancement MVP', desc: 'Version MVP stable. 3 hôpitaux pilotes. Modules essentiels opérationnels.' },
                { date: 'Mois 5', title: 'Version Complète', desc: 'Tous les 16 modules opérationnels. 50 hôpitaux en production.' },
                { date: 'Mois 7', title: 'Version IA', desc: 'Fonctionnalités IA intégrées. Téléconsultation. Interopérabilité FHIR.' },
                { date: 'Mois 9', title: 'Lancement Continental', desc: '500+ hôpitaux. 10+ pays. Marketplace de modules. Certification ISO 27001.' },
              ].map((milestone, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
                    <span className="text-primary-foreground text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="pb-2">
                    <Badge variant="outline" className="mb-1 text-xs">{milestone.date}</Badge>
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TAB 10: BUDGET & RESSOURCES
   ───────────────────────────────────────────── */
function SectionBudget() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={DollarSign} title="Budget et Ressources" subtitle="Estimation des coûts et composition de l'équipe" />

      <SubTitle title="10.1 Équipe de Développement" />
      <Card>
        <CardContent className="pt-6">
          <SpecTable
            headers={['Rôle', 'Nombre', 'Durée', 'Coût/Mois (USD)']}
            rows={[
              ['Chef de Projet / Product Owner', '1', '9 mois', '$4 000'],
              ['Architecte Backend (NestJS)', '2', '9 mois', '$3 500'],
              ['Développeur Backend', '3', '9 mois', '$2 500'],
              ['Développeur Android (Kotlin)', '3', '9 mois', '$3 000'],
              ['Développeur Frontend (Next.js)', '2', '9 mois', '$2 500'],
              ['Designer UI/UX', '1', '6 mois', '$2 500'],
              ['Ingénieur QA / Testeur', '2', '6 mois', '$1 800'],
              ['DevOps / SRE', '1', '9 mois', '$3 000'],
              ['Spécialiste Sécurité', '1', '3 mois', '$4 000'],
              ['Expert IA/ML', '1', '3 mois', '$4 500'],
              ['Chargé de Déploiement Terrain', '2', '6 mois', '$1 500'],
            ]}
          />
        </CardContent>
      </Card>

      <SubTitle title="10.2 Budget Prévisionnel" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">$580 000</div>
            <p className="text-sm text-muted-foreground mt-1">Phase 1 (Mois 1-3)</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">Développement MVP + Infrastructure + Pilotes</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-600">$720 000</div>
            <p className="text-sm text-muted-foreground mt-1">Phase 2 (Mois 4-6)</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">Modules avancés + Multi-langues + Déploiement 50 hôpitaux</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-600">$900 000</div>
            <p className="text-sm text-muted-foreground mt-1">Phase 3 (Mois 7-9)</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">IA + Expansion continentale + Certification</p>
          </CardContent>
        </Card>
      </div>

      <Card className="nya-gradient text-white">
        <CardContent className="pt-6 text-center">
          <p className="text-white/70 text-sm mb-1">Budget Total Projet</p>
          <div className="text-4xl sm:text-5xl font-bold text-white">$2.2 Millions USD</div>
          <p className="text-white/60 text-sm mt-3">Pour 9 mois de développement complet, de l&apos;alpha au lancement continental</p>
        </CardContent>
      </Card>

      <SubTitle title="10.3 Retour sur Investissement" />
      <Card>
        <CardContent className="pt-6">
          <SpecTable
            headers={['Scénario', 'Hôpitaux (An 1)', 'Hôpitaux (An 2)', 'Hôpitaux (An 3)', 'CA Cumulé', 'ROI']}
            rows={[
              ['Conservateur', '50', '200', '500', '$1.8M', '8 mois'],
              ['Modéré', '100', '500', '1 500', '$5.4M', '5 mois'],
              ['Optimiste', '200', '1 000', '3 000', '$12.6M', '3 mois'],
            ]}
          />
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Hypothèses :</strong> Prix moyen de $2 000/an par hôpital.
              Revenus récurrents (SaaS). Upsell modules premium et marketplace.
              Coût d&apos;acquisition client estimé à $200 par hôpital (démonstrations terrain).
            </p>
          </div>
        </CardContent>
      </Card>

      <SubTitle title="10.4 Infrastructure et Coûts Récurrents" />
      <SpecTable
        headers={['Poste', 'Coût Mensuel', 'Notes']}
        rows={[
          ['Serveurs Cloud (AWS Africa)', '$2 000 - $5 000', 'Scale selon nombre d\'utilisateurs'],
          ['CDN et Distribution', '$500 - $1 500', 'Akamai ou CloudFront pour l\'Afrique'],
          ['SMS (Twilio + locaux)', '$1 000 - $3 000', 'Dépend du volume de notifications'],
          ['Mobile Money API Fees', '$500 - $1 000', 'Frais de transaction des opérateurs'],
          ['SSL et Sécurité', '$200 - $500', 'Certificats, WAF, monitoring sécurité'],
          ['Monitoring et Alertes', '$300 - $800', 'Datadog ou équivalent'],
          ['Support et Maintenance', '$5 000 - $10 000', 'Équipe de support technique 24/7'],
          ['Total Estimé', '$9 500 - $21 800', 'Scalable selon la croissance'],
        ]}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
   ───────────────────────────────────────────── */
const tabs = [
  { value: 'vue-ensemble', label: 'Vue d\'Ensemble', icon: Eye },
  { value: 'marche', label: 'Analyse Marché', icon: BookOpen },
  { value: 'architecture', label: 'Architecture', icon: Server },
  { value: 'multi-tenant', label: 'Multi-Tenant', icon: Building2 },
  { value: 'modules', label: 'Modules (16)', icon: Layers },
  { value: 'android', label: 'Android Apps', icon: Smartphone },
  { value: 'adaptations', label: 'Adaptations Afrique', icon: Globe },
  { value: 'securite', label: 'Sécurité', icon: Shield },
  { value: 'planning', label: 'Planning', icon: CalendarDays },
  { value: 'budget', label: 'Budget', icon: DollarSign },
] as const

export default function Home() {
  const [activeTab, setActiveTab] = useState('vue-ensemble')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b mb-8">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="inline-flex h-auto gap-1 bg-transparent p-0">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value="vue-ensemble"><SectionVueEnsemble /></TabsContent>
            <TabsContent value="marche"><SectionMarche /></TabsContent>
            <TabsContent value="architecture"><SectionArchitecture /></TabsContent>
            <TabsContent value="multi-tenant"><SectionMultiTenant /></TabsContent>
            <TabsContent value="modules"><SectionModules /></TabsContent>
            <TabsContent value="android"><SectionAndroid /></TabsContent>
            <TabsContent value="adaptations"><SectionAdaptations /></TabsContent>
            <TabsContent value="securite"><SectionSecurite /></TabsContent>
            <TabsContent value="planning"><SectionPlanning /></TabsContent>
            <TabsContent value="budget"><SectionBudget /></TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="nya-gradient text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/nya-logo.png" alt="NYA Santé" width={32} height={32} className="rounded-lg" />
                <span className="font-bold text-lg">NYA Santé</span>
              </div>
              <p className="text-white/70 text-sm">
                Plateforme de gestion hospitalière nouvelle génération, conçue pour l&apos;Afrique.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Cahier de Charges</h4>
              <ul className="space-y-1.5 text-sm text-white/70">
                <li>10 sections détaillées</li>
                <li>16 modules fonctionnels</li>
                <li>3 applications Android</li>
                <li>Architecture Offline-First</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Document</h4>
              <ul className="space-y-1.5 text-sm text-white/70">
                <li>Version : 1.0</li>
                <li>Date : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li>Statut : En cours de rédaction</li>
                <li>Classification : Confidentiel</li>
              </ul>
            </div>
          </div>
          <Separator className="my-6 bg-white/20" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© {new Date().getFullYear()} NYA Santé — Tous droits réservés</p>
            <p>Conçu avec ❤️ pour l&apos;Afrique</p>
          </div>
        </div>
      </footer>
    </div>
  )
}