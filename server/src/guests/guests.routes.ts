import { Router } from 'express'
import {
  listGuestsHandler,
  createGuestHandler,
  updateGuestHandler,
  deleteGuestHandler,
  exportGuestsHandler,
} from './guests.controller.js'

export const guestsRouter = Router()

guestsRouter.get('/export', exportGuestsHandler)
guestsRouter.get('/', listGuestsHandler)
guestsRouter.post('/', createGuestHandler)
guestsRouter.patch('/:id', updateGuestHandler)
guestsRouter.delete('/:id', deleteGuestHandler)
