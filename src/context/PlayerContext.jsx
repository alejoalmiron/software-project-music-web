// src/context/PlayerContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // 1. Al seleccionar una canción, se carga y arranca la reproducción
  const playSong = (song) => {
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
        setCurrentTime((prevTime) => {
          if (prevTime >= currentSong.duration) {
            setIsPlaying(false); // Detener al llegar al final
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        playSong,
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