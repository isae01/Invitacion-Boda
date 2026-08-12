import type { EventInfo } from '../data/events'

/** YYYYMMDDTHHmmssZ (UTC), formato que requieren Google Calendar y los archivos .ics. */
function toUtcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '')
}

/** Link de "agregar a Google Calendar" — mismo patrón que los links de Maps/Waze del MapCard. */
export function buildGoogleCalendarUrl(event: EventInfo, guestLabel: string): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} de ${guestLabel}`,
    dates: `${toUtcStamp(event.startDateTime)}/${toUtcStamp(event.endDateTime)}`,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Archivo .ics como blob URL, para Apple Calendar / Outlook (no requieren cuenta Google).
 * Usa Blob en vez de una data: URL porque Safari/Chrome en iOS (ambos sobre WebKit)
 * bloquean la navegación directa a URLs data: — el link no hacía nada al tocarlo.
 */
export function buildIcsBlobUrl(event: EventInfo, guestLabel: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${event.key}-${Date.now()}@invitacion-boda`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${toUtcStamp(event.startDateTime)}`,
    `DTEND:${toUtcStamp(event.endDateTime)}`,
    `SUMMARY:${event.title} de ${guestLabel}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  return URL.createObjectURL(blob)
}
