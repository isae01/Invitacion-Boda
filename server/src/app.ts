import express from 'express'
import { prisma } from './lib/prisma.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(express.json())

/**
 * Smoke test de infraestructura: confirma que Express, Prisma y la conexión
 * a Postgres funcionan juntos antes de construir los módulos reales.
 */
app.get('/api/health', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: true })
  } catch (err) {
    next(err)
  }
})

app.use(errorHandler)
