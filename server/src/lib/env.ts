function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value
}

/** Falla rápido al importar si falta la variable, en vez de fallar tarde con un error confuso. */
export const env = {
  jwtSecret: required('JWT_SECRET'),
  adminPassword: required('ADMIN_PASSWORD'),
}
