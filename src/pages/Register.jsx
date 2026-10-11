import { useState } from 'react'
import { Check, Lock, Mail, User } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Brand } from './Login.jsx'

const roles = [
  {
    value: 'oyente',
    title: 'Oyente',
    description: 'Accedé a toda la música',
  },
  {
    value: 'publicador',
    title: 'Publicador',
    description: 'Podés subir tu propia música',
  },
]

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('oyente')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      register({ name, email, password, role })
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'No se pudo crear la cuenta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-line px-12 py-10 lg:flex xl:px-20">
        <div className="absolute -left-32 top-1/4 h-[520px] w-[520px] rounded-full bg-brand/[0.07] blur-[110px]" />
        <Brand />
        <div className="relative mb-24 max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-brand">
            Un mundo para descubrir
          </p>
          <h1 className="font-display text-6xl font-extrabold leading-[1.08] tracking-[-0.05em] xl:text-7xl">
            Compartí
            <br />
            tu <span className="text-brand">sonido.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#9299A1]">
            Creá tu cuenta y encontrá música que te acompaña en cada momento.
          </p>
        </div>
        <p className="relative text-xs text-[#626971]">
          © 2025 SoundWave. Hecho para disfrutar.
        </p>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-9">
            <h2 className="font-display text-[28px] font-bold tracking-tight">
              Crear cuenta
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#9299A1]">
              Completá tus datos para comenzar a disfrutar de la música.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#D7D9DC]">
                  Nombre completo
                </span>
                <span className="relative block">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737982]"
                  />
                  <input
                    className="auth-input"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#D7D9DC]">
                  Correo electrónico
                </span>
                <span className="relative block">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737982]"
                  />
                  <input
                    className="auth-input"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#D7D9DC]">
                  Contraseña
                </span>
                <span className="relative block">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737982]"
                  />
                  <input
                    className="auth-input"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Creá una contraseña"
                    minLength="6"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </span>
              </label>

              <fieldset className="pt-1">
                <legend className="mb-3 text-sm font-medium text-[#D7D9DC]">
                  ¿Qué tipo de usuario sos?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {roles.map((option) => {
                    const selected = role === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        aria-pressed={selected}
                        className={`relative rounded-xl border p-4 text-left transition ${
                          selected
                            ? 'border-brand bg-brand/[0.07]'
                            : 'border-line bg-[#0D0F12] hover:border-[#41474F]'
                        }`}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[#07130b]">
                            <Check size={13} strokeWidth={3} />
                          </span>
                        )}
                        <span
                          className={`block text-sm font-semibold ${
                            selected ? 'text-brand' : 'text-white'
                          }`}
                        >
                          {option.title}
                        </span>
                        <span className="mt-1 block pr-3 text-xs leading-5 text-[#858B93]">
                          {option.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {error && (
                <p
                  className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-[#07130b] transition hover:bg-[#29c760] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Confirmar'}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-sm text-[#9299A1]">
            ¿Ya tenés una cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand transition hover:text-[#46d477]"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
