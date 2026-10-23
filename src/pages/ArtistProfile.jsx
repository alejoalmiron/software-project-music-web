import { useState } from 'react'
import { Mic, Upload, CheckCircle2, Music } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { saveSongDraft } from '../services/songStorage.js'
import { GENRES } from '../data/songs.js'

export default function ArtistProfile() {
  const { user } = useAuth()
  
  // Estados para el panel de "Subir canción" que aparece abajo
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [songGenre, setSongGenre] = useState(GENRES[0] || '')
  const [releaseDate, setReleaseDate] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [successSong, setSuccessSong] = useState(false)
  const [errorSong, setErrorSong] = useState('')


  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function handleSongSubmit(e) {
    e.preventDefault()
    setErrorSong('')
    setSuccessSong(false)

    if (!title.trim() || !releaseDate || !imagePreview) {
      setErrorSong('Completá todos los campos y seleccioná una imagen.')
      return
    }

    try {
      saveSongDraft({
        title: title.trim(),
        genre: songGenre,
        releaseDate,
        image: imagePreview,
        artist: user?.artistName || user?.name || 'Artista',
        artistEmail: user?.email,
      })

      setSuccessSong(true)
      setTitle('')
      setReleaseDate('')
      setImageFile(null)
      setImagePreview('')
    } catch (err) {
      setErrorSong('No se pudo guardar la canción como borrador.')
    }
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

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#D7D9DC]">Fecha de lanzamiento</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-2.5 text-sm text-white outline-none focus:border-brand text-white"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                />
              </label>
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
      </div>
    </div>
  )
}