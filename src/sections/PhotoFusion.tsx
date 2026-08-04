import { COUPLE } from "../data/couple";
import Reveal from "../components/Reveal";

/**
 * Fusión fotográfica (DESIGN.md §2 movimiento 7 / §3 fila 10), rediseñada a
 * pedido de la clienta: tres franjas apiladas — la 9186 arriba con el mismo
 * velo azul oscuro que en El Día, luego dos franjas más (nunca el cuerpo
 * completo) — con reveal al entrar en scroll. El Dress Code ya no vive aquí
 * como tarjeta flotante — ver el bloque "DRESS CODE" en El Día y Recepción.
 */
function PhotoFusion() {
  return (
    <section className="relative">
      <Reveal>
        <div className="relative h-[30vh] overflow-hidden">
          <img
            src="/images/IMG_9186.jpg"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ objectPosition: "48% 55%" }}
          />
          <div className="absolute inset-0 bg-accent-deep/60" />
        </div>
      </Reveal>

      <Reveal>
        <div className="h-[30vh] overflow-hidden">
          <img
            src="/images/IMG_9156.jpg"
            alt={`${COUPLE.bride} y ${COUPLE.groom}`}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 22%" }}
          />
        </div>
      </Reveal>

      <Reveal>
        <div className="h-[30vh] overflow-hidden">
          <img
            src="/images/IMG_9119.jpg"
            alt={`${COUPLE.bride} y ${COUPLE.groom}`}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 55%" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

export default PhotoFusion;
