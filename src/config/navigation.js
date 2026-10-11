import { Home, Megaphone } from 'lucide-react'
import { ROLES } from '../utils/userHelpers.js'

const inicio = { label: 'Inicio', to: '/', icon: Home, end: true }
const anuncios = { label: 'Gestionar anuncios', to: '/admin/anuncios', icon: Megaphone }

export const navigationByRole = {
  [ROLES.OYENTE]: [inicio],
  [ROLES.PUBLICADOR]: [inicio],
  [ROLES.ADMIN]: [inicio, anuncios],
}