import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import AdminAds from './pages/AdminAds.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { ROLES } from './utils/userHelpers.js'
import Library from './pages/Library.jsx'

function NotFoundRedirect() {
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas que usan el MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="library" element={<Library />} />

                {/* Rutas exclusivas para Admin */}
                <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
                  <Route path="admin/anuncios" element={<AdminAds />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}