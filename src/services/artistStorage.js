import { ROLES } from '../utils/userHelpers.js'
import { getCatalogSongs } from './songStorage.js'

const USERS_KEY = 'soundwave.users'

export function artistProfilePath(artistName) {
  return `/artist/${encodeURIComponent(artistName)}`
}

function readPublisherProfiles() {
  const saved = localStorage.getItem(USERS_KEY)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (account) =>
          account?.role === ROLES.PUBLICADOR && Boolean(account.artistName?.trim()),
      )
      .map((account) => ({
        artistName: account.artistName.trim(),
        genre: account.genre?.trim() || '',
      }))
  } catch {
    return []
  }
}

export function getPublishedSongsByArtist(artistName) {
  const normalized = artistName?.trim().toLowerCase()
  if (!normalized) return []
  return getCatalogSongs().filter(
    (song) => song.artist?.trim().toLowerCase() === normalized,
  )
}

export function getPublicArtistProfile(artistName) {
  const trimmed = artistName?.trim()
  if (!trimmed) return null

  const normalized = trimmed.toLowerCase()
  const publishedSongs = getPublishedSongsByArtist(trimmed)
  const publisher = readPublisherProfiles().find(
    (profile) => profile.artistName.toLowerCase() === normalized,
  )

  if (!publisher && publishedSongs.length === 0) return null

  const genresFromSongs = [...new Set(publishedSongs.map((song) => song.genre).filter(Boolean))]

  return {
    artistName: publisher?.artistName || publishedSongs[0]?.artist || trimmed,
    genre: publisher?.genre || genresFromSongs[0] || '',
    genres: publisher?.genre ? [publisher.genre] : genresFromSongs,
    isRegisteredPublisher: Boolean(publisher),
    publishedSongs,
  }
}
