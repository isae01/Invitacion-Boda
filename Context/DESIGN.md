# Invitación Digital — Juan Diego & Valeria

## Especificación de diseño para desarrollo

Documento de handoff. Describe cada decisión de diseño tomada durante el proceso creativo, lista para que un desarrollador reconstruya la experiencia en cualquier stack sin ambigüedad.

---

## 1. Concepto creativo

**Nombre del concepto:** "Piedra, Luz y Palabra" (evolucionado a lo largo del proyecto hacia un editorial botánico contemporáneo).

**Dirección:** experiencia digital premium, mobile-first, pensada para compartirse por WhatsApp. No es una invitación impresa adaptada a web — es un producto digital con ritmo cinematográfico propio.

**Pilares:**

- Minimalista, elegante, editorial — inspirado en portadas de revista de lujo, papelería fina y sitios de producto tipo Apple.
- Fotografía real de la pareja como protagonista absoluto; todo lo demás (tipografía, color, ilustración botánica) es acompañamiento.
- Ilustración botánica de línea fina en steel-blue como firma de composición — nunca decoración dominante.
- Ritmo "cinematográfico": impacto → pausa → impacto (signature) → estructura → inmersión → utilidad → cierre emocional. Ningún tramo puramente informativo dura más de una pantalla sin un momento visual.
- Movimiento ligado al scroll (scroll-driven, no solo animaciones por temporizador) para sensación de continuidad "una sola historia", no secciones independientes.

---

## 2. Storytelling / recorrido narrativo

7 movimientos, ejecutados en 10 bloques de scroll (algunos movimientos se subdividen en 2 pantallas para dar ritmo):

1. **Hero** — impacto inmediato, presentación de la pareja y la fecha.
2. **El anillo** — momento del compromiso, revelado con máscara circular continua desde el Hero (mismo contenedor de scroll, sin corte).
3. **Historia** — pausa tipográfica pura, frase íntima sobre foto parcial.
4. **Momento circular signature** — foto en círculo que crece hasta pantalla completa y se transforma en otra foto (crossfade).
5. **El día — Ceremonia** — bloque informativo con fondo fotográfico que se disuelve; el texto se retira y la foto llena la pantalla; esa misma foto se convierte en el fondo de la transición hacia Recepción ("la pantalla evoluciona, no cambia").
6. **El día — Recepción** — foto de ambiente + itinerario resumido en formato editorial de puntos y línea (no lista técnica).
7. **Fusión fotográfica** — foto a pantalla completa con "satélites" (fotos pequeñas en los bordes) que crecen y se revelan con el scroll + tarjeta de Dress Code flotante.
8. **Dónde y cuándo** — foto de fondo fija con panel de tarjetas de ubicación flotando y revelándose por encima (sensación de profundidad).
9. **Cuenta regresiva** — vive dentro del mismo panel que el punto 8, cierre de la sección utilitaria.
10. **RSVP + cierre** — fondo steel-blue profundo, formulario con fade progresivo por campo, eco tipográfico de la fecha del Hero al confirmar.

---

## 3. Arquitectura de la experiencia (orden exacto de secciones)

| #   | Sección                                              | Mecánica de scroll                                              | Altura del contenedor |
| --- | ---------------------------------------------------- | --------------------------------------------------------------- | --------------------- |
| 1   | Hero + Anillo (un solo contenedor `heroseq`)         | Sticky + clip-path circular continuo                            | 175vh                 |
| 2   | Historia                                             | Sticky + panel-cortina (`curtain`) que sube revelando texto     | 150vh                 |
| 3   | Momento circular → pantalla completa (`circlefull`)  | Sticky + clip-path circular creciente + crossfade               | 170vh                 |
| 4   | Eyebrow "EL DÍA"                                     | Reveal simple (fade + slide-up)                                 | auto                  |
| 5   | Ceremonia (`bgdissolve`)                             | Sticky + foto se agranda, tarjeta de info se desvanece          | 150vh                 |
| 6   | Transición "Y luego, la fiesta" (`curtain2`)         | Sticky + panel-cortina revela "Recepción"                       | 130vh                 |
| 7   | Recepción — encabezado (fecha/hora)                  | Reveal simple                                                   | auto                  |
| 8   | Recepción — foto de ambiente ("Baile general")       | Parallax ligero                                                 | 40vh                  |
| 9   | Recepción — itinerario (puntos y línea)              | Reveal simple por ítem                                          | auto                  |
| 10  | Fusión fotográfica + satélites + Dress Code          | Parallax + reveal de satélites por scroll                       | 100svh                |
| 11  | Dónde y Cuándo + tarjetas de mapa + cuenta regresiva | Sticky bg + panel normal-flow con margen negativo (profundidad) | auto (bg 100svh)      |
| 12  | RSVP + cierre                                        | Reveal simple + reveal por campo de formulario                  | auto                  |
| 13  | Footer                                               | Estático                                                        | auto                  |

