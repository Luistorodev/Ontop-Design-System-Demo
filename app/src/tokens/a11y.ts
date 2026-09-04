/* Accessibility floor and verified pairings — DESIGN.md section 9.

   Pairings are stored as token names, not hexes, so the page resolves them
   through color.ts and recomputes the ratio live. The `stated` figure is what
   DESIGN.md claims; the page compares it against the measured value. */

export const floor = [
  'Body text: 4.5:1 minimum. Text at least 18.66px Semibold or at least 24px: 3:1.',
  'Non-text (icons, borders, focus, chart strokes): 3:1.',
  'Color is never the only channel. Status carries an icon or a label as well.',
  'Every interactive element has a visible focus state at 3:1.',
  'Motion respects prefers-reduced-motion.',
]

export type Pairing = {
  /** Token names as they appear in color.ts. */
  fg: string
  bg: string
  /** Ratios DESIGN.md states, per mode. */
  stated: { light: number; dark: number }
}

export const verifiedPairings: Pairing[] = [
  { fg: 'text-primary', bg: 'surface-page', stated: { light: 14.34, dark: 20.06 } },
  { fg: 'text-secondary', bg: 'surface-page', stated: { light: 7.5, dark: 16.96 } },
  { fg: 'text-tertiary', bg: 'surface-page', stated: { light: 4.85, dark: 13.61 } },
  { fg: 'text-link', bg: 'surface-page', stated: { light: 6.28, dark: 7.29 } },
  { fg: 'text-primary', bg: 'surface-subtle', stated: { light: 14.07, dark: 14.7 } },
  { fg: 'text-inverse', bg: 'surface-inverse', stated: { light: 14.7, dark: 17.31 } },
  { fg: 'text-primary', bg: 'surface-card', stated: { light: 1.41, dark: 13.09 } },
  { fg: 'text-on-brand', bg: 'surface-brand', stated: { light: 3.02, dark: 4.05 } },
]

/** Surfaces the matrix checks every text token against. */
export const matrixSurfaces = [
  'surface-page',
  'surface-subtle',
  'surface-card',
  'surface-card-raised',
  'surface-card-sunken',
  'surface-overlay',
  'surface-inverse',
  'surface-brand',
]

export const matrixText = [
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-placeholder',
  'text-inverse',
  'text-on-brand',
  'text-link',
]
