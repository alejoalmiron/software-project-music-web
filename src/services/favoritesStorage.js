const FAVORITES_STORAGE_KEY = 'soundwave_favorites'

export const FAVORITES_CHANGED_EVENT = 'soundwave:favorites-changed'

function readAllFavorites() {
  const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('El formato de las canciones favoritas no es válido.')
    }
    return parsed
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('No se pudieron leer las canciones favoritas guardadas.')
    }
    throw error
  }
}

export function getFavoriteSongIds(userId) {
  if (!userId) return []
  const favorites = readAllFavorites()
  const songIds = favorites[userId]
  if (songIds === undefined) return []
  if (!Array.isArray(songIds)) {
    throw new Error('El formato de las canciones favoritas no es válido.')
  }
  return songIds
}

export function saveFavoriteSongIds(userId, songIds) {
  if (!userId) {
    throw new Error('Tenés que iniciar sesión para guardar canciones favoritas.')
  }

  const favorites = readAllFavorites()
  favorites[userId] = songIds
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT))
}
