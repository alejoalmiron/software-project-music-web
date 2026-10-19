import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { songs } from '../data/songs.js'
import {
  FAVORITES_CHANGED_EVENT,
  getFavoriteSongIds,
  saveFavoriteSongIds,
} from '../services/favoritesStorage.js'
import { useAuth } from './AuthContext.jsx'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favoriteState, setFavoriteState] = useState({ userId: null, songIds: [] })

  useEffect(() => {
    const refreshFavorites = () => {
      setFavoriteState({
        userId: user?.id ?? null,
        songIds: getFavoriteSongIds(user?.id),
      })
    }

    refreshFavorites()
    window.addEventListener(FAVORITES_CHANGED_EVENT, refreshFavorites)
    window.addEventListener('storage', refreshFavorites)
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, refreshFavorites)
      window.removeEventListener('storage', refreshFavorites)
    }
  }, [user?.id])

  const favoriteIds =
    favoriteState.userId === user?.id ? favoriteState.songIds : []

  function isFavorite(songId) {
    return favoriteIds.includes(songId)
  }

  function toggleFavorite(song) {
    if (!user?.id) {
      throw new Error('Tenés que iniciar sesión para guardar canciones favoritas.')
    }

    const currentIds = getFavoriteSongIds(user.id)
    const nextIds = currentIds.includes(song.id)
      ? currentIds.filter((songId) => songId !== song.id)
      : [...currentIds, song.id]

    saveFavoriteSongIds(user.id, nextIds)
    setFavoriteState({ userId: user.id, songIds: nextIds })
  }

  const favoriteSongs = useMemo(
    () => songs.filter((song) => favoriteIds.includes(song.id)),
    [favoriteIds],
  )

  const value = useMemo(
    () => ({ favoriteSongs, isFavorite, toggleFavorite }),
    [favoriteSongs, favoriteIds],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider.')
  }
  return context
}
