import { useEffect, useRef } from 'react'

const SLIDES: string[] = [
  '/images/IMG_9351.jpg',
  '/images/antigua3.jpg',
  '/images/teatro.jpg',
  '/images/IMG_9119.jpg',
  '/images/peru.png',
  '/images/IMG_9156.jpg',
  '/images/antigua2.jpg',
  '/images/strokes.jpg',
  '/images/IMG_9186.jpg',
]

// Se triplica el set de fotos: al acercarse a un extremo, el scroll salta de
// forma instantánea a la copia del medio, dando la sensación de un loop
// infinito con las mismas imágenes (sin librería externa).
const LOOPED_SLIDES = [...SLIDES, ...SLIDES, ...SLIDES]

/** Carrusel de recuerdos para los novios — swipe nativo (scroll-snap), sin librería. */
function PhotoGallery() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const settleTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollLeft = el.scrollWidth / 3
  }, [])

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    if (settleTimeout.current) clearTimeout(settleTimeout.current)
    settleTimeout.current = setTimeout(() => {
      const oneSetWidth = el.scrollWidth / 3
      if (el.scrollLeft < oneSetWidth * 0.5) {
        el.scrollLeft += oneSetWidth
      } else if (el.scrollLeft > oneSetWidth * 1.5) {
        el.scrollLeft -= oneSetWidth
      }
    }, 120)
  }

  return (
    <div
      ref={scrollerRef}
      onScroll={handleScroll}
      className="scrollbar-hide flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
    >
      {LOOPED_SLIDES.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="h-72 w-56 shrink-0 snap-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg sm:h-80 sm:w-64"
        >
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  )
}

export default PhotoGallery
