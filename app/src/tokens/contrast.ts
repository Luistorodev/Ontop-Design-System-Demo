/* WCAG 2.1 relative luminance and contrast ratio.

   DESIGN.md ships a table of verified pairings. Recomputing them in the hub
   rather than printing them means the table cannot silently rot when a token
   changes: the page shows the stated ratio next to the measured one and flags
   any drift. */

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA Large' | 'FAIL'

/** `large` is text at least 18.66px Semibold or at least 24px. */
export function rate(ratio: number, large = false): ContrastLevel {
  if (large) {
    if (ratio >= 4.5) return 'AAA'
    if (ratio >= 3) return 'AA Large'
    return 'FAIL'
  }
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'FAIL'
}

/** Non-text contrast: icons, borders, focus rings, chart strokes. */
export function ratesNonText(ratio: number): boolean {
  return ratio >= 3
}
