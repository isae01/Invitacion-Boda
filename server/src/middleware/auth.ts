import type { NextFunction, Request, Response } from 'express'
import { SESSION_COOKIE, verifyToken } from '../auth/auth.service.js'
import { HttpError } from '../lib/httpError.js'

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE]

  if (!token) {
    next(new HttpError(401, 'No autenticado'))
    return
  }

  try {
    verifyToken(token)
    next()
  } catch {
    next(new HttpError(401, 'Sesión inválida o expirada'))
  }
}
