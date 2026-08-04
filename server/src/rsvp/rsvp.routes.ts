import { Router } from 'express'
import { submitRsvpHandler } from './rsvp.controller.js'

export const rsvpRouter = Router()

rsvpRouter.post('/', submitRsvpHandler)
