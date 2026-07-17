/**
 * Role-based access control for NYA Santé
 * Each role maps to the navigation views they are allowed to access.
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'dashboard', 'patients', 'dme', 'departments', 'staff', 'appointments',
    'consultations', 'prescriptions', 'invoices', 'medications', 'labs',
    'audit', 'settings', 'platforms', 'transfers',
  ],
  medecin_chef: [
    'dashboard', 'patients', 'dme', 'appointments',
    'consultations', 'prescriptions', 'labs', 'medications', 'transfers',
  ],
  medecin: [
    'dashboard', 'patients', 'dme', 'appointments',
    'consultations', 'prescriptions', 'transfers',
  ],
  infirmier: [
    'dashboard', 'patients', 'dme', 'appointments', 'consultations', 'transfers',
  ],
  laborantin: [
    'dashboard', 'labs',
  ],
  pharmacien: [
    'dashboard', 'medications', 'prescriptions',
  ],
  recepteur: [
    'dashboard', 'patients', 'appointments',
  ],
}

/**
 * Returns the list of allowed view keys for a given role name.
 * Falls back to `recepteur` (most restricted) for unknown roles.
 */
export function getAllowedViews(roleName: string | undefined | null): string[] {
  return ROLE_PERMISSIONS[roleName || 'recepteur'] || ROLE_PERMISSIONS.recepteur
}

/**
 * Returns a role-appropriate welcome message for the given user.
 */
export function getWelcomeMessage(
  firstName: string,
  lastName: string,
  roleName: string,
): string {
  switch (roleName) {
    case 'super_admin':
      return `Bienvenue, ${firstName} ${lastName} ! Accès complet`
    case 'medecin_chef':
      return `Bienvenue, Dr. ${lastName} ! Chef de département`
    case 'medecin':
      return `Bienvenue, Dr. ${lastName} !`
    case 'infirmier':
      return `Bienvenue, ${firstName} ${lastName} !`
    case 'laborantin':
      return `Bienvenue, ${firstName} ${lastName} ! Laboratoire`
    case 'pharmacien':
      return `Bienvenue, ${firstName} ${lastName} ! Pharmacie`
    case 'recepteur':
      return `Bienvenue, ${firstName} ${lastName} !`
    default:
      return `Bienvenue, ${firstName} ${lastName} !`
  }
}