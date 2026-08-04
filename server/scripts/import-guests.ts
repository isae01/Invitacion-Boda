import { readFileSync } from 'node:fs'
import { parse } from 'csv-parse/sync'
import { z } from 'zod'
import { InvitationType } from '@prisma/client'
import { prisma } from '../src/lib/prisma.js'
import { normalizeName } from '../src/lib/normalizeName.js'

const INVITATION_TYPE_BY_ALIAS: Record<string, InvitationType> = {
  ambos: InvitationType.AMBOS,
  ceremonia: InvitationType.CEREMONIA,
  recepcion: InvitationType.RECEPCION,
}

const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value)

const rowSchema = z.object({
  nombre: z.string().trim().min(1, 'nombre es requerido'),
  telefono: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  tipo_invitacion: z
    .string()
    .transform((value) => normalizeName(value))
    .refine((value): value is keyof typeof INVITATION_TYPE_BY_ALIAS => value in INVITATION_TYPE_BY_ALIAS, {
      message: 'tipo_invitacion debe ser: ambos, ceremonia o recepcion',
    }),
  asistentes_max: z.coerce.number().int().min(1).default(1),
})

interface RowError {
  row: number
  reason: string
}

async function main() {
  const path = process.argv[2]
  if (!path) {
    console.error('Uso: npm run import:guests -- ruta/al/archivo.csv')
    process.exitCode = 1
    return
  }

  const csv = readFileSync(path, 'utf8')
  const rows: Record<string, string>[] = parse(csv, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
    bom: true,
  })

  let imported = 0
  const errors: RowError[] = []

  for (let i = 0; i < rows.length; i++) {
    const rowNumber = i + 2 // +1 por índice base 0, +1 por la fila de encabezado
    const parsed = rowSchema.safeParse(rows[i])

    if (!parsed.success) {
      errors.push({
        row: rowNumber,
        reason: parsed.error.issues.map((issue) => issue.message).join('; '),
      })
      continue
    }

    const { nombre, telefono, tipo_invitacion, asistentes_max } = parsed.data

    try {
      await prisma.guest.create({
        data: {
          fullName: nombre,
          normalizedName: normalizeName(nombre),
          phone: telefono,
          invitationType: INVITATION_TYPE_BY_ALIAS[tipo_invitacion],
          maxAttendees: asistentes_max,
        },
      })
      imported++
    } catch (err) {
      errors.push({ row: rowNumber, reason: err instanceof Error ? err.message : String(err) })
    }
  }

  console.log(`Importados: ${imported}`)
  console.log(`Con error: ${errors.length}`)
  for (const error of errors) {
    console.log(`  fila ${error.row}: ${error.reason}`)
  }

  if (errors.length > 0) process.exitCode = 1
}

main().finally(() => prisma.$disconnect())
