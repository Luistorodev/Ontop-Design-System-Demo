/* Foundations as data. Pages render from these files, so correcting a value
   against Figma is an edit in one place, never a rewrite of a page. */

export type Mode = 'light' | 'dark'

/** A tier-3 semantic color: the only tier a component may reference. */
export type ColorToken = {
  /** Name in Figma, e.g. "text/primary". */
  figma: string
  /** Custom-property suffix: "text-primary" becomes --color-text-primary. */
  name: string
  light: string
  dark: string
  /** Tier-2 ramp position each mode aliases, for traceability. */
  lightRamp: string
  darkRamp: string
  use: string
  /** Example utility a developer would actually type. */
  utility: string
  /** Known gap from DESIGN.md section 11 that applies to this token. */
  gap?: { severity: 'blocking' | 'warning'; note: string }
}

export type ColorCollection = {
  /** Figma collection name, e.g. "Typography/Color". */
  figma: string
  title: string
  intro: string
  tokens: ColorToken[]
}

/** A tier-1/tier-2 ramp step. A null value means DESIGN.md references the
 *  step but does not publish its hex, so it has to come from the Figma file. */
export type RampStep = { step: string; value: string | null }

export type Ramp = {
  name: string
  role: string
  usedBy: string
  steps: RampStep[]
  /** True when the ramp is being retired. */
  legacy?: boolean
}
