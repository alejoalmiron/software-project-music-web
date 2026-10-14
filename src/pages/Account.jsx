import { useState } from 'react'
import { BadgeCheck, CalendarDays, Check, CreditCard, Crown, Megaphone, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { isPremium, PLANS } from '../utils/userHelpers.js'

const premiumPrice = '$2.999 ARS'
const premiumDuration = '30 días'
const millisecondsPerDay = 24 * 60 * 60 * 1000
const emptyCard = { number: '', holder: '', expiration: '', securityCode: '' }
const cardNumberLength = 16

function getDaysRemaining(expiresAt) {
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / millisecondsPerDay)
}

function formatCardNumber(digits) {
  return digits.match(/.{1,4}/g)?.join(' ') ?? ''
}

function validateCard(card) {
  const errors = {}
  const cardNumber = card.number.replace(/[ -]/g, '')

  if (!/^\d{16}$/.test(cardNumber)) {
    errors.number = 'Completá los 16 dígitos del número de tarjeta.'
  }
  if (!/^[\p{L}][\p{L}\s'-]{1,}$/u.test(card.holder.trim())) {
    errors.holder = 'Ingresá el nombre del titular tal como figura en la tarjeta.'
  }

  const expirationMatch = card.expiration.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
  if (!expirationMatch) {
    errors.expiration = 'Usá el formato MM/AA.'
  } else {
    const month = Number(expirationMatch[1])
    const year = 2000 + Number(expirationMatch[2])
    const now = new Date()
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errors.expiration = 'La tarjeta está vencida.'
    }
  }

  if (!/^\d{3,4}$/.test(card.securityCode)) {
    errors.securityCode = 'Ingresá un código de seguridad de 3 o 4 dígitos.'
  }

  return errors
}

const plans = [
  {
    name: 'Free',
    description: 'Para descubrir y disfrutar música.',
    price: 'Gratis',
    duration: 'Sin vencimiento',
    ads: 'Incluye anuncios',
    benefits: ['Acceso a las recomendaciones', 'Playlists personales'],
  },
  {
    name: 'Premium',
    description: 'Música sin interrupciones.',
    price: premiumPrice,
    duration: premiumDuration,
    ads: 'Sin anuncios',
    benefits: ['Escuchá sin anuncios', 'Playlists personales'],
  },
]

