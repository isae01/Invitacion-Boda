import type { ErrorRequestHandler } from 'express'
import { HttpError } from '../lib/httpError.js'

/** Middleware final: cualquier error pasado a next(err) termina acá con una respuesta JSON consistente. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
