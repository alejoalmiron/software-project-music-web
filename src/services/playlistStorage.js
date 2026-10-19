const PLAYLISTS_STORAGE_KEY = 'soundwave_playlists'

export const PLAYLISTS_CHANGED_EVENT = 'soundwave:playlists-changed'

// Lee TODAS las playlists guardadas (de todos los usuarios). Uso interno.
function readAllPlaylists() {
  try {
    const raw = localStorage.getItem(PLAYLISTS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error('Error al leer playlists desde localStorage:', error)
    return []
  }
}

// Devuelve solo las playlists del usuario indicado.
export function getPlaylists(userId) {
  if (!userId) return []
  return readAllPlaylists().filter((pl) => pl.ownerId === userId)
}

export function savePlaylists(playlists) {
  try {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists))
    window.dispatchEvent(new Event(PLAYLISTS_CHANGED_EVENT))
    return true
  } catch (error) {
    console.error('Error al guardar playlists en localStorage:', error)
    return false
  }
}

export function createPlaylist(name, userId) {
  const trimmedName = name?.trim()
  if (!trimmedName) {
    throw new Error('El nombre de la playlist es obligatorio')
  }

  if (!userId) {
    throw new Error('Tenés que iniciar sesión para crear una playlist')
  }

  const playlists = readAllPlaylists()
  const newPlaylist = {
    id: `pl-${Date.now()}`,
    ownerId: userId,
    name: trimmedName,
    createdAt: new Date().toISOString(),
    songs: [],
  }

  const updatedPlaylists = [newPlaylist, ...playlists]
  savePlaylists(updatedPlaylists)
  return newPlaylist
}

export function renamePlaylist(playlistId, name, userId) {
  const trimmedName = name?.trim()
  if (!trimmedName) {
    throw new Error('El nombre de la playlist es obligatorio')
  }
  if (!userId) {
    throw new Error('Tenés que iniciar sesión para renombrar una playlist')
  }

  const playlists = readAllPlaylists()
  const playlist = playlists.find(
    (item) => item.id === playlistId && item.ownerId === userId,
  )
  if (!playlist) {
    throw new Error('No se encontró una playlist propia para renombrar.')
  }

  const updatedPlaylists = playlists.map((item) =>
    item.id === playlistId && item.ownerId === userId
      ? { ...item, name: trimmedName }
      : item,
  )
  if (!savePlaylists(updatedPlaylists)) {
    throw new Error('No se pudieron guardar los cambios de la playlist.')
  }
  return { ...playlist, name: trimmedName }
}

// Agregar canción a la playlist (evita duplicados)
export function addSongToPlaylist(playlistId, song, userId) {
  const playlists = readAllPlaylists()
  const updatedPlaylists = playlists.map((pl) => {
    // Solo se puede agregar a una playlist propia
    if (pl.id === playlistId && pl.ownerId === userId) {
      const alreadyExists = pl.songs.some((s) => s.id === song.id)
      if (alreadyExists) return pl
      return { ...pl, songs: [...pl.songs, song] }
    }
    return pl
  })
  savePlaylists(updatedPlaylists)
  return updatedPlaylists
}