export default function Account() {
  const { user, updatePlan } = useAuth()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [card, setCard] = useState(emptyCard)
  const [cardErrors, setCardErrors] = useState({})
  const [purchaseError, setPurchaseError] = useState('')
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const premiumActive = isPremium(user)
  const daysRemaining = premiumActive ? getDaysRemaining(user.plan.expiresAt) : 0
  const currentPlan = premiumActive ? 'Premium' : 'Free'

  function handleCardChange(event) {
    const { name, value } = event.target
    const nextValue =
      name === 'number' ? value.replace(/\D/g, '').slice(0, cardNumberLength) : value
    setCard((currentCard) => ({ ...currentCard, [name]: nextValue }))
    setCardErrors((currentErrors) => {
      const remainingErrors = { ...currentErrors }
      delete remainingErrors[name]
      return remainingErrors
    })
    setPurchaseError('')
    setPurchaseSuccess(false)
  }

  function handlePurchase(event) {
    event.preventDefault()
    setPurchaseError('')
    setPurchaseSuccess(false)
    const errors = validateCard(card)
    setCardErrors(errors)
    if (Object.keys(errors).length > 0) return

    const expiresAt = new Date(Date.now() + 30 * millisecondsPerDay).toISOString()
    try {
      updatePlan({ type: PLANS.PREMIUM, expiresAt })
    } catch (error) {
      setPurchaseError(
        error instanceof Error ? error.message : 'No se pudo activar el plan Premium.',
      )
      return
    }
    setCard(emptyCard)
    setIsCheckoutOpen(false)
    setPurchaseSuccess(true)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="mb-8">
        <p className="mb-2 text-sm text-[#858B93]">Tu cuenta SoundWave</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Gestión de cuenta
        </h1>
        <p className="mt-3 text-sm text-[#858B93]">
          Consultá tu plan y compará las opciones disponibles.
        </p>
      </section>

      <section
        aria-label="Plan actual"
        className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5 sm:p-6"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          {premiumActive ? <Crown size={23} /> : <BadgeCheck size={23} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#858B93]">
            Tu plan actual
          </p>
          <h2 className="mt-1 font-display text-xl font-bold">{currentPlan}</h2>
          {premiumActive ? (
            <p className="mt-1 text-sm text-[#A1A7AF]">
              Te quedan {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'} de Premium.
              <span className="block text-xs text-[#737982]">
                Vence el{' '}
                {new Date(user.plan.expiresAt).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                .
              </span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-[#A1A7AF]">
              Estás usando el plan Free. Compará los planes para elegir el que mejor se adapte a vos.
            </p>
          )}
        </div>
        <span className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
          {premiumActive ? 'Activo' : 'Plan actual'}
        </span>
      </section>

      <section aria-labelledby="plans-heading">
        <div className="mb-4">
          <h2 id="plans-heading" className="font-display text-xl font-bold">
            Compará los planes
          </h2>
          <p className="mt-1 text-sm text-[#858B93]">
            Encontrá la experiencia que va mejor con vos.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.name
            const isPremiumPlan = plan.name === 'Premium'

            return (
              <article
                key={plan.name}
                className={`rounded-2xl border bg-surface p-5 sm:p-6 ${
                  isPremiumPlan ? 'border-brand/50 shadow-[0_0_32px_rgba(29,185,84,0.08)]' : 'border-line'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[#858B93]">{plan.description}</p>
                  </div>
                  {isCurrentPlan && (
                    <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
                      Tu plan
                    </span>
                  )}
                </div>

                <p className="mt-6 font-display text-2xl font-extrabold text-white">
                  {plan.price}
                </p>
                <p className="mt-1 text-xs text-[#858B93]">
                  {isPremiumPlan ? `por ${plan.duration}` : plan.duration}
                </p>

                <div className="my-5 h-px bg-line" />
                <dl className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Megaphone size={16} className="shrink-0 text-[#858B93]" />
                    <dt className="sr-only">Anuncios</dt>
                    <dd>{plan.ads}</dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="shrink-0 text-[#858B93]" />
                    <dt className="sr-only">Duración</dt>
                    <dd>{plan.duration}</dd>
                  </div>
                  {plan.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 text-[#B4BAC1]">
                      <Check size={16} className="shrink-0 text-brand" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </div>
      </section>

      {purchaseSuccess && premiumActive && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand"
        >
          ¡Plan Premium contratado! Ya podés escuchar sin anuncios durante {daysRemaining}{' '}
          {daysRemaining === 1 ? 'día' : 'días'}.
        </p>
      )}

      {premiumActive ? (
        !purchaseSuccess && (
          <p className="mt-5 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-[#B4BAC1]">
            Ya disfrutás de Premium. Tu plan vence en {daysRemaining}{' '}
            {daysRemaining === 1 ? 'día' : 'días'}.
          </p>
        )
      ) : (
        <section className="mt-5">
          {!isCheckoutOpen ? (
            <button
              type="button"
              onClick={() => {
                setPurchaseSuccess(false)
                setCardErrors({})
                setPurchaseError('')
                setIsCheckoutOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-[#07130b] transition hover:brightness-110"
            >
              <Crown size={17} />
              Elegir Premium
            </button>
          ) : (
            <form
              onSubmit={handlePurchase}
              noValidate
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">Pago con tarjeta</h2>
                  <p className="mt-1 text-sm text-[#858B93]">
                    Premium por 30 días · {premiumPrice}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false)
                    setCard(emptyCard)
                    setCardErrors({})
                    setPurchaseError('')
                  }}
                  className="icon-button"
                  aria-label="Cerrar formulario de pago"
                >
                  <X size={18} />
                </button>
              </div>

              {(Object.keys(cardErrors).length > 0 || purchaseError) && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300"
                >
                  {purchaseError || 'Revisá los datos de la tarjeta antes de confirmar.'}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
                  Número de tarjeta
                  <span className="relative">
                    <CreditCard
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737982]"
                    />
                    <input
                      name="number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={23}
                      value={formatCardNumber(card.number)}
                      onChange={handleCardChange}
                      aria-invalid={Boolean(cardErrors.number)}
                      aria-describedby={cardErrors.number ? 'card-number-error' : undefined}
                      className="w-full rounded-xl border border-line bg-[#0D0F12] py-3 pl-10 pr-3 font-mono text-sm tracking-wider text-transparent caret-brand outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-[#737982] focus:border-brand"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 whitespace-pre font-mono text-sm tracking-wider text-[#737982]"
                    >
                      {Array.from({ length: cardNumberLength }, (_, index) => (
                        <span key={index}>
                          {index > 0 && index % 4 === 0 ? ' ' : ''}
                          <span className={index < card.number.length ? 'text-white' : 'text-[#737982]'}>
                            {index < card.number.length ? card.number[index] : 'X'}
                          </span>
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="text-xs font-normal text-[#737982]">
                    Ingresá los 16 dígitos; cada X representa un dígito pendiente.
                  </span>
                  {cardErrors.number && (
                    <span id="card-number-error" className="text-xs font-normal text-red-300">
                      {cardErrors.number}
                    </span>
                  )}
                </label>

                <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
                  Titular de la tarjeta
                  <input
                    name="holder"
                    type="text"
                    autoComplete="cc-name"
                    value={card.holder}
                    onChange={handleCardChange}
                    placeholder="Nombre y apellido"
                    aria-invalid={Boolean(cardErrors.holder)}
                    aria-describedby={cardErrors.holder ? 'card-holder-error' : undefined}
                    className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-3 text-sm font-normal outline-none focus:border-brand"
                  />
                  {cardErrors.holder && (
                    <span id="card-holder-error" className="text-xs font-normal text-red-300">
                      {cardErrors.holder}
                    </span>
                  )}
                </label>

                <label className="grid gap-1.5 text-sm font-semibold">
                  Vencimiento
                  <input
                    name="expiration"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                    value={card.expiration}
                    onChange={handleCardChange}
                    placeholder="MM/AA"
                    aria-invalid={Boolean(cardErrors.expiration)}
                    aria-describedby={cardErrors.expiration ? 'card-expiration-error' : undefined}
                    className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-3 text-sm font-normal outline-none focus:border-brand"
                  />
                  {cardErrors.expiration && (
                    <span id="card-expiration-error" className="text-xs font-normal text-red-300">
                      {cardErrors.expiration}
                    </span>
                  )}
                </label>

                <label className="grid gap-1.5 text-sm font-semibold">
                  Código de seguridad
                  <input
                    name="securityCode"
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    value={card.securityCode}
                    onChange={handleCardChange}
                    placeholder="123"
                    aria-invalid={Boolean(cardErrors.securityCode)}
                    aria-describedby={cardErrors.securityCode ? 'card-code-error' : undefined}
                    className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-3 text-sm font-normal outline-none focus:border-brand"
                  />
                  {cardErrors.securityCode && (
                    <span id="card-code-error" className="text-xs font-normal text-red-300">
                      {cardErrors.securityCode}
                    </span>
                  )}
                </label>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#737982]">
                Simulación educativa: no se realizará ningún cobro y los datos de la tarjeta no se
                guardan.
              </p>
              <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-bold text-[#07130b] transition hover:brightness-110 sm:w-auto sm:px-8"
              >
                Confirmar pago
              </button>
            </form>
          )}
          <p className="mt-4 text-xs leading-5 text-[#858B93]">
            El pago es una simulación educativa. No se realizará ningún cobro.
          </p>
        </section>
      )}
    </div>
  )
}
