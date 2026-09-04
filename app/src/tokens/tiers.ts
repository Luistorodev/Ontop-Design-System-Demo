/* Membership tier backgrounds — DESIGN.md section 8.

   Tier identity is expressed by switching the mode on a container, not by
   swapping fills. One gradient component, four modes.

   DESIGN.md gives these stops as tier-2 ramp positions, not hexes, and it does
   not publish the Indigo ramp or lavender-50/100/600. Those resolve to null
   here and render as gaps rather than as invented colors. */

import { ramps } from './primitives'

export type TierMode = 'Purple' | 'Indigo' | 'Lavender' | 'Reverse'

export const tierModes: TierMode[] = ['Purple', 'Indigo', 'Lavender', 'Reverse']

export type TierStop = {
  token: string
  /** Ramp position per mode, in tierModes order. */
  ramps: Record<TierMode, string>
}

export const lightStops: TierStop[] = [
  {
    token: 'bg/gradient-01',
    ramps: { Purple: 'purple-400', Indigo: 'indigo-300', Lavender: 'lavender-400', Reverse: 'gray-blue-600' },
  },
  {
    token: 'bg/gradient-02',
    ramps: { Purple: 'purple-300', Indigo: 'indigo-200', Lavender: 'lavender-300', Reverse: 'gray-blue-500' },
  },
  {
    token: 'bg/gradient-03',
    ramps: { Purple: 'purple-100', Indigo: 'indigo-100', Lavender: 'lavender-100', Reverse: 'gray-blue-400' },
  },
  {
    token: 'bg/gradient-04',
    ramps: { Purple: 'purple-50', Indigo: 'indigo-50', Lavender: 'lavender-50', Reverse: 'gray-blue-200' },
  },
  {
    token: 'bg/flat',
    ramps: { Purple: 'purple-50', Indigo: 'indigo-50', Lavender: 'lavender-50', Reverse: 'gray-blue-200' },
  },
]

export const darkStops: TierStop[] = [
  {
    token: 'bg-dark/gradient-01',
    ramps: { Purple: 'purple-600', Indigo: 'indigo-600', Lavender: 'lavender-600', Reverse: 'gray-blue-900' },
  },
  {
    token: 'bg-dark/gradient-02',
    ramps: { Purple: 'purple-300', Indigo: 'indigo-300', Lavender: 'lavender-300', Reverse: 'gray-blue-600' },
  },
  {
    token: 'bg-dark/gradient-03',
    ramps: { Purple: 'purple-400', Indigo: 'indigo-400', Lavender: 'lavender-400', Reverse: 'gray-blue-700' },
  },
  {
    token: 'bg-dark/gradient-04',
    ramps: { Purple: 'purple-700', Indigo: 'indigo-700', Lavender: 'lavender-700', Reverse: 'gray-blue-950' },
  },
  {
    token: 'bg-dark/gradient-05',
    ramps: { Purple: 'indigo-950', Indigo: 'indigo-950', Lavender: 'indigo-950', Reverse: 'indigo-950' },
  },
  {
    token: 'bg-dark/flat',
    ramps: { Purple: 'indigo-950', Indigo: 'indigo-950', Lavender: 'indigo-950', Reverse: 'indigo-950' },
  },
]

/** Resolve a tier-2 ramp position like "lavender-400" to its hex, or null when
 *  DESIGN.md never published it. */
export function resolveRamp(position: string): string | null {
  const match = position.match(/^(.*)-(\d+|white)$/)
  if (!match) return null
  const [, family, step] = match
  const ramp = ramps.find((r) => normalize(r.name) === family)
  return ramp?.steps.find((s) => s.step === step)?.value ?? null
}

function normalize(rampName: string): string {
  // "Purple (Primary)" -> "purple", "Gray Blue" -> "gray-blue"
  return rampName
    .replace(/\s*\(.*\)\s*/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export const tierNotes = [
  'Reverse is the neutral / no-tier state, not a fourth tier.',
  'gradient-04 and flat are the same value in Light, as are gradient-05 and flat in Dark. flat exists so a non-gradient fallback can be bound without re-pointing.',
  'Every tier terminates on indigo-950 in Dark by design: the gradients differ at the top of the ramp and converge into the page.',
  'Text on tier backgrounds uses text/primary on Light stops and text/inverse on Dark stops. Do not place text/link on a gradient — verify contrast per stop.',
]
