# SoundWave

### Tu música, en todas partes

SoundWave es un clon/simulador de Spotify web desarrollado con React, Vite y Tailwind CSS. El proyecto propone una experiencia de música en línea e implementa una base de autenticación, navegación y vistas principales.

**Universidad Nacional de Lanús (UNLa)**

**Cátedra de Proyecto de Software · 2026**

## Stack Tecnológico

- **Frontend:** React, Vite, Tailwind CSS, React Router DOM y Lucide Icons (`lucide-react`).
- **Control de versiones:** Git y GitHub.

## Estructura del Proyecto

```text
soundwave/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── ads/
    │   │   └── AdBanner.jsx
    │   ├── layout/
    │   │   └── MainLayout.jsx
    │   ├── player/
    │   │   └── MusicPlayer.jsx
    │   └── songs/
    │   │   ├── FavoriteButton.jsx
    │   │   └── SongCard.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── FavoritesContext.jsx
    │   └── PlayerContext.jsx
    ├── data/
    │   ├── ads.js
    │   ├── songs.js
    │   └── users.js
    ├── config/
    │   └── navigation.js
    ├── pages/
    │   ├── Account.jsx
    │   ├── AdminAds.jsx
    │   ├── Dashboard.jsx
    │   ├── Favorites.jsx
    │   ├── Library.jsx
    │   ├── Login.jsx
    │   └── Register.jsx
    ├── routes/
    │   └── ProtectedRoute.jsx
    ├── services/
    │   ├── adsStorage.js
    │   ├── favoritesStorage.js
    │   └── playlistStorage.js
    └── utils/
        ├── imageUtils.js
        └── userHelpers.js
```

## Instalación y Ejecución

Requiere Node.js y npm instalados.

```bash
git clone https://github.com/alejoalmiron/software-project-music-web.git
cd software-project-music-web
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

## División de Responsabilidades y Asignación de Tareas (Sprint 1)

El equipo está conformado por cinco integrantes:

- **Alejo Daniel (Lead Architect & Base):** configuración de la arquitectura, layout global, estado de autenticación (`AuthContext`), rutas protegidas y módulo de registro, inicio y cierre de sesión (US-01, US-02, US-03).
- **Ariel:** módulo de reproductor flotante e interfaz de controles (US-04, US-05).
- **Lucas:** buscador de canciones y gestión de playlists (US-06, US-10).
- **Marcos:** banners publicitarios e interrupciones para usuarios Free (US-07).
- **Martín:** vistas de planes Premium y formulario de pago con tarjeta (US-08, US-09).

## Gestión de cuenta y planes

Los oyentes pueden abrir **Gestión de cuenta** desde el menú lateral para consultar su plan y
comparar Free con Premium según anuncios, precio y duración. El precio mostrado para Premium
(ARS 2.999 por 30 días) es ilustrativo. Un oyente Free puede elegir Premium y completar un
formulario de tarjeta de prueba; al confirmar, el plan se activa por 30 días y se ocultan los
anuncios. Si el oyente ya tiene Premium activo, se muestra la fecha de vencimiento y los días
restantes, sin ofrecer otra contratación. Cuando Premium vence, el plan vuelve a Free al iniciar
sesión y se muestra un aviso persistente con acceso a Gestión de cuenta para elegir Premium otra vez.

## Eliminar una playlist

Desde **Mi biblioteca**, abrí la playlist que quieras quitar y seleccioná **Eliminar**. La pantalla
pedirá confirmación; **Cancelar** conserva la playlist y **Confirmar** la elimina de la biblioteca
del usuario.

## Gestión de anuncios en banners

La aplicación muestra anuncios publicitarios en banners a los usuarios con plan gratuito. Un administrador decide cuáles se muestran.

### Usuarios precargados

Hay dos usuarios que ya vienen creados para probar la aplicación:

| Usuario | Correo | Contraseña | Qué puede hacer |
| --- | --- | --- | --- |
| Administrador | admin@soundwave.com | admin123 | Gestionar los anuncios |
| Oyente Premium (solo para pruebas) | premium@soundwave.com | premium123 | Escuchar música sin ver anuncios |

Cualquier otra cuenta se crea desde "Crear cuenta". Los oyentes nuevos empiezan con el plan Free, por lo que ven los anuncios. Las cuentas quedan guardadas en el navegador, así que solo existen en la computadora donde se crearon.

### Qué anuncios se ven y quién los ve

- Hay dos banners: el **Inferior** (arriba del reproductor) y el **Derecho** (al costado de las canciones).
- Cada banner muestra un solo anuncio a la vez: el que esté **Activo**.
- Los anuncios los ven únicamente los **oyentes con plan Free**. No los ven el administrador, los publicadores ni los oyentes Premium.
- La aplicación ya trae **4 anuncios precargados** (2 por banner), de los cuales uno por banner está activo desde el inicio. Así los banners se ven apenas se abre la aplicación, sin cargar nada.
- Al finalizar una canción con otra canción pendiente en la cola, los oyentes Free escuchan un anuncio de audio de 10 segundos antes de que continúe la reproducción. Durante el anuncio no se muestran controles. Los oyentes Premium continúan directamente con la siguiente canción.

### Cómo gestionar los anuncios (administrador)

1. Iniciar sesión como administrador.
2. Entrar a **Gestionar anuncios** desde el menú lateral.
3. Para **cargar un anuncio nuevo**: escribir un nombre, elegir una imagen JPG o PNG de hasta 2 MB, elegir el banner (Inferior o Derecho) y presionar **Cargar anuncio**. Los anuncios nuevos quedan **Inactivos**.
4. Para **mostrar un anuncio**: presionar **Activar** en la lista. Si ya había otro activo en ese banner, pasa a Inactivo automáticamente.
5. Para **dejar de mostrarlo**: presionar **Desactivar**.

> Los anuncios y las cuentas se guardan en el navegador, por eso cada computadora tiene sus propios datos.

## Biblioteca y canciones favoritas

Desde **Mi biblioteca** podés crear playlists y cambiar sus nombres. Marcá una canción con el ícono de corazón para guardarla en **Canciones favoritas**; podés quitarla de favoritos desde la misma tarjeta o desde esa vista. Las playlists y las canciones favoritas se guardan localmente en el navegador y se separan por usuario.

## Licencia / Estado

Proyecto con fines estrictamente académicos, desarrollado en el marco de la Cátedra de Proyecto de Software de la Universidad Nacional de Lanús (UNLa), 2026.
