import { app } from '../server/src/app.js'

/**
 * Función catch-all: toda request bajo /api/* llega aquí y la resuelve el
 * mismo Express app que se usa en desarrollo local (server/src/app.ts).
 */
export default app
