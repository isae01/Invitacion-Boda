import { z } from 'zod'
import { InvitationType, RsvpStatus } from '@prisma/client'

export const createGuestSchema = z.object({
  fullName: z.string().trim().min(1),
  phone: z.string().trim().min(1).optional(),
  invitationType: z.nativeEnum(InvitationType),
  maxAttendees: z.coerce.number().int().min(1).default(1),
})

export const updateGuestSchema = createGuestSchema.partial().extend({
  status: z.nativeEnum(RsvpStatus).optional(),
  attendeesCount: z.coerce.number().int().min(1).nullable().optional(),
  message: z.string().trim().max(1000).nullable().optional(),
})

export const listGuestsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.nativeEnum(RsvpStatus).optional(),
  invitationType: z.nativeEnum(InvitationType).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export const exportGuestsQuerySchema = listGuestsQuerySchema.omit({ page: true, pageSize: true })

export type CreateGuestInput = z.infer<typeof createGuestSchema>
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>
export type ListGuestsQuery = z.infer<typeof listGuestsQuerySchema>
export type ExportGuestsQuery = z.infer<typeof exportGuestsQuerySchema>
