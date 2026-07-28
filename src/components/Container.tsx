import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Contenedor de lectura centrado: max-width 600px, padding lateral 24–32px (DESIGN.md §7). */
function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[600px] px-[clamp(24px,6vw,32px)]', className)}>
      {children}
    </div>
  )
}

export default Container
