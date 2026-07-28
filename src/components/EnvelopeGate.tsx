import { useEffect, useRef, useState, type ReactNode } from 'react'
import BackgroundMusic, { type BackgroundMusicHandle } from './BackgroundMusic'

interface EnvelopeGateProps {
  children: ReactNode
}

// Duración total antes de retirar la pantalla del sobre del DOM — incluye
// el giro de la solapa (700ms) + el fundido de salida del overlay.
const OPEN_ANIMATION_MS = 2600

/**
 * Pantalla de apertura con sobre (a pedido de la clienta): el sitio real
 * vive montado detrás desde el inicio (nunca se remonta, así el scroll y la
 * música no se reinician) — este overlay solo lo tapa hasta el clic. El
 * clic es el gesto de usuario que los navegadores exigen para poder
 * reproducir audio, por eso BackgroundMusic vive aquí mismo.
 */
function EnvelopeGate({ children }: EnvelopeGateProps) {
  const musicRef = useRef<BackgroundMusicHandle>(null)
  const [opening, setOpening] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    document.body.style.overflow = dismissed ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [dismissed])

  const handleOpen = () => {
    if (opening) return
    musicRef.current?.play()
    setOpening(true)
    window.setTimeout(() => setDismissed(true), OPEN_ANIMATION_MS)
  }

  return (
    <>
      <BackgroundMusic ref={musicRef} />
      {children}

      {!dismissed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-accent-deep transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: opening ? 0 : 1, pointerEvents: opening ? 'none' : 'auto' }}
        >
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Haz clic para abrir la invitación"
            className="flex flex-col items-center gap-7 px-6"
          >
            <div className="relative h-[140px] w-[210px]" style={{ perspective: '700px' }}>
              {/* Cuerpo del sobre */}
              <div className="absolute inset-0 rounded-[6px] bg-surface shadow-2xl" />
              {/* Sello, detrás de la solapa — corazón rosado pálido */}
              <svg
                viewBox="0 0 24 24"
                fill="#f3c6d3"
                className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
              </svg>
              {/* Solapa triangular — gira sobre su borde superior al abrir */}
              <div
                className="absolute inset-x-0 top-0 transition-transform duration-700 ease-in-out"
                style={{
                  height: '72px',
                  background: 'linear-gradient(160deg, #f7f8f9, #e6eaed)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformOrigin: 'top',
                  transform: `rotateX(${opening ? 180 : 0}deg)`,
                }}
              />
            </div>
            <span className="text-[13px] font-bold tracking-[2px] text-white">
              Haz clic para abrir invitación
            </span>
          </button>
        </div>
      )}
    </>
  )
}

export default EnvelopeGate
