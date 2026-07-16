'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useTheme } from 'next-themes'

/* ─────────────────────────────────────────────
   GLOBAL CONTEXT: search, scroll, dark mode
   ───────────────────────────────────────────── */
interface AppContextType {
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeTab: string
  setActiveTab: (t: string) => void
  scrollProgress: number
}

const AppContext = createContext<AppContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  activeTab: 'vue-ensemble',
  setActiveTab: () => {},
  scrollProgress: 0,
})

export const useApp = () => useContext(AppContext)
export { AppContext }

/* ─────────────────────────────────────────────
   READING PROGRESS BAR
   ───────────────────────────────────────────── */
export function ReadingProgress({ progress }: { progress: number }) {
  return (
    <div className="reading-progress no-print" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
  )
}

/* ─────────────────────────────────────────────
   SCROLL TO TOP BUTTON
   ───────────────────────────────────────────── */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-top-btn no-print fixed bottom-24 right-6 z-50 w-11 h-11 rounded-full nya-gradient text-white shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-transform ${visible ? 'visible-btn' : 'hidden-btn'}`}
      aria-label="Retour en haut"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
    </button>
  )
}

/* ─────────────────────────────────────────────
   DARK MODE TOGGLE
   ───────────────────────────────────────────── */
export function DarkModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Using a timeout to avoid synchronous setState in effect
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return <div className="w-9 h-9" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted/80 transition-colors"
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────
   SEARCH BAR
   ───────────────────────────────────────────── */
export function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    setSearchQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher dans le cahier de charges..."
        className="w-full h-9 pl-9 pr-8 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
      {searchQuery && (
        <button onClick={handleClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Effacer la recherche">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PRINT BUTTON
   ───────────────────────────────────────────── */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted/80 transition-colors"
      aria-label="Imprimer le document"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    </button>
  )
}

/* ─────────────────────────────────────────────
   SECTION COMPLETION BADGE
   ───────────────────────────────────────────── */
export function SectionProgress({ total, completed }: { total: number; completed: number }) {
  const pct = Math.round((completed / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground font-medium tabular-nums">{pct}%</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SEARCH HIGHLIGHT WRAPPER
   ───────────────────────────────────────────── */
export function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
      )}
    </>
  )
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────── */
export function AnimatedStat({ value, label, icon: Icon, delay = 0 }: {
  value: string; label: string; icon: React.ElementType; delay?: number
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Icon className="w-6 h-6 mx-auto mb-2 text-amber-300" />
      <div className="text-2xl font-bold text-center">{value}</div>
      <div className="text-xs text-white/70 text-center mt-1">{label}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   APP PROVIDER
   ───────────────────────────────────────────── */
export function AppProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('vue-ensemble')
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    setScrollProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <AppContext.Provider value={{ searchQuery, setSearchQuery, activeTab, setActiveTab, scrollProgress }}>
      {children}
    </AppContext.Provider>
  )
}