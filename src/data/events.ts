import type { GuestAccess } from "../types/guestAccess";

export type EventKey = "ceremonia" | "recepcion";

export interface EventInfo {
  key: EventKey;
  title: string;
  date: string;
  timeRange: string;
  /** ISO con offset de Guatemala (UTC-6), para la cuenta regresiva. */
  startDateTime: string;
  /** ISO con offset de Guatemala (UTC-6), para "agregar a mi calendario" en el RSVP. */
  endDateTime: string;
  location: string;
  mapsUrl: string;
  wazeUrl: string;
  dressCode: string;
  music: string;
  itinerary: string[];
  giftMessage?: string;
}

/**
 * Única estructura de datos de eventos (DESIGN.md §12): las secciones que
 * dependen de eventos iteran sobre esto filtrado por guestAccess, sin
 * duplicar markup por variante. Contenido desde Context/CONTENT.md.
 */
export const EVENTS_DATA: Record<EventKey, EventInfo> = {
  ceremonia: {
    key: "ceremonia",
    title: "Ceremonia",
    date: "23 de octubre, 2026",
    timeRange: "7:00 PM – 8:30 PM",
    startDateTime: "2026-10-23T19:00:00-06:00",
    endDateTime: "2026-10-23T20:30:00-06:00",
    location: "20 Avenida 19-60, Colonia Montesano, Zona 16, Guatemala",
    mapsUrl: "https://share.google/1mTzJ0J0oqdm4ERNc",
    wazeUrl: "https://waze.com/ul/h9fxejx3m2",
    dressCode: "Formal",
    music: "No lleva música de fondo.",
    itinerary: [
      "Canción",
      "Discurso",
      "Votos",
      "Canción",
      "Oración",
      "Fotografía",
    ],
  },
  recepcion: {
    key: "recepcion",
    title: "Recepción",
    date: "24 de octubre, 2026",
    timeRange: "5:00 PM – 10:00 PM",
    startDateTime: "2026-10-24T17:00:00-06:00",
    endDateTime: "2026-10-24T22:00:00-06:00",
    location: "Jardín Casa La Historia, Antigua Guatemala",
    mapsUrl: "https://maps.app.goo.gl/hCZCoETdjrdWn3rv9",
    wazeUrl: "https://waze.com/ul/h9fx6xhk6h",
    dressCode: "Formal",
    music: "Here Comes The Sun",
    itinerary: [
      "Recepción",
      "Fotografías",
      "Palabras de los novios",
      "Oración y comida",
      "Primer baile",
      "Pastel",
      "A celebrar juntos",
    ],
    giftMessage:
      "Tu presencia es nuestro mayor regalo. Pero si deseas hacernos un obsequio, también lo recibiremos con mucho cariño.",
  },
};

/**
 * Label editorial en pantalla por evento (Context/CONTENT.md § Labels en
 * pantalla) — distinto del nombre real del evento (`title`), que se sigue
 * usando en el RSVP y los textos alternativos de imagen.
 */
export const EVENT_DISPLAY_LABEL: Record<EventKey, string> = {
  ceremonia: "DISCURSO",
  recepcion: "FIESTA",
};

/** Foto del lugar para la tarjeta de Dónde y Cuándo (Context/CONTENT.md § Fotografías). */
export const EVENT_VENUE_PHOTO: Record<EventKey, string> = {
  ceremonia: "/images/salon.jpg",
  recepcion: "/images/antigua.jpg",
};

/** object-position de cada foto de lugar — ajustado a mano por encuadre. */
export const EVENT_VENUE_PHOTO_POSITION: Record<EventKey, string> = {
  ceremonia: "50% 39%", // equilibrio entre el micrófono del podio y la gente sentada
  recepcion: "50% 50%",
};

/** Qué eventos ve cada variante de invitado (DESIGN.md §12 / CONTENT.md § Variantes). */
const VISIBLE_EVENT_KEYS: Record<GuestAccess, EventKey[]> = {
  ambos: ["ceremonia", "recepcion"],
  ceremonia: ["ceremonia"],
  recepcion: ["recepcion"],
};

export function getVisibleEvents(guestAccess: GuestAccess): EventInfo[] {
  return VISIBLE_EVENT_KEYS[guestAccess].map((key) => EVENTS_DATA[key]);
}

/** Fecha objetivo de la cuenta regresiva: el evento visible más próximo (CONTENT.md § Variantes). */
export function getCountdownTarget(guestAccess: GuestAccess): Date {
  const events = getVisibleEvents(guestAccess);
  const soonest = events.reduce((a, b) =>
    new Date(a.startDateTime) <= new Date(b.startDateTime) ? a : b,
  );
  return new Date(soonest.startDateTime);
}
