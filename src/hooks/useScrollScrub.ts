import { useEffect, useRef } from 'react'

/**
 * Progreso de scroll (0→1) de un contenedor "pineado" (sticky), expuesto
 * como la custom property CSS `--progress` en ese mismo contenedor.
 *
 * No conoce el significado visual del progreso — cada sección lo consume
 * en su propio CSS vía `calc(var(--progress) * ...)`. Esto mantiene el hook
 * genérico y reutilizable para heroseq, curtain, circlefull, bgdissolve, etc.
 *
 * No usa useState: escribir progress como estado de React re-renderizaría
 * en cada frame de scroll. En su lugar muta la propiedad CSS directamente
 * sobre el nodo DOM, fuera del ciclo de render.
 */
export function useScrollScrub<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ticking = false

    const updateProgress = () => {
      const rect = container.getBoundingClientRect()
      const scrollableHeight = rect.height - window.innerHeight
      const progress =
        scrollableHeight > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollableHeight))
          : 0

      container.style.setProperty('--progress', progress.toString())
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return containerRef
}
