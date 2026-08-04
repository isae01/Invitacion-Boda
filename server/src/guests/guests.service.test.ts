import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateGuest } from './guests.service.js'
import { prisma } from '../lib/prisma.js'
import { HttpError } from '../lib/httpError.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    guest: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const findUnique = vi.mocked(prisma.guest.findUnique)
const update = vi.mocked(prisma.guest.update)

const baseGuest = {
  id: 'guest-1',
  fullName: 'Isabela Test',
  normalizedName: 'isabela test',
  phone: null,
  invitationType: 'AMBOS' as const,
  maxAttendees: 2,
  attendeesCount: null,
  status: 'DECLINED' as const,
  // Quedó en false de una respuesta anterior por el form público.
  discursoAttending: false,
  fiestaAttending: false,
  message: null,
  respondedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
  findUnique.mockResolvedValue(baseGuest)
  update.mockImplementation(
    (args) =>
      Promise.resolve({ ...baseGuest, ...args.data }) as unknown as ReturnType<
        typeof prisma.guest.update
      >
  )
})

describe('updateGuest', () => {
  it('lanza 404 si el invitado no existe', async () => {
    findUnique.mockResolvedValue(null)
    await expect(updateGuest('no-existe', {})).rejects.toThrow(HttpError)
  })

  it('lanza 400 si attendeesCount supera maxAttendees', async () => {
    await expect(updateGuest('guest-1', { attendeesCount: 5 })).rejects.toThrow(
      /no puede superar maxAttendees/
    )
  })

  it('al volver el status a PENDING, limpia discursoAttending y fiestaAttending (fix del bug de resumen por evento)', async () => {
    await updateGuest('guest-1', { status: 'PENDING' })

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'PENDING',
          discursoAttending: null,
          fiestaAttending: null,
        }),
      })
    )
  })

  it('no toca discursoAttending/fiestaAttending si el status no cambia a PENDING', async () => {
    await updateGuest('guest-1', { status: 'CONFIRMED', attendeesCount: 1 })

    const call = update.mock.calls[0][0]
    expect(call.data).not.toHaveProperty('discursoAttending')
    expect(call.data).not.toHaveProperty('fiestaAttending')
  })

  it('no toca discursoAttending/fiestaAttending si se editan otros campos sin cambiar el status', async () => {
    await updateGuest('guest-1', { phone: '099123456' })

    const call = update.mock.calls[0][0]
    expect(call.data).not.toHaveProperty('discursoAttending')
    expect(call.data).not.toHaveProperty('fiestaAttending')
  })
})
