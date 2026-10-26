import { Link } from 'react-router-dom'
import { artistProfilePath } from '../../services/artistStorage.js'

export default function ArtistLink({ artist, className = '' }) {
  if (!artist) return null

  return (
    <Link
      to={artistProfilePath(artist)}
      onClick={(event) => event.stopPropagation()}
      className={`truncate transition hover:text-white hover:underline ${className}`}
    >
      {artist}
    </Link>
  )
}
