import { getVisibleEvents, EVENT_DISPLAY_LABEL } from "../data/events";
import { useParallax } from "../hooks/useParallax";
import Container from "../components/Container";
import Reveal from "../components/Reveal";
import ItineraryList from "../components/ItineraryList";
import type { GuestAccess } from "../types/guestAccess";

interface RecepcionProps {
  guestAccess: GuestAccess;
}

/**
 * Recepción (DESIGN.md §3, filas 6-9). Fondo lila claro (party) en vez del
 * azul oscuro compartido con Ceremonia — a diferencia de Ceremonia, acá el
 * texto es oscuro (fondo claro), para un "vibe" de fiesta distinto. La
 * transición hacia esta sección (franja corta) vive en El Día — ver
 * ElDia.tsx. Si el invitado no ve Recepción, la sección entera no se
 * renderiza.
 */
function Recepcion({ guestAccess }: RecepcionProps) {
  const recepcion = getVisibleEvents(guestAccess).find(
    (event) => event.key === "recepcion",
  );
  const brideRef = useParallax<HTMLImageElement>(12, "x");
  const noviosRef = useParallax<HTMLDivElement>(12, "x");

  if (!recepcion) return null;

  return (
    <div className="relative overflow-hidden bg-party">
      {/* Resplandor difuso detrás del título */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-12 rounded-full bg-white/70 blur-3xl"
      />

      {/* Decoración: bride + novio recortado (aprobado para todas las
       * variantes de invitación, reemplazando al velo que se probaba antes). */}
      <img
        ref={brideRef}
        src="/images/bride.PNG"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -bottom-6 z-0 w-[190px] opacity-20"
      />
      {/*
       * "novio hombre.PNG" todavía trae un poco de la novia asomando a la
       * izquierda (pelo/hombro); la ventana (overflow-hidden) recorta esa
       * franja y el <img> se corre hacia la izquierda para que solo quede
       * visible el novio.
       */}
      <div
        ref={noviosRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 -bottom-6 z-0 h-[194px] w-[154px] overflow-hidden opacity-15"
      >
        <img
          src="/images/novio hombre.PNG"
          alt=""
          className="absolute top-1"
          style={{ width: "260px", maxWidth: "none", left: "-65px" }}
        />
      </div>

      <div className="relative z-10">
        <Reveal>
          <div className="px-6 pt-16 pb-6 text-center">
            <span className="text-[13px] font-bold tracking-[3px] text-accent">
              {EVENT_DISPLAY_LABEL.recepcion}
            </span>
            <p className="mt-3 font-serif text-2xl text-ink">
              {recepcion.date}
            </p>
            <p className="mt-1 text-sm text-ink-secondary">
              {recepcion.timeRange}
            </p>
          </div>
        </Reveal>

        <Container className="pt-2 pb-16">
          <Reveal>
            <div className="mx-auto w-fit">
              <p className="text-center text-[11px] font-bold tracking-[3px] text-accent">
                ITINERARIO
              </p>
              <div className="mt-4">
                <ItineraryList items={recepcion.itinerary} revealItems />
              </div>
              <div className="mt-4 flex justify-center">
                <Reveal delayMs={recepcion.itinerary.length * 90} once>
                  <span className="rounded-full border border-accent/30 px-3.5 py-1.5 text-xs font-bold tracking-[2px] text-accent">
                    {recepcion.dressCode}
                  </span>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}

export default Recepcion;
