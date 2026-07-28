/**
 * Rampa lineal 0→1 entre dos valores de --progress, como expresión CSS.
 * Compartida entre las secciones que usan useScrollScrub para animar
 * clip-path/opacity/transform por tramos (DESIGN.md §9B).
 */
export function rampFraction(start: number, end: number): string {
  const rate = 1 / (end - start)
  return `clamp(0, calc((var(--progress) - ${start}) * ${rate}), 1)`
}
