import { Mic, Music2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import SongCard from '../components/songs/SongCard.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { getPublicArtistProfile } from '../services/artistStorage.js'

export default function PublicArtistProfile() {
  const { artistSlug } = useParams()
  const { playSong } = usePlayer()
  const artistName = artistSlug ? decodeURIComponent(artistSlug) : ''
  const profile = getPublicArtistProfile(artistName)

  if (!profile) {
    return (
      <section className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
        <Mic size={34} className="mx-auto mb-3 text-[#858B93]" />
        <h1 className="font-display text-2xl font-bold">No encontramos ese artista</h1>
        <p className="mt-2 text-sm text-[#858B93]">
          El perfil no existe o todavía no tiene canciones publicadas.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-[#07130b] transition hover:brightness-110"
        >
          Volver al inicio
        </Link>
      </section>
    )
  }

  const { publishedSongs } = profile

  return (
    <div>
      <section className="mb-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <p className="mb-2 text-sm text-[#858B93]">Perfil de artista</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Mic size={30} />
          </span>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {profile.artistName}
            </h1>
            <p className="mt-2 text-sm text-[#858B93]">
              {profile.genre ? `${profile.genre} · ` : ''}
              {publishedSongs.length}{' '}
              {publishedSongs.length === 1 ? 'canción publicada' : 'canciones publicadas'}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Music2 size={18} className="text-brand" />
          <h2 className="font-display text-xl font-bold">Canciones publicadas</h2>
        </div>

        {publishedSongs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-base font-semibold text-white">Todavía no hay canciones publicadas</p>
            <p className="mt-1 text-sm text-[#858B93]">
              Cuando el artista publique una canción, va a aparecer acá.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {publishedSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={() => playSong(song, publishedSongs)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
