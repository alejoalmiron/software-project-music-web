// src/context/PlayerContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();
 const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState([]); // canciones de la lista que se está escuchando (ej: la playlist)


  const playSong = (song, list = []) => {
    setQueue(list);
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  // 2. Alternar entre Play y Pausa
  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  // Reproducir una lista completa desde su primera canción (ej: botón "Reproducir" de una playlist)
  const playList = (list) => {
    if (!list || list.length === 0) return;
    setQueue(list);
    setCurrentSong(list[0]);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Pasar a la siguiente canción de la cola. Si no hay más, se detiene.
  const playNext = () => {
    const index = queue.findIndex((s) => s.id === currentSong?.id);
    const next = index >= 0 ? queue[index + 1] : null;
    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

   // Volver a la canción anterior de la cola
  const playPrevious = () => {
    const index = queue.findIndex((s) => s.id === currentSong?.id);
    const previous = index > 0 ? queue[index - 1] : null;
    if (previous) {
      setCurrentSong(previous);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  // Indican si hay canción anterior / siguiente (habilitan o deshabilitan los botones del reproductor)
  const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1; 

  // 3. Mover la canción a un segundo puntual (al hacer click o arrastrar la barra)
  const seek = (seconds) => {
    if (!currentSong) return;
    const limited = Math.min(Math.max(Math.floor(seconds), 0), currentSong.duration);
    setCurrentTime(limited);
  };

// 4. Al cerrar sesión se detiene la música y se limpia el reproductor
  useEffect(() => {
    if (!user)  {  
      setCurrentSong(null);   
      setIsPlaying(false);   
      setCurrentTime(0);   
      } 
    }, [user]);      

  // 5. Simulación de la barra de progreso (avanza 1 segundo cada 1000ms)
  useEffect(() => {
    let interval = null;
    if (isPlaying && currentSong) {
            interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  // 6. Al terminar la canción, suena la siguiente de la cola (o se detiene si era la última)
  useEffect(() => {
    if (currentSong && isPlaying && currentTime >= currentSong.duration) {
      playNext();
    }
  }, [currentTime]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        queue,
        playSong,
        playList,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        togglePlay,
        seek,
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