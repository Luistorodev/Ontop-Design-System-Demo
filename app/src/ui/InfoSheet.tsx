import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronRightIcon, CloseIcon } from '../icons/info-sheet'

/* InfoSheet — 02 - Worker Design System, node 12497:17075.
   StepItem — node 12497:17258, a private child of InfoSheet.

   A bottom sheet for explanation and confirmation: a content slot the caller
   fills, and one or two actions. It spans the viewport and its height hugs the
   slot and the action stack, capped at 90% of the screen.

   Figma models the sheet as the panel alone. The scrim, the enter/exit motion
   and the focus handling are added here because the component's own
   accessibility guidance requires them: dismissal must not depend on the close
   button alone, and focus has to move into the sheet on open and return to the
   trigger on close.

   The slot scrolls once it runs out of room, with a fade at the top edge and a
   close button that floats above the content. That is a deliberate departure:
   the guidance says "don't nest a scroll container that fights the hug", which
   holds while the slot is Figma's fixed 168 placeholder but breaks the moment a
   caller puts three steps in it. The sheet still hugs — the scroll only starts
   at the cap. See the Deviations section of the component page. */

/* ================================================================
   Provisional chrome

   Button and Link do not exist in src/ui yet, but both are part of these two
   components in Figma. They are drawn here from Button/Color and
   Component/Link — the token values, never a hex — so the sheet can be handed
   over complete. Only the `default` state is covered: hover, pressed, disabled
   and loading belong to the Button component and are driven at screen level.
   Replace both the moment Button and Link are built.
   ================================================================ */

/** Size lg, the only size the sheet uses: 328 x 48 inside the 16 side padding. */
function SheetButton({
  variant,
  label,
  onClick,
}: {
  variant: 'filled' | 'outline'
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      /* The outline stroke is an inset shadow, not a border. Figma draws its
         1.5 stroke *inside* the frame, so the button stays 328 x 48; a CSS
         border would add 3 to the height and take 3 off the width, which then
         pushes the whole sheet 4 past the 428 the spec states. */
      className={`w-full cursor-pointer rounded-pill px-[24px] py-[12px] text-lg leading-lg font-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
        variant === 'filled'
          ? 'bg-button-primary-filled-bg text-button-primary-filled-text'
          : 'bg-button-primary-outline-bg text-button-primary-outline-text shadow-[inset_0_0_0_1.5px_var(--color-button-primary-outline-border)]'
      }`}
    >
      {label}
    </button>
  )
}

/* Link · Size sm · Colour Primary. The underline carries the affordance
   alongside the colour, which is why it is not decoration here. */
function StepLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-[4px] text-md leading-md font-medium text-link-primary-default underline decoration-solid outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      {label}
      <ChevronRightIcon className="block size-[16px]" />
    </a>
  )
}

/* ================================================================
   StepItem
   ================================================================ */

export function StepItem({
  title,
  description,
  number,
  link,
  className = '',
}: {
  /** One line. Let the description carry the detail. */
  title: string
  /** Wraps freely — which is why the container must keep hugging. */
  description: string
  /** Decorative: the reading order carries the sequence, not the digit. Let the
   *  parent own it so the list stays consecutive when a step is added. */
  number?: number
  link?: { label: string; href: string }
  className?: string
}) {
  return (
    /* Fills the slot; height always hugs. Figma says 328 fixed, but that is
       360 minus the slot's sp-16 either side — it is the reference width, not
       an independent measurement, and a card that stayed 328 inside a
       full-width sheet would sit short of the right-hand padding.

       No illustration slot: dropped by team decision. Figma still carries it —
       an 80 x 80 SLOT with 93 preferred values, defaulting to
       Illustration/Send — so the file and this component now disagree until the
       slot comes out of Figma too. Recorded on the component page.

       The root gap is sp-08 — the guidance text still calls it an unbound 10,
       but the component binds sp-08 and measures 166 tall at 328 wide, against
       the 254 the guidance states for a card with the illustration in. */
    <div
      className={`flex w-full flex-col items-start gap-sp-08 rounded-12 bg-stepitem-card-bg p-sp-12 ${className}`}
    >
      {number !== undefined ? (
        /* 48/56 is Heading/3xl, which DESIGN.md §11.8 records as unbound: the
           Typescale stops at font-size/6xl 40 and line-height/5xl 48, so there
           is no utility for either value. Arbitrary values here are the honest
           transcription, not a shortcut. */
        <div
          aria-hidden
          className="text-[48px] leading-[56px] font-semibold text-stepitem-number-text"
        >
          {number}
        </div>
      ) : null}

      <div className="flex w-full flex-col gap-sp-04">
        <div className="text-lg leading-title-md font-semibold text-stepitem-text-primary">
          {title}
        </div>
        <p className="text-lg leading-lg text-stepitem-text-secondary">{description}</p>
      </div>

      {link ? <StepLink label={link.label} href={link.href} /> : null}
    </div>
  )
}