Todas las secciones son `<section>` de ancho completo, apiladas verticalmente, mobile-first (diseñado para 375–430px de ancho, se adapta con `clamp()` y unidades relativas — no hay breakpoints de escritorio dedicados; el diseño es intencionalmente de una sola columna en todos los tamaños, coherente con el uso exclusivo desde WhatsApp/móvil).

---

## 4. Fotografías — asignación final (12 fotos, todas con propósito)

| Archivo      | Uso                                                                                                                              | Sección                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| IMG_9289.jpg | Fotografía principal del Hero (retrato amplio y emocional)                                                                       | Hero                         |
| IMG_9202.jpg | El anillo — revelado con máscara circular sobre el Hero                                                                          | Anillo (dentro de `heroseq`) |
| IMG_9156.jpg | Franja fotográfica parcial (34% superior)                                                                                        | Historia                     |
| IMG_9351.jpg | Primera imagen del círculo creciente                                                                                             | Momento circular             |
| IMG_9312.jpg | Segunda imagen (crossfade al final del crecimiento)                                                                              | Momento circular             |
| IMG_9149.jpg | Fondo de la tarjeta de información de Ceremonia                                                                                  | Ceremonia                    |
| IMG_9186.jpg | Fondo de la transición hacia Recepción + foto de ambiente "Baile general" (reutilizada intencionalmente, mismo contexto festivo) | Transición + Recepción       |
| IMG_9101.jpg | Foto principal a pantalla completa                                                                                               | Fusión fotográfica           |
| IMG_9119.jpg | Foto satélite izquierda                                                                                                          | Fusión fotográfica           |
| IMG_9304.jpg | Foto satélite derecha                                                                                                            | Fusión fotográfica           |
| IMG_9136.jpg | Foto satélite izquierda inferior                                                                                                 | Fusión fotográfica           |
| IMG_9252.jpg | Fondo fijo detrás del panel de ubicación                                                                                         | Dónde y Cuándo               |

**Regla:** ninguna fotografía debe repetirse fuera de la excepción documentada (9186). Todas las fotos van a `object-fit: cover` con `object-position` ajustado caso por caso para encuadrar rostros/gestos correctamente (ver valores exactos en el código fuente).

---

## 5. Paleta de colores

Definida en **OKLCH** para mantener armonía perceptual (Steel Blue como base):

- `accent` (Steel Blue medio): `oklch(54% 0.07 240)` — tweakable, opciones alternativas: `oklch(50% 0.05 230)`, `oklch(46% 0.06 250)`, `oklch(58% 0.04 220)`.
- `accentDeep` (Steel Blue profundo): `oklch(26% 0.05 245)` — fondo de RSVP, botones sólidos, hero-gradientes.
- `accentPale` (Steel Blue claro): `oklch(78% 0.03 240)` — reservado para acentos claros sobre fondo oscuro.
- Fondo base: `#f7f8f9` (gris casi blanco).
- Texto principal: `#1f2933` (gris oscuro azulado).
- Texto secundario: `#5a6772`, `#8a97a1`.
- Bordes/líneas: `#e6eaed`, `#edf0f2`, `#e2e6e9`.
- Blanco puro para texto sobre fotos: `#f3f6f8` / `#fff`.

Máximo 2 colores saturados en toda la pieza (accent + accentDeep); el resto es escala de grises. Los overlays sobre fotografías usan siempre `rgba(15,22,29, X)` o `rgba(20,30,38, X)` (un azul-carbón, no negro puro) para mantener coherencia con la paleta steel-blue incluso en las sombras.

---

## 6. Tipografía

