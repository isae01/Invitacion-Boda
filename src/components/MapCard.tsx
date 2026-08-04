import {
  EVENT_DISPLAY_LABEL,
  EVENT_VENUE_PHOTO,
  EVENT_VENUE_PHOTO_POSITION,
  type EventInfo,
} from '../data/events'

interface MapCardProps {
  event: EventInfo
}

/**
 * Tarjeta de ubicación (DESIGN.md §8): foto real del lugar + pin + nombre +
 * dirección + fecha/hora + botones Maps/Waze.
 */
function MapCard({ event }: MapCardProps) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-surface shadow-[0_12px_40px_rgba(15,22,29,0.1)]">
      <div className="relative flex h-[150px] w-full items-center justify-center overflow-hidden">
        <img
          src={EVENT_VENUE_PHOTO[event.key]}
          alt={event.location}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: EVENT_VENUE_PHOTO_POSITION[event.key] }}
        />
        <div className="absolute inset-0 bg-accent-deep/35" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={1.4}
          className="relative h-10 w-10 drop-shadow-[0_2px_6px_rgba(15,22,29,0.5)]"
          aria-hidden="true"
        >
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
      </div>

      <div className="px-8 py-7 text-center">
        <span className="text-[13px] font-bold tracking-[3px] text-accent">
          {EVENT_DISPLAY_LABEL[event.key]}
        </span>
        <p className="mt-2 font-serif text-xl font-semibold leading-snug text-ink">
          {event.location}
        </p>
        <p className="mt-1 text-sm text-ink-secondary">
          {event.date} · {event.timeRange}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent-deep px-6 py-3 text-[13px] font-semibold text-white"
          >
            Google Maps
          </a>
          <a
            href={event.wazeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-6 py-3 text-[13px] font-semibold text-ink"
          >
            Waze
          </a>
        </div>
      </div>
    </div>
  )
}

export default MapCard
