import {
  Disc3,
  Play,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { navigationByRole } from '../../config/navigation.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MainLayout() {
  const { user } = useAuth()
  const navItems = navigationByRole[user?.role] ?? []
  
  return (
    <div className="min-h-screen bg-canvas text-white">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] border-r border-line bg-[#101215] px-5 py-7 md:flex md:flex-col">
        <Link to="/" className="mb-12 flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[#07130b]">
            <Disc3 size={25} strokeWidth={2.4} />
          </span>
          <span className="font-display text-[22px] font-extrabold tracking-tight">
            Sound<span className="text-brand">Wave</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-[#A1A7AF] hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto px-3 text-xs leading-5 text-[#626971]">
          Tu música, en todas partes.
        </p>
      </aside>

      <div className="pb-[110px] md:ml-[252px]">
        <header className="sticky top-0 z-10 flex h-[82px] items-center border-b border-line bg-canvas/90 px-5 backdrop-blur-xl sm:px-8">
          <label className="relative block w-full max-w-[520px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777E87]"
            />
            <input
              type="search"
              placeholder="Buscar canciones..."
              aria-label="Buscar canciones"
              className="w-full rounded-full border border-line bg-[#15181C] py-3 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-[#737982] focus:border-[#3B454D]"
            />
          </label>
          <div className="ml-auto hidden items-center gap-2 text-xs text-[#858B93] sm:flex">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Escuchá lo que te gusta
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 flex min-h-[88px] items-center justify-between border-t border-line bg-[#111316] px-4 py-3 sm:px-7 md:left-[252px]">
        <div className="flex min-w-0 items-center gap-3 sm:w-[30%]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#375b48] via-[#212d27] to-[#121815]">
            <Disc3 size={23} className="text-brand/90" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Elegí tu próximo tema</p>
            <p className="truncate text-xs text-[#858B93]">SoundWave</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button className="icon-button hidden sm:inline-flex" aria-label="Aleatorio">
            <Shuffle size={17} />
          </button>
          <button className="icon-button" aria-label="Anterior">
            <SkipBack size={18} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101215] transition hover:scale-105"
            aria-label="Reproducir"
          >
            <Play size={19} fill="currentColor" />
          </button>
          <button className="icon-button" aria-label="Siguiente">
            <SkipForward size={18} />
          </button>
          <button className="icon-button hidden sm:inline-flex" aria-label="Repetir">
            <Repeat size={17} />
          </button>
        </div>

        <div className="hidden w-[30%] items-center justify-end gap-3 sm:flex">
          <Volume2 size={18} className="text-[#9BA1A9]" />
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="68"
            aria-label="Volumen"
            className="h-1 w-24 cursor-pointer accent-brand"
          />
        </div>
      </footer>
    </div>
  )
}
