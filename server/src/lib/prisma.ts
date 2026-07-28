import { PrismaClient } from '@prisma/client'

/**
 * Singleton cacheado en `globalThis`: evita crear una conexión nueva en cada
 * hot-reload local o en cada invocación "warm" de la función serverless.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
