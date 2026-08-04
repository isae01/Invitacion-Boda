import { Router } from 'express'
import { loginHandler, logoutHandler, meHandler } from './auth.controller.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = Router()

authRouter.post('/login', loginHandler)
authRouter.post('/logout', logoutHandler)
authRouter.get('/me', requireAuth, meHandler)
