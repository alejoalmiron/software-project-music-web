import { useRef, useState } from 'react'
import {
  BANNERS,
  BANNER_LABELS,
  addAd,
  getAds,
  setAdActive,
} from '../services/adsStorage.js'
import { resizeImageToDataUrl, validateImageFile } from '../utils/imageUtils.js'

export default function AdminAds() {
  const [ads, setAds] = useState(getAds)
  const [name, setName] = useState('')
  const [banner, setBanner] = useState(BANNERS.INFERIOR)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const fileInput = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!name.trim()) return setError('Ingresá el nombre del anuncio.')
    const fileError = validateImageFile(file)
    if (fileError) return setError(fileError)

    setIsSaving(true)
    try {
      const image = await resizeImageToDataUrl(file)
      const result = addAd({ name, image, banner })
      if (!result.ok) return setError(result.error)
      setAds(result.ads)
      setName('')
      setFile(null)
      if (fileInput.current) fileInput.current.value = ''
    } catch (saveError) {
      setError(saveError.message || 'No se pudo cargar el anuncio.')
    } finally {
      setIsSaving(false)
    }
  }

  function toggle(ad) {
    const result = setAdActive(ad.id, !ad.active)
    if (!result.ok) return setError(result.error)
    setError('')
    setAds(result.ads)
  }

  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold">Gestionar anuncios</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid max-w-[640px] gap-4 rounded-2xl border border-line bg-surface p-5"
      >
        <h2 className="text-lg font-bold">Cargar anuncio</h2>

        <label className="grid gap-1.5 text-sm font-semibold">
          Nombre
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-lg border border-line bg-[#15181C] px-4 py-2.5 text-sm font-normal outline-none focus:border-[#3B454D]"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold">
          Imagen (JPG o PNG, hasta 2 MB)
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold">
          Banner
          <select
            value={banner}
            onChange={(event) => setBanner(event.target.value)}
            className="rounded-lg border border-line bg-[#15181C] px-4 py-2.5 text-sm font-normal outline-none focus:border-[#3B454D]"
          >
            {Object.entries(BANNER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-[#07130b] transition hover:brightness-110 disabled:opacity-60"
        >
          {isSaving ? 'Cargando...' : 'Cargar anuncio'}
        </button>
      </form>

      <ul className="mt-8 grid gap-3">
        {ads.length === 0 && (
          <li className="text-sm text-[#858B93]">Todavía no hay anuncios cargados.</li>
        )}
        {ads.map((ad) => (
          <li
            key={ad.id}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3"
          >
            <img
              src={ad.image}
              alt={`Anuncio: ${ad.name}`}
              className="h-16 w-28 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{ad.name}</p>
              <p className="text-xs text-[#858B93]">
                Banner {BANNER_LABELS[ad.banner]} ·{' '}
                <span className={ad.active ? 'text-brand' : ''}>
                  {ad.active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle(ad)}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:bg-white/5"
            >
              {ad.active ? 'Desactivar' : 'Activar'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}