/* ================================================================
   InfoSheet
   ================================================================ */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function InfoSheet({
  open,
  onClose,
  label,
  children,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  closeLabel = 'Close',
  className = '',
}: {
  open: boolean
  /** Must be honoured by the close button, the scrim and Escape alike. */
  onClose: () => void
  /** Names the dialog. The slot content is the caller's, so only the caller
   *  knows what this sheet is about — hence required rather than optional. */
  label: string
  /** The slot. Whatever goes in brings its own tokens: the sheet never
   *  recolours its payload. */
  children: ReactNode
  primaryLabel: string
  onPrimary?: () => void
  /** Omit it for a single action. An outline button with nothing to say is
   *  noise, and the sheet drops from 428 to 368. */
  secondaryLabel?: string
  onSecondary?: () => void
  closeLabel?: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  const returnFocusTo = useRef<HTMLElement | null>(null)
  const scrollArea = useRef<HTMLDivElement>(null)
  /* `overflowing` drives the tab stop, `scrolled` drives the top fade. They are
     separate because a sheet can be scrollable while still at the top. */
  const [overflowing, setOverflowing] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const syncScroll = useCallback(() => {
    const el = scrollArea.current
    if (!el) return
    /* 1px of slack: sub-pixel layout rounding otherwise reports a permanent
       overflow of a fraction of a pixel on a sheet that plainly fits. */
    setOverflowing(el.scrollHeight - el.clientHeight > 1)
    setScrolled(el.scrollTop > 1)
  }, [])

  /* Re-measured on open and on resize, not just on scroll: whether the sheet
     overflows depends on the slot the caller filled and on how much room the
     screen has, and neither is known until it is on screen. */
  useEffect(() => {
    if (!open) return
    syncScroll()
    window.addEventListener('resize', syncScroll)
    return () => window.removeEventListener('resize', syncScroll)
  }, [open, children, syncScroll])

  /* The panel decelerates in and accelerates out. A symmetric ease-in-out —
     which is what this had — is what made the entrance read as sluggish: it
     spends its opening frames barely moving, so the sheet looks like it
     hesitates before committing. A sheet that arrives should settle, and one
     that leaves should get out of the way.

     Reduce Motion snaps both directions rather than merely shortening them,
     the same contract NavigationBar states. */
  const decelerate = [0, 0, 0.2, 1] as const
  const accelerate = [0.4, 0, 1, 1] as const

  const panelMotion = {
    hidden: { y: '100%', transition: reduceMotion ? { duration: 0 } : { duration: 0.2, ease: accelerate } },
    visible: { y: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.34, ease: decelerate } },
  }
  const fade = reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }

  /* Focus moves into the sheet on open and returns to whatever opened it on
     close. Without the return, a keyboard user who dismisses the sheet is
     dropped at the top of the document.

     `preventScroll` because a plain focus() asks the browser to scroll the
     target into view, and on open the panel is still translated a full
     sheet-height below the fold — so the page would jump to chase something
     that is about to arrive on its own. */
  useEffect(() => {
    if (!open) return
    returnFocusTo.current = document.activeElement as HTMLElement | null
    panel.current?.focus({ preventScroll: true })
    return () => returnFocusTo.current?.focus({ preventScroll: true })
  }, [open])

  /* Escape is bound on the document rather than the panel: it has to work even
     if focus has drifted outside, which is exactly the case where a user most
     needs a way out. */
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  /* The trap is a Tab cycle over the panel's own focusables. It stays on the
     panel instead of the document so the rest of the page keeps working
     normally the moment the sheet closes. */
  function trapTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab' || !panel.current) return
    const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === panel.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        /* Absolute rather than fixed so the sheet can be demonstrated inside a
           device frame. In the product this is a portal to the root, and the
           only change is absolute becoming fixed.

           No z-index on purpose: stacking belongs to whatever mounts the sheet.
           A portal at the document root needs none, and forcing one here would
           paint the sheet over the platform's own status bar and home
           indicator, which stay above a bottom sheet on both platforms. */
        <div
          /* overflow-hidden is load-bearing, not tidiness. While the panel is
             translated a full sheet-height down it sticks out below this box,
             and a transformed element still counts towards its scroll
             container's scrollable overflow. The container compensates for the
             growing overflow by shifting its contents by the same amount, which
             cancels the slide exactly: the sheet ends up pinned in place while
             everything around it moves. Clipping to the viewport keeps the
             translated panel out of the overflow calculation entirely. */
          className={`absolute inset-0 flex items-end justify-center overflow-clip ${className}`}
        >
          {/* Tapping the scrim closes the sheet — the accessibility guidance is
              explicit that dismissal must not depend on the close button. */}
          <motion.button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={onClose}
            /* surface/overlay is the Foundations token for modals, drawers and
               sheets. DESIGN.md §11.5 flags it: in Light it resolves to
               #1D2939, the same value as card-sunken and inverse. A dark
               neutral is right for a scrim, so it is used as published — the
               shared value is a Foundations gap, not a reason to invent one. */
            className="absolute inset-0 cursor-pointer bg-surface-overlay/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          />

          {/* The transform lives on the panel itself, never on a wrapper around
              it — the rule the glass navigation bar is built on, kept here so
              the pattern stays consistent if a blurred surface is ever added. */}
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={trapTab}
            /* Bottom corners stay square: the sheet is anchored to the screen
               edge. No side or bottom padding — the children own the 16, so
               sheet/bg stays the single source of truth for the surface.

               sheet/border is an inset shadow for the same reason as the
               outline button: Figma's stroke is inside the frame, so the
               content box stays a full 360 and the buttons come out at 328. A
               real border would also shift the absolutely positioned close
               button by 1, because absolute offsets resolve against the
               padding box — that is what put it at 17/25 instead of 16/24.

               Full width, not the 360 Figma draws. 360 is the reference screen
               width, not a component width: a bottom sheet spans the viewport
               edge to edge, and what the file actually specifies is the sp-16
               of side padding its children carry. Stranding a 360 sheet in the
               middle of a 402 or 412 point screen would leave a gutter of page
               showing down both sides. Same reading as NavigationBar.

               The height still hugs, but it is capped at 90% of the screen so
               a long slot scrolls instead of growing past the viewport. The
               remaining 10% keeps a strip of scrim visible, which is what tells
               the user there is a screen behind this and that tapping it will
               dismiss. Figma has no cap because its slot is a fixed placeholder.

               overflow-clip, not overflow-hidden: `hidden` would make the panel
               a scroll container too, and a bottom sheet with two nested
               scrollers is how you get a scroll that fights itself. */
            className="relative flex max-h-[90%] w-full flex-col items-center gap-sp-16 overflow-clip rounded-t-20 bg-sheet-bg pt-sp-24 shadow-[inset_0_0_0_1px_var(--color-sheet-border)] outline-none"
            variants={panelMotion}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* The scroll region: the reserved close strip and the slot
                together. It carries the panel's gap-sp-16 between the two, so
                the 24 / 48 / 16 / slot rhythm Figma specifies is unchanged
                while the sheet still hugs.

                `min-h-0` is what lets it shrink: a flex child will not go below
                its content height without it, so the panel would blow past its
                cap instead of scrolling. Actions stay `shrink-0` so the buttons
                never get squeezed — the content yields, not the affordances.

                Only a tab stop when it actually overflows. A region that cannot
                scroll should not cost a keyboard user a stop, and one that can
                must be reachable, or its content is unreachable without a
                pointer (SC 2.1.1). Deliberately unnamed: the only name this
                component knows is the dialog's, and reusing it here would have
                a screen reader announce the same string twice. Naming the
                region is the caller's job if the content warrants it. */}
            <div
              ref={scrollArea}
              onScroll={syncScroll}
              tabIndex={overflowing ? 0 : -1}
              className="sheet-scroll flex w-full min-h-0 flex-col gap-sp-16 overflow-y-auto"
            >
              {/* Reserved strip. It holds nothing — it clears room for the
                  floating close button so the slot never collides with it.
                  Inside the scroll region rather than above it, so content
                  travels up behind the button instead of stopping short. */}
              <div className="h-[48px] w-full shrink-0" />

              <div className="flex w-full flex-col gap-sp-12 px-sp-16">{children}</div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-sp-12 px-sp-16 py-sp-24">
              <SheetButton variant="filled" label={primaryLabel} onClick={onPrimary} />
              {secondaryLabel ? (
                <SheetButton variant="outline" label={secondaryLabel} onClick={onSecondary} />
              ) : null}
            </div>

            {/* Scroll fade. Content passing under the floating close button has
                to go somewhere, and a hard cut at the panel edge reads as a
                clipping bug rather than as more content above. Only shown once
                there is something above to fade — a permanent gradient over a
                sheet that does not scroll is just a smudge.

                The gradient itself lives in `.sheet-fade` in index.css: it
                holds opaque for its first third and then eases off, because a
                plain two-stop ramp between two colours this close together is
                almost invisible. Same reason the glass navigation bar keeps its
                specular edge in CSS rather than in a utility. */}
            <motion.div
              aria-hidden
              className="sheet-fade pointer-events-none absolute top-0 left-0 h-[112px] w-full"
              initial={false}
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={fade}
            />

            {/* Named HomeIndicator in Figma, but it sits at the top of the sheet
                and reads as a grab handle. Decorative: the sheet is dismissed
                by the close button, the scrim or Escape, not by dragging this.
                Drawn after the fade so the bar stays crisp over it. */}
            <div
              aria-hidden
              className="absolute top-0 left-0 h-[21px] w-full bg-home-indicator-bg"
            >
              <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[58px] -translate-x-1/2 rounded-pill bg-home-indicator-bar" />
            </div>

            {/* Floating: absolute against the panel, not the scroll region, so
                it stays put while the content runs under it. 48 x 48 clears the
                44 minimum of SC 2.5.5 comfortably. Figma pins it at 15/23 to
                overlap the 1px stroke; measured from the border box those are
                the sp-16 and sp-24 the spec states. */}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute top-sp-24 right-sp-16 flex size-[48px] cursor-pointer items-center justify-center rounded-pill bg-close-bg text-close-icon outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <CloseIcon className="block size-[24px]" />
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
