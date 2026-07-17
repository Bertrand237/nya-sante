#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# NYA Santé - Script de déploiement rapide (après config initiale)
# ═══════════════════════════════════════════════════════════════
# Utilisation: ./push.sh "message de commit"
#
# Ce script:
# 1. Commit toutes les modifications
# 2. Push vers GitHub
# 3. Le déploiement Fly.io se fait AUTOMATIQUEMENT via GitHub Actions
# ═══════════════════════════════════════════════════════════════

set -e

COMMIT_MSG="${1:-Mise à jour $(date +%Y-%m-%d\ %H:%M)}"

echo "📤 Commit: $COMMIT_MSG"
git add -A
git commit -m "$COMMIT_MSG" --allow-empty

echo "🚀 Push vers GitHub..."
git push origin main

echo ""
echo "✅ Code poussé !"
echo "🔄 Déploiement Fly.io en cours via GitHub Actions..."
echo "📊 Suivez le déploiement: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo ""