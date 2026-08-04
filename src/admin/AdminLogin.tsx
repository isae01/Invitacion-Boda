import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'
import { useAdminMusic } from './AdminLayout'
import { ApiError } from '../lib/api'
import { COUPLE } from '../data/couple'

const inputClasses =
  'rounded-lg border border-accent-pale/60 px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none'

function AdminLogin() {
  const { authenticated, loading, login } = useAdminAuth()
  const { play } = useAdminMusic()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Si ya hay una sesión válida, no tiene sentido mostrar el login.
  useEffect(() => {
    if (!loading && authenticated) navigate('/admin', { replace: true })
  }, [loading, authenticated, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(password)
      play()
      navigate('/admin')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent-deep px-6 py-12">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl">
        {/* Mismo patrón que el Footer de la invitación: foto + velo azul + nombre en serif cursiva. */}
        <div className="relative h-40 w-full">
          <img
            src="/images/IMG_9304.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '50% 25%' }}
          />
          <div className="absolute inset-0 bg-accent-deep/65" />
          <div className="relative flex h-full flex-col items-center justify-center text-white">
            <p className="font-serif text-2xl italic">
              {COUPLE.bride} &amp; {COUPLE.groom}
            </p>
            <p className="mt-1 text-[11px] tracking-[2px]">23 · 24.10.2026</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8">
          <img
            src="/images/copas.PNG"
            alt=""
            className="mx-auto h-24 w-24 opacity-80"
          />
          <h1 className="mt-3 text-center font-serif text-xl italic text-ink">
            Panel de los novios
          </h1>
          <p className="mt-1 text-center text-sm text-ink-secondary">
            Ingresa la clave para gestionar la lista de invitados.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <input
              type="password"
              required
              autoFocus
              placeholder="Clave"
              autoComplete="current-password"
              className={inputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-accent-deep py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin
