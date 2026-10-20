// src/components/player/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MoreVertical,
  Plus,
  Check,
  ListMusic,
  Volume2,
} from 'lucide-react';
import { getPlaylists, addSongToPlaylist } from '../../services/playlistStorage.js';

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    currentTime,
    seek,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    queue,
    playFromQueue, // <<< NUEVO: función para reproducir desde la cola sin alterar su orden
  } = usePlayer();
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);

  // Estados para el menú de opciones (3 puntitos)
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para la ventana flotante de la cola de reproducción
  const [queueOpen, setQueueOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [addedMessage, setAddedMessage] = useState('');

  const menuRef = useRef(null);
  const queueRef = useRef(null);

  // Cargar playlists cada vez que se abre el menú
  const handleToggleMenu = () => {
    if (!menuOpen) {
      setPlaylists(getPlaylists(user?.id));
      setQueueOpen(false);
    }
    setMenuOpen((prev) => !prev);
  };

  // Alternar visibilidad de la cola de reproducción
  const handleToggleQueue = () => {
    if (!queueOpen) setMenuOpen(false);
    setQueueOpen((prev) => !prev);
  };

  // Cerrar menú o lista de reproducción al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (queueRef.current && !queueRef.current.contains(e.target)) {
        setQueueOpen(false);
      }
    };
    if (menuOpen || queueOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, queueOpen]);

  // Manejar adición de la canción activa a la playlist seleccionada
  const handleSelectPlaylist = (playlistId, playlistName) => {
    const playlist = playlists.find((pl) => pl.id === playlistId);
    const alreadyInPlaylist = playlist?.songs?.some((s) => s.id === currentSong.id);

    if (alreadyInPlaylist) {
      setAddedMessage(`Ya estaba en ${playlistName}`);
    } else {
      addSongToPlaylist(playlistId, currentSong, user?.id);
      setAddedMessage(`Agregada a ${playlistName}`);
    }
    setTimeout(() => {
      setAddedMessage('');
      setMenuOpen(false);
    }, 1200);
  };

  // Si no hay canción seleccionada, no se muestra nada
  if (!currentSong) return null;

  // Formatear segundos (ej: 125s -> "2:05")
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = currentSong.duration
    ? (currentTime / currentSong.duration) * 100
    : 0;

  // Calcula el segundo según dónde se hizo click (o se arrastró) sobre la barra
  const seekFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * currentSong.duration);
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    seekFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (dragging) seekFromEvent(e);
  };

  const handlePointerUp = () => setDragging(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-[88px] flex items-center justify-between border-t border-line bg-[#121418] px-4 py-3 text-white shadow-lg md:left-[252px]">
      
      {/* LADO IZQUIERDO: Botón "Cola" + Información de la canción actual */}
      <div className="flex w-1/3 items-center gap-3">
        
        {/* BOTÓN "COLA" */}
        <div className="relative shrink-0" ref={queueRef}>
          <button
            type="button"
            onClick={handleToggleQueue}
            title="Ver cola de reproducción"
            className={`flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
              queueOpen ? 'bg-brand text-black border-brand' : 'bg-[#16191F] text-white hover:bg-white/10'
            }`}
          >
            <ListMusic size={16} />
            <span>Cola</span>
          </button>

          {/* Popover / Desplegable de la Cola de Reproducción */}
          {queueOpen && (
            <div className="absolute bottom-12 left-0 z-50 w-80 max-h-[70vh] flex flex-col rounded-2xl border border-line bg-[#16191F] p-3 shadow-2xl">
              <div className="flex items-center justify-between px-1 py-1 border-b border-line/40 pb-2 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#858B93]">
                  Cola de reproducción
                </p>
                <span className="text-[10px] text-[#737982]">
                  {queue.length} {queue.length === 1 ? 'canción' : 'canciones'}
                </span>
              </div>
              
              {/* Listado de todas las canciones en orden fijo */}
              <div className="overflow-y-auto space-y-1 pr-1 max-h-64">
                {queue.length === 0 ? (
                  <p className="p-3 text-center text-xs font-medium text-[#858B93] bg-white/5 rounded-xl">
                    No hay canciones en la cola
                  </p>
                ) : (
                  queue.map((song, i) => {
                    const isCurrent = song.id === currentSong.id;

                    return (
                      <div
                        key={`${song.id}-${i}`}
                        onClick={() => playFromQueue(song)}
                        className={`flex items-center justify-between gap-2.5 rounded-xl p-2 text-xs cursor-pointer transition ${
                          isCurrent
                            ? 'bg-brand/15 border border-brand/40 shadow-sm'
                            : 'hover:bg-white/5 border border-transparent opacity-85 hover:opacity-100'
                        }`}
                        title={isCurrent ? 'Reproduciendo ahora' : `Reproducir ${song.title}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Número o icono de sonido activo */}
                          <div className="w-4 flex justify-center shrink-0">
                            {isCurrent ? (
                              <Volume2 size={14} className="text-brand animate-pulse" />
                            ) : (
                              <span className="text-[11px] text-[#656C76]">{i + 1}</span>
                            )}
                          </div>

                          <img
                            src={song.image}
                            alt={song.title}
                            className="h-8 w-8 rounded-lg object-cover shrink-0"
                          />

                          <div className="truncate min-w-0">
                            <p className={`truncate text-xs ${isCurrent ? 'font-bold text-brand' : 'font-medium text-white'}`}>
                              {song.title}
                            </p>
                            <p className="text-[10px] text-[#858B93] truncate">{song.artist}</p>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#858B93] shrink-0">
                          {formatTime(song.duration)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Imagen, Título y Artista de la canción */}
        <img
          src={currentSong.image}
          alt={currentSong.title}
          className="h-12 w-12 rounded-lg border border-line object-cover shrink-0"
        />
        <div className="truncate">
          <p className="truncate text-sm font-semibold">{currentSong.title}</p>
          <p className="truncate text-xs text-[#858B93]">{currentSong.artist}</p>
        </div>
      </div>

      {/* CENTRO: Control de Play/Pausa y Barra de progreso */}
      <div className="flex w-1/3 max-w-md flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={playPrevious}
            disabled={!hasPrevious}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#858B93] transition hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#858B93]"
            title="Anterior"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            disabled={!hasNext}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#858B93] transition hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#858B93]"
            title="Siguiente"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>

        {/* Barra de progreso animada */}
        <div className="flex w-full items-center gap-3 text-xs text-[#858B93]">
          <span>{formatTime(currentTime)}</span>
          <div
            role="slider"
            aria-label="Progreso de la canción"
            aria-valuemin={0}
            aria-valuemax={currentSong.duration}
            aria-valuenow={currentTime}
            className="flex h-4 w-full cursor-pointer touch-none items-center"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#202329]">
              <div
                className={`h-full rounded-full bg-brand ${dragging ? '' : 'transition-all duration-300'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span>{formatTime(currentSong.duration)}</span>
        </div>
      </div>

      {/* LADO DERECHO: Botón de 3 puntitos (Playlists) */}
      <div className="relative flex w-1/3 items-center justify-end pr-2" ref={menuRef}>
        <button
          type="button"
          onClick={handleToggleMenu}
          title="Opciones de la canción"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#858B93] transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          <MoreVertical size={18} />
        </button>

        {/* Popover desplegable hacia arriba */}
        {menuOpen && (
          <div className="absolute bottom-12 right-0 z-50 w-64 rounded-2xl border border-line bg-[#16191F] p-2.5 shadow-2xl">
            <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#858B93]">
              Agregar a playlist
            </p>

            {addedMessage ? (
              <div className="flex items-center gap-2 rounded-xl bg-brand/10 px-3 py-2 text-xs font-semibold text-brand">
                <Check size={14} />
                <span>{addedMessage}</span>
              </div>
            ) : playlists.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-[#737982]">
                No tienes playlists creadas.
              </p>
            ) : (
              <div className="mt-1 max-h-48 overflow-y-auto space-y-1">
                {playlists.map((playlist) => {
                  const alreadyInPlaylist = playlist.songs?.some((s) => s.id === currentSong.id);

                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      onClick={() => handleSelectPlaylist(playlist.id, playlist.name)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <ListMusic size={15} className="shrink-0 text-brand" />
                        <span className="truncate text-white font-medium">{playlist.name}</span>
                      </div>
                      {alreadyInPlaylist ? (
                        <Check size={14} className="shrink-0 text-brand" />
                      ) : (
                        <Plus size={14} className="shrink-0 text-[#858B93]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}