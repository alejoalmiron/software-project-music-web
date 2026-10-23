import { songs } from '../data/songs.js'
const SONGS_KEY = 'soundwave.publisher_songs'

export function publishSong(songId) {
  const saved = localStorage.getItem(SONGS_KEY)
  const allSongs = saved ? JSON.parse(saved) : []

  const updatedSongs = allSongs.map((song) =>
    song.id === songId
      ? { ...song, status: 'publicada', publishedAt: new Date().toISOString() }
      : song,
  )

  localStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs))
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