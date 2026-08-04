import { z } from 'zod'

export const rsvpSchema = z.object({
  fullName: z.string().trim().min(1),
  status: z.enum(['CONFIRMED', 'DECLINED']),
  attendeesCount: z.coerce.number().int().min(1).optional(),
  message: z.string().trim().max(1000).optional(),
  discursoAttending: z.boolean().optional(),
  fiestaAttending: z.boolean().optional(),
})

export type RsvpInput = z.infer<typeof rsvpSchema>
