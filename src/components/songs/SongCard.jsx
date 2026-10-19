import { Music2 } from 'lucide-react'
import FavoriteButton from './FavoriteButton.jsx'

export default function SongCard({ song, onPlay }) {
  return (
    <article className="group relative rounded-2xl border border-line bg-surface p-3 transition hover:border-[#333A41] hover:bg-[#17191D] sm:p-4">
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Reproducir ${song.title} de ${song.artist}`}
        className="block w-full text-left"
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
      </button>
      <FavoriteButton song={song} />
    </article>
  )
}
