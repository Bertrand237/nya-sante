export const STATUS_APPOINTMENT: Record<string, { label: string; className: string }> = {
  en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  confirme: { label: 'Confirmé', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  en_cours: { label: 'En cours', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  termine: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  annule: { label: 'Annulé', className: 'bg-red-100 text-red-800 border-red-300' },
}

export const STATUS_LAB: Record<string, { label: string; className: string }> = {
  en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  en_cours: { label: 'En cours', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  termine: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
}

export const LAB_TYPES = ['Hémogramme', 'Biochimie', 'Urine', 'Parasitologie', 'Sérologie', 'Bactériologie', 'Autre']

export const STATUS_INVOICE: Record<string, { label: string; className: string }> = {
  impayee: { label: 'Impayée', className: 'bg-red-100 text-red-800 border-red-300' },
  partiellement_payee: { label: 'Partielle', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  payee: { label: 'Payée', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
}

export const STATUS_PRESCRIPTION: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  completed: { label: 'Terminée', className: 'bg-gray-100 text-gray-700 border-gray-300' },
}

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const DEPT_TYPES = ['clinique', 'chirurgical', 'laboratoire', 'imagerie', 'pharmacie', 'administration', 'urgence', 'maternite', 'pediatrie', 'autre']

export const MED_CATEGORIES = [
  'Antalgique', 'Antibiotique', 'Antihypertenseur', 'Antidiabétique',
  'AINS', 'Antihistaminique', 'Antiulcéreux', 'Bronchodilatateur',
  'Antipaludéen', 'Autre',
]

export const MED_FORMS = [
  'Comprimé', 'Gélule', 'Sirop', 'Aérosol', 'Injectable', 'Crème', 'Suppositoire',
]

export const STAFF_ROLES = [
  'super_admin', 'medecin_chef', 'medecin', 'infirmier', 'laborantin', 'pharmacien', 'recepteur',
]