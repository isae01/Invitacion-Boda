import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../lib/httpError.js'

/** Middleware final: cualquier error pasado a next(err) termina acá con una respuesta JSON consistente. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Datos inválidos', details: err.issues })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