- **Cormorant Garamond** (serif, pesos 500/600, itálica 400) — nombres, fechas, frases emocionales, títulos de sección grandes. Nunca para UI funcional.
- **Manrope** (sans-serif, pesos 400–800) — todo lo funcional: horarios, direcciones, botones, formularios, labels, itinerarios.
- Jerarquía de "eyebrow" (etiquetas pequeñas tipo "EL DÍA", "DÓNDE Y CUÁNDO"): Manrope 11px, `letter-spacing: 3px`, `font-weight: 700`, color `accent`.
- Tamaño del titular del Hero: `clamp(58px, 18vw, 96px)` — nunca baja de 58px incluso en pantallas muy pequeñas.
- Texto de cuerpo mínimo: 13–15px. Ningún texto funcional baja de 12px.

---

## 7. Espaciado

- Contenedor de texto máximo: 420–600px (centrado, `margin: 0 auto`) — nunca full-width en bloques de lectura.
- Padding lateral estándar: 24–32px en móvil.
- Padding vertical entre movimientos grandes: 60–130px según el peso emocional de la sección (las secciones de mayor impacto llevan más aire arriba/abajo).
- `gap` en listas de puntos: 12–26px entre ítems.
- Las tarjetas (mapa, ceremonia, RSVP) usan `border-radius: 12–28px` según su tamaño (más grande = radio mayor).

---

## 8. Componentes

- **Tarjeta de ubicación**: preview de mapa (actualmente placeholder con patrón diagonal — reemplazar por embed real de Google Maps o imagen estática de mapa en producción) + pin SVG animado (pulso) + nombre + dirección + fecha/hora + 2 botones (Google Maps sólido, Waze con borde).
- **Widget de cuenta regresiva**: 4 columnas (Días/Horas/Min/Seg), números tabulares, cada dígito tiene `key={valor}` para reanimarse en cada cambio (micro-fade de "tick").
- **Formulario RSVP**: inputs sin borde de caja, solo línea inferior (`border-bottom`), fondo transparente sobre el steel-blue profundo. Botones Sí/No con estado activo (`accent` de fondo cuando seleccionado).
- **Bloque de itinerario editorial**: punto (círculo 6-7px, color `accent`) + línea vertical conectora (1px, `#e2e6e9`) + texto — usado tanto en Ceremonia como en Recepción. **No usar iconos ni emojis** en esta lista — decisión explícita del cliente.
- **Botánica**: SVG de línea fina (un solo trazo, `stroke-width:1`, con 2–3 elipses como "hojas") usado como esquina decorativa, divisor entre secciones y acento en tarjetas. Opacidad siempre entre 0.3–0.45 — nunca protagonista. Uno de los adornos (esquina del RSVP y del Hero) tiene una animación de balanceo (`sway`, rotación ±2°, 7–8s, loop).

---

## 9. Animaciones y comportamiento del scroll

Dos sistemas de movimiento, ambos en JS puro (sin librerías):

### A. Reveal por intersección (`IntersectionObserver`)

- Elementos con `data-reveal` empiezan en `opacity:0; transform:translateY(26px)` (o `translateY(26px) scale(.96)` si tienen `data-reveal-scale`).
- Al entrar en viewport (threshold 0.12, rootMargin `-6%` inferior): transición a `opacity:1; transform:none` en **0.85s**, curva `cubic-bezier(.16,1,.3,1)`.
- Se dispara una sola vez por elemento (`unobserve` tras animar).
- Usado para: bloques de texto, tarjetas, ítems de listas, campos de formulario individuales (cada campo del RSVP tiene su propio `data-reveal` para que aparezcan en fade independiente, no todo el formulario junto).

### B. Scroll-scrub continuo (contenedores pineados)

Patrón general: `<section data-scrub-container="TIPO" style="height:Xvh">` con un hijo `position:sticky; top:0; height:100svh`. En cada frame de scroll se calcula:

```
progress = clamp01(-containerRect.top / (containerHeight - viewportHeight))
```

y ese `progress` (0→1) controla propiedades CSS de los hijos marcados con `data-scrub="rol"`. Tipos implementados:

