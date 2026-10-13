import { useState, useEffect } from 'react'
import {
  Plus,
  AlertCircle,
  Folder,
  Play,
  Music,
  ArrowLeft,
} from 'lucide-react'
import {
  getPlaylists,
  createPlaylist,
} from '../services/playlistStorage.js'
import { usePlayer } from '../context/PlayerContext.jsx'

export default function Library() {
  const { playSong } = usePlayer()
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setPlaylists(getPlaylists())
  }, [])

  const currentPlaylist = playlists.find((p) => p.id === selectedPlaylistId)

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setPlaylistName('')
    setErrorMessage('')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPlaylistName('')
    setErrorMessage('')
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!playlistName.trim()) {
      setErrorMessage('El nombre de la playlist es obligatorio.')
      return
    }

    try {
      createPlaylist(playlistName)
      setPlaylists(getPlaylists())
      handleCloseModal()
    } catch (err) {
      setErrorMessage(err.message || 'Error al crear la playlist.')
    }
  }

  // Vista de detalle de la playlist seleccionada
  if (currentPlaylist) {
    const playlistSongs = currentPlaylist.songs || []

    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedPlaylistId(null)}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#858B93] transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Volver a mis playlists
        </button>

        <section className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E2631] via-[#141A22] to-[#0D1015] shadow-xl">
            <Music size={56} className="text-brand" />
          </div>

          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Playlist
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {currentPlaylist.name}
            </h1>
            <p className="mt-2 text-xs text-[#858B93]">
              {playlistSongs.length} {playlistSongs.length === 1 ? 'canción' : 'canciones'}
            </p>
          </div>
        </section>

        {playlistSongs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <Music size={32} className="mx-auto text-[#858B93] mb-3" />
            <p className="text-sm font-semibold text-white">
              Esta playlist aún no tiene canciones
            </p>
            <p className="mt-1 text-xs text-[#858B93]">
              Reproduce una canción y agrégala desde el menú de opciones (⋮) del reproductor.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line/40 rounded-2xl border border-line bg-surface">
            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className="group flex cursor-pointer items-center justify-between p-3.5 transition hover:bg-[#1A1D23] sm:px-5"
              >
                <div className="flex flex-1 items-center gap-3.5 min-w-0">
                  <span className="w-5 text-center text-xs font-medium text-[#737982] group-hover:hidden">
                    {index + 1}
                  </span>
                  <Play
                    size={14}
                    fill="currentColor"
                    className="hidden w-5 text-brand group-hover:block"
                  />

                  <img
                    src={song.image}
                    alt={song.title}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1 truncate">
                    <p className="truncate text-sm font-semibold text-white group-hover:text-brand">
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-[#858B93]">{song.artist}</p>
                  </div>
                </div>

                <span className="text-xs text-[#858B93] pl-3">{song.genre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Listado general de playlists
  return (
    <div>
      <section className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-sm text-[#858B93]">Tu colección</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Mi biblioteca
          </h1>
          <p className="mt-3 text-sm text-[#858B93]">
            Tus listas de reproducción personalizadas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-[#07130b] transition hover:brightness-110 active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          Crear una playlist
        </button>
      </section>

      {playlists.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface py-20 px-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1D23] text-[#858B93]">
            <Folder size={26} />
          </div>
          <p className="text-base font-semibold text-white">Tu biblioteca está vacía</p>
          <p className="mt-1 text-xs text-[#858B93]">
            Crea tu primera playlist para empezar a organizar tu música.
          </p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="mt-6 rounded-full border border-line bg-[#15181C] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#454C54] hover:bg-[#1C2026]"
          >
            Crear playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {playlists.map((playlist) => (
            <article
              key={playlist.id}
              onClick={() => setSelectedPlaylistId(playlist.id)}
              className="group relative cursor-pointer rounded-2xl border border-line bg-surface p-3 transition hover:border-[#333A41] hover:bg-[#17191D] sm:p-4"
            >
              <div className="relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#1E2631] via-[#141A22] to-[#0D1015] p-4 shadow-inner">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand/80">
                  Playlist
                </span>

                <div className="self-center text-[#4A5568] transition duration-300 group-hover:scale-110 group-hover:text-brand">
                  <Music size={42} strokeWidth={1.5} />
                </div>

                <div className="h-3" />

                <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-brand text-[#07130b] opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                </span>
              </div>

              <div className="mt-3">
                <h3 className="truncate text-sm font-semibold text-white" title={playlist.name}>
                  {playlist.name}
                </h3>
                <p className="mt-1 truncate text-xs text-[#858B93]">
                  {playlist.songs?.length ?? 0} {playlist.songs?.length === 1 ? 'canción' : 'canciones'}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal crear playlist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-[#121519] p-6 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-white">Crear una playlist</h2>
            <p className="mt-1 text-xs text-[#858B93]">
              Dale un nombre a tu nueva colección musical.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-5">
              <label htmlFor="playlistName" className="mb-1.5 block text-xs font-semibold text-[#858B93]">
                Nombre de la playlist
              </label>
              <input
                id="playlistName"
                type="text"
                value={playlistName}
                onChange={(e) => {
                  setPlaylistName(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                placeholder="Ej. Rock Clásico, Relax, Favoritas..."
                autoFocus
                className="w-full rounded-xl border border-line bg-[#1A1D23] px-4 py-2.5 text-sm text-white placeholder-[#737982] outline-none transition focus:border-brand"
              />

              {errorMessage && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-[#A1A7AF] transition hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-[#07130b] transition hover:brightness-110 active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}