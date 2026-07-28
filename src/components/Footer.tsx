import { COUPLE } from "../data/couple";

/** Footer estático (DESIGN.md §3 fila 13): foto 9252 (mismo recorte de abajo,
 * pasto + beso) detrás del nombre, con velo oscuro para legibilidad. */
function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 py-16 text-center text-white/60">
      <img
        src="/images/IMG_9252.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 75%" }}
      />
      <div className="absolute inset-0 bg-accent-deep/70" />

      <div className="relative">
        <p className="font-serif text-lg italic text-white">
          {COUPLE.bride} &amp; {COUPLE.groom}
        </p>
        <p className="mt-2 text-[11px] tracking-[2px]">23 · 24.10.2026</p>
      </div>
    </footer>
  );
}

export default Footer;
