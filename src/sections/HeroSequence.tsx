import { useEffect, useRef } from "react";
import { useScrollScrub } from "../hooks/useScrollScrub";
import { getHeroContent } from "../data/hero";
import { COUPLE } from "../data/couple";
import { RING_CAPTION_PHRASE, WELCOME_TITLE, WELCOME_BODY } from "../data/story";
import Container from "../components/Container";
import Reveal from "../components/Reveal";
import { rampFraction } from "../lib/scrollScrub";
import type { GuestAccess } from "../types/guestAccess";

interface HeroSequenceProps {
  guestAccess: GuestAccess;
}

// Progreso (0→1) del contenedor pineado (Hero → Anillo → leyenda):
const RING_START = 0.08; // más scroll antes de que el anillo empiece a aparecer
const RING_GROW_END = 0.45; // el anillo termina de crecer (ease-in cuadrático), luego se queda estático
const CAPTION_FADE_IN_END = 0.55; // la leyenda aparece sobre el anillo y se queda (no se desvanece)

const ringGrowLinear = rampFraction(RING_START, RING_GROW_END);
// Ease-in cuadrático: el anillo arranca lento y acelera, en vez de crecer a velocidad constante.
const ringGrowFraction = `calc(${ringGrowLinear} * ${ringGrowLinear})`;
// El anillo, una vez crecido, se queda estático y visible el resto del recorrido — nunca se desvanece.
const ringOpacity = ringGrowFraction;
const ringScale = `calc(1.1 - ${ringGrowFraction} * 0.1)`;

// La leyenda solo tiene fade-in — una vez aparece, se queda visible (no se desvanece).
const captionOpacity = rampFraction(RING_GROW_END, CAPTION_FADE_IN_END);

// "Breathing" cinematográfico de la foto principal — corre solo mientras el
// usuario NO ha hecho scroll (progress === 0). Apenas empieza a scrollear,
// deja de actualizarse: la foto queda congelada en la escala que tenía en
// ese instante, sin ningún regreso/transición animada al tamaño original
// (eso sí sería un movimiento ligado al scroll, que es justo lo que no
// queremos). Prioriza la sensación por encima de la simetría matemática:
// la "cámara" entra despacio (fase de subida larga, con easeInOutQuart) y
// retrocede más rápido (fase de bajada corta, con easeInOutSine) — pasando
// de una a otra justo en el pico, sin pausa. Unipolar (0→1, nunca negativa)
// para que scale nunca baje de 1 — así la foto siempre cubre el Hero al
// 100%, sin dejar ver márgenes al hacer zoom.
const BREATHE_PERIOD_MS = 32000; // ciclo completo, lento y pausado
const BREATHE_AMPLITUDE = 0.07; // notorio, sin llegar a distraer
const BREATHE_RISE_END = 0.55; // % del período que dura el acercamiento (fase larga); ahí mismo empieza a retroceder, sin pausa

function easeInOutSine(x: number): number {
  return (1 - Math.cos(x * Math.PI)) / 2;
}

// Curva distinta para la subida (más plana al inicio/final, cambio de escala
// concentrado en menos tiempo) — el zoom out sigue usando easeInOutSine, sin tocar.
function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2;
}

/**
 * Hero + Anillo, pineados con scroll-scrub (DESIGN.md §3, bloque 1): el
 * anillo crece sobre el Hero y se queda estático → aparece la leyenda de
 * Historia sobre él y se queda visible (no se desvanece).
 *
 * IMG_9136 y el mensaje de bienvenida ya NO viven dentro de este scroll-scrub
 * — son contenido normal, estático, que sigue debajo en el flujo de la
 * página (ver el <section> después del pineado). Nada de paneles ni
 * "cortinas" que suban: solo aparecen con el scroll normal, como cualquier
 * otra sección del sitio.
 */
