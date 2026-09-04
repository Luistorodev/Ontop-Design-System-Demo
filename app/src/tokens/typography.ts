/* Typography, from DESIGN.md section 6.

   General Sans ships Regular 400, Medium 500 and Semibold 600 and nothing
   else. Light, Bold and Black are not available and must never be specified. */

export const fontFamily = {
  name: 'General Sans',
  weights: [
    { value: 400, label: 'Regular', token: 'font-weight/regular' },
    { value: 500, label: 'Medium', token: 'font-weight/medium' },
    { value: 600, label: 'Semibold', token: 'font-weight/semibold' },
  ],
  loadedFrom: 'Fontshare CDN, linked in index.html',
}

export type ScaleEntry = { token: string; utility: string; value: number }

export const fontSizes: ScaleEntry[] = [
  { token: 'font-size/xs', utility: 'text-xs', value: 10 },
  { token: 'font-size/sm', utility: 'text-sm', value: 12 },
  { token: 'font-size/md', utility: 'text-md', value: 14 },
  { token: 'font-size/lg', utility: 'text-lg', value: 16 },
  { token: 'font-size/xl', utility: 'text-xl', value: 18 },
  { token: 'font-size/2xl', utility: 'text-2xl', value: 20 },
  { token: 'font-size/3xl', utility: 'text-3xl', value: 24 },
  { token: 'font-size/4xl', utility: 'text-4xl', value: 28 },
  { token: 'font-size/5xl', utility: 'text-5xl', value: 32 },
  { token: 'font-size/6xl', utility: 'text-6xl', value: 40 },
]

export const lineHeights: ScaleEntry[] = [
  { token: 'line-height/xs', utility: 'leading-xs', value: 14 },
  { token: 'line-height/sm', utility: 'leading-sm', value: 16 },
  { token: 'line-height/md', utility: 'leading-md', value: 20 },
  { token: 'line-height/title-md', utility: 'leading-title-md', value: 22 },
  { token: 'line-height/lg', utility: 'leading-lg', value: 24 },
  { token: 'line-height/2xl', utility: 'leading-2xl', value: 28 },
  { token: 'line-height/3xl', utility: 'leading-3xl', value: 32 },
  { token: 'line-height/4xl', utility: 'leading-4xl', value: 36 },
  { token: 'line-height/5xl', utility: 'leading-5xl', value: 48 },
]

export const letterSpacings: { token: string; utility: string; value: string }[] = [
  { token: 'letter-spacing/normal', utility: 'tracking-normal', value: '0' },
  { token: 'letter-spacing/tight', utility: 'tracking-tight', value: '0' },
]

export type TextStyle = {
  name: string
  size: number
  lineHeight: number
  weight: 400 | 500 | 600
  /** Which letter-spacing variable the style binds. Both resolve to 0 today,
   *  so this is latent: the day `tight` gets a real value, exactly these
   *  styles move and nothing else does. */
  tracking: 'normal' | 'tight'
  use: string
  /** Heading/xl and up are not bound to Typescale variables in Figma. */
  unbound?: boolean
}

export type TextStyleFamily = {
  name: string
  intro: string
  styles: TextStyle[]
}

