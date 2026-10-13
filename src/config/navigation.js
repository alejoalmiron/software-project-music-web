import { Home, Library, Megaphone } from 'lucide-react'
import { ROLES } from '../utils/userHelpers.js'

const inicio = { label: 'Inicio', to: '/', icon: Home, end: true }
const biblioteca = { label: 'Mi biblioteca', to: '/library', icon: Library }
const anuncios = { label: 'Gestionar anuncios', to: '/admin/anuncios', icon: Megaphone }

export const navigationByRole = {
  [ROLES.OYENTE]: [inicio, biblioteca],
  [ROLES.PUBLICADOR]: [inicio],
  [ROLES.ADMIN]: [inicio, anuncios,biblioteca],
}