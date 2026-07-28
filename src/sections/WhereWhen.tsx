import { getVisibleEvents, getCountdownTarget } from "../data/events";
import Reveal from "../components/Reveal";
import MapCard from "../components/MapCard";
import Countdown from "../components/Countdown";
import type { GuestAccess } from "../types/guestAccess";

interface WhereWhenProps {
  guestAccess: GuestAccess;
}

/**
 * Dónde y Cuándo + cuenta regresiva (DESIGN.md §3 fila 11): fondo fijo
 * (sticky) con un panel de flujo normal que sube encima con margen negativo
 * — sensación de profundidad. La cuenta regresiva vive en el mismo panel.
 */
function WhereWhen({ guestAccess }: WhereWhenProps) {
  const events = getVisibleEvents(guestAccess);
  const countdownTarget = getCountdownTarget(guestAccess);

  return (
    <section className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <img
          src="/images/IMG_9252.jpg"
          alt="Dónde y cuándo"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "48% 70%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,22,29,0.15), rgba(15,22,29,0.55))",
          }}
        />
      </div>

      <div className="relative z-10 -mt-[50vh] rounded-t-[32px] bg-surface px-6 pb-24 pt-14">
        <Reveal>
          <div className="text-center">
            <span className="text-[12px] font-bold tracking-[4px] text-accent">
              DÓNDE Y CUÁNDO
            </span>
            <svg
              viewBox="0 0 48 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
              aria-hidden="true"
              className="mx-auto mt-3 h-3 w-12 text-accent/40"
            >
              <path d="M2 6 Q 8 0, 14 6 T 26 6 T 38 6 T 46 6" />
            </svg>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-[420px] flex-col gap-8">
          {events.map((event) => (
            <Reveal key={event.key}>
              <MapCard event={event} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mx-auto mt-16 max-w-[420px] text-center">
            <span className="text-[11px] font-bold tracking-[4px] text-accent">
              FALTAN
            </span>
            <div className="mt-6">
              <Countdown target={countdownTarget} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default WhereWhen;
