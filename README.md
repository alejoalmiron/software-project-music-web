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
    │   └── layout/
    │       └── MainLayout.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── Login.jsx
    │   └── Register.jsx
    ├── routes/
    │   └── ProtectedRoute.jsx
    └── services/                 # Reservado para servicios e integraciones futuras
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

## Licencia / Estado

Proyecto con fines estrictamente académicos, desarrollado en el marco de la Cátedra de Proyecto de Software de la Universidad Nacional de Lanús (UNLa), 2026.
