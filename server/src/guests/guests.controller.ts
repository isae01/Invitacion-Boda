import type { Request, Response, NextFunction } from 'express'
import {
  createGuestSchema,
  updateGuestSchema,
  listGuestsQuerySchema,
  exportGuestsQuerySchema,
} from './guests.schema.js'
import { listGuests, createGuest, updateGuest, deleteGuest, exportGuestsCsv } from './guests.service.js'

export async function listGuestsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listGuestsQuerySchema.parse(req.query)
    res.json(await listGuests(query))
  } catch (err) {
    next(err)
  }
}

export async function exportGuestsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = exportGuestsQuerySchema.parse(req.query)
    const csv = await exportGuestsCsv(query)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="invitados.csv"')
    res.send(csv)
  } catch (err) {
    next(err)
  }
}

export async function createGuestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createGuestSchema.parse(req.body)
    res.status(201).json(await createGuest(input))
  } catch (err) {
    next(err)
  }
}

export async function updateGuestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateGuestSchema.parse(req.body)
    res.json(await updateGuest(req.params.id, input))
  } catch (err) {
    next(err)
  }
}

export async function deleteGuestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteGuest(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
