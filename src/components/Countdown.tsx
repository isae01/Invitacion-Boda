import { useCountdown } from '../hooks/useCountdown'

interface CountdownProps {
  target: Date
}

/**
 * Widget de cuenta regresiva: 4 columnas, números tabulares (DESIGN.md §8).
 * Cada dígito usa key={valor} para reanimarse (micro-fade "tick") en cada cambio.
 */
function Countdown({ target }: CountdownProps) {
  const { days, hours, minutes, seconds } = useCountdown(target)
  const units = [
    { label: 'Días', value: days },
    { label: 'Horas', value: hours },
    { label: 'Min', value: minutes },
    { label: 'Seg', value: seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 text-center">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span
            key={unit.value}
            className="animate-tick font-sans text-3xl font-extrabold tabular-nums text-ink"
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-[2px] text-ink-tertiary">
            {unit.label.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Countdown
