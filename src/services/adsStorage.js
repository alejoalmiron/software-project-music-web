const ADS_KEY = 'soundwave.ads'

export const BANNERS = {
  INFERIOR: 'inferior',
  DERECHO: 'derecho',
}

export const BANNER_LABELS = {
  [BANNERS.INFERIOR]: 'Inferior',
  [BANNERS.DERECHO]: 'Derecho',
}

export function getAds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ADS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAds(ads) {
  try {
    localStorage.setItem(ADS_KEY, JSON.stringify(ads))
    return { ok: true, ads }
  } catch {
    return {
      ok: false,
      error: 'No hay espacio disponible en el navegador para guardar el anuncio.',
    }
  }
}

// Los anuncios nuevos se cargan Inactivos.
export function addAd({ name, image, banner }) {
  const ad = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    name: name.trim(),
    image,
    banner,
    active: false,
  }
  return saveAds([...getAds(), ad])
}

// Un solo anuncio Activo por banner: al activar uno se desactiva el otro.
export function setAdActive(id, active) {
  const current = getAds()
  const target = current.find((ad) => ad.id === id)
  if (!target) return { ok: false, error: 'No se encontró el anuncio.' }
  const next = current.map((ad) => {
    if (ad.id === id) return { ...ad, active }
    if (active && ad.banner === target.banner) return { ...ad, active: false }
    return ad
  })
  return saveAds(next)
}

export function getActiveAd(banner) {
  return getAds().find((ad) => ad.banner === banner && ad.active) ?? null
}