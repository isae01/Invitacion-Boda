import type { Request, Response, NextFunction } from 'express'
import { loginSchema } from './auth.schema.js'
import { login, SESSION_COOKIE } from './auth.service.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body)
    const token = login(input)

    res.cookie(SESSION_COOKIE, token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

export function logoutHandler(_req: Request, res: Response) {
  res.clearCookie(SESSION_COOKIE, COOKIE_OPTIONS)
  res.status(204).end()
}

// requireAuth (montado antes en la ruta) ya validó la cookie — si llegamos
// acá, hay sesión.
export function meHandler(_req: Request, res: Response) {
  res.status(204).end()
}
