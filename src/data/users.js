// Usuarios precargados.
// El resto de las cuentas se crean desde "Crear cuenta" y se guardan en localStorage.
const premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

export const seedUsers = [
  {
    id: 'admin-soundwave',
    name: 'Administrador',
    email: 'admin@soundwave.com',
    password: 'admin123',
    role: 'admin',
    plan: null,
  },
  // SOLO PARA PRUEBAS: oyente Premium hasta que exista la contratación de Premium.
  {
    id: 'premium-prueba',
    name: 'Oyente Premium',
    email: 'premium@soundwave.com',
    password: 'premium123',
    role: 'oyente',
    plan: { type: 'premium', expiresAt: premiumExpiresAt.toISOString() },
  },
]