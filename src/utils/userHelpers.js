export const ROLES = {
  OYENTE: 'oyente',
  PUBLICADOR: 'publicador',
  ADMIN: 'admin',
}

export const PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
}

export const FREE_PLAN = { type: PLANS.FREE, expiresAt: null }

// Normaliza cuentas viejas (role 'free') al modelo rol + plan.
export function normalizeUser(user) {
  const role = user.role === 'free' ? ROLES.OYENTE : user.role
  const plan = role === ROLES.OYENTE ? (user.plan ?? FREE_PLAN) : null
  return { ...user, role, plan }
}

export function isPremium(user, now = new Date()) {
  if (!user || user.role !== ROLES.OYENTE || !user.plan) return false
  if (user.plan.type !== PLANS.PREMIUM || !user.plan.expiresAt) return false
  return new Date(user.plan.expiresAt) > now
}

// Los banners se muestran solo a oyentes con plan Free.
export function showsAds(user, now = new Date()) {
  return Boolean(user) && user.role === ROLES.OYENTE && !isPremium(user, now)
}
