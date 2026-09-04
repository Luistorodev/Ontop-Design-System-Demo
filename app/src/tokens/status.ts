/* Known gaps and legacy surface — DESIGN.md sections 10 and 11.

   These are open questions, not decided ones. They are in the hub because a
   developer reading a token needs to know it is contested before they build
   on it, not after. */

export type Gap = {
  n: number
  severity: 'blocking' | 'high' | 'medium'
  title: string
  detail: string
}

export const knownGaps: Gap[] = [
  {
    n: 1,
    severity: 'blocking',
    title: 'Surface/Color Light mode is unshipped for the card family',
    detail:
      'surface/card (#344054), card-raised (#475467), card-sunken (#1D2939) and overlay (#1D2939) hold dark neutrals in Light mode, against a surface/page of #FCFCFD. Primary text on a Light card measures 1.41:1. The values read like the Dark ramp landed in the Light column. Do not build Light-mode cards until this is resolved.',
  },
  {
    n: 2,
    severity: 'blocking',
    title: 'text/on-brand fails on surface/brand in both modes',
    detail:
      '3.02 Light, 4.05 Dark. White on pink-500 does not reach 4.5:1. Either darken the brand surface for text contexts, or restrict surface/brand to large text and non-text use.',
  },
  {
    n: 3,
    severity: 'high',
    title: 'surface/brand-subtle is inverted',
    detail:
      'It resolves to pink-600 (Light) and pink-700 (Dark) — darker than surface/brand itself. Its description calls for a very soft brand tint; it should sit at pink-50/100.',
  },
  {
    n: 4,
    severity: 'high',
    title: 'surface/brand description contradicts its value',
    detail:
      'The description says Purple; the token resolves to Pink. Purple is the primary interactive color, Pink is brand identity — the description needs to follow the value, or the decision needs revisiting.',
  },
  {
    n: 5,
    severity: 'high',
    title: 'Three Light tokens share one value',
    detail:
      'card-sunken, overlay and inverse all resolve to #1D2939 in Light. Three intents, no differentiation.',
  },
  {
    n: 6,
    severity: 'medium',
    title: 'Typescale Mobile mode is a no-op',
    detail:
      'Both modes carry identical values. Either fill in the mobile ramp or drop the mode — a declared axis that does nothing will be trusted by someone eventually.',
  },
  {
    n: 7,
    severity: 'medium',
    title: 'letter-spacing/normal and /tight are both 0',
    detail: 'Undifferentiated. tight is presumably meant for Amount/* and large headings.',
  },
  {
    n: 8,
    severity: 'medium',
    title: 'Heading/xl, 2xl and 3xl are unbound',
    detail:
      'Their sizes (32, 36, 48) partly fall outside the Typescale, which tops out at 40. Extend the scale, or move these three into a display family with its own ramp.',
  },
  {
    n: 9,
    severity: 'medium',
    title: 'font-size/6xl (40) has no matching line-height',
    detail:
      'line-height/* ends at 5xl (48). Amount/xl pairs 6xl with 5xl, which works but reads as a mismatch.',
  },
  {
    n: 10,
    severity: 'medium',
    title: 'Shadows are not tokenized and have no Dark variant',
    detail:
      'Elevation in Dark relies entirely on the surface ramp. Worth making explicit as tokens.',
  },
  {
    n: 11,
    severity: 'medium',
    title: 'No motion tokens',
    detail:
      'Durations and easings live in the Spinner Animation page, not in variables.',
  },
]

export type LegacyItem = { title: string; detail: string }

export const legacySurface: LegacyItem[] = [
  {
    title: 'Legacy fill styles',
    detail:
      'Primary/*, Grey/*, Blue/*, Red/*, Green/*, Yellow/*, Feedback/*, Text/*, Base/*, Background/25, Darks/Blue, and the Blue-pale/*, Blue-russian/*, Green-mindaro/*, Yellow-saffron/* palettes. All superseded by tier-3 variables.',
  },
  {
    title: 'Gradient fill styles',
    detail:
      'Thirteen one-off Gradients/* styles (gradient-main, Gradient-Dusk, Gradient-Atlas, Gradient-Coral and others). Superseded for tier work by Membership tier backgrounds; the remainder are unowned.',
  },
  {
    title: 'Deprecated text styles',
    detail: 'Fifteen, prefixed ❌ Deprecated/, retained for migration reference only.',
  },
  {
    title: 'Gray Iron ramp',
    detail: 'Survives only inside shadow and focus-ring effect styles. Gray Blue is the system neutral.',
  },
  {
    title: 'Grid styles',
    detail:
      'NEW GRIDS/center CLIENT, sidebar + right content CLIENT, center WORKER. Still in use; not yet tokenized or documented.',
  },
]

export const legacyRule =
  'Touching a flow means migrating the legacy styles in it. No new usage, ever.'

export const changeProcess = [
  'Any change lands in Figma first. The file is the source of truth; code follows.',
  'New semantic tokens alias tier 2. New tier-1 or tier-2 entries require a brand decision, not a design one.',
  'Every color token ships both modes and a description stating intent, not value. "Purple 500" is not a description; "focus ring for interactive elements" is.',
  'Contrast is verified before merge — every text token against every surface it can legally sit on.',
  'Removing a token means migrating its consumers first, then deleting. Renaming in place breaks silently.',
  'DESIGN.md is updated in the same change. A foundations edit that does not touch it is incomplete.',
]
