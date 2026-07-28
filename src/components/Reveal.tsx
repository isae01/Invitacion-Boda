import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'
import { cn } from '../lib/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  scale?: boolean
  threshold?: number
  rootMargin?: string
  /** Si es false, se revela y se oculta cada vez que entra/sale del viewport (no una sola vez). */
  once?: boolean
  /** Retraso antes de iniciar la transición — para escalonar una lista de Reveal (ej. itinerario). */
  delayMs?: number
}

/** Envuelve contenido con la animación de aparición estándar del sitio (DESIGN.md §9A). */
function Reveal({ children, className, scale = false, threshold, rootMargin, once, delayMs }: RevealProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>({ threshold, rootMargin, once })

  return (
    <div
      ref={ref}
      className={cn('reveal', scale && 'reveal--scale', isRevealed && 'reveal--visible', className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default Reveal
