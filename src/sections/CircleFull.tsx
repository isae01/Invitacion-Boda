import { COUPLE } from "../data/couple";

/**
 * Momento fotográfico simplificado (DESIGN.md §3, bloque "circlefull"): a
 * pedido de la clienta, sin ningún efecto de scroll — collage estático de
 * dos fotos lado a lado, sección normal en el flujo (sin pineado ni
 * margen negativo, para no montarse sobre el Welcome Body de arriba).
 */
function CircleFull() {
  return (
    <section className="mt-4 mb-1 grid grid-cols-2 gap-1">
      <div className="h-[45vh] overflow-hidden sm:h-[55vh]">
        <img
          src="/images/IMG_9101.jpg"
          alt={`${COUPLE.bride} y ${COUPLE.groom}`}
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 62%" }}
        />
      </div>
      <div className="h-[45vh] overflow-hidden sm:h-[55vh]">
        <img
          src="/images/IMG_9312.jpg"
          alt={`${COUPLE.bride} y ${COUPLE.groom}`}
          className="h-full w-full object-cover"
          style={{ objectPosition: "52% 55%" }}
        />
      </div>
    </section>
  );
}

export default CircleFull;
