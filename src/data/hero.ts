import type { GuestAccess } from '../types/guestAccess'

interface HeroContent {
  eyebrow: string
  date: string
}

/**
 * Texto del Hero que cambia según guestAccess (DESIGN.md §12).
 * Fechas y ubicaciones vienen de Context/CONTENT.md.
 */
const HERO_CONTENT: Record<GuestAccess, HeroContent> = {
  ambos: { eyebrow: 'ZONA 16 · ANTIGUA GUATEMALA', date: '23 · 24.10.2026' },
  ceremonia: { eyebrow: 'ZONA 16, GUATEMALA', date: '23.10.2026' },
  recepcion: { eyebrow: 'ANTIGUA GUATEMALA', date: '24.10.2026' },
}

export function getHeroContent(guestAccess: GuestAccess): HeroContent {
  return HERO_CONTENT[guestAccess]
}
