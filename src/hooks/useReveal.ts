import { useEffect, useRef, useState } from 'react'

interface UseRevealOptions {
  threshold?: number
  rootMargin?: string
  /** Si es true, el elemento se revela una sola vez y ya no se vuelve a ocultar. */
  once?: boolean
}

/**
 * Detecta cuándo un elemento entra en el viewport y expone `isRevealed`.
 * Por defecto alterna cada vez que entra o sale del viewport (a pedido de
 * la clienta: el efecto debe repetirse subiendo y bajando el scroll, sin
 * recargar la página) — con `once: true` se revela una sola vez y se
 * desobserva, para casos puntuales que no deban repetirse.
 *
 * No aplica ningún estilo — solo observa. La transición (opacity,
 * transform, timing) vive en las clases `.reveal` / `.reveal--visible`
 * de index.css, compartidas por todas las secciones.
 */
export function useReveal<T extends HTMLElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -6% 0px',
  once = false,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting)
        if (entry.isIntersecting && once) {
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isRevealed }
}
