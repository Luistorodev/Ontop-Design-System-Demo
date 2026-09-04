import type { Ramp } from './types'

/* Tier 1 (Hexes/Values) and tier 2 (Color System) — plumbing.

   Read from the Figma variable collection on 2026-09-04, node 17397:3051 of
   00 - Ontop Foundations. Every step below is the real value; nothing is
   inferred, and the nulls this file used to carry are gone.

   These are NOT emitted as Tailwind utilities on purpose. The rule in
   DESIGN.md is that a component referencing color-purple-500 instead of
   accent/purple is a bug, so the ramps exist here only to let a semantic token
   be traced back to the position it aliases. */

export const rampsReadFrom = {
  file: '00 - Ontop Foundations',
  fileKey: 'Q111EpmKAhOw3C2mxisUhe',
  nodeId: '17397-3051',
  readOn: '2026-09-04',
}

export const ramps: Ramp[] = [
  {
    name: 'Gray Blue',
    role: 'Primary neutral ramp',
    usedBy: 'All neutral surfaces, text and borders',
    steps: [
      { step: '50', value: '#FCFCFD' },
      { step: '100', value: '#F9FAFB' },
      { step: '200', value: '#F2F4F7' },
      { step: '300', value: '#EAECF0' },
      { step: '400', value: '#D0D5DD' },
      { step: '500', value: '#98A2B3' },
      { step: '600', value: '#667085' },
      { step: '700', value: '#475467' },
      { step: '800', value: '#344054' },
      { step: '900', value: '#1D2939' },
      { step: '950', value: '#101828' },
    ],
  },
  {
    name: 'Purple (Primary)',
    role: 'Primary interactive',
    usedBy: 'Links, focus, accent/purple',
    steps: [
      { step: '50', value: '#F3EFFF' },
      { step: '100', value: '#D3C5FC' },
      { step: '200', value: '#BCA7FB' },
      { step: '300', value: '#A68AFA' },
      { step: '400', value: '#906DF8' },
      { step: '500', value: '#7A50F7' },
      { step: '600', value: '#6643CE' },
      { step: '700', value: '#5135A5' },
      { step: '800', value: '#3D287B' },
      { step: '900', value: '#291B52' },
      { step: '950', value: '#181031' },
    ],
  },
  {
    name: 'Indigo (Secondary)',
    role: 'Secondary',
    usedBy: 'Dark page background, tier gradients',
    steps: [
      { step: '50', value: '#EFEDFD' },
      { step: '100', value: '#B7B2D5' },
      { step: '200', value: '#938BC0' },
      { step: '300', value: '#7064AC' },
      { step: '400', value: '#4C3E97' },
      { step: '500', value: '#281782' },
      { step: '600', value: '#21136C' },
      { step: '700', value: '#1B0F57' },
      { step: '800', value: '#140B41' },
      { step: '900', value: '#0D082B' },
      { step: '950', value: '#08051A' },
    ],
  },
  {
    name: 'Lavender (Tertiary)',
    role: 'Tertiary',
    usedBy: 'Dark-mode cards, tier gradients',
    steps: [
      { step: '50', value: '#EEEEFE' },
      { step: '100', value: '#C7C7E7' },
      { step: '200', value: '#ABAADB' },
      { step: '300', value: '#908ECF' },
      { step: '400', value: '#7472C3' },
      { step: '500', value: '#5856B7' },
      { step: '600', value: '#494898' },
      { step: '700', value: '#3B397A' },
      { step: '800', value: '#2C2B5B' },
      { step: '900', value: '#1D1D3D' },
      { step: '950', value: '#121125' },
    ],
  },
  {
    name: 'Pink (Brand)',
    role: 'Ontop brand',
    usedBy: 'accent/brand, surface/brand',
    steps: [
      { step: '50', value: '#FFF5F6' },
      { step: '100', value: '#FFF0F2' },
      { step: '200', value: '#FFDEE2' },
      { step: '300', value: '#FFBDC6' },
      { step: '400', value: '#FF8C9C' },
      { step: '500', value: '#FF5A70' },
      { step: '600', value: '#DE485D' },
      { step: '700', value: '#AA3C4B' },
      { step: '800', value: '#7F2D38' },
      { step: '900', value: '#551E25' },
      { step: '950', value: '#331216' },
    ],
  },
  {
    name: 'Red',
    role: 'Feedback',
    usedBy: 'Status borders, accents, chart series',
    steps: [
      { step: '50', value: '#FFFAFA' },
      { step: '100', value: '#FEF3F2' },
      { step: '200', value: '#FEE4E2' },
      { step: '300', value: '#FECDCA' },
      { step: '400', value: '#FDA29B' },
      { step: '500', value: '#F97066' },
      { step: '600', value: '#F04438' },
      { step: '700', value: '#D92D20' },
      { step: '800', value: '#B32318' },
      { step: '900', value: '#912018' },
      { step: '950', value: '#7A271A' },
    ],
  },
  {
    name: 'Green',
    role: 'Feedback',
    usedBy: 'Status borders, accents, chart series',
    steps: [
      { step: '50', value: '#F6FEF9' },
      { step: '100', value: '#ECFDF3' },
      { step: '200', value: '#D1FADF' },
      { step: '300', value: '#A6F4C5' },
      { step: '400', value: '#6CE9A6' },
      { step: '500', value: '#32D583' },
      { step: '600', value: '#12B76A' },
      { step: '700', value: '#039855' },
      { step: '800', value: '#027948' },
      { step: '900', value: '#05603A' },
      { step: '950', value: '#054F31' },
    ],
  },
  {
    name: 'Yellow',
    role: 'Feedback',
    usedBy: 'Status borders, accents, chart series',
    steps: [
      { step: '50', value: '#FFFCF5' },
      { step: '100', value: '#FFFAEB' },
      { step: '200', value: '#FEEFC7' },
      { step: '300', value: '#FEDF89' },
      { step: '400', value: '#FEC84B' },
      { step: '500', value: '#FDB022' },
      { step: '600', value: '#F79009' },
      { step: '700', value: '#DC6803' },
      { step: '800', value: '#B54708' },
      { step: '900', value: '#93370D' },
      { step: '950', value: '#792E0D' },
    ],
  },
  {
    name: 'Blue',
    role: 'Feedback + data',
    usedBy: 'Informational accents, first chart series',
    steps: [
      { step: '50', value: '#F5F8FF' },
      { step: '100', value: '#EFF4FF' },
      { step: '200', value: '#D1E0FF' },
      { step: '300', value: '#B2CCFF' },
      { step: '400', value: '#84ADFF' },
      { step: '500', value: '#528BFF' },
      { step: '600', value: '#2970FF' },
      { step: '700', value: '#155EEF' },
      { step: '800', value: '#004EEB' },
      { step: '900', value: '#0040C1' },
      { step: '950', value: '#00359E' },
    ],
  },
  {
    name: 'Neutral',
    role: 'White / black anchors',
    usedBy: 'text/inverse, text/on-brand',
    steps: [
      { step: 'white', value: '#FFFFFF' },
      { step: 'black', value: '#000000' },
    ],
  },
  {
    name: 'Gray Iron',
    role: 'Legacy neutral ramp — being retired',
    usedBy: 'Shadow and focus-ring effect styles only',
    legacy: true,
    steps: [
      { step: '50', value: '#FCFCFD' },
      { step: '100', value: '#FAFAFA' },
      { step: '200', value: '#F3F2F2' },
      { step: '300', value: '#E5E3E3' },
      { step: '400', value: '#C9C5C5' },
      { step: '500', value: '#A7A0A1' },
      { step: '600', value: '#776E6F' },
      { step: '700', value: '#5D5657' },
      { step: '800', value: '#423D3E' },
      { step: '900', value: '#282525' },
      { step: '950', value: '#0D0C0C' },
    ],
  },
]