export const textStyleFamilies: TextStyleFamily[] = [
  {
    name: 'Heading',
    intro:
      'Page and section structure. If it opens a region, it is a Heading; if it names a thing, it is a Title.',
    styles: [
      { name: 'Heading/3xl', size: 48, lineHeight: 56, weight: 600, tracking: 'normal', use: 'Marketing, hero', unbound: true },
      { name: 'Heading/2xl', size: 36, lineHeight: 40, weight: 600, tracking: 'normal', use: 'Marketing, hero', unbound: true },
      { name: 'Heading/xl', size: 32, lineHeight: 36, weight: 600, tracking: 'normal', use: 'Page title', unbound: true },
      { name: 'Heading/lg', size: 28, lineHeight: 32, weight: 600, tracking: 'normal', use: 'Page title' },
      { name: 'Heading/md', size: 24, lineHeight: 28, weight: 600, tracking: 'normal', use: 'Section heading' },
    ],
  },
  {
    name: 'Title',
    intro: 'Object naming — the label of a card, row or list item.',
    styles: [
      { name: 'Title/lg/semibold', size: 20, lineHeight: 24, weight: 600, tracking: 'normal', use: 'Card title, sub-title' },
      { name: 'Title/md/semibold', size: 18, lineHeight: 22, weight: 600, tracking: 'tight', use: 'List item title' },
      { name: 'Title/md/medium', size: 18, lineHeight: 22, weight: 500, tracking: 'normal', use: 'List item sub-title' },
      { name: 'Title/sm/semibold', size: 16, lineHeight: 22, weight: 600, tracking: 'normal', use: 'Dense list item title' },
      { name: 'Title/sm/medium', size: 16, lineHeight: 22, weight: 500, tracking: 'normal', use: 'Dense list item sub-title' },
    ],
  },
  {
    name: 'Body',
    intro: 'Body/md is the default UI body style.',
    styles: [
      { name: 'Body/lg/regular', size: 16, lineHeight: 24, weight: 400, tracking: 'normal', use: 'Long-form body' },
      { name: 'Body/lg/md', size: 16, lineHeight: 24, weight: 500, tracking: 'normal', use: 'Long-form body, emphasized' },
      { name: 'Body/md/regular', size: 14, lineHeight: 20, weight: 400, tracking: 'normal', use: 'Default UI body' },
      { name: 'Body/md/md', size: 14, lineHeight: 20, weight: 500, tracking: 'normal', use: 'Default UI body, emphasized' },
      { name: 'Body/sm/regular', size: 12, lineHeight: 16, weight: 400, tracking: 'normal', use: 'Dense body, table cells' },
      { name: 'Body/sm/md', size: 12, lineHeight: 16, weight: 500, tracking: 'normal', use: 'Dense body, emphasized' },
      { name: 'Body/xs/regular', size: 10, lineHeight: 14, weight: 400, tracking: 'normal', use: 'Mobile only' },
      { name: 'Body/xs/md', size: 10, lineHeight: 14, weight: 500, tracking: 'normal', use: 'Mobile only, emphasized' },
    ],
  },
  {
    name: 'Caption',
    intro: 'Labels. Always Semibold.',
    styles: [
      { name: 'Caption/lg', size: 16, lineHeight: 24, weight: 600, tracking: 'normal', use: 'Emphasized label' },
      { name: 'Caption/md', size: 14, lineHeight: 20, weight: 600, tracking: 'normal', use: 'Field label' },
      { name: 'Caption/sm', size: 12, lineHeight: 16, weight: 600, tracking: 'normal', use: 'Dense label, badge text' },
    ],
  },
  {
    name: 'Link',
    intro: 'Inline links. Always paired with the text/link token.',
    styles: [
      { name: 'Link/lg', size: 16, lineHeight: 24, weight: 500, tracking: 'normal', use: 'Inline link in long-form body' },
      { name: 'Link/md', size: 14, lineHeight: 20, weight: 500, tracking: 'normal', use: 'Inline link in UI body' },
      { name: 'Link/sm', size: 12, lineHeight: 16, weight: 500, tracking: 'normal', use: 'Inline link in dense body' },
    ],
  },
  {
    name: 'Amount',
    intro:
      'Currency only. Monetary values use this family and nothing else — it is what keeps figures optically consistent across payroll, invoicing and statements. Never use Heading for a number.',
    styles: [
      { name: 'Amount/xl', size: 40, lineHeight: 48, weight: 600, tracking: 'tight', use: 'Hero balance, primary amount' },
      { name: 'Amount/lg', size: 32, lineHeight: 36, weight: 600, tracking: 'tight', use: 'Section amount' },
      { name: 'Amount/md', size: 24, lineHeight: 32, weight: 600, tracking: 'tight', use: 'Inline amount, table total' },
    ],
  },
]

export const typographyReadFrom = {
  file: '00 - Ontop Foundations',
  fileKey: 'Q111EpmKAhOw3C2mxisUhe',
  nodeId: '11807-8549',
  readOn: '2026-09-04',
}

/* What the variable read changed or confirmed against DESIGN.md §6. */
export const typographyFindings = [
  {
    kind: 'corrected' as const,
    title: 'The medium Body variants are named /md, not /medium',
    detail:
      'Figma has Body/lg/md, Body/md/md, Body/sm/md and Body/xs/md. So Body/md/md is size md at weight md — the same token stands for a size in the second segment and a weight in the third. Ambiguous, but it is the real name, and a style referenced as Body/md/medium does not exist.',
  },
  {
    kind: 'confirmed' as const,
    title: 'letter-spacing/tight is bound by exactly four styles',
    detail:
      'Title/md/semibold, Amount/xl, Amount/lg and Amount/md. DESIGN.md gap 7 guessed "Amount/* and large headings" — it is the three Amounts plus one Title, and no heading at all. Both variables resolve to 0, so the binding is invisible today.',
  },
  {
    kind: 'new' as const,
    title: 'Title/md/semibold uses tight while Title/md/medium uses normal',
    detail:
      'Same size, same line-height, same family, different letter-spacing binding. Nothing distinguishes them visually today because tight is 0 — but give tight a real value and the semibold half of that pair drifts away from the medium half on its own.',
  },
  {
    kind: 'new' as const,
    title: 'Two capitalised Body duplicates survive, unbound',
    detail:
      'Body/md/Medium and Body/lg/Medium (capital M) hold hardcoded 14/20 and 16/24 instead of binding Typescale variables. They duplicate Body/md/md and Body/lg/md and belong with the deprecated styles.',
  },
  {
    kind: 'confirmed' as const,
    title: 'All 19 Typescale variables and all 27 text styles match DESIGN.md',
    detail:
      'Every font-size, line-height, size, line-height and weight in the document reproduces exactly. The only divergence in the whole family was the /md naming above.',
  },
]
