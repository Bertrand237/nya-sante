'use client'

import { useState, useEffect, useRef } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Download, Smartphone, RefreshCw, WifiOff, CheckCircle2 } from 'lucide-react'

export function PWAInstallPrompt() {
  const { canInstall, isInstalled, isOnline, isUpdateAvailable, promptInstall, applyUpdate } = usePWA()
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Auto-show install prompt after 3 seconds on Android
  useEffect(() => {
    if (canInstall && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowInstallDialog(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [canInstall, isInstalled, dismissed])

  // Show update dialog (track via ref to avoid setState-in-effect)
  const updateShownRef = useRef(false)
  useEffect(() => {
    if (isUpdateAvailable && !updateShownRef.current) {
      updateShownRef.current = true
      // Use timeout to defer setState outside effect body
      const timer = setTimeout(() => setShowUpdateDialog(true), 0)
      return () => clearTimeout(timer)
    }
  }, [isUpdateAvailable])

  const handleInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      setShowInstallDialog(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallDialog(false)
    setDismissed(true)
  }

  // Offline indicator (always visible when offline)
  if (!isOnline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
        <WifiOff className="w-4 h-4" />
        <span>Vous êtes hors ligne — certaines fonctionnalités peuvent être limitées</span>
      </div>
    )
  }

  return (
    <>
      {/* Install Install Dialog */}
      <AlertDialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center overflow-hidden border-2 border-emerald-200 dark:border-emerald-700">
                <img src="/icons/icon-192x192.png" alt="NYA Santé" className="w-16 h-16 object-contain" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-lg">
              Installer NYA Santé
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              <div className="space-y-3 py-2">
                <p className="font-medium text-foreground">
                  Accédez à NYA Santé directement depuis votre écran d&apos;accueil
                </p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-left">
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Fonctionne comme une application native sur Android
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Accès rapide sans ouvrir le navigateur
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Fonctionne partiellement hors ligne
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Mêmes données et accès sur web et mobile
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vous pouvez aussi utiliser l&apos;application directement dans votre navigateur web.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleInstall}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-11"
            >
              <Download className="w-4 h-4 mr-2" />
              Installer sur mon appareil
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleDismiss} className="w-full">
              Continuer sur le navigateur
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Available Dialog */}
      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              Mise à jour disponible
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Une nouvelle version de NYA Santé est disponible. Veuillez mettre à jour pour bénéficier des dernières améliorations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={applyUpdate}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Mettre à jour maintenant
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">Plus tard</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating install button (shows when dialog is dismissed but install is available) */}
      {canInstall && !isInstalled && dismissed && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => setShowInstallDialog(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg rounded-full h-12 w-12 p-0"
            title="Installer l'application"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      )}
    </>
  )
}

export function PWAStatusBadge() {
  const { isInstalled, isOnline } = usePWA()

  if (!isInstalled) return null

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
      <Smartphone className="w-3 h-3" />
      <span>App</span>
      {!isOnline && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
    </div>
  )
}