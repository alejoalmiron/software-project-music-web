import { useSearchParams } from 'react-router-dom'
import { Heart, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { GENRES, getSongsByGenre, songs } from '../data/songs.js'
import SongCard from '../components/songs/SongCard.jsx'

const recommendations = GENRES.map((genre) => ({
  genre,
  songs: getSongsByGenre(genre),
}))

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { playSong } = usePlayer()

  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')?.trim() || ''
  const hasSearched = Boolean(searchQuery)

  // Filtrado de canciones por título
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
        <div className="flex items-center gap-2">
          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-[#15181C] px-4 py-2.5 text-xs font-semibold text-[#B4BAC1] transition hover:border-[#454C54] hover:text-white"
          >
            <Heart size={15} />
            Favoritas
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-[#15181C] px-4 py-2.5 text-xs font-semibold text-[#B4BAC1] transition hover:border-[#454C54] hover:text-white"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
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
                <SongCard key={song.id} song={song} onPlay={() => playSong(song)} />
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
                  <SongCard key={song.id} song={song} onPlay={() => playSong(song)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}