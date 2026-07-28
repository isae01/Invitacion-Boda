import { cn } from '../lib/cn'

interface BotanicalDecorationProps {
  className?: string
  sway?: boolean
}

/**
 * Motivo botánico único del proyecto: rama fina con hojas, trazo constante
 * (stroke-width 1), en currentColor. Opacidad 0.3–0.45 siempre (DESIGN.md §10)
 * — nunca debe competir con una fotografía.
 */
function BotanicalDecoration({ className, sway = false }: BotanicalDecorationProps) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn('h-24 w-16 opacity-40', sway && 'animate-sway', className)}
    >
      <path d="M40 4 C 38 40, 42 80, 40 116" />
      <ellipse cx="40" cy="30" rx="14" ry="6" transform="rotate(-35 40 30)" />
      <ellipse cx="40" cy="58" rx="15" ry="6.5" transform="rotate(30 40 58)" />
      <ellipse cx="40" cy="86" rx="13" ry="5.5" transform="rotate(-25 40 86)" />
    </svg>
  )
}

export default BotanicalDecoration
