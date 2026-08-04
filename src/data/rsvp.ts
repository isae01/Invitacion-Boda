import type { EventKey } from './events'

/** Copy del formulario RSVP (Context/CONTENT.md § Formulario RSVP). */
export const RSVP_TITLE = 'Nos encantaría celebrar contigo.'
export const RSVP_DEADLINE_REMINDER = 'Por favor confirma antes del 3 de septiembre'

/**
 * Pregunta de asistencia por evento, usando el label editorial (DISCURSO /
 * FIESTA) — con su propio artículo porque el género cambia entre los dos
 * ("al discurso" vs "a la fiesta"), no se puede armar con una plantilla única.
 */
export const RSVP_ATTENDANCE_QUESTION: Record<EventKey, string> = {
  ceremonia: '¿Asistirás al discurso?',
  recepcion: '¿Asistirás a la fiesta?',
}

/**
 * Invitación a agregar el evento al calendario del invitado, mostrada tras
 * confirmar asistencia (solo para los eventos a los que sí asistirá).
 */
export const RSVP_CALENDAR_LABEL: Record<EventKey, string> = {
  ceremonia: 'Agrega el discurso a tu calendario',
  recepcion: 'Agrega la fiesta a tu calendario',
}

/**
 * Pregunta y label del campo de asistentes: pide el total incluyendo al
 * invitado principal, para que no haya que adivinar si un acompañante
 * (ej. su esposa) ya está contado o no.
 */
export const RSVP_ATTENDEES_QUESTION = '¿Cuántos de tu invitación asistirán (contándote a ti)?'
export const RSVP_ATTENDEES_LABEL = 'Asistentes'
