import Reveal from './Reveal'
import { cn } from '../lib/cn'

interface ItineraryListProps {
  items: string[]
  /** Revela cada ítem por separado al entrar en viewport (DESIGN.md fila 9, Recepción). */
  revealItems?: boolean
  /** Fondo oscuro (bg-accent-deep) en vez de superficie clara — invierte texto/punto/línea a blanco. */
  dark?: boolean
}

/**
 * Bloque de itinerario editorial: punto + línea conectora (DESIGN.md §8) —
 * compartido entre Ceremonia y Recepción. Sin iconos ni emojis (regla
 * explícita del cliente).
 */
function ItineraryList({ items, revealItems = false, dark = false }: ItineraryListProps) {
  return (
    <ol className="mx-auto flex w-fit flex-col">
      {items.map((item, index) => {
        const text = (
          <span className={cn('text-[16px]', dark ? 'text-white/80' : 'text-ink-secondary')}>
            {item}
          </span>
        )
        return (
          <li key={`${item}-${index}`} className="flex gap-3">
            <span className="flex w-[7px] flex-col items-center">
              <span
                className={cn(
                  'mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full',
                  dark ? 'bg-accent-pale' : 'bg-accent'
                )}
              />
              {index < items.length - 1 && (
                <span className={cn('w-px flex-1', dark ? 'bg-white/25' : 'bg-border')} />
              )}
            </span>
            <div className="pb-[18px]">
              {revealItems ? <Reveal delayMs={index * 90} once>{text}</Reveal> : text}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default ItineraryList
