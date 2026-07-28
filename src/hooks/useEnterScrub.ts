import { useEffect, useRef } from 'react'

/**
 * Progreso (0→1) de cuánto ha "entrado" un elemento al viewport, expuesto
 * como `--progress` en ese mismo nodo — igual convención que useScrollScrub,
 * pero sin necesitar un contenedor pineado (DESIGN.md §9, satélites de
 * Fusión: "se calculan por posición de scroll de su sección padre").
 * 0 cuando el tope del elemento toca el borde inferior del viewport,
 * 1 cuando llega a la mitad del viewport.
 */
export function useEnterScrub<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let ticking = false

    const update = () => {
      const rect = element.getBoundingClientRect()
      const start = window.innerHeight
      const end = window.innerHeight / 2
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))

      element.style.setProperty('--progress', progress.toString())
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
  }, [])

  return ref
}
