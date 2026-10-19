import { Heart, Home, Library, Megaphone, UserRound } from 'lucide-react'
import { ROLES } from '../utils/userHelpers.js'

const inicio = { label: 'Inicio', to: '/', icon: Home, end: true }
const biblioteca = { label: 'Mi biblioteca', to: '/library', icon: Library }
const favoritas = { label: 'Canciones favoritas', to: '/favorites', icon: Heart }
const anuncios = { label: 'Gestionar anuncios', to: '/admin/anuncios', icon: Megaphone }
const gestionCuenta = { label: 'Gestión de cuenta', to: '/account', icon: UserRound }

export const navigationByRole = {
  [ROLES.OYENTE]: [inicio, biblioteca, favoritas, gestionCuenta],
  [ROLES.PUBLICADOR]: [inicio, biblioteca, favoritas],
  [ROLES.ADMIN]: [inicio, anuncios, biblioteca, favoritas],
}