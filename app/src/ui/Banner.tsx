import type { ReactNode } from 'react'
import { BannerPlaceholderIcon } from '../icons/banner'
import { Logo } from './Logo'

/* Banner — 02 - Worker Design System, Banner (node 13203:8052).

   A one-line message with an optional link, shown above the Composer's text
   when Aura has something to say about the conversation. Five types:

   - neutral: Aura's own voice — the Logo (Gradient, 18) instead of an icon.
   - info, error, warning, success: a status, with an icon.

   Each type colours the border, the icon, the text and the link with one
   token, and fills with its -bg token (a light tint in Light, the hue at 30%
   in Dark), all from the Aura · Semantic group.

   The Figma frame is 302 wide — the Large Composer's 328 less its 12 of
   padding a side. Here it fills its container, like the Composer itself. */

export type BannerType = 'neutral' | 'info' | 'error' | 'warning' | 'success'

/* Literal class strings, so Tailwind can see every one. */
const TONE: Record<BannerType, string> = {
  neutral: 'bg-semantic-neutral-bg text-semantic-neutral shadow-[inset_0_0_0_1px_var(--color-semantic-neutral)]',
  info: 'bg-semantic-info-bg text-semantic-info shadow-[inset_0_0_0_1px_var(--color-semantic-info)]',
  error: 'bg-semantic-error-bg text-semantic-error shadow-[inset_0_0_0_1px_var(--color-semantic-error)]',
  warning: 'bg-semantic-warning-bg text-semantic-warning shadow-[inset_0_0_0_1px_var(--color-semantic-warning)]',
  success: 'bg-semantic-success-bg text-semantic-success shadow-[inset_0_0_0_1px_var(--color-semantic-success)]',
}

export function Banner({
  type = 'neutral',
  children,
  action,
  onAction,
  className = '',
}: {
  type?: BannerType
  /** The message. One line in the file; longer copy wraps. */
  children: ReactNode
  /** The link's label — "Retry", "Learn more". Omit for no link. */
  action?: string
  onAction?: () => void
  className?: string
}) {
  return (
    /* The 1px border is a Figma stroke drawn inside the frame (strokes not
       included in layout), so it is an inset shadow: 12 + 20 + 12 = the 44
       the variants report. Error and warning are announced; the others are
       status updates that should not interrupt. */
    <div
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      className={`flex w-full items-center gap-[12px] rounded-08 p-sp-12 ${TONE[type]} ${className}`}
    >
      <div className="flex min-w-px flex-[1_0_0] items-center gap-sp-08">
        {type === 'neutral' ? (
          <Logo color="gradient" size={18} />
        ) : (
          <BannerPlaceholderIcon className="shrink-0" />
        )}
        <p className="min-w-px flex-[1_0_0] text-md leading-md font-medium">{children}</p>
      </div>
      {action ? (
        /* Link · sm · Primary in the file, recoloured by the type's token —
           the instance overrides Link's own purple. Body 14/20 Medium,
           underlined. */
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 cursor-pointer text-md leading-md font-medium whitespace-nowrap underline outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          {action}
        </button>
      ) : null}
    </div>
  )
}
