import { useCallback, useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

/** Sesión única compartida por clave — no hay usuarios individuales que distinguir. */
export function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      await apiGet('/api/auth/me')
      setAuthenticated(true)
    } catch {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function login(password: string) {
    await apiPost('/api/auth/login', { password })
    setAuthenticated(true)
  }

  async function logout() {
    await apiPost('/api/auth/logout')
    setAuthenticated(false)
  }

  return { authenticated, loading, login, logout }
}
