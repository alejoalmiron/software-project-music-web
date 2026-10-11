export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return 'Seleccioná una imagen.'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato no válido: usá una imagen JPG o PNG.'
  }
  if (file.size > MAX_IMAGE_BYTES) return 'La imagen supera los 2 MB.'
  return ''
}

// Reduce la imagen para que entre en localStorage (límite ~5 MB).
export function resizeImageToDataUrl(file, maxSide = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}