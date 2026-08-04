import { Prisma, InvitationType, RsvpStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { normalizeName } from '../lib/normalizeName.js'
import { HttpError } from '../lib/httpError.js'
import type {
  CreateGuestInput,
  UpdateGuestInput,
  ListGuestsQuery,
  ExportGuestsQuery,
} from './guests.schema.js'

function buildWhere(query: {
  search?: string
  status?: RsvpStatus
  invitationType?: InvitationType
}): Prisma.GuestWhereInput {
  return {
    ...(query.status && { status: query.status }),
    ...(query.invitationType && { invitationType: query.invitationType }),
    ...(query.search && {
      normalizedName: { contains: normalizeName(query.search) },
    }),
  }
}

export async function listGuests(query: ListGuestsQuery) {
  const where = buildWhere(query)

  const [data, total] = await Promise.all([
    prisma.guest.findMany({
      where,
      orderBy: { fullName: 'asc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.guest.count({ where }),
  ])

  return { data, total, page: query.page, pageSize: query.pageSize }
}

export function createGuest(input: CreateGuestInput) {
  return prisma.guest.create({
    data: {
      fullName: input.fullName,
      normalizedName: normalizeName(input.fullName),
      phone: input.phone,
      invitationType: input.invitationType,
      maxAttendees: input.maxAttendees,
    },
  })
}

export async function updateGuest(id: string, input: UpdateGuestInput) {
  const existing = await prisma.guest.findUnique({ where: { id } })
  if (!existing) throw new HttpError(404, 'Invitado no encontrado')

  const maxAttendees = input.maxAttendees ?? existing.maxAttendees
  const attendeesCount = input.attendeesCount ?? existing.attendeesCount
  if (attendeesCount != null && attendeesCount > maxAttendees) {
    throw new HttpError(400, `attendeesCount no puede superar maxAttendees (${maxAttendees})`)
  }

  return prisma.guest.update({
    where: { id },
    data: {
      ...input,
      ...(input.fullName && { normalizedName: normalizeName(input.fullName) }),
      // El admin solo edita el status general, no discursoAttending/fiestaAttending
      // (esos campos vienen del form público). Si vuelve a poner PENDING para
      // "resetear" la respuesta, hay que limpiarlos también o el resumen por
      // evento sigue mostrando la respuesta vieja aunque el status ya no la refleje.
      ...(input.status === 'PENDING' && { discursoAttending: null, fiestaAttending: null }),
    },
  })
}

export async function deleteGuest(id: string) {
  try {
    await prisma.guest.delete({ where: { id } })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new HttpError(404, 'Invitado no encontrado')
    }
    throw err
  }
}

const STATUS_LABEL: Record<RsvpStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  DECLINED: 'No asistirá',
}

const INVITATION_LABEL: Record<InvitationType, string> = {
  AMBOS: 'Ambos',
  CEREMONIA: 'Ceremonia',
  RECEPCION: 'Recepción',
}

function csvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

/** BOM al inicio para que Excel detecte UTF-8 y no rompa los acentos. */
export async function exportGuestsCsv(query: ExportGuestsQuery): Promise<string> {
  const where = buildWhere(query)
  const guests = await prisma.guest.findMany({ where, orderBy: { fullName: 'asc' } })

  const header = [
    'Nombre',
    'Teléfono',
    'Invitación',
    'Tope de asistentes',
    'Estado',
    'Asistentes confirmados',
    'Mensaje',
    'Respondió el',
  ]

  const rows = guests.map((guest) => [
    guest.fullName,
    guest.phone ?? '',
    INVITATION_LABEL[guest.invitationType],
    String(guest.maxAttendees),
    STATUS_LABEL[guest.status],
    guest.attendeesCount != null ? String(guest.attendeesCount) : '',
    guest.message ?? '',
    guest.respondedAt ? guest.respondedAt.toISOString() : '',
  ])

  const csv = [header, ...rows].map((row) => row.map(csvField).join(',')).join('\n')
  return '﻿' + csv
}
