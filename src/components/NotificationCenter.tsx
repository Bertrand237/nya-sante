'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Info, AlertTriangle, XCircle, CheckCircle2, CheckCheck, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export type NotificationType = 'info' | 'warning' | 'error' | 'success'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
}

/* ═══════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════ */

const TYPE_CONFIG: Record<NotificationType, {
  icon: typeof Info
  borderColor: string
  bgColor: string
  iconColor: string
}> = {
  info: {
    icon: Info,
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    iconColor: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-500',
  },
  error: {
    icon: XCircle,
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    iconColor: 'text-red-500',
  },
  success: {
    icon: CheckCircle2,
    borderColor: 'border-l-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-500',
  },
}

/* ═══════════════════════════════════════════════════
   DEMO DATA
   ═══════════════════════════════════════════════════ */

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Nouveau patient enregistré',
    message: 'Mbassi Jean-Pierre a été ajouté au système par Réception.',
    timestamp: 'Il y a 5 min',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Rendez-vous aujourd\'hui : 3 en attente',
    message: 'Trois patients attendent d\'être reçus en consultation.',
    timestamp: 'Il y a 15 min',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Paiement reçu : 25 000 FCFA',
    message: 'Facture #FAC-2024-003 réglée par Ngoe Mirabelle.',
    timestamp: 'Il y a 1 h',
    read: false,
  },
  {
    id: '4',
    type: 'error',
    title: 'Stock bas : Paracétamol',
    message: 'Le stock de Paracétamol 500mg est en dessous du seuil minimal (12 unités).',
    timestamp: 'Il y a 2 h',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Transfert reçu de Clinique du Nord',
    message: 'Dossier patient de Kamga Paul transféré avec 3 résultats de laboratoire.',
    timestamp: 'Il y a 3 h',
    read: true,
  },
]

/* ═══════════════════════════════════════════════════
   NOTIFICATION ITEM
   ═══════════════════════════════════════════════════ */

function NotificationItem({ notification, onMarkRead }: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const config = TYPE_CONFIG[notification.type]
  const Icon = config.icon

  return (
    <button
      onClick={() => !notification.read && onMarkRead(notification.id)}
      className={cn(
        'w-full text-left flex gap-3 px-4 py-3 border-l-[3px] transition-colors duration-150',
        config.borderColor,
        notification.read
          ? 'bg-transparent hover:bg-muted/50'
          : cn(config.bgColor, 'hover:brightness-95 dark:hover:brightness-110'),
      )}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className={cn('w-4.5 h-4.5', config.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            'text-sm font-medium leading-snug',
            notification.read ? 'text-muted-foreground' : 'text-foreground',
          )}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[11px] text-muted-foreground/70 mt-1">
          {notification.timestamp}
        </p>
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════
   NOTIFICATION CENTER
   ═══════════════════════════════════════════════════ */

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="h-9 w-9 relative"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none animate-[pulse_2s_ease-in-out_infinite]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] rounded-xl border bg-popover text-popover-foreground shadow-xl ring-1 ring-black/5 dark:ring-white/5 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Tout marquer comme lu
                </Button>
              )}
            </div>

            {/* Notification List */}
            {notifications.length > 0 ? (
              <ScrollArea className="max-h-[360px]">
                <div className="divide-y divide-border/50">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkRead={handleMarkRead}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Aucune notification
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Vous êtes à jour !
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t px-4 py-2.5 bg-muted/20">
              <button
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors py-1"
                onClick={() => setOpen(false)}
              >
                Voir tout
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}