function HeroSequence({ guestAccess }: HeroSequenceProps) {
  const containerRef = useScrollScrub<HTMLElement>();
  const heroImgRef = useRef<HTMLImageElement>(null);
  // Última escala calculada por el breathing. Una vez que progress > 0 deja
  // de actualizarse — congela la foto en ese valor exacto, sin resets ni
  // re-renders de por medio (se lee/escribe directo, fuera de React state).
  const scaleRef = useRef(1);
  const { eyebrow, date } = getHeroContent(guestAccess);

  useEffect(() => {
    const container = containerRef.current;
    const heroImg = heroImgRef.current;
    if (!container || !heroImg) return;

    let frameId: number;

    const tick = (time: number) => {
      const progress =
        parseFloat(container.style.getPropertyValue("--progress")) || 0;

      if (progress <= 0) {
        const cycle = (time % BREATHE_PERIOD_MS) / BREATHE_PERIOD_MS;
        const wave =
          cycle < BREATHE_RISE_END
            ? easeInOutQuart(cycle / BREATHE_RISE_END)
            : 1 -
              easeInOutSine(
                (cycle - BREATHE_RISE_END) / (1 - BREATHE_RISE_END),
              );
        scaleRef.current = 1 + wave * BREATHE_AMPLITUDE;
      }

      // Con progress > 0, scaleRef.current ya no cambia (bloque de arriba no
      // corre) — esta línea solo reaplica el mismo valor congelado.
      heroImg.style.transform = `scale(${scaleRef.current})`;

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [containerRef]);

  return (
    <>
      {/* 200vh (no 150vh): más recorrido de scroll para el mismo tramo de
          progreso del anillo — así el crecimiento no se salta aunque el
          invitado haga scroll rápido. */}
      <section ref={containerRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <img
            ref={heroImgRef}
            src="/images/IMG_9289.jpg"
            alt={`${COUPLE.bride} y ${COUPLE.groom}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 30%" }}
          />

          {/* Overlay azul-carbón para legibilidad del texto del Hero (DESIGN.md §14) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,22,29,0.15), rgba(15,22,29,0.35) 55%, rgba(15,22,29,0.65))",
            }}
          />

          {/* Texto del Hero — se desvanece conforme avanza el scroll */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white"
            style={{ opacity: "clamp(0, calc(1 - var(--progress) * 3), 1)" }}
          >
            <span className="text-[11px] font-bold tracking-[3px] text-white drop-shadow-[0_1px_4px_rgba(15,22,29,0.7)]">
              {eyebrow}
            </span>
            <h1
              className="font-serif font-medium leading-none"
              style={{ fontSize: "clamp(58px, 18vw, 96px)" }}
            >
              {COUPLE.bride}
              <br />
              <span className="italic">&amp;</span>
              <br />
              {COUPLE.groom}
            </h1>
            <span className="text-sm tracking-[2px]">{date}</span>
          </div>

          {/* El anillo — crece y se queda estático y visible el resto del recorrido */}
          <img
            src="/images/IMG_9202.jpg"
            alt="El anillo"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "50% 50%",
              clipPath: `circle(calc(4% + ${ringGrowFraction} * 150%) at 50% 50%)`,
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
          />

          {/* Viñeta inferior — solo detrás de la leyenda, como pie de foto */}
          <div
            className="absolute inset-0"
            style={{
              opacity: captionOpacity,
              background:
                "linear-gradient(to top, rgba(15,22,29,0.6) 0%, transparent 28%)",
            }}
          />

          {/* Leyenda de Historia — pie de foto sobre el anillo; aparece y se queda (no se desvanece) */}
          <div
            className="absolute inset-x-0 bottom-[8%] flex justify-center px-8 text-center"
            style={{ opacity: captionOpacity }}
          >
            <p className="font-serif text-[20px] italic leading-snug text-white sm:text-[26px]">
              {RING_CAPTION_PHRASE}
            </p>
          </div>
        </div>
      </section>

      {/* IMG_9136 + bienvenida — contenido normal, debajo del anillo, sin
          animación de scroll: es una foto horizontal, por eso una franja
          corta en vez de pantalla completa (a pantalla completa forzaba un
          zoom excesivo con object-cover). */}
      <section className="relative bg-surface">
        <div className="relative h-[42vh] overflow-hidden">
          <img
            src="/images/IMG_9136.jpg"
            alt={`${COUPLE.bride} y ${COUPLE.groom}`}
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-surface" />
        </div>

        <div
          className="flex items-center justify-center px-6"
          style={{
            paddingTop: "clamp(40px, 8vw, 64px)",
            paddingBottom: "clamp(40px, 8vw, 64px)",
          }}
        >
          <Container>
            <Reveal threshold={0.4} rootMargin="0px" once={false}>
              {/* NUEVO: Este div fuerza el centrado perfecto de todo su contenido hacia el medio de la pantalla */}
              <div className="flex flex-col items-center justify-center w-full">
                <p
                  className="text-center font-serif italic leading-snug text-accent-deep"
                  style={{ fontSize: "clamp(22px, 6vw, 30px)" }}
                >
                  <span className="font-normal italic">{WELCOME_TITLE}</span>
                </p>

                <p
                  className="text-center font-serif italic leading-snug text-accent-deep max-w-sm px-6 text-center"
                  style={{
                    fontSize: "clamp(20px, 5.5vw, 28px)",
                    marginTop: "29px",
                  }}
                >
                  {WELCOME_BODY}
                </p>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>
    </>
  );
}

export default HeroSequence;
