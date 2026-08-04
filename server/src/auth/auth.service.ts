import jwt from 'jsonwebtoken'
import { env } from '../lib/env.js'
import { HttpError } from '../lib/httpError.js'
import type { LoginInput } from './auth.schema.js'

export const SESSION_COOKIE = 'session'

/** Clave única compartida (no hay usuarios individuales) — ver ADMIN_PASSWORD en .env. */
export function login({ password }: LoginInput): string {
  if (password !== env.adminPassword) {
    throw new HttpError(401, 'Contraseña incorrecta')
  }

  return jwt.sign({ role: 'admin' }, env.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): void {
  jwt.verify(token, env.jwtSecret)
}
