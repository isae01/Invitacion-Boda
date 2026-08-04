import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import BackgroundMusic, { type BackgroundMusicHandle } from '../components/BackgroundMusic'
import { ADMIN_MUSIC_PLAYLIST, ADMIN_MUSIC_VOLUME } from '../data/music'

interface AdminMusicContextValue {
  /** Solo funciona si se llama directo desde un gesto del usuario (ej. el clic de "Entrar"). */
  play: () => void
  muted: boolean
  toggleMuted: () => void
}

const AdminMusicContext = createContext<AdminMusicContextValue | null>(null)

export function useAdminMusic() {
  const ctx = useContext(AdminMusicContext)
  if (!ctx) throw new Error('useAdminMusic debe usarse dentro de AdminLayout')
  return ctx
}

/**
 * Envuelve /admin/login y /admin: el <audio> vive aquí, una sola vez, y no
 * se desmonta al navegar de login al panel — por eso la música iniciada al
 * loguearse sigue sonando adentro sin reiniciarse (mismo patrón que
 * EnvelopeGate para la invitación).
 */
function AdminLayout() {
  const musicRef = useRef<BackgroundMusicHandle>(null)
  const [muted, setMuted] = useState(false)

  const play = useCallback(() => musicRef.current?.play(), [])

  // "Activar música" también hace play(): si se entró al panel sin pasar por
  // el submit del login (ej. refrescando la página ya logueado), el audio
  // nunca arrancó y destildar el mute solo no alcanza para que suene.
  const toggleMuted = useCallback(() => {
    setMuted((m) => {
      const next = !m
      if (!next) musicRef.current?.play()
      return next
    })
  }, [])

  return (
    <AdminMusicContext.Provider value={{ play, muted, toggleMuted }}>
      <BackgroundMusic ref={musicRef} src={ADMIN_MUSIC_PLAYLIST} volume={ADMIN_MUSIC_VOLUME} muted={muted} />
      <Outlet />
    </AdminMusicContext.Provider>
  )
}

export default AdminLayout
