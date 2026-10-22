import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LogOut, Music2, Mic } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { GENRES, getSongsByGenre, songs } from '../data/songs.js'

const recommendations = GENRES.map((genre) => ({
  genre,
  songs: getSongsByGenre(genre),
}))

export default function Dashboard() {
  const { user, logout, createArtistProfile } = useAuth()
  const { playSong } = usePlayer()

  // Estados locales por si es un publicador sin perfil al iniciar sesión
  const [artistNameInput, setArtistNameInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [profileError, setProfileError] = useState('')

  // Validamos si es publicador y le falta el perfil artístico
  const isPublisherWithoutProfile = user?.role === 'publicador' && !user?.artistName

function handleProfileSubmit(e) {
    e.preventDefault()
    setProfileError('')
    try {
      createArtistProfile({ artistName: artistNameInput, genre: genreInput })
      window.location.reload() // recargar y muestre el inicioo
    } catch (err) {
      setProfileError(err.message)
    }
  }

  // Si es publicador y no tiene perfil, mostramos la pantalla obligatoria de bienvenida/creación
  if (isPublisherWithoutProfile) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 shadow-2xl mt-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Mic size={24} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Completá tu perfil de artista</h1>
            <p className="text-sm text-[#858B93]">Bienvenido, {user.name}. Configurá tu identidad.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#D7D9DC]">Nombre artístico</span>
            <input
              type="text"
              className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-3 text-sm text-white outline-none focus:border-brand"
              placeholder="Ej: Banda Sonica"
              value={artistNameInput}
              onChange={(e) => setArtistNameInput(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#D7D9DC]">Género principal</span>
            <input
              type="text"
              className="w-full rounded-xl border border-line bg-[#0D0F12] px-4 py-3 text-sm text-white outline-none focus:border-brand"
              placeholder="Ej: Rock / Trap / Pop"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              required
            />
          </label>

          {profileError && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {profileError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3 text-sm font-bold text-[#07130b] transition hover:brightness-110"
          >
            Crear perfil y continuar
          </button>
        </form>
      </div>
    )
  }

  // --- RESTO DEL DASHBOARD NORMAL (Oyentes, Admins o Publicadores con perfil creado) ---
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')?.trim() || ''
  const hasSearched = Boolean(searchQuery)

  const searchResults = hasSearched
    ? songs.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleClearSearch = () => {
    setSearchParams({})
  }

  return (
    <div>
      <section className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-sm text-[#858B93]">Hola{user?.name ? `, ${user.name}` : ''}</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Buenas vibras para hoy
          </h1>
          <p className="mt-3 text-sm text-[#858B93]">
            Música para acompañar cada momento.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-[#15181C] px-4 py-2.5 text-xs font-semibold text-[#B4BAC1] transition hover:border-[#454C54] hover:text-white"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </section>

      {/* Si hay búsqueda activa: mostramos resultados o estado vacío */}
      {hasSearched ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              Resultados de la búsqueda: <span className="text-brand">"{searchQuery}"</span>
            </h2>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-semibold text-[#858B93] transition hover:text-white"
            >
              Volver a recomendaciones
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface py-16 text-center">
              <p className="text-base font-semibold text-white">
                No encontramos resultados
              </p>
              <p className="mt-1 text-xs text-[#858B93]">
                Prueba con otro título de canción.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {searchResults.map((song) => (
                <article
                  key={song.id}
                  onClick={() => playSong(song)}
                  className="group cursor-pointer rounded-2xl border border-line bg-surface p-3 transition hover:border-[#333A41] hover:bg-[#17191D] sm:p-4"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[#202329]">
                    <img
                      src={song.image}
                      alt={`Carátula de ${song.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-brand text-[#07130b] opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                      <Music2 size={18} fill="currentColor" />
                    </span>
                  </div>
                  <h3 className="mt-3 truncate text-sm font-semibold">{song.title}</h3>
                  <p className="mt-1 truncate text-xs text-[#858B93]">{song.artist}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Si no hay búsqueda: mostramos recomendaciones normales */
        <div className="space-y-10">
          {recommendations.map((section) => (
            <section key={section.genre}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  Recomendaciones <span className="text-[#858B93]">·</span>{' '}
                  {section.genre}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {section.songs.map((song) => (
                  <article
                    key={song.id}
                    onClick={() => playSong(song)}
                    className="group cursor-pointer rounded-2xl border border-line bg-surface p-3 transition hover:border-[#333A41] hover:bg-[#17191D] sm:p-4"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#202329]">
                      <img
                        src={song.image}
                        alt={`Carátula de ${song.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition group-hover:opacity-100" />
                      <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-brand text-[#07130b] opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                        <Music2 size={18} fill="currentColor" />
                      </span>
                    </div>
                    <h3 className="mt-3 truncate text-sm font-semibold">{song.title}</h3>
                    <p className="mt-1 truncate text-xs text-[#858B93]">{song.artist}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}