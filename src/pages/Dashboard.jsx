import { LogOut, Music2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const recommendations = [
  {
    genre: 'Pop',
    songs: [
      {
        title: 'Midnight City',
        artist: 'M83',
        image:
          'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Golden',
        artist: 'Harry Styles',
        image:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Electric Feel',
        artist: 'MGMT',
        image:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Dreams',
        artist: 'The Cranberries',
        image:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=85',
      },
    ],
  },
  {
    genre: 'Rock',
    songs: [
      {
        title: 'Do I Wanna Know?',
        artist: 'Arctic Monkeys',
        image:
          'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Everlong',
        artist: 'Foo Fighters',
        image:
          'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Californication',
        artist: 'Red Hot Chili Peppers',
        image:
          'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'The Pretender',
        artist: 'Foo Fighters',
        image:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=640&q=85',
      },
    ],
  },
  {
    genre: 'Hip Hop',
    songs: [
      {
        title: 'Passionfruit',
        artist: 'Drake',
        image:
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Good Days',
        artist: 'SZA',
        image:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Nights',
        artist: 'Frank Ocean',
        image:
          'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'After Hours',
        artist: 'The Weeknd',
        image:
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=640&q=85',
      },
    ],
  },
  {
    genre: 'Electrónica',
    songs: [
      {
        title: 'Innerbloom',
        artist: 'RÜFÜS DU SOL',
        image:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Sunset Lover',
        artist: 'Petit Biscuit',
        image:
          'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'A Moment Apart',
        artist: 'ODESZA',
        image:
          'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=640&q=85',
      },
      {
        title: 'Strobe',
        artist: 'deadmau5',
        image:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=640&q=85',
      },
    ],
  },
]

export default function Dashboard() {
  const { user, logout } = useAuth()

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
                  key={`${section.genre}-${song.title}`}
                  className="group rounded-2xl border border-line bg-surface p-3 transition hover:border-[#333A41] hover:bg-[#17191D] sm:p-4"
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
