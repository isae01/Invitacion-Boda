import { useScrollScrub } from "../hooks/useScrollScrub";
import { useParallax } from "../hooks/useParallax";
import { rampFraction } from "../lib/scrollScrub";
import { getVisibleEvents, EVENT_DISPLAY_LABEL } from "../data/events";
import { STORY_PHRASE } from "../data/story";
import { COUPLE } from "../data/couple";
import Container from "../components/Container";
import Reveal from "../components/Reveal";
import ItineraryList from "../components/ItineraryList";
import type { GuestAccess } from "../types/guestAccess";

interface ElDiaProps {
  guestAccess: GuestAccess;
}

// bgdissolve (DESIGN.md §9B): la foto de fondo hace zoom continuo mientras
// la tarjeta de información se desvanece y se achica — la foto "gana" la
// pantalla progresivamente.
const bgScale = `calc(1.05 + var(--progress) * 0.25)`; // 1.05 → 1.3
const cardFadeProgress = rampFraction(0, 1); // 0 → 1 conforme avanza el scroll
const cardOpacity = `calc(1 - ${cardFadeProgress})`; // 1 → 0
const cardScale = `calc(1 - var(--progress) * 0.12)`; // 1 → 0.88

/**
 * "El día" (DESIGN.md §3, filas 4-5): bloque de Ceremonia (bgdissolve) +
 * frase de la historia. La foto/frase (bgdissolve) es la misma para
 * cualquier invitado — no es contenido específico de la ceremonia, así que
 * se muestra siempre. El bloque con fecha/hora/itinerario de la ceremonia
 * sí depende del guestAccess (variantes 'ceremonia' y 'ambos').
 */
function ElDia({ guestAccess }: ElDiaProps) {
  const containerRef = useScrollScrub<HTMLElement>();
  const anillosRef = useParallax<HTMLImageElement>(12, "x");
  const bibliaRef = useParallax<HTMLImageElement>(12, "x");
  const ceremonia = getVisibleEvents(guestAccess).find(
    (event) => event.key === "ceremonia",
  );

  return (
    <>
      <section ref={containerRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <img
            src="/images/IMG_9149.jpg"
            alt={`${COUPLE.groom} y ${COUPLE.bride}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "45% 60%",
              transform: `scale(${bgScale})`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,22,29,0.1), rgba(15,22,29,0.45) 70%, rgba(15,22,29,0.6))",
            }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ opacity: cardOpacity, transform: `scale(${cardScale})` }}
          >
            <Container>
              <div className="mx-auto max-w-[280px] rounded-[24px] bg-surface/60 p-5 text-center backdrop-blur-md">
                <p className="font-serif text-2xl italic font-semibold leading-snug text-story-green">
                  {STORY_PHRASE}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {ceremonia && (
        <div className="relative overflow-hidden bg-accent-deep">
          {/* Decoración: resplandor + dibujo de anillos (ilustración de la novia) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-12 rounded-full bg-white/10 blur-3xl"
          />
          {/*
           * ANILLOS — para probar vos misma la posición/tamaño, tocá:
           * - Posición: `-right-3` (qué tan a la derecha) y `bottom-8` (qué
           *   tan arriba desde abajo).
           * - Tamaño: `w-[135px]` — más grande = se ve más grande y también
           *   se recorta más contra el borde (por el `overflow-hidden` del
           *   div padre de toda la sección).
           * - Opacidad: `opacity-15`.
           * - `invert` da vuelta el color (de negro a blanco) para que se lea
           *   sobre el fondo oscuro — no lo saques o el dibujo desaparece.
           */}
          <img
            ref={anillosRef}
            src="/images/anillos.PNG"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 bottom-8 z-0 w-[141px] opacity-15 invert"
          />
          {/* BIBLIA — espejo de los anillos: misma posición vertical, tamaño,
           * opacidad e inversión de color, pero del lado izquierdo. */}
          <img
            ref={bibliaRef}
            src="/images/biblia.PNG"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-1 bottom-8 z-0 w-[141px] opacity-15 invert"
          />

          <div className="relative z-10">
            <Reveal>
              <div className="px-6 pt-10 pb-6 text-center">
                <span className="text-[13px] font-bold tracking-[3px] text-accent-pale">
                  {EVENT_DISPLAY_LABEL.ceremonia}
                </span>
                <p className="mt-3 font-serif text-2xl text-white">
                  {ceremonia.date}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {ceremonia.timeRange}
                </p>
              </div>
            </Reveal>

            <Container className="pt-2 pb-10">
              <Reveal>
                <div className="mx-auto w-fit">
                  <p className="text-center text-[11px] font-bold tracking-[3px] text-accent-pale">
                    ITINERARIO
                  </p>
                  <div className="mt-4">
                    <ItineraryList
                      items={ceremonia.itinerary}
                      revealItems
                      dark
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Reveal delayMs={ceremonia.itinerary.length * 90} once>
                      <span className="rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-bold tracking-[2px] text-white/70">
                        {ceremonia.dressCode}
                      </span>
                    </Reveal>
                  </div>
                </div>
              </Reveal>
            </Container>
          </div>
        </div>
      )}
    </>
  );
}

export default ElDia;
