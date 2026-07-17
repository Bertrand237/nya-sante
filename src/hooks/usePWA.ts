'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isInstalled: boolean
  isOnline: boolean
  canInstall: boolean
  isUpdateAvailable: boolean
}

function getInitialState(): PWAState {
  if (typeof window === 'undefined') {
    return { isInstalled: false, isOnline: true, canInstall: false, isUpdateAvailable: false }
  }
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || !!(window.navigator as any).standalone
  return {
    isInstalled,
    isOnline: navigator.onLine,
    canInstall: false,
    isUpdateAvailable: false,
  }
}

export function usePWA() {
  const [state, setState] = useState<PWAState>(getInitialState)
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)

  // Register service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        registrationRef.current = registration

        // Check for updates via callback (not direct setState in effect body)
        const handleUpdateFound = () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState((prev) => ({ ...prev, isUpdateAvailable: true }))
              }
            })
          }
        }
        registration.addEventListener('updatefound', handleUpdateFound)
      } catch (error) {
        console.error('SW registration failed:', error)
      }
    }

    registerSW()
  }, [])

  // Listen for beforeinstallprompt and other events via callbacks
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      deferredPromptRef.current = e as BeforeInstallPromptEvent
      setState((prev) => ({ ...prev, canInstall: true }))
    }

    const handleAppInstalled = () => {
      deferredPromptRef.current = null
      setState((prev) => ({ ...prev, canInstall: false, isInstalled: true }))
    }

    const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Prompt installation
  const promptInstall = useCallback(async () => {
    if (!deferredPromptRef.current) return false

    try {
      await deferredPromptRef.current.prompt()
      const choiceResult = await deferredPromptRef.current.userChoice
      deferredPromptRef.current = null

      if (choiceResult.outcome === 'accepted') {
        setState((prev) => ({ ...prev, canInstall: false, isInstalled: true }))
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  // Apply update
  const applyUpdate = useCallback(async () => {
    if (registrationRef.current?.waiting) {
      registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' })
      // Reload after the new SW activates
      registrationRef.current.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  return {
    ...state,
    promptInstall,
    applyUpdate,
  }
}