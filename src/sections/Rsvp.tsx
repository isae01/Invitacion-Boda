import { useState } from 'react'
import { getVisibleEvents, type EventKey } from '../data/events'
import { getHeroContent } from '../data/hero'
import {
  RSVP_TITLE,
  RSVP_DEADLINE_REMINDER,
  RSVP_ATTENDANCE_QUESTION,
  RSVP_CALENDAR_LABEL,
  RSVP_ATTENDEES_QUESTION,
  RSVP_ATTENDEES_LABEL,
} from '../data/rsvp'
import { COUPLE } from '../data/couple'
import { buildGoogleCalendarUrl, buildIcsDataUrl } from '../lib/calendar'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import type { GuestAccess } from '../types/guestAccess'
import { apiPost, ApiError } from '../lib/api'
import { cn } from '../lib/cn'

interface RsvpProps {
  guestAccess: GuestAccess
}

const inputClasses =
  'w-full border-b border-white/30 bg-transparent py-2 text-center text-white placeholder:text-white/40 focus:border-white focus:outline-none'

const EVENT_ADMIN_LABEL: Record<EventKey, string> = {
  ceremonia: 'Discurso',
  recepcion: 'Fiesta',
}

/**
 * RSVP + cierre (DESIGN.md §3 fila 12, §8): fondo steel-blue profundo,
 * inputs sin caja (solo línea inferior), reveal individual por campo.
 * Sin backend (DESIGN.md §15) — solo estado local; al confirmar, eco
 * tipográfico de la fecha del Hero (DESIGN.md §2 punto 10).
 */
