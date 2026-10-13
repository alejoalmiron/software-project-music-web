const PLAYLISTS_STORAGE_KEY = 'soundwave_playlists'

export function getPlaylists() {
  try {
    const raw = localStorage.getItem(PLAYLISTS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error('Error al leer playlists desde localStorage:', error)
    return []
  }
}

export function savePlaylists(playlists) {
  try {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists))
  } catch (error) {
    console.error('Error al guardar playlists en localStorage:', error)
  }
}

export function createPlaylist(name) {
  const trimmedName = name?.trim()
  if (!trimmedName) {
    throw new Error('El nombre de la playlist es obligatorio')
  }

  const playlists = getPlaylists()
  const newPlaylist = {
    id: `pl-${Date.now()}`,
    name: trimmedName,
    createdAt: new Date().toISOString(),
    songs: [],
  }

  const updatedPlaylists = [newPlaylist, ...playlists]
  savePlaylists(updatedPlaylists)
  return newPlaylist
}

// Agregar canción a la playlist (evita duplicados)
export function addSongToPlaylist(playlistId, song) {
  const playlists = getPlaylists()
  const updatedPlaylists = playlists.map((pl) => {
    if (pl.id === playlistId) {
      const alreadyExists = pl.songs.some((s) => s.id === song.id)
      if (alreadyExists) return pl
      return { ...pl, songs: [...pl.songs, song] }
    }
    return pl
  })
  savePlaylists(updatedPlaylists)
  return updatedPlaylists
}