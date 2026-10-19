import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext.jsx'

export default function FavoriteButton({ song, compact = false }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [error, setError] = useState('')
  const favorite = isFavorite(song.id)

  function handleClick(event) {
    event.stopPropagation()
    setError('')
    try {
      toggleFavorite(song)
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'No se pudo actualizar la canción favorita.',
      )
    }
  }

  return (
    <div className={compact ? 'relative h-9 w-9 shrink-0' : 'contents'}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          favorite
            ? `Quitar ${song.title} de favoritos`
            : `Agregar ${song.title} a favoritos`
        }
        aria-pressed={favorite}
        title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        className={`${compact ? 'relative' : 'absolute right-3 top-3 z-10'} flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
          favorite
            ? 'border-brand/40 bg-[#101215]/90 text-brand'
            : `border-white/10 bg-[#101215]/75 text-white ${compact ? '' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'}`
        }`}
      >
        <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      {error && (
        <span
          role="alert"
          className={`absolute z-10 rounded-lg border border-red-400/20 bg-[#151316] px-2 py-1.5 text-xs text-red-300 shadow-lg ${
            compact ? 'right-0 top-10 w-48' : 'left-3 right-3 top-14'
          }`}
        >
          {error}
        </span>
      )}
    </div>
  )
}
