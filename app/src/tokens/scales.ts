/* Spacing, radius, elevation and focus — DESIGN.md section 7. */

export type SpacingStep = { token: string; utility: string; value: number }

/* 4-point base, fine-grained to 16, then 8-point steps. There is no sp-20:
   the jump from 16 to 24 is intentional, to stop the mid-range drifting. */
export const spacingScale: SpacingStep[] = [
  { token: 'sp-04', utility: 'p-sp-04', value: 4 },
  { token: 'sp-08', utility: 'p-sp-08', value: 8 },
  { token: 'sp-12', utility: 'p-sp-12', value: 12 },
  { token: 'sp-16', utility: 'p-sp-16', value: 16 },
  { token: 'sp-24', utility: 'p-sp-24', value: 24 },
  { token: 'sp-32', utility: 'p-sp-32', value: 32 },
  { token: 'sp-40', utility: 'p-sp-40', value: 40 },
  { token: 'sp-48', utility: 'p-sp-48', value: 48 },
  { token: 'sp-56', utility: 'p-sp-56', value: 56 },
  { token: 'sp-64', utility: 'p-sp-64', value: 64 },
  { token: 'sp-72', utility: 'p-sp-72', value: 72 },
  { token: 'sp-80', utility: 'p-sp-80', value: 80 },
  { token: 'sp-88', utility: 'p-sp-88', value: 88 },
  { token: 'sp-96', utility: 'p-sp-96', value: 96 },
  { token: 'sp-104', utility: 'p-sp-104', value: 104 },
]

export const spacingIntent = [
  { range: 'sp-04 – sp-08', use: 'Inside a component' },
  { range: 'sp-12 – sp-16', use: 'Between elements' },
  { range: 'sp-24 – sp-32', use: 'Between groups' },
  { range: 'sp-40 and up', use: 'Between page sections' },
]

export type RadiusStep = {
  token: string
  utility: string
  value: number
  /** Rendered size, since br-100 is a sentinel rather than a real radius. */
  display: number
  use?: string
}

/* Figma's br-NN cannot be mirrored literally in Tailwind: rounded-br-04 would
   collide with the bottom-right corner utility. */
export const radiusScale: RadiusStep[] = [
  { token: 'br-04', utility: 'rounded-04', value: 4, display: 4 },
  { token: 'br-08', utility: 'rounded-08', value: 8, display: 8 },
  { token: 'br-12', utility: 'rounded-12', value: 12, display: 12 },
  { token: 'br-16', utility: 'rounded-16', value: 16, display: 16 },
  { token: 'br-20', utility: 'rounded-20', value: 20, display: 20 },
  { token: 'br-24', utility: 'rounded-24', value: 24, display: 24 },
  { token: 'br-32', utility: 'rounded-32', value: 32, display: 32 },
  {
    token: 'br-100',
    utility: 'rounded-pill',
    value: 99999,
    display: 99999,
    use: 'Pills, avatars, circular controls. A full-round sentinel, not a 100px radius — never for a card.',
  },
]

export type ShadowToken = { token: string; utility: string; value: string }

export const shadowScale: ShadowToken[] = [
  { token: 'Shadows/xs', utility: 'shadow-xs', value: '0 1px 2px 0 rgb(13 12 12 / 0.05)' },
  {
    token: 'Shadows/sm',
    utility: 'shadow-sm',
    value: '0 1px 2px 0 rgb(13 12 12 / 0.06), 0 1px 3px 0 rgb(13 12 12 / 0.10)',
  },
  {
    token: 'Shadows/md',
    utility: 'shadow-md',
    value: '0 2px 4px -2px rgb(13 12 12 / 0.06), 0 4px 8px -2px rgb(13 12 12 / 0.10)',
  },
  {
    token: 'Shadows/lg',
    utility: 'shadow-lg',
    value: '0 4px 6px -2px rgb(13 12 12 / 0.03), 0 12px 16px -4px rgb(13 12 12 / 0.08)',
  },
]
