export default function AdBanner({ ad, className = '' }) {
  if (!ad) return null
  return (
    <img
      src={ad.image}
      alt={`Anuncio: ${ad.name}`}
      className={`h-full w-full rounded-xl object-cover ${className}`}
    />
  )
}