import { RsvpStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

interface EventStats {
  total: number
  confirmed: number
  pending: number
  declined: number
  totalAttendees: number
  maxAttendeesTotal: number
}

/**
 * Sin respuesta explícita al evento (discursoAttending/fiestaAttending en
 * null), se usa el status general del invitado — cubre invitados de un solo
 * evento y datos cargados desde /admin sin ese detalle.
 */
export function eventOutcome(status: RsvpStatus, attending: boolean | null): RsvpStatus {
  if (attending === true) return 'CONFIRMED'
  if (attending === false) return 'DECLINED'
  return status
}

export function computeEventStats(
  guests: Array<{ status: RsvpStatus; attendeesCount: number | null; maxAttendees: number }>,
  attendingByGuest: Array<boolean | null>,
): EventStats {
  const stats: EventStats = {
    total: guests.length,
    confirmed: 0,
    pending: 0,
    declined: 0,
    totalAttendees: 0,
    maxAttendeesTotal: 0,
  }
  guests.forEach((guest, i) => {
    stats.maxAttendeesTotal += guest.maxAttendees
    const outcome = eventOutcome(guest.status, attendingByGuest[i])
    if (outcome === 'CONFIRMED') {
      stats.confirmed++
      // attendeesCount ya incluye al invitado principal, no hay que sumarle +1.
      stats.totalAttendees += guest.attendeesCount ?? 1
    } else if (outcome === 'DECLINED') {
      stats.declined++
    } else {
      stats.pending++
    }
  })
  return stats
}

export async function getDashboardStats() {
  const [total, confirmed, pending, declined, attendeesAgg, guests] = await Promise.all([
    prisma.guest.count(),
    prisma.guest.count({ where: { status: 'CONFIRMED' } }),
    prisma.guest.count({ where: { status: 'PENDING' } }),
    prisma.guest.count({ where: { status: 'DECLINED' } }),
    prisma.guest.aggregate({ where: { status: 'CONFIRMED' }, _sum: { attendeesCount: true } }),
    prisma.guest.findMany({
      select: {
        invitationType: true,
        status: true,
        attendeesCount: true,
        maxAttendees: true,
        discursoAttending: true,
        fiestaAttending: true,
      },
    }),
  ])

  const attendanceRate = total === 0 ? 0 : Math.round((confirmed / total) * 1000) / 10

  const discursoInvitees = guests.filter((g) => g.invitationType === 'CEREMONIA' || g.invitationType === 'AMBOS')
  const fiestaInvitees = guests.filter((g) => g.invitationType === 'RECEPCION' || g.invitationType === 'AMBOS')
  const ambosInvitees = guests.filter((g) => g.invitationType === 'AMBOS')

  const byInvitationType = {
    CEREMONIA: computeEventStats(
      discursoInvitees,
      discursoInvitees.map((g) => g.discursoAttending),
    ),
    RECEPCION: computeEventStats(
      fiestaInvitees,
      fiestaInvitees.map((g) => g.fiestaAttending),
    ),
    // "Ambos" sigue reflejando el status general de la invitación, sin
    // desglosar por evento (esa granularidad ya la dan las dos tarjetas de arriba).
    AMBOS: computeEventStats(
      ambosInvitees,
      ambosInvitees.map(() => null),
    ),
  }

  return {
    total,
    confirmed,
    pending,
    declined,
    attendanceRate,
    totalAttendees: attendeesAgg._sum.attendeesCount ?? 0,
    maxAttendeesTotal: guests.reduce((sum, g) => sum + g.maxAttendees, 0),
    byInvitationType,
  }
}
