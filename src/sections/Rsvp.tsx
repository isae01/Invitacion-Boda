import { useState } from 'react'
import { getVisibleEvents } from '../data/events'
import { getHeroContent } from '../data/hero'
import {
  RSVP_TITLE,
  RSVP_DEADLINE_REMINDER,
  RSVP_ATTENDANCE_QUESTION,
  RSVP_CALENDAR_LABEL,
} from '../data/rsvp'
import { COUPLE } from '../data/couple'
import { buildGoogleCalendarUrl, buildIcsDataUrl } from '../lib/calendar'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import type { GuestAccess } from '../types/guestAccess'

interface RsvpProps {
  guestAccess: GuestAccess
}

const inputClasses =
  'w-full border-b border-white/30 bg-transparent py-2 text-center text-white placeholder:text-white/40 focus:border-white focus:outline-none'

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
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    const allDeclined = events.every((event) => attendance[event.key] === false)
    const confirmedEvents = events.filter((event) => attendance[event.key] === true)
    const guestLabel = `${COUPLE.groom} y ${COUPLE.bride}`

    return (
      <section className="bg-accent-deep px-6 py-24 text-center text-white">
        <Reveal>
          <p className="font-serif text-2xl italic">¡Gracias, {fullName.split(' ')[0] || ''}!</p>
          <p className="mt-3 text-sm text-white/70">
            {allDeclined ? 'Te extrañaremos' : 'Los esperamos'}
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

          <Reveal>
            <button
              type="submit"
              className="w-full rounded-full bg-white py-4 text-center text-[14px] font-bold text-accent-deep"
            >
              Confirmar asistencia
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
