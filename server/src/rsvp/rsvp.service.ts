import { prisma } from '../lib/prisma.js'
import { normalizeName } from '../lib/normalizeName.js'
import { HttpError } from '../lib/httpError.js'
import type { RsvpInput } from './rsvp.schema.js'

const NOT_FOUND_MESSAGE =
  'No encontramos tu nombre en la lista de invitados. Revisa que esté escrito igual que en tu invitación, o contacta a los novios.'

export async function submitRsvp(input: RsvpInput) {
  const matches = await prisma.guest.findMany({
    where: { normalizedName: normalizeName(input.fullName) },
  })

  // 0 coincidencias: no está en la lista. Más de 1: no se puede saber cuál
  // es sin arriesgarse a actualizar la respuesta de otra persona.
  if (matches.length !== 1) {
    throw new HttpError(404, NOT_FOUND_MESSAGE)
  }

  const guest = matches[0]
  const attendeesCount = input.status === 'CONFIRMED' ? input.attendeesCount ?? 1 : null

  if (attendeesCount != null && attendeesCount > guest.maxAttendees) {
    throw new HttpError(
      400,
      `El máximo de personas que podés confirmar (incluyéndote) es ${guest.maxAttendees}.`
    )
  }

  const updated = await prisma.guest.update({
    where: { id: guest.id },
    data: {
      status: input.status,
      attendeesCount,
      message: input.message ?? null,
      discursoAttending: input.discursoAttending ?? null,
      fiestaAttending: input.fiestaAttending ?? null,
      respondedAt: new Date(),
    },
  })

  return {
    status: updated.status,
    attendeesCount: updated.attendeesCount,
  }
}
