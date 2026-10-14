import { Home, Library, Megaphone, UserRound } from 'lucide-react'
import { ROLES } from '../utils/userHelpers.js'

const inicio = { label: 'Inicio', to: '/', icon: Home, end: true }
const biblioteca = { label: 'Mi biblioteca', to: '/library', icon: Library }
const anuncios = { label: 'Gestionar anuncios', to: '/admin/anuncios', icon: Megaphone }
const gestionCuenta = { label: 'Gestión de cuenta', to: '/account', icon: UserRound }

export const navigationByRole = {
  [ROLES.OYENTE]: [inicio, biblioteca, gestionCuenta],
  [ROLES.PUBLICADOR]: [inicio, biblioteca],
  [ROLES.ADMIN]: [inicio, anuncios,biblioteca],
}