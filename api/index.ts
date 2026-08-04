import { app } from '../server/src/app.js'

/**
 * Función única: toda request bajo /api/* llega acá (ver el rewrite en
 * vercel.json) y la resuelve el mismo Express app que se usa en desarrollo
 * local (server/src/app.ts). Se usa este patrón (en vez de un catch-all
 * `[...path].ts` con corchetes) porque el catch-all no estaba capturando
 * rutas de más de un segmento en producción — bug real encontrado en este
 * proyecto, no documentado.
 */
export default app
