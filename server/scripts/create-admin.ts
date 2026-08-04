import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../src/lib/prisma.js'

const inputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

async function main() {
  const [username, password] = process.argv.slice(2)
  const input = inputSchema.parse({ username, password })

  const passwordHash = await bcrypt.hash(input.password, 10)

  const admin = await prisma.admin.upsert({
    where: { email: input.username },
    create: { email: input.username, passwordHash },
    update: { passwordHash },
  })

  console.log(`Admin listo: ${admin.email}`)
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
