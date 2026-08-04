import { Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AdminLayout from './admin/AdminLayout.tsx'
import AdminLogin from './admin/AdminLogin.tsx'
import AdminPanel from './admin/AdminPanel.tsx'
import type { GuestAccess } from './types/guestAccess'

/** Única fuente de verdad ruta → guestAccess. Nada fuera de este archivo conoce el pathname. */
const ROUTE_GUEST_ACCESS: Record<string, GuestAccess> = {
  '/': 'ambos',
  '/1': 'ceremonia',
  '/2': 'recepcion',
  '/3': 'ambos',
}

function AppRoutes() {
  return (
    <Routes>
      {Object.entries(ROUTE_GUEST_ACCESS).map(([path, guestAccess]) => (
        <Route key={path} path={path} element={<App guestAccess={guestAccess} />} />
      ))}
      <Route element={<AdminLayout />}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
