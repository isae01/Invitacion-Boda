import { forwardRef, useImperativeHandle, useRef } from 'react'
import { BACKGROUND_MUSIC_SRC, BACKGROUND_MUSIC_VOLUME } from '../data/music'

export interface BackgroundMusicHandle {
  play: () => void
}

/**
 * Música de fondo única para toda la experiencia — se monta una sola vez
 * (en App.tsx, fuera de EnvelopeGate) y nunca se desmonta, así el audio no
 * se reinicia al hacer scroll entre secciones. `play()` se expone vía ref
 * porque los navegadores solo permiten iniciar audio como respuesta directa
 * a un gesto del usuario (el clic del sobre) — no se puede autoreproducir
 * al cargar la página.
 */
const BackgroundMusic = forwardRef<BackgroundMusicHandle>((_props, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = BACKGROUND_MUSIC_VOLUME
      void audio.play()
    },
  }))

  return (
    <audio
      ref={audioRef}
      src={BACKGROUND_MUSIC_SRC}
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  )
})

BackgroundMusic.displayName = 'BackgroundMusic'

export default BackgroundMusic
