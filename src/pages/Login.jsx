import { useState } from 'react'
import { Disc3, Lock, Mail } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      login({ email, password })
      navigate(location.state?.from?.pathname ?? '/', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'No se pudo iniciar sesión.')
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
            Tu espacio, tu sonido
          </p>
          <h1 className="font-display text-6xl font-extrabold leading-[1.08] tracking-[-0.05em] xl:text-7xl">
            Tu música,
            <br />
            en todas <span className="text-brand">partes.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#9299A1]">
            Encontrá la banda sonora perfecta para cada momento.
          </p>
        </div>
        <p className="relative text-xs text-[#626971]">
          © 2025 SoundWave. Hecho para disfrutar.
        </p>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-9">
            <h2 className="font-display text-[28px] font-bold tracking-tight">
              Iniciar sesión
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#9299A1]">
              Accedé a tu cuenta para disfrutar de toda la música que te gusta
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                    autoComplete="current-password"
                    placeholder="Ingresá tu contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </span>
              </label>

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
                {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs text-[#737982]">o</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <Link
              to="/register"
              className="block w-full rounded-xl border border-[#353A42] py-3.5 text-center text-sm font-semibold text-white transition hover:border-[#606770] hover:bg-white/[0.03]"
            >
              Crear cuenta
            </Link>
          </div>
          <p className="mt-6 text-center text-xs text-[#626971] lg:hidden">
            Tu música, en todas partes.
          </p>
        </div>
      </section>
    </main>
  )
}

export function Brand() {
  return (
    <Link to="/login" className="relative inline-flex w-fit items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[#07130b]">
        <Disc3 size={25} strokeWidth={2.4} />
      </span>
      <span className="font-display text-[22px] font-extrabold tracking-tight">
        Sound<span className="text-brand">Wave</span>
      </span>
    </Link>
  )
}
