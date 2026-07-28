import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
}

/** <section> de ancho completo — bloque base de cada movimiento narrativo (DESIGN.md §3). */
function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('relative w-full', className)}>
      {children}
    </section>
  )
}

export default Section
