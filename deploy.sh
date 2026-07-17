#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# NYA Santé - Script de Déploiement Initial
# ═══════════════════════════════════════════════════════════════
#
# Ce script automatise :
# 1. Connexion à GitHub
# 2. Création du repo GitHub
# 3. Push du code
# 4. Connexion à Fly.io
# 5. Configuration du secret FLY_API_TOKEN dans GitHub
# 6. Premier déploiement
#
# Utilisation: chmod +x deploy.sh && ./deploy.sh
# ═══════════════════════════════════════════════════════════════

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   NYA Santé — Déploiement GitHub + Fly.io           ║"
echo "║   Version Web + PWA Android                         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# ─── Étape 1: GitHub Auth ───────────────────────────────────
echo "━━━ ÉTAPE 1/5: Connexion GitHub ━━━"
echo ""
if gh auth status &>/dev/null; then
    echo "✅ Déjà connecté à GitHub"
    GITHUB_USER=$(gh api user --jq .login)
    echo "   Compte: $GITHUB_USER"
else
    echo "📱 Connexion à GitHub requise..."
    echo "   Un code va s'afficher. Ouvrez l'URL dans votre navigateur."
    echo ""
    gh auth login --hostname github.com --git-protocol https --web
    GITHUB_USER=$(gh api user --jq .login)
    echo "✅ Connecté en tant que: $GITHUB_USER"
fi
echo ""

# ─── Étape 2: Création du repo GitHub ───────────────────────
echo "━━━ ÉTAPE 2/5: Création du dépôt GitHub ━━━"
REPO_NAME="nya-sante"
FULL_REPO="${GITHUB_USER}/${REPO_NAME}"

if gh repo view "$FULL_REPO" &>/dev/null; then
    echo "✅ Dépôt existe déjà: https://github.com/$FULL_REPO"
else
    echo "📦 Création du dépôt $FULL_REPO..."
    gh repo create "$REPO_NAME" \
        --public \
        --description "NYA Santé — Plateforme SaaS de Gestion Hospitalière PWA" \
        --source=. \
        --push
    echo "✅ Dépôt créé: https://github.com/$FULL_REPO"
fi
echo ""

# ─── Étape 3: Push du code ─────────────────────────────────
echo "━━━ ÉTAPE 3/5: Envoi du code sur GitHub ━━━"
git remote set-url origin "https://github.com/${FULL_REPO}.git" 2>/dev/null || \
    git remote add origin "https://github.com/${FULL_REPO}.git"

git push -u origin main --force
echo "✅ Code poussé sur GitHub"
echo ""

# ─── Étape 4: Fly.io Auth ──────────────────────────────────
echo "━━━ ÉTAPE 4/5: Connexion Fly.io ━━━"
FLYCTL_PATH=""

if command -v flyctl &>/dev/null; then
    FLYCTL_PATH="flyctl"
elif [ -f "$HOME/.fly/bin/flyctl" ]; then
    FLYCTL_PATH="$HOME/.fly/bin/flyctl"
    export PATH="$HOME/.fly/bin:$PATH"
else
    echo "📦 Installation de Fly.io CLI..."
    curl -L https://fly.io/install.sh | sh
    FLYCTL_PATH="$HOME/.fly/bin/flyctl"
    export PATH="$HOME/.fly/bin:$PATH"
fi

if $FLYCTL_PATH auth whoami &>/dev/null; then
    echo "✅ Déjà connecté à Fly.io"
else
    echo "📱 Connexion à Fly.io..."
    $FLYCTL_PATH auth login
    echo "✅ Connecté à Fly.io"
fi

# Get API token for GitHub Actions secret
echo "🔑 Récupération du token API Fly.io..."
FLY_API_TOKEN=$($FLYCTL_PATH auth token)
echo ""

# ─── Étape 5: Configuration du déploiement auto ─────────────
echo "━━━ ÉTAPE 5/5: Configuration du déploiement automatique ━━━"

# Set FLY_API_TOKEN as GitHub Actions secret
echo "🔐 Configuration du secret FLY_API_TOKEN dans GitHub..."
gh secret set FLY_API_TOKEN --repo "$FULL_REPO" --body "$FLY_API_TOKEN"
echo "✅ Secret configuré"

# Premier déploiement manuel
echo ""
echo "🚀 Premier déploiement sur Fly.io..."
$FLYCTL_PATH deploy --remote-only 2>&1 | tail -20
echo ""

# ─── Résumé ─────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !              ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "📦 GitHub:  https://github.com/$FULL_REPO"
echo "🌐 Fly.io:  https://nya-sante.fly.dev"
echo ""
echo "🔄 DÉPLOIEMENT AUTOMATIQUE ACTIVÉ:"
echo "   Chaque 'git push' vers main déploie automatiquement"
echo "   sur Fly.io via GitHub Actions."
echo ""
echo "📱 Pour installer l'app sur Android:"
echo "   1. Ouvrez https://nya-sante.fly.dev dans Chrome"
echo "   2. Menu ⋮ → 'Installer l'application'"
echo ""
echo "💻 Pour installer sur desktop:"
echo "   1. Ouvrez https://nya-sante.fly.dev dans Chrome/Edge"
echo "   2. Cliquez sur l'icône d'installation dans la barre d'adresse"
echo ""