- **`heroseq`** (Hero + Anillo): texto del hero se desvanece (`opacity = 1 - progress*3`); foto del anillo revela con `clip-path: circle(4%→154% at 50% 50%)` + fade-in + scale-down sutil (1.1→1.0); caption del anillo aparece al final (progress 0.75–1).
- **`curtain`** (Historia) / **`curtain2`** (transición Ceremonia→Recepción): un panel (`curtain-panel`) se desliza con `translateY(100%→0%)` cubriendo progresivamente el fondo fijo.
- **`circlefull`** (Momento circular): dos imágenes superpuestas, ambas con el mismo `clip-path: circle(12%→157%)`; la segunda gana opacidad solo en el último 30% del recorrido (crossfade). Objetivo visual: Esta debe ser la escena más memorable de toda la invitación. El usuario ve un retrato circular elegante que parece una fotografía impresa. Conforme avanza el scroll, el círculo crece lentamente hasta ocupar toda la pantalla sin deformarse ni recortarse. Durante los últimos instantes del crecimiento, la fotografía se transforma suavemente en una segunda imagen mediante un crossfade imperceptible. Debe sentirse como un único plano cinematográfico, no como dos imágenes distintas.
- **`bgdissolve`** (Ceremonia): la foto de fondo hace zoom continuo (`scale 1.05→1.3`); la tarjeta de información se desvanece y se achica (`opacity 1→0`, `scale 1→0.88`) — la foto "gana" la pantalla progresivamente.

Además, `data-parallax` (fuera de contenedores pineados) aplica un `translateY` proporcional a la posición del elemento relativa al centro del viewport — usado en fotos de ancho completo no pineadas (franja de Historia, banda de Recepción, foto principal de Fusión).

Los "satélites" fotográficos de Fusión (`data-scrub="satellite-left/right"`) se calculan por posición de scroll de su sección padre (no de un contenedor pineado): `translateX` de ±92px y `scale` hasta 1.15 conforme la sección entra en viewport — dan sensación de "crecer y revelarse".

**Regla general de ritmo:** ninguna transición debe sentirse como "corte" — todo cambio de foto/sección relevante pasa por fade, scale o máscara, nunca un salto abrupto de opacidad 0→1 sin easing.

---

## 10. Ilustraciones botánicas — reglas de uso

- Un solo motivo repetido: rama fina con 2–3 hojas (elipses), en un solo color (`currentColor` = `accent` o blanco según el fondo).
- Grosor de línea constante: `stroke-width: 1`.
- Opacidad: 0.3–0.45 en todos los casos (nunca full opacity).
- Posiciones permitidas: esquinas de fotos a pantalla completa, divisores entre bloques de texto, esquina de tarjetas (Ceremonia, RSVP).
- **Prohibido:** flores grandes, colores múltiples, estilos "clip-art", cualquier ilustración que compita visualmente con una fotografía.
- Nota de proceso: se evaluó una ilustración floral en acuarela (referencia del cliente) pero no tenía transparencia real utilizable — si se obtiene una versión con canal alfa real, puede integrarse como reemplazo/complemento del motivo de línea en las mismas posiciones.

---

## 11. Responsive

- Diseño mobile-first estricto — el 100% del tráfico esperado es móvil vía WhatsApp.
- No hay layout de dos columnas en ningún punto (se descartó explícitamente una composición editorial "texto izquierda / foto derecha" a favor de mantener todo en una sola columna vertical).
- Todos los tamaños de fuente usan `clamp()` para adaptarse entre ~375px y ~430px sin breakpoints discretos.
- Alturas de sección en `vh`/`svh` (no `vh` fijo a secas) para compatibilidad con barras de navegador móviles dinámicas.
- No se ha probado ni optimizado para desktop — si se requiere, limitar el ancho máximo del contenido (ya está parcialmente resuelto vía `max-width` en los bloques de texto) y considerar si el mecanismo de scroll-scrub necesita reescalarse.

---

## 12. Variantes de invitado (/1, /2, /3)

Controladas por un único parámetro `guestAccess` con 3 valores:

1. **`ambos`** (default): invitado a Ceremonia + Recepción. Muestra ambos bloques de "El Día", ambas tarjetas de ubicación, ambos toggles de asistencia en el RSVP, cuenta regresiva a la fecha más próxima (23 oct), mensaje de regalo (solo existe para Recepción).
2. **`ceremonia`**: solo el bloque de Ceremonia, una tarjeta de ubicación, un toggle de asistencia, cuenta regresiva al 23 de octubre 7:00 PM, sin mensaje de regalo, hero muestra "ZONA 16, GUATEMALA" y fecha `23.10.2026`.
3. **`recepcion`**: solo el bloque de Recepción (con su foto/itinerario), una tarjeta de ubicación, un toggle de asistencia, cuenta regresiva al 24 de octubre 5:00 PM, con mensaje de regalo y nota musical, hero muestra "ANTIGUA GUATEMALA" y fecha `24.10.2026`.

