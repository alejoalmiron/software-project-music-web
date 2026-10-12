import { LogOut, Music2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { GENRES, getSongsByGenre } from '../data/songs.js'

const recommendations = GENRES.map((genre) => ({
  genre,
  songs: getSongsByGenre(genre),
}))

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { playSong } = usePlayer() 

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

      <div className="space-y-10">
        {recommendations.map((section) => (
          <section key={section.genre}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                Recomendaciones <span className="text-[#858B93]">·</span>{' '}
                {section.genre}
              </h2>
              <button className="text-xs font-semibold text-[#858B93] transition hover:text-white">
                Ver todo
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {section.songs.map((song) => (
                <article
                  key={song.id}
                  onClick={() => playSong(song)} // 2. Agregamos el evento onClick aquí
                  className="group cursor-pointer rounded-2xl border border-line bg-surface p-3 transition hover:border-[#333A41] hover:bg-[#17191D] sm:p-4" // 3. Agregamos cursor-pointer
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
    </div>
  )
}