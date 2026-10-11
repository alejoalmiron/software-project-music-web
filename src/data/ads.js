// Anuncios precargados para pruebas.
const base = import.meta.env.BASE_URL

export const seedAds = [
  {
    id: 'seed-inferior-1',
    name: 'Anuncio de prueba azul',
    image: `${base}anuncios/inferior-1-azul.png`,
    banner: 'inferior',
    active: true,
  },
  {
    id: 'seed-inferior-2',
    name: 'Anuncio de prueba naranja',
    image: `${base}anuncios/inferior-2-naranja.jpg`,
    banner: 'inferior',
    active: false,
  },
  {
    id: 'seed-derecho-1',
    name: 'Anuncio de prueba violeta',
    image: `${base}anuncios/derecho-1-violeta.png`,
    banner: 'derecho',
    active: true,
  },
  {
    id: 'seed-derecho-2',
    name: 'Anuncio de prueba verde',
    image: `${base}anuncios/derecho-2-verde.jpg`,
    banner: 'derecho',
    active: false,
  },
]