import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitRsvp } from './rsvp.service.js'
import { prisma } from '../lib/prisma.js'
import { HttpError } from '../lib/httpError.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    guest: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const findMany = vi.mocked(prisma.guest.findMany)
const update = vi.mocked(prisma.guest.update)

const guest = {
  id: 'guest-1',
  fullName: 'Isabela Test',
  normalizedName: 'isabela test',
  phone: null,
  invitationType: 'AMBOS' as const,
  maxAttendees: 2,
  attendeesCount: null,
  status: 'PENDING' as const,
  discursoAttending: null,
  fiestaAttending: null,
  message: null,
  respondedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
  update.mockImplementation(
    (args) =>
      Promise.resolve({ ...guest, ...args.data }) as unknown as ReturnType<
        typeof prisma.guest.update
      >
  )
})

describe('submitRsvp', () => {
  it('lanza 404 si no encuentra al invitado por nombre', async () => {
    findMany.mockResolvedValue([])
    await expect(submitRsvp({ fullName: 'Nadie', status: 'CONFIRMED' })).rejects.toThrow(HttpError)
  })

  it('lanza 404 si hay más de una coincidencia (no se puede saber cuál es)', async () => {
    findMany.mockResolvedValue([guest, { ...guest, id: 'guest-2' }])
    await expect(submitRsvp({ fullName: 'Isabela Test', status: 'CONFIRMED' })).rejects.toThrow(
      HttpError
    )
  })

  it('lanza 400 si attendeesCount supera maxAttendees', async () => {
    findMany.mockResolvedValue([guest])
    await expect(
      submitRsvp({ fullName: 'Isabela Test', status: 'CONFIRMED', attendeesCount: 5 })
    ).rejects.toThrow(/máximo de personas/)
  })

  it('al declinar, guarda attendeesCount en null aunque el input traiga uno', async () => {
    findMany.mockResolvedValue([guest])
    await submitRsvp({ fullName: 'Isabela Test', status: 'DECLINED', attendeesCount: 3 })

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'DECLINED', attendeesCount: null }),
      })
    )
  })

  it('guarda discursoAttending y fiestaAttending como llegan (respuesta por evento)', async () => {
    findMany.mockResolvedValue([guest])
    await submitRsvp({
      fullName: 'Isabela Test',
      status: 'CONFIRMED',
      attendeesCount: 1,
      discursoAttending: true,
      fiestaAttending: false,
    })

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ discursoAttending: true, fiestaAttending: false }),
      })
    )
  })

  it('si no llega respuesta por evento, guarda null (no deja el valor anterior)', async () => {
    findMany.mockResolvedValue([{ ...guest, discursoAttending: false, fiestaAttending: true }])
    await submitRsvp({ fullName: 'Isabela Test', status: 'CONFIRMED', attendeesCount: 1 })

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ discursoAttending: null, fiestaAttending: null }),
      })
    )
  })
})
