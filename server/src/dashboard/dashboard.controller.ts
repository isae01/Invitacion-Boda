import type { Request, Response, NextFunction } from 'express'
import { getDashboardStats } from './dashboard.service.js'

export async function getDashboardHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getDashboardStats())
  } catch (err) {
    next(err)
  }
}
