// src/components/player/MusicPlayer.jsx
import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { Play, Pause } from 'lucide-react';

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, currentTime, seek } = usePlayer();
  const [dragging, setDragging] = useState(false);

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

      <div className="hidden w-1/4 sm:block"></div>
    </div>
  );
}
//componente visual de la barra de reproduccion q va aparecer abajo de todo
//en la pantalla cuandoo se toca la cancion