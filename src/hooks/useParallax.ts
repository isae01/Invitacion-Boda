import { useEffect, useRef } from 'react'

/**
 * Parallax ligero (DESIGN.md §9, `data-parallax`) para elementos fuera de un
 * contenedor pineado: aplica un translate proporcional a la posición del
 * elemento respecto al centro del viewport. A diferencia de useScrollScrub,
 * no necesita un contenedor alto — sigue el scroll normal de la página.
 */
export function useParallax<T extends HTMLElement>(strength = 40, axis: 'x' | 'y' = 'y') {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let ticking = false

    const update = () => {
      const rect = element.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const offset = (viewportCenter - elementCenter) / viewportCenter
      const px = (offset * strength).toFixed(2)

      element.style.transform = axis === 'x' ? `translateX(${px}px)` : `translateY(${px}px)`
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength, axis])

  return ref
}