**Regla de implementación:** el contenido de eventos vive en una única estructura de datos (`EVENTS_DATA`) con llaves `ceremonia`/`recepcion`; la variante filtra qué llaves se renderizan pero **no duplica markup** — todas las secciones que dependen de eventos (`El día`, tarjetas de mapa, RSVP) iteran sobre la lista ya filtrada. Esto es lo que permite que mostrar 1 o 2 eventos no rompa el flujo visual: cada sección de evento es autocontenida y su ausencia simplemente no renderiza ese bloque, sin dejar huecos.

En producción, `guestAccess` debe determinarse por un parámetro en la URL del enlace enviado a cada invitado (ej. `?a=ceremonia`), no por una selección manual del usuario.

---

## 13. Datos del evento (contenido final aprobado)

**Fechas administrativas:** envío de invitaciones 3 de agosto · fecha límite de confirmación 3 de septiembre.

**Ceremonia** — 23 de octubre, 7:00–8:30 PM · 20 Avenida 19-60, Colonia Montesano, Zona 16 · Google Maps: `https://share.google/1mTzJ0J0oqdm4ERNc` · Waze: `https://waze.com/ul/h9fxejx3m2` · Dress code: Formal · Sin mesa de regalos. Itinerario: Canción, Discurso, Votos, Canción, Oración, Fotografía.

**Recepción** — 24 de octubre, 5:00–10:00 PM · Jardín Casa La Historia, Antigua Guatemala · Google Maps: `https://maps.app.goo.gl/hCZCoETdjrdWn3rv9` · Waze: `https://waze.com/ul/h9fx6xhk6h` · Dress code: Formal · Música: "Here Comes The Sun" · Regalo: "Tu presencia es nuestro mayor regalo. Pero si deseas hacernos un obsequio, también lo recibiremos con mucho cariño." Itinerario editorial resumido: Recepción, Fotos, Palabras de los novios, Oración y comida, Primer baile, Pastel, A celebrar juntos.

---

## 14. Reglas visuales generales (checklist para el desarrollador)

- Cero emojis en el itinerario (se probó con iconos/emoji y se revirtió explícitamente).
- Cero listas largas sin curar — el itinerario de Recepción (14 ítems del cliente) se resume editorialmente a 7 momentos antes de mostrarse.
- Toda fotografía a pantalla completa lleva un overlay de gradiente `rgba(15,22,29,X)` o `rgba(20,30,38,X)` para legibilidad de texto — nunca texto directo sobre foto sin overlay.
- Las tarjetas sobre fotos (Dress Code, mapa) usan `backdrop-filter: blur()` + fondo semitransparente — efecto "glass" sutil, solo en esos casos puntuales, no en toda la UI.
- El accent color y accentDeep son tweakable (props del componente) — no hardcodear si se porta a otro sistema; exponer como variables/tokens.
- Mantener siempre `overflow-x: hidden` a nivel de `html`/`body` (no en contenedores intermedios) — hacerlo en un contenedor intermedio rompe `position: sticky` de los hijos (bug real encontrado y corregido durante el proyecto).
- Los contenedores de scroll-scrub necesitan que su altura total sea mayor a `100vh` para que el `position:sticky` interno tenga rango de "pineado"; nunca pinear un elemento cuyo contenedor mide exactamente `100vh`.

---

## 15. Fuera de alcance / pendiente para el cliente

- Vista previa de mapa real (actualmente placeholder gráfico) — integrar Google Maps Embed o capturas estáticas reales por evento.
- Enlace de mesa de regalos (Recepción) — placeholder de texto, falta URL final.
- Backend de RSVP — el formulario actual solo cambia estado local en el navegador; falta integración con hoja de cálculo/base de datos/email para persistir respuestas reales.
- Métrica de envío por invitado (`guestAccess` vía query param) — falta el sistema que genere y distribuya los enlaces personalizados por invitado/familia.