function Rsvp({ guestAccess }: RsvpProps) {
  const events = getVisibleEvents(guestAccess)
  const { date } = getHeroContent(guestAccess)
  const giftMessage = events.find((event) => event.giftMessage)?.giftMessage

  const [fullName, setFullName] = useState('')
  const [attendance, setAttendance] = useState<Record<string, boolean | null>>(() =>
    Object.fromEntries(events.map((event) => [event.key, null]))
  )
  const [message, setMessage] = useState('')
  // '' es un estado intermedio válido mientras el invitado borra el campo
  // para escribir un número nuevo — si se confirma vacío (blur o submit),
  // se vuelve a 1.
  const [attendees, setAttendees] = useState<number | ''>(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Si ya dijo que no va a ningún evento visible, no tiene sentido
  // preguntarle cuántos asistirán — el backend igual descarta ese número.
  const allDeclined = events.every((event) => attendance[event.key] === false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    // El backend guarda una sola confirmación por invitado, no una por
    // evento: si declinó todos los eventos visibles, se envía DECLINED;
    // si confirmó al menos uno, CONFIRMED.
    const status = allDeclined ? 'DECLINED' : 'CONFIRMED'

    // No hay un status por evento en el backend: si un invitado de "ambos"
    // responde distinto a cada evento (p. ej. sí al discurso, no a la
    // fiesta), ese detalle se pierde en el status único. Lo guardamos como
    // texto en el mensaje para que quede visible en /admin.
    const attendanceVaries =
      events.length > 1 &&
      events.some((event) => attendance[event.key] !== attendance[events[0].key])
    const attendanceDetail = attendanceVaries
      ? events
          .map((event) => {
            const value = attendance[event.key]
            const label = value === true ? 'sí asistirá' : value === false ? 'no asistirá' : 'sin responder'
            return `${EVENT_ADMIN_LABEL[event.key]}: ${label}`
          })
          .join(' · ')
      : null
    const finalMessage = [attendanceDetail, message.trim() || null].filter(Boolean).join(' — ') || undefined

    const discursoAttending =
      attendance.ceremonia === true ? true : attendance.ceremonia === false ? false : undefined
    const fiestaAttending =
      attendance.recepcion === true ? true : attendance.recepcion === false ? false : undefined

    try {
      await apiPost('/api/rsvp', {
        fullName,
        status,
        attendeesCount: attendees === '' ? 1 : attendees,
        message: finalMessage,
        discursoAttending,
        fiestaAttending,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'No se pudo enviar tu respuesta. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    const confirmedEvents = events.filter((event) => attendance[event.key] === true)
    const guestLabel = `${COUPLE.groom} y ${COUPLE.bride}`

    return (
      <section className="bg-accent-deep px-6 py-24 text-center text-white">
        <Reveal>
          <p className="font-serif text-2xl italic">¡Gracias, {fullName}!</p>
          <p className="mt-3 text-sm text-white/70">
            {allDeclined ? 'Te extrañaremos' : attendees === 1 ? 'Te esperamos' : 'Los esperamos'}
          </p>
          <p className="mt-6 text-sm tracking-[2px] text-accent-pale">{date}</p>
        </Reveal>

        {confirmedEvents.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 flex max-w-xs flex-col gap-6">
              {confirmedEvents.map((event) => (
                <div key={event.key}>
                  <p className="text-xs font-bold tracking-[2px] text-white/70">
                    {RSVP_CALENDAR_LABEL[event.key]}
                  </p>
                  <div className="mt-3 flex justify-center gap-3">
                    <a
                      href={buildGoogleCalendarUrl(event, guestLabel)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-accent-deep"
                    >
                      Google Calendar
                    </a>
                    <a
                      href={buildIcsDataUrl(event, guestLabel)}
                      download={`${event.title}.ics`}
                      className="rounded-full border border-white/25 px-4 py-2.5 text-[13px] font-semibold text-white"
                    >
                      Apple / Outlook
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full border border-white/25 px-3 py-1.5 text-[10px] font-bold tracking-[2px] text-white/70"
          >
            SUBIR AL PRINCIPIO
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-accent-deep px-6 pt-24 pb-10">
      <Container>
        <Reveal>
          <div className="text-center text-white">
            <p className="font-serif text-3xl italic">{RSVP_TITLE}</p>
            <p className="mt-3 text-[13px] font-bold text-white">{RSVP_DEADLINE_REMINDER}</p>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          <Reveal>
            <input
              required
              aria-label="Nombre completo"
              placeholder="Tu nombre completo"
              className={inputClasses}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Reveal>

          {events.map((event) => (
            <Reveal key={event.key}>
              <div className="flex flex-col items-center gap-3 text-center text-sm text-white/80">
                <span>{RSVP_ATTENDANCE_QUESTION[event.key]}</span>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { label: 'Sí, asistiré', value: true },
                    { label: 'No podré ir', value: false },
                  ] as const).map((option) => {
                    const isActive = attendance[event.key] === option.value
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          setAttendance((prev) => ({ ...prev, [event.key]: option.value }))
                        }
                        className={
                          isActive
                            ? 'rounded-2xl bg-white px-4 py-3 text-center text-[13px] font-bold text-accent-deep'
                            : 'rounded-2xl border border-white/25 px-4 py-3 text-center text-[13px] font-bold text-white'
                        }
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <input
              aria-label="Mensaje para los novios (opcional)"
              placeholder="Mensaje para los novios (opcional)"
              className={inputClasses}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Reveal>

          {!allDeclined && (
            <Reveal>
              <div className="flex flex-col items-center gap-3 text-center text-sm text-white/80">
                <span>{RSVP_ATTENDEES_QUESTION}</span>
                <input
                  type="number"
                  min={1}
                  aria-label={RSVP_ATTENDEES_LABEL}
                  className={cn(inputClasses, 'max-w-[80px]')}
                  value={attendees}
                  onChange={(e) => {
                    const raw = e.target.value
                    if (raw === '') {
                      setAttendees('')
                      return
                    }
                    const parsed = Number(raw)
                    if (!Number.isNaN(parsed)) setAttendees(Math.max(1, parsed))
                  }}
                  onBlur={() => {
                    if (attendees === '') setAttendees(1)
                  }}
                />
              </div>
            </Reveal>
          )}

          {submitError && (
            <Reveal>
              <p className="text-center text-sm text-red-300">{submitError}</p>
            </Reveal>
          )}

          <Reveal>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-white py-4 text-center text-[14px] font-bold text-accent-deep disabled:opacity-60"
            >
              {isSubmitting ? 'Enviando…' : 'Confirmar asistencia'}
            </button>
          </Reveal>

          {giftMessage && (
            <Reveal>
              <p className="text-center text-sm text-white/70">{giftMessage}</p>
            </Reveal>
          )}
        </form>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full border border-white/25 px-3 py-1.5 text-[10px] font-bold tracking-[2px] text-white/70"
          >
            SUBIR AL PRINCIPIO
          </button>
        </div>
      </Container>
    </section>
  )
}

export default Rsvp
