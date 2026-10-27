// src/context/PlayerContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getCatalogSongs } from '../services/songStorage.js'; // Catálogo: precargadas + publicadas
import { showsAds } from '../utils/userHelpers.js';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState([]); // canciones de la lista que se está escuchando (ej: la playlist)
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const adCompletionHandled = useRef(false);

  // Reproducir una canción individual (Si viene de una playlist conserva esa lista, si es suelta genera por género)
  // Al tocar una canción (desde donde sea): se arma la cola de ese lugar y la canción suena desde cero.
  // Si se toca la misma canción que ya suena, vuelve a empezar.
  const playSong = (song, list = []) => {
    if (isAdPlaying) return;
    if (list && list.length > 0) {
      // Viene de una lista (ej: playlist): la cola es exactamente esa lista
      setQueue(list);
    } else {
      // Canción suelta (inicio / buscador): la cola es ella + las del mismo género
      const currentGenre = song.genre?.trim().toLowerCase();
      const sameGenreSongs = getCatalogSongs().filter(
        (s) => s.id !== song.id && s.genre?.trim().toLowerCase() === currentGenre
      );
      setQueue([song, ...sameGenreSongs]);
    }

    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // =========================================================================
  // >>> AGREGADO NUEVO: Función para reproducir desde la cola <<<
  // Permite saltar a una canción de la cola sin recalcular ni reordenar 'queue'.
  // Las canciones anteriores quedan arriba, la actual suena y las siguientes abajo.
  // =========================================================================
  const playFromQueue = (song) => {
    if (!song || isAdPlaying) return;
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };
  // =========================================================================

  // 2. Alternar entre Play y Pausa
  const togglePlay = () => {
    if (currentSong && !isAdPlaying) {
      setIsPlaying(!isPlaying);
    }
  };

  // Reproducir una playlist desde su botón "Reproducir"
  const playList = (list) => {
    if (!list || list.length === 0 || isAdPlaying) return;
    // Mantiene en orden EXACTO las canciones de la playlist
    setQueue(list);
    setCurrentSong(list[0]);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Pasar a la siguiente canción de la cola.
  const advanceQueue = () => {
    if (!currentSong) return;

    const index = queue.findIndex((s) => s.id === currentSong.id);
    const next = index >= 0 && index < queue.length - 1 ? queue[index + 1] : null;

    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
      setCurrentTime(0);
    } else {
      // Criterio Lean Inception 2: Si no hay otra canción en la cola (ej: terminó la playlist), la reproducción se detiene
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const playNext = () => {
    if (isAdPlaying) return;
    advanceQueue();
  };

  const finishAd = () => {
    if (!isAdPlaying || adCompletionHandled.current) return;
    adCompletionHandled.current = true;
    setIsAdPlaying(false);
    advanceQueue();
  };

  const playNextWithAd = () => {
    const index = queue.findIndex((song) => song.id === currentSong?.id);
    const hasNextSong = index >= 0 && index < queue.length - 1;
    if (hasNextSong && showsAds(user)) {
      adCompletionHandled.current = false;
      setIsPlaying(false);
      setIsAdPlaying(true);
      setCurrentTime(0);
      return;
    }
    advanceQueue();
  };

  // Volver a la canción anterior de la cola
  const playPrevious = () => {
    if (isAdPlaying) return;
    const index = queue.findIndex((s) => s.id === currentSong?.id);
    const previous = index > 0 ? queue[index - 1] : null;
    if (previous) {
      setCurrentSong(previous);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const removeSongFromPlayback = (songId) => {
    if (isAdPlaying) return;
    setQueue((currentQueue) => currentQueue.filter((song) => song.id !== songId))
    setCurrentSong((playing) => {
      if (playing?.id !== songId) return playing
      setIsPlaying(false)
      setCurrentTime(0)
      return null
    })
  }

  // Indican si hay canción anterior / siguiente (habilitan o deshabilitan los botones del reproductor)
  const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1;

  // 3. Mover la canción a un segundo puntual (al hacer click o arrastrar la barra)
  const seek = (seconds) => {
    if (!currentSong) return;
    const limited = Math.min(Math.max(Math.floor(seconds), 0), currentSong.duration - 1);
    setCurrentTime(limited);
  };

  // 4. Al cerrar sesión se detiene la música y se limpia el reproductor
  useEffect(() => {
    if (!user) {  
      setCurrentSong(null);   
      setIsPlaying(false);   
      setCurrentTime(0);   
      setIsAdPlaying(false);
    } 
  }, [user]);      

  // 5. Simulación de la barra de progreso (avanza 1 segundo cada 1000ms)
  useEffect(() => {
    let interval = null;
    if (isPlaying && currentSong && !isAdPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, isAdPlaying]);

  // 6. Al terminar la canción, los oyentes Free escuchan un anuncio antes de la siguiente.
  useEffect(() => {
    if (currentSong && isPlaying && currentTime >= currentSong.duration) {
      playNextWithAd();
    }
  }, [currentSong, currentTime, isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        isAdPlaying,
        finishAd,
        queue,
        playSong,
        playFromQueue, // <<< AGREGADO NUEVO: exportada para que la use el reproductor / cola
        playList,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        togglePlay,
        seek,
        removeSongFromPlayback,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  return context;
};
//sirve para q cualquier parte de la pag sepa q cancion se esta escuchando