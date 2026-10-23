import { useState } from 'react'
import { Mic, Upload, CheckCircle2, Music } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { saveSongDraft, getPublisherSongs, publishSong  } from '../services/songStorage.js'
import { GENRES } from '../data/songs.js'

function formatDuration(seconds) {
  if (!seconds) return '—'
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export default function ArtistProfile() {
  const { user } = useAuth()
  const mySongs = getPublisherSongs(user?.email)
  const [confirmingId, setConfirmingId] = useState(null)
  const [publishedTitle, setPublishedTitle] = useState('')
  
  // Estados para el panel de "Subir canción" que aparece abajo
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [songGenre, setSongGenre] = useState(GENRES[0] || '')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [successSong, setSuccessSong] = useState(false)
  const [errorSong, setErrorSong] = useState('')


  function handleImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  setImageFile(file)

  // Guardamos la imagen como texto (reducida) para que no se pierda al recargar
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, 640 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      setImagePreview(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

  function handleSongSubmit(e) {
    e.preventDefault()
    setErrorSong('')
    setSuccessSong(false)

    const duration = (Number(minutes) || 0) * 60 + (Number(seconds) || 0)

    if (!title.trim() || duration <= 0 || !imagePreview) {
      setErrorSong('Completá todos los campos y seleccioná una imagen.')
      return
    }

    try {
      saveSongDraft({
        title: title.trim(),
        genre: songGenre,
        duration,
        image: imagePreview,
        artist: user?.artistName || user?.name || 'Artista',
        artistEmail: user?.email,
      })

      setSuccessSong(true)
      setTitle('')
      setMinutes('')
      setSeconds('')
      setImageFile(null)
      setImagePreview('')
    } catch (err) {
      setErrorSong('No se pudo guardar la canción como borrador.')
    }
  }

  function handlePublish(song) {
    publishSong(song.id)
    setConfirmingId(null)
    setPublishedTitle(song.title)
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <section className="mb-8">
        <p className="mb-2 text-sm text-[#858B93]">Panel de Publicador</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Mi perfil de artista
        </h1>
        <p className="mt-3 text-sm text-[#858B93]">
          Administrá tu identidad y cargá tus obras musicales para los oyentes.
        </p>
      </section>

      {/* Tarjeta de Perfil de Artista */}
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xl mb-8">
        <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Mic size={28} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">{user?.artistName || 'Sin perfil'}</h2>
            <p className="text-sm text-[#858B93]">Correo: {user?.email}</p>
          </div>
        </div>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-[#858B93]">Nombre artístico</dt>
            <dd className="mt-1 text-base font-semibold text-white">{user?.artistName || 'Sin perfil'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[#858B93]">Género principal</dt>
            <dd className="mt-1 text-base font-semibold text-white">{user?.genre || '—'}</dd>
          </div>
        </dl>
      </div>

      {/* SECCIÓN ABAJO: Botón "Subir canción" y Panel de Carga */}
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Gestión de canciones</h2>
            <p className="text-sm text-[#858B93]">Cargá nuevas canciones como borrador.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsUploading(!isUploading)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-[#07130b] transition hover:brightness-110"
          >
            <Upload size={17} />
            {isUploading ? 'Ocultar formulario' : 'Subir canción'}
          </button>
        </div>

        {/* Formulario que se despliega al presionar el botón */}
        {isUploading && (
          <form onSubmit={handleSongSubmit} className="mt-6 space-y-4 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-white">Cargar una canción como borrador</h3>

            {successSong && (
              <div className="flex items-center gap-2 rounded-xl bg-brand/10 p-3 text-sm text-brand">
                <CheckCircle2 size={18} />
                <span>¡Guardado con éxito! La canción quedó en estado Borrador.</span>
              </div>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#D7D9DC]">Título</span>
              <input
                type="text"
                className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                placeholder="Título de la canción"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#D7D9DC]">Género</span>
                <select
                  className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                  value={songGenre}
                  onChange={(e) => setSongGenre(e.target.value)}
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>

              <div className="block">
                <span className="mb-1 block text-sm font-medium text-[#D7D9DC]">Duración</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                    placeholder="Min"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />
                  <span className="text-[#858B93]">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                    placeholder="Seg"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#D7D9DC]">Archivo de imagen (Carátula)</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-[#858B93]" required />
            </label>

            {imagePreview && (
              <div className="h-24 w-24 overflow-hidden rounded-xl border border-line">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}

            {errorSong && <p className="text-sm text-red-300">{errorSong}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Guardar
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <h3 className="mb-4 text-base font-semibold text-white">Mis canciones</h3>
          {publishedTitle && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand/10 p-3 text-sm text-brand">
              <CheckCircle2 size={18} />
              <span>¡"{publishedTitle}" ya está publicada! Los oyentes pueden buscarla y escucharla.</span>
            </div>
          )}
          {mySongs.length === 0 ? (
            <p className="text-sm text-[#858B93]">Aún no hay canciones cargadas.</p>
          ) : (
            <ul className="space-y-3">
              {mySongs.map((song) => (
                <li
                  key={song.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-[#0D0F12] p-3"
                >
                  <img src={song.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{song.title}</p>
                    <p className="text-xs text-[#858B93]">
                      {song.genre} · {formatDuration(song.duration)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      song.status === 'publicada'
                        ? 'bg-brand/10 text-brand'
                        : 'bg-white/10 text-[#B4BAC1]'
                    }`}
                  >
                    {song.status === 'publicada' ? 'Publicada' : 'Borrador'}
                  </span>
                  {song.status === 'borrador' && confirmingId !== song.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmingId(song.id)
                        setPublishedTitle('')
                      }}
                      className="rounded-xl bg-brand px-4 py-1.5 text-xs font-bold text-[#07130b] transition hover:brightness-110"
                    >
                      Publicar
                    </button>
                  )}

                  {confirmingId === song.id && (
                    <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                      <p className="text-sm text-[#D7D9DC]">
                        ¿Publicar esta canción? Los oyentes podrán escucharla.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handlePublish(song)}
                          className="rounded-xl bg-brand px-4 py-1.5 text-xs font-bold text-[#07130b] transition hover:brightness-110"
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="rounded-xl bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}