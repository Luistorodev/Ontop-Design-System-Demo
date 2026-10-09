import { LogoGradientArt, LogoPurpleArt, LogoWhiteArt } from '../icons/logo'

/* Logo — 02 - Worker Design System, Logo Aura (node 13196:7849).

   The Aura star, 40 x 40. One property, Color, with exactly three values —
   the only colours the mark is allowed to take:

   - gradient (default): general/gradient-light → gradient-dark, top to bottom.
     Both tokens move with the mood, so this one variant serves Light and
     Dark on the app's own surface.
   - white: general/logo-white — #7A50F7 in Light, white in Dark.
   - purple: general/blob-purple, #906DF8 in both moods — for light
     backgrounds.

   Simplified by the team on 2026-10-07 (it was Purple / Effect / White, then
   Dark / Light / White). Never drawn below 18.

   The big animated version on the chat home is LogoHero, not this. */

/** The smallest the mark may be drawn. */
export const LOGO_MIN_SIZE = 18

export function Logo({
  color = 'gradient',
  size = 40,
  label,
  className = '',
}: {
  color?: 'gradient' | 'white' | 'purple'
  /** Drawn at 40 in the file; 18 is the minimum, and anything smaller is
   *  raised to it. */
  size?: number
  /** An accessible name, when the mark is the only thing naming Aura.
   *  Without one it is decorative and hidden from assistive technology. */
  label?: string
  className?: string
}) {
  const Art = { gradient: LogoGradientArt, white: LogoWhiteArt, purple: LogoPurpleArt }[color]
  // 18 is the team's minimum size (2026-10-07).
  const px = Math.max(size, LOGO_MIN_SIZE)
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: px, height: px }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Art size={px} />
    </span>
  )
}
