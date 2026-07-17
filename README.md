# 🏥 NYA Santé — Plateforme SaaS de Gestion Hospitalière

<p align="center">
  <img src="public/nya-logo.png" alt="NYA Santé" width="80" height="80" />
</p>

<p align="center">
  <strong>Plateforme de gestion hospitalière nouvelle génération pour l'Afrique</strong><br/>
  Version Web + Application Android (PWA) — Même serveur, mêmes données
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/PWA-Installable-purple" alt="PWA" />
  <img src="https://img.shields.io/badge/Fly.io-Deployed-7B2FBE?logo=fly.io" alt="Deployed on Fly.io" />
</p>

---

## 🚀 Démarrage Rapide

### Déploiement automatique (recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE_USER/nya-sante.git
cd nya-sante

# 2. Installer les dépendances
bun install

# 3. Générer le client Prisma et initialiser la base
bunx prisma generate
bunx prisma db push
bun run seed

# 4. Lancer en local
bun run dev
```

### Déploiement production (GitHub + Fly.io)

Exécutez le script de déploiement initial :

```bash
./deploy.sh
```

Ce script configure :
- ✅ Connexion GitHub + création du dépôt
- ✅ Push du code
- ✅ Connexion Fly.io + déploiement
- ✅ **Déploiement automatique** à chaque `git push`

Après la configuration initiale, utilisez simplement :

```bash
./push.sh "votre message de commit"
```

---

## 📱 Version Web + Android (PWA)

L'application est une **PWA (Progressive Web App)**. Une seule codebase, deux interfaces :

| | 🌐 Version Web | 📱 Version Android |
|---|---|---|
| **Accès** | URL dans le navigateur | Icône sur l'écran d'accueil |
| **Installation** | Aucune | Menu ⋮ → "Installer l'application" |
| **Serveur** | ✅ Même serveur | ✅ Même serveur |
| **Données** | ✅ Mêmes données | ✅ Mêmes données |
| **Connexion simultanée** | ✅ Multi-appareils | ✅ Multi-appareils |
| **Hors-ligne** | Partiel | ✅ Amélioré |
| **Plein écran** | Non | ✅ Oui (standalone) |

### Installer sur Android

1. Ouvrez l'application dans **Chrome** sur Android
2. Appuyez sur le menu **⋮** (trois points)
3. Sélectionnez **"Installer l'application"**
4. L'icône NYA Santé apparaît sur votre écran d'accueil !

---

## 🏗️ Architecture

### Stack Technique

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: SQLite (volume persistant sur Fly.io)
- **État**: Zustand (client), TanStack Query (serveur)
- **PWA**: Service Worker, Web App Manifest
- **Déploiement**: Docker (Bun + Next.js standalone) → Fly.io (Paris CDG)

### Modules Fonctionnels

| Module | Description |
|--------|-------------|
| 📊 **Tableau de bord** | KPIs, graphiques, activité récente |
| ❤️ **Patients** | CRUD complet, recherche, dossier médical |
| 📋 **DME** | 6 onglets (Info, Consultations, Ordonnances, Labo, Factures, Constantes) |
| 🏢 **Départements** | Gestion des services hospitaliers |
| 👥 **Personnel** | 7 rôles (super_admin, médecin, infirmier, etc.) |
| 📅 **Rendez-vous** | Planification, rappels, annulation |
| 🩺 **Consultations** | Diagnostic, notes, prescriptions |
| 💊 **Ordonnances** | Création et gestion des prescriptions |
| 💰 **Facturation** | Factures, paiements, suivi |
| 💊 **Pharmacie** | Médicaments, alertes stock bas |
| 🔬 **Laboratoire** | Examens, résultats, statuts |
| 🔄 **Transferts** | Transferts inter-hospitaliers |
| 🛡️ **Audit** | Journal de toutes les actions |
| ⚙️ **Paramètres** | Configuration de l'établissement |
| 🌙 **Thème** | Mode clair / sombre |
| 📲 **PWA** | Installation sur mobile/desktop |

### Rôles et Permissions

| Rôle | Accès |
|------|-------|
| **super_admin** | Vue SaaS, validation abonnements, tout accès |
| **medecin_chef** | Tous les modules cliniques + gestion |
| **medecin** | Patients, consultations, ordonnances, labo |
| **infirmier** | Patients, constantes, rendez-vous |
| **laborantin** | Laboratoire |
| **pharmacien** | Pharmacie |
| **recepteur** | Patients, rendez-vous, facturation |

---

## 🔐 Compte de démonstration

| | |
|---|---|
| **Téléphone** | `655443322` |
| **Code PIN** | `123456` |
| **Profil** | Dr. Amina Nya (Médecin chef) |

---

## 📂 Structure du projet

```
nya-sante/
├── .github/workflows/
│   └── fly-deploy.yml      # Auto-déploiement GitHub → Fly.io
├── prisma/
│   ├── schema.prisma        # Schéma de base de données (17+ modèles)
│   └── seed.ts              # Données de démonstration
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service Worker
│   ├── icons/               # Icônes PWA (192, 512, maskable, apple-touch)
│   └── nya-logo.png         # Logo
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout avec meta PWA
│   │   ├── page.tsx         # Page principale (SPA)
│   │   └── globals.css      # Styles globaux + thème sombre
│   ├── api/                 # 20+ routes API REST
│   ├── components/
│   │   ├── views/           # 16 vues de l'application
│   │   ├── ui/              # Composants shadcn/ui
│   │   └── PWAInstallPrompt.tsx
│   ├── hooks/
│   │   └── usePWA.ts        # Hook PWA (install, offline, update)
│   └── lib/
│       ├── store.ts         # Zustand store
│       ├── permissions.ts   # RBAC
│       ├── constants.ts     # Constantes
│       └── helpers.ts       # Utilitaires
├── Dockerfile               # Production (Bun + Next.js standalone)
├── fly.toml                 # Configuration Fly.io (Paris CDG)
├── deploy.sh                # Script de déploiement initial
└── push.sh                  # Script de push rapide
```

---

## 🌍 Déploiement

### Fly.io (recommandé)

Le déploiement est **automatique** via GitHub Actions :
- Chaque push sur `main` déclenche un déploiement
- Région : Paris (CDG) — latence optimale pour l'Afrique
- SSL automatique (Let's Encrypt)
- Volume persistant pour SQLite

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DATABASE_URL` | Chemin SQLite | `file:/data/nya-sante.db` |
| `NODE_ENV` | Environnement | `production` |
| `PORT` | Port du serveur | `3000` |

### Configuration GitHub Actions

1. Créez un token API Fly.io : `flyctl auth token`
2. Ajoutez-le comme secret GitHub : `gh secret set FLY_API_TOKEN`
3. Le workflow `.github/workflows/fly-deploy.yml` s'occupe du reste

---

## 📄 Licence

Propriétaire — NYA Santé © 2025