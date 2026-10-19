import { Heart, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import SongCard from '../components/songs/SongCard.jsx'

export default function Favorites() {
  const { favoriteSongs } = useFavorites()
  const { playSong } = usePlayer()

  return (
    <section>
      <div className="mb-8">
        <p className="mb-2 text-sm text-[#858B93]">Tu colección</p>
        <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <Heart size={29} className="text-brand" />
          Canciones favoritas
        </h1>
        <p className="mt-3 text-sm text-[#858B93]">
          {favoriteSongs.length}{' '}
          {favoriteSongs.length === 1 ? 'canción guardada' : 'canciones guardadas'}
        </p>
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <Music2 size={34} className="mx-auto mb-3 text-[#858B93]" />
          <p className="text-base font-semibold text-white">
            Todavía no guardaste canciones
          </p>
          <p className="mt-1 text-sm text-[#858B93]">
            Agregá canciones a favoritos desde Inicio para encontrarlas acá.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-[#07130b] transition hover:brightness-110"
          >
            Explorar música
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {favoriteSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={() => playSong(song, favoriteSongs)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
