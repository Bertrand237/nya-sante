export const fmtCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'

export const fmtDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export const fmtDateTime = (date: string | Date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const fmtTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })