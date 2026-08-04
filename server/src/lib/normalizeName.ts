const DIACRITICS = /[̀-ͯ]/g

/** minusculas, sin acentos, sin espacios extra - usado al crear/editar invitados y al matchear el RSVP. */
export function normalizeName(fullName: string): string {
  return fullName
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}
