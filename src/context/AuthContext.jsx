import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'soundwave.session'
const USERS_KEY = 'soundwave.users'
const ALLOWED_ROLES = new Set(['free', 'publicador', 'admin'])

function readSession() {
  const savedSession = localStorage.getItem(SESSION_KEY)
  if (!savedSession) return null

  try {
    const parsedSession = JSON.parse(savedSession)
    if (
      parsedSession &&
      typeof parsedSession.id === 'string' &&
      typeof parsedSession.email === 'string' &&
      ALLOWED_ROLES.has(parsedSession.role)
    ) {
      return parsedSession
    }
  } catch {
    localStorage.removeItem(SESSION_KEY)
  }

  return null
}

function readUsers() {
  const savedUsers = localStorage.getItem(USERS_KEY)
  if (!savedUsers) return []

  try {
    const parsedUsers = JSON.parse(savedUsers)
    if (!Array.isArray(parsedUsers)) {
      throw new Error('El formato de las cuentas guardadas no es válido.')
    }
    return parsedUsers
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('No se pudieron leer las cuentas guardadas del navegador.')
    }
    throw error
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const account = readUsers().find(
      (candidate) =>
        candidate.email === normalizedEmail && candidate.password === password,
    )

    if (!account) {
      throw new Error('El correo electrónico o la contraseña son incorrectos.')
    }

    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }

  function register({ name, email, password, role = 'free' }) {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password) {
      throw new Error('Completá todos los campos para crear tu cuenta.')
    }
    if (!ALLOWED_ROLES.has(role) || role === 'admin') {
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
    }
    users.push(account)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
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
      login,
      register,
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