/* Things the variable read turned up that DESIGN.md does not mention.
   Recorded here rather than dropped, because each one is a small decision
   someone still has to make. */
export const readFindings = [
  {
    title: 'Blue is the only ramp whose 50 step is named 050',
    detail:
      'color-blue-050, against color-purple-50, color-red-50 and every other family. Harmless until something iterates variable names, at which point it is a silent miss.',
  },
  {
    title: 'Two Inter text styles survive in the collection',
    detail:
      'Display xs/Medium and Text lg/Normal are both set in Inter, not General Sans, and are bound to raw numbers rather than Typescale variables. They belong with the deprecated styles in DESIGN.md §10.',
  },
  {
    title: 'Legacy aliases still resolve',
    detail:
      'Gray/900, Gray/500, Base/White and Pink/FF5A70(Base) are still live in the collection alongside their tier-2 equivalents. They are the pre-token naming and should migrate.',
  },
  {
    title: 'Gray Iron is the ramp the older prototypes were built on',
    detail:
      'Its steps (#423D3E, #5D5657, #776E6F, #A7A0A1) are exactly the warm text ramp hardcoded in the Direct Deposits prototype. That prototype is on the retired ramp, not on Gray Blue.',
  },
]

export const tierTable = [
  {
    tier: 'Tier 1 — Hexes/Values',
    count: '112 variables',
    modes: 'Base Value',
    naming: 'Named by value',
    example: 'Purple/7A50F7 (Base)',
  },
  {
    tier: 'Tier 2 — Color System',
    count: '112 variables',
    modes: 'Mode 1',
    naming: 'Named by role in the ramp',
    example: 'Purple (Primary)/color-purple-500',
  },
  {
    tier: 'Tier 3 — Semantic',
    count: '36 variables, 4 collections',
    modes: 'Light and Dark',
    naming: 'Named by what it does',
    example: 'accent/purple',
  },
]

export const architectureRules = [
  'Design and code consume tier 3 only. A component that references color-purple-500 instead of accent/purple is a bug, not a shortcut.',
  'Never a raw hex. If no semantic token expresses the intent, the answer is a new semantic token, not a hardcoded value.',
  'Tier 1 and 2 are plumbing. They exist so a brand refresh is a re-alias, not a find-and-replace. Do not extend them ad hoc.',
  'Both modes, always. Every tier-3 color token must resolve in Light and Dark. Shipping a token with one mode filled is shipping a broken token.',
]
