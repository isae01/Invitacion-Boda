import express from 'express'
import cookieParser from 'cookie-parser'
import { prisma } from './lib/prisma.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './auth/auth.routes.js'
import { guestsRouter } from './guests/guests.routes.js'
import { rsvpRouter } from './rsvp/rsvp.routes.js'
import { dashboardRouter } from './dashboard/dashboard.routes.js'
import { requireAuth } from './middleware/auth.js'

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/admin/guests', requireAuth, guestsRouter)
app.use('/api/admin/dashboard', requireAuth, dashboardRouter)
app.use('/api/rsvp', rsvpRouter)

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
