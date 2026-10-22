const SONGS_KEY = 'soundwave.publisher_songs'

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