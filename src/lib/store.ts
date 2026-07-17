import { create } from 'zustand'

export interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  role: { name: string; label: string }
  department: { id: string; name: string } | null
  hospital: { name: string; city: string }
  specialty: string | null
}

interface DashboardStats {
  totalPatients: number
  totalStaff: number
  totalDepartments: number
  todayAppointments: number
  pendingInvoices: number
  totalRevenue: number
  lowStockMedications: number
}

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean

  // Navigation
  currentView: string
  setCurrentView: (view: string) => void

  // Patient Dossier
  selectedPatientId: string | null
  setSelectedPatientId: (id: string | null) => void

  // Dashboard
  dashboardStats: DashboardStats | null
  setDashboardStats: (stats: DashboardStats) => void
  recentPatients: any[]
  setRecentPatients: (patients: any[]) => void
  todayAppointments: any[]
  setTodayAppointments: (appointments: any[]) => void

  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toastMessage: string | null
  showToast: (message: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,

  // Navigation
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  // Patient Dossier
  selectedPatientId: null,
  setSelectedPatientId: (id) => set({ selectedPatientId: id }),

  // Dashboard
  dashboardStats: null,
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  recentPatients: [],
  setRecentPatients: (patients) => set({ recentPatients: patients }),
  todayAppointments: [],
  setTodayAppointments: (appointments) => set({ todayAppointments: appointments }),

  // UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toastMessage: null,
  showToast: (message: string) => {
    set({ toastMessage: message })
    setTimeout(() => set({ toastMessage: null }), 3000)
  },
}))