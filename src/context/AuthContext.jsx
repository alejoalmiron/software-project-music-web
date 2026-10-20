import { createContext, useContext, useMemo, useState } from 'react'
import { seedUsers } from '../data/users.js'
import { FREE_PLAN, PLANS, ROLES, normalizeUser } from '../utils/userHelpers.js'

const AuthContext = createContext(null)

const SESSION_KEY = 'soundwave.session'
const USERS_KEY = 'soundwave.users'
const EXPIRED_PLAN_NOTICE_KEY = 'soundwave.plan-expired-notice'
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

function hasExpiredPremiumPlan(account) {
  if (account?.role !== ROLES.OYENTE || account.plan?.type !== PLANS.PREMIUM) {
    return false
  }
  const expiryTime = Date.parse(account.plan.expiresAt)
  return !Number.isFinite(expiryTime) || expiryTime <= Date.now()
}

function readPlanExpiredNotice(userId) {
  if (typeof userId !== 'string') return false
  try {
    const notice = JSON.parse(localStorage.getItem(EXPIRED_PLAN_NOTICE_KEY) ?? 'null')
    return notice?.userId === userId
  } catch {
    localStorage.removeItem(EXPIRED_PLAN_NOTICE_KEY)
    return false
  }
}

function downgradeExpiredPlan(account, users) {
  if (!hasExpiredPremiumPlan(account)) return account

  const freeAccount = { ...account, plan: FREE_PLAN }
  const updatedUsers = users.map((storedUser) =>
    storedUser.id === account.id ? freeAccount : storedUser,
  )
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
  localStorage.setItem(EXPIRED_PLAN_NOTICE_KEY, JSON.stringify({ userId: account.id }))
  return freeAccount
}

// La sesión guarda solo el id; los datos se leen siempre de las cuentas,
// así un cambio de plan se refleja sin volver a iniciar sesión.
function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
    if (!saved || typeof saved.id !== 'string') return null
    const users = readUsers()
    const account = users.find((candidate) => candidate.id === saved.id)
    if (!account) return null
    const resolvedAccount = downgradeExpiredPlan(account, users)
    return toSessionUser(resolvedAccount)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const [planExpiredNotice, setPlanExpiredNotice] = useState(() =>
    readPlanExpiredNotice(user?.id),
  )

  function startSession(account) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: account.id }))
    const session = toSessionUser(account)
    setUser(session)
    setPlanExpiredNotice(readPlanExpiredNotice(account.id))
    return session
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readUsers()
    const account = users.find(
      (candidate) =>
        candidate.email === normalizedEmail && candidate.password === password,
    )
    if (!account) {
      throw new Error('El correo electrónico o la contraseña son incorrectos.')
    }
    return startSession(downgradeExpiredPlan(account, users))
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
    if (plan.type === PLANS.PREMIUM) {
      localStorage.removeItem(EXPIRED_PLAN_NOTICE_KEY)
      setPlanExpiredNotice(false)
    }
    setUser({ ...user, plan })
  }

  function dismissPlanExpiredNotice() {
    localStorage.removeItem(EXPIRED_PLAN_NOTICE_KEY)
    setPlanExpiredNotice(false)
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
      planExpiredNotice,
      login,
      register,
      updatePlan,
      dismissPlanExpiredNotice,
      logout,
    }),
    [user, planExpiredNotice],
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