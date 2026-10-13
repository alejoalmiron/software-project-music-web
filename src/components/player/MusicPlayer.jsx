// src/components/player/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Play, Pause, MoreVertical, Plus, Check, ListMusic } from 'lucide-react';
import { getPlaylists, addSongToPlaylist } from '../../services/playlistStorage.js';

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, currentTime, seek } = usePlayer();
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);

  // Estados para el menú de opciones (3 puntitos)
  const [menuOpen, setMenuOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [addedMessage, setAddedMessage] = useState('');
  const menuRef = useRef(null);

  // Cargar playlists cada vez que se abre el menú
  const handleToggleMenu = () => {
    if (!menuOpen) {
      setPlaylists(getPlaylists(user?.id));
    }
    setMenuOpen((prev) => !prev);
  };

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

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
      
      {/* Imagen, Título y Artista de la canción */}
      <div className="flex w-1/4 items-center gap-3">
        <img
          src={currentSong.image}
          alt={currentSong.title}
          className="h-12 w-12 rounded-lg border border-line object-cover"
        />
        <div className="truncate">
          <p className="truncate text-sm font-semibold">{currentSong.title}</p>
          <p className="truncate text-xs text-[#858B93]">{currentSong.artist}</p>
        </div>
      </div>

      {/* Control de Play/Pausa y Barra de progreso */}
      <div className="flex w-2/4 max-w-md flex-col items-center gap-2">
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

      {/* Lado derecho: botón de 3 puntitos y popover */}
      <div className="relative flex w-1/4 items-center justify-end pr-2" ref={menuRef}>
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
          <div className="absolute bottom-12 right-2 z-50 w-64 rounded-2xl border border-line bg-[#16191F] p-2.5 shadow-2xl">
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