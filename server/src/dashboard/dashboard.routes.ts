import { Router } from 'express'
import { getDashboardHandler } from './dashboard.controller.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', getDashboardHandler)
