import { createContext, useContext, useMemo, useState } from 'react'
import { seedUsers } from '../data/users.js'
import { FREE_PLAN, PLANS, ROLES, normalizeUser } from '../utils/userHelpers.js'

const AuthContext = createContext(null)

const SESSION_KEY = 'soundwave.session'
const USERS_KEY = 'soundwave.users'
const REGISTRABLE_ROLES = new Set([ROLES.OYENTE, ROLES.PUBLICADOR])
const PREMIUM_TRIAL_MAX_DAYS = 60

function readStoredUsers() {
  const saved = localStorage.getItem(USERS_KEY)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) throw new Error('formato inválido')
    return parsed
  } catch {
    throw new Error('No se pudieron leer las cuentas guardadas del navegador.')
  }
}

// Cuentas guardadas (normalizadas) + admin precargado.
function readUsers() {
  const stored = readStoredUsers().map(normalizeUser)
  const missingSeeds = seedUsers.filter(
    (seed) => !stored.some((account) => account.id === seed.id),
  )
  const users = [
    ...missingSeeds,
    ...stored.map((account) => {
      const seed = seedUsers.find((candidate) => candidate.id === account.id)
      if (
        account.id === 'premium-prueba' &&
        account.plan?.type === PLANS.PREMIUM &&
        seed?.plan?.type === PLANS.PREMIUM
      ) {
        const daysUntilExpiry =
          (new Date(account.plan.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        if (daysUntilExpiry > PREMIUM_TRIAL_MAX_DAYS) {
          return { ...account, plan: seed.plan }
        }
      }
      return account
    }),
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

function toSessionUser({ id, name, email, role, plan }) {
  return { id, name, email, role, plan }
}

// La sesión guarda solo el id; los datos se leen siempre de las cuentas,
// así un cambio de plan se refleja sin volver a iniciar sesión.
function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
    if (!saved || typeof saved.id !== 'string') return null
    const account = readUsers().find((candidate) => candidate.id === saved.id)
    return account ? toSessionUser(account) : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  function startSession(account) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: account.id }))
    const session = toSessionUser(account)
    setUser(session)
    return session
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const account = readUsers().find(
      (candidate) =>
        candidate.email === normalizedEmail && candidate.password === password,
    )
    if (!account) {
      throw new Error('El correo electrónico o la contraseña son incorrectos.')
    }
    return startSession(account)
  }

  function register({ name, email, password, role = ROLES.OYENTE }) {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password) {
      throw new Error('Completá todos los campos para crear tu cuenta.')
    }
    if (!REGISTRABLE_ROLES.has(role)) {
      throw new Error('El tipo de usuario seleccionado no es válido.')
    }

    const users = readUsers()
    if (users.some((account) => account.email === normalizedEmail)) {
      throw new Error('Ya existe una cuenta asociada a ese correo electrónico.')
    }

    const account = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      password,
      role,
      plan: role === ROLES.OYENTE ? FREE_PLAN : null,
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, account]))
    return startSession(account)
  }

  // Solo para oyentes. Premium se activa con fecha de vencimiento.
  function updatePlan(plan) {
    if (!user || user.role !== ROLES.OYENTE) {
      throw new Error('Solo los oyentes pueden cambiar de plan.')
    }
    const users = readUsers().map((account) =>
      account.id === user.id ? { ...account, plan } : account,
    )
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    setUser({ ...user, plan })
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      plan: user?.plan ?? null,
      login,
      register,
      updatePlan,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.')
  }
  return context
}