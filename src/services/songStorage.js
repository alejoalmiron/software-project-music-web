import { songs } from '../data/songs.js'
const SONGS_KEY = 'soundwave.publisher_songs'

function readPublisherSongs() {
  const saved = localStorage.getItem(SONGS_KEY)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function publishSong(songId) {
  const allSongs = readPublisherSongs()

  const updatedSongs = allSongs.map((song) =>
    song.id === songId
      ? { ...song, status: 'publicada', publishedAt: new Date().toISOString() }
      : song,
  )

  localStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs))
}

export function deletePublishedSong(songId, artistEmail) {
  if (!artistEmail) {
    throw new Error('Tenés que iniciar sesión para eliminar una canción.')
  }

  const allSongs = readPublisherSongs()
  const song = allSongs.find((item) => item.id === songId)

  if (!song || song.artistEmail !== artistEmail) {
    throw new Error('No se encontró una canción propia para eliminar.')
  }
  if (song.status !== 'publicada') {
    throw new Error('Solo se pueden eliminar canciones publicadas.')
  }

  const updatedSongs = allSongs.filter((item) => item.id !== songId)
  localStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs))
  return song
}

// Las últimas canciones publicadas (la más reciente primero), para la sección "Nuevo"
export function getNewSongs(limit = 4) {
  return readPublisherSongs()
    .filter((song) => song.status === 'publicada')
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit)
}

export function getPublisherSongs(artistEmail) {
  const saved = localStorage.getItem(SONGS_KEY)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved)
    return parsed.filter((song) => song.artistEmail === artistEmail)
  } catch {
    return []
  }
}

// Catálogo completo: las canciones precargadas + las publicadas por los artistas
export function getCatalogSongs() {
  const saved = localStorage.getItem(SONGS_KEY)
  try {
    const published = (saved ? JSON.parse(saved) : []).filter(
      (song) => song.status === 'publicada',
    )
    return [...songs, ...published]
  } catch {
    return songs
  }
}

export function saveSongDraft(songData) {
  const saved = localStorage.getItem(SONGS_KEY)
  const allSongs = saved ? JSON.parse(saved) : []
  
  const newSong = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    ...songData,
    status: 'borrador', // Estado borrador
    createdAt: new Date().toISOString(),
  }

  const updatedSongs = [newSong, ...allSongs]
  localStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs))
  return newSong
}