import {
  Disc3,
  Search,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { navigationByRole } from '../../config/navigation.js'
import { useAuth } from '../../context/AuthContext.jsx'
import AdBanner from '../ads/AdBanner.jsx'
import { BANNERS, getActiveAd } from '../../services/adsStorage.js'
import { showsAds } from '../../utils/userHelpers.js'
import { usePlayer } from '../../context/PlayerContext.jsx'
import MusicPlayer from '../player/MusicPlayer.jsx'


export default function MainLayout() {
  const { user } = useAuth()
  const { currentSong } = usePlayer()
  const navItems = navigationByRole[user?.role] ?? []
  const adsVisible = showsAds(user)
  const bottomAd = adsVisible ? getActiveAd(BANNERS.INFERIOR) : null
  const rightAd = adsVisible ? getActiveAd(BANNERS.DERECHO) : null
  
  const hasPlayer = Boolean(currentSong)
  const bottomSpace = (hasPlayer ? 88 : 0) + (bottomAd ? 72 : 0) + 24
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

      <div className="md:ml-[252px]" style={{ paddingBottom: bottomSpace }}>
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

        <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-5 py-8 sm:px-8 lg:px-10">
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
          {rightAd && (
            <aside
              aria-label="Anuncio"
              className="sticky top-[106px] hidden h-[340px] w-[240px] shrink-0 self-start lg:block"
            >
              <AdBanner ad={rightAd} />
            </aside>
          )}
        </div>
        
      </div>
      
      {bottomAd && (
        <div
          aria-label="Anuncio"
          className={`fixed inset-x-0 ${hasPlayer ? 'bottom-[88px]' : 'bottom-0'} z-20 h-[72px] border-t border-line bg-[#0D0F12] px-4 py-2 md:left-[252px]`}
        >
          <AdBanner ad={bottomAd} />
        </div>
      )}
      <MusicPlayer />
    </div>
  )
}
