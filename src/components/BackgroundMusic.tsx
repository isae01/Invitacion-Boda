import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { BACKGROUND_MUSIC_SRC, BACKGROUND_MUSIC_VOLUME } from '../data/music'

export interface BackgroundMusicHandle {
  play: () => void
}

interface BackgroundMusicProps {
  /** Una sola pista, o una lista que suena en orden (la última queda en loop). */
  src?: string | string[]
  volume?: number
  muted?: boolean
}

/**
 * Música de fondo — se monta una sola vez (fuera de la pantalla que la
 * dispara) y nunca se desmonta, así el audio no se reinicia. `play()` se
 * expone vía ref porque los navegadores solo permiten iniciar audio como
 * respuesta directa a un gesto del usuario, no se puede autoreproducir al
 * cargar la página. `src`/`volume` son opcionales — sin pasarlos, se
 * comporta exactamente igual que antes (música de la invitación).
 */
const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(
  ({ src = BACKGROUND_MUSIC_SRC, volume = BACKGROUND_MUSIC_VOLUME, muted = false }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const playlist = Array.isArray(src) ? src : [src]
    const [trackIndex, setTrackIndex] = useState(0)
    const isLastTrack = trackIndex === playlist.length - 1

    useImperativeHandle(ref, () => ({
      play: () => {
        const audio = audioRef.current
        if (!audio) return
        audio.volume = volume
        void audio.play()
      },
    }))

    function handleEnded() {
      if (!isLastTrack) setTrackIndex((i) => i + 1)
    }

    // Cambiar el `src` de la pista pausa el audio automáticamente — el
    // navegador no retoma la reproducción solo, así que la seguimos acá.
    // Como venimos de un elemento que ya estaba sonando (gesto del usuario
    // ya consumido), retomar el play no vuelve a pedir permiso.
    useEffect(() => {
      if (trackIndex === 0) return
      const audio = audioRef.current
      if (!audio) return
      audio.volume = volume
      void audio.play()
    }, [trackIndex, volume])

    return (
      <audio
        ref={audioRef}
        src={playlist[trackIndex]}
        loop={isLastTrack}
        muted={muted}
        preload="auto"
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />
    )
  }
)

BackgroundMusic.displayName = 'BackgroundMusic'

export default BackgroundMusic
