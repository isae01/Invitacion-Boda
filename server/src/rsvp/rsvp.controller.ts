import type { Request, Response, NextFunction } from 'express'
import { rsvpSchema } from './rsvp.schema.js'
import { submitRsvp } from './rsvp.service.js'

export async function submitRsvpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = rsvpSchema.parse(req.body)
    res.json(await submitRsvp(input))
  } catch (err) {
    next(err)
  }
}
