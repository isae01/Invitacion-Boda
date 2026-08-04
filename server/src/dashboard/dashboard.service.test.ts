import { describe, it, expect } from 'vitest'
import { eventOutcome, computeEventStats } from './dashboard.service.js'

describe('eventOutcome', () => {
  it('usa la respuesta del evento cuando existe, sin importar el status general', () => {
    expect(eventOutcome('PENDING', true)).toBe('CONFIRMED')
    expect(eventOutcome('CONFIRMED', false)).toBe('DECLINED')
  })

  it('cae al status general cuando no hay respuesta por evento (null)', () => {
    expect(eventOutcome('PENDING', null)).toBe('PENDING')
    expect(eventOutcome('CONFIRMED', null)).toBe('CONFIRMED')
    expect(eventOutcome('DECLINED', null)).toBe('DECLINED')
  })
})

describe('computeEventStats', () => {
  it('cuenta confirmados, pendientes y declinados por separado', () => {
    const guests = [
      { status: 'CONFIRMED' as const, attendeesCount: 2, maxAttendees: 2 },
      { status: 'PENDING' as const, attendeesCount: null, maxAttendees: 1 },
      { status: 'DECLINED' as const, attendeesCount: null, maxAttendees: 1 },
    ]
    const stats = computeEventStats(guests, [null, null, null])

    expect(stats.total).toBe(3)
    expect(stats.confirmed).toBe(1)
    expect(stats.pending).toBe(1)
    expect(stats.declined).toBe(1)
    expect(stats.totalAttendees).toBe(2)
    expect(stats.maxAttendeesTotal).toBe(4)
  })

  it('no cuenta a nadie como "no asistirá" si ningún invitado tiene status DECLINED ni respuesta de evento en false (regresión del bug de /admin)', () => {
    // Caso real: invitada confirmó, después declinó, el novio la editó desde
    // /admin y volvió a poner PENDING. Antes del fix, discursoAttending
    // quedaba en `false` (stale) aunque el status general ya fuera PENDING,
    // y el resumen por evento la seguía contando como "no asistirá".
    const guests = [{ status: 'PENDING' as const, attendeesCount: null, maxAttendees: 1 }]

    // Con el fix en guests.service.ts, updateGuest limpia discursoAttending
    // a null cuando el status vuelve a PENDING — así es como debería llegar
    // acá siempre que el status general sea PENDING.
    const stats = computeEventStats(guests, [null])

    expect(stats.declined).toBe(0)
    expect(stats.pending).toBe(1)
  })

  it('sí cuenta como declinado un evento puntual aunque el status general sea CONFIRMED (invitado de "ambos" que solo va a uno)', () => {
    const guests = [{ status: 'CONFIRMED' as const, attendeesCount: 1, maxAttendees: 1 }]
    const stats = computeEventStats(guests, [false])

    expect(stats.declined).toBe(1)
    expect(stats.confirmed).toBe(0)
  })
})
