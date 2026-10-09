import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { LogoHero } from './LogoHero'
import { STAR_PATH } from '../icons/logo-hero'
import { TagCloseIcon } from '../icons/composer'

/* Floating button — the Aura FAB.

   The way into Aura from anywhere in the Worker app. Built from the "Ontop
   Walkthroughs" Claude Design prompt, which the team made the source over
   the Figma component Floating (13149:3819) on 2026-10-08: the file still
   draws a 56 indigo-900 disc with four rings; this is a 52 #6A3FE0 orb with
   the Logo hero inside.

   - Orb: the Logo hero (the prompt's AuraOrb comes from the same canvas),
     dark, scaled so the star is 32 and clipped to the 52 circle. It plays the
     intro on mount, then idles. The prompt's FAB overrides live in index.css.
   - Entry: scales in from 0.4 with a slight overshoot.
   - Drag: past a 5 threshold the button follows the pointer inside its
     positioned parent (8 margin, 52 clear at the top for the status bar).
     The position survives remounts. A drag never opens Aura.
   - Nudge: the hint above the button — Figma's Nudge (13302:8980), part of
     Floating since 2026-10-09 behind its Nudge boolean. Its caret points at
     the orb, and it moves with the button when dragged.
   - First time (`intro`): six sparkles burst from the button and the Nudge
     shows, then fades on its own after 3s.

   It positions itself: render it inside the screen's positioned container. */

type Point = { x: number; y: number }

/* Where the user left it, across screens — the prompt's window.__auraFabPos,
   kept in the module instead of on window. */
let savedPos: Point = { x: 0, y: 0 }

const SPARKS: Point[] = [
  { x: -36, y: -26 },
  { x: 30, y: -40 },
  { x: -24, y: 26 },
  { x: 40, y: 10 },
  { x: 8, y: -48 },
  { x: -46, y: -2 },
]

const SIZE = 52
const DRAG_THRESHOLD = 5
const EDGE = 8
const TOP_CLEAR = 52
/* The star in the Logo hero is 76; the prompt's FAB logo is 32. */
const ORB_SCALE = 32 / 76

export function FloatingButton({
  onOpen,
  intro = false,
  right = 16,
  bottom = 101,
  label = 'Aura',
  nudge = false,
  nudgeText = 'Need a hand? ',
  nudgeHighlight = 'Ask Aura.',
  closeNudgeLabel = 'Dismiss',
  persist = true,
}: {
  /** Fires on a tap — never at the end of a drag. */
  onOpen?: () => void
  /** The first-time sparkles, with the Nudge fading on its own after 3s. */
  intro?: boolean
  /** Resting place inside the parent. The prompt's 16 / 101 sit on a 106
   *  navigation bar; pass what clears yours. */
  right?: number
  bottom?: number
  /** The accessible name. */
  label?: string
  /** Figma's Nudge boolean: shows the hint until it is closed. */
  nudge?: boolean
  /** The hint, in two runs: plain, then highlighted. It grows to 260 wide,
   *  then wraps onto more lines. */
  nudgeText?: string
  nudgeHighlight?: string
  closeNudgeLabel?: string
  /** Keep the dragged position across mounts. Off for a specimen. */
  persist?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<Point>(persist ? savedPos : { x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const gesture = useRef<{ id: number; start: Point; from: Point; moved: boolean } | null>(null)
  const dragged = useRef(false)

  const [tip, setTip] = useState<'shown' | 'fading' | 'gone'>(intro || nudge ? 'shown' : 'gone')
  useEffect(() => {
    if (!intro) return
    const fade = window.setTimeout(() => setTip((t) => (t === 'shown' ? 'fading' : t)), 3000)
    const gone = window.setTimeout(() => setTip('gone'), 3450)
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(gone)
    }
  }, [intro])

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    // Capture keeps the drag alive when the pointer outruns the button. It
    // can throw for a pointer the browser no longer tracks; the drag still
    // works without it.
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* not capturable */
    }
    gesture.current = { id: event.pointerId, start: { x: event.clientX, y: event.clientY }, from: pos, moved: false }
    dragged.current = false
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const g = gesture.current
    const el = ref.current
    if (!g || g.id !== event.pointerId || !el?.offsetParent) return
    const dx = event.clientX - g.start.x
    const dy = event.clientY - g.start.y
    if (!g.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      g.moved = true
      dragged.current = true
      setDragging(true)
    }
    /* Clamp against the parent, from the button's untranslated box. */
    const parent = el.offsetParent as HTMLElement
    const baseLeft = parent.clientWidth - right - SIZE
    const baseTop = parent.clientHeight - bottom - SIZE
    const x = Math.min(Math.max(g.from.x + dx, EDGE - baseLeft), parent.clientWidth - EDGE - SIZE - baseLeft)
    const y = Math.min(Math.max(g.from.y + dy, TOP_CLEAR - baseTop), parent.clientHeight - EDGE - SIZE - baseTop)
    if (persist) savedPos = { x, y }
    setPos({ x, y })
  }

  const endGesture = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (gesture.current?.id !== event.pointerId) return
    gesture.current = null
    setDragging(false)
  }

  return (
    /* The anchor carries the resting place and the drag; the button inside
       keeps transform for its entry, and the Nudge rides along. */
    <div
      ref={ref}
      className={`aura-fab-anchor absolute z-[50] size-[52px] ${dragging ? 'is-dragging' : ''}`}
      style={{ right, bottom, translate: `${pos.x}px ${pos.y}px` }}
    >
      {tip !== 'gone' ? (
        <Nudge
          text={nudgeText}
          highlight={nudgeHighlight}
          closeLabel={closeNudgeLabel}
          onClose={() => setTip('gone')}
          fading={tip === 'fading'}
        />
      ) : null}

      <button
        type="button"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onClick={() => {
          // The click that ends a drag is not a tap.
          if (dragged.current) {
            dragged.current = false
            return
          }
          onOpen?.()
        }}
        className={`aura-fab relative size-[52px] cursor-grab touch-none rounded-pill border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 active:scale-[0.94] ${
          dragging ? 'cursor-grabbing' : ''
        }`}
      >
        <span data-theme="dark" className="aura-fab-orb absolute inset-0 overflow-clip rounded-pill">
          <span
            className="absolute top-1/2 left-1/2 size-[140px]"
            style={{ transform: `translate(-50%, -50%) scale(${ORB_SCALE})` }}
          >
            <LogoHero mode="intro" />
          </span>
        </span>

        {/* Sparkles: the Aura star at 14, purple-500, bursting outwards. */}
        {intro
          ? SPARKS.map((s, i) => (
              <svg
                key={i}
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 76 76"
                className="aura-fab-sparkle pointer-events-none absolute top-1/2 left-1/2 -mt-[7px] -ml-[7px]"
                style={
                  {
                    '--sx': `${s.x}px`,
                    '--sy': `${s.y}px`,
                    animationDelay: `${0.12 + 0.06 * i}s`,
                  } as CSSProperties
                }
              >
                <path d={STAR_PATH} fill="currentColor" />
              </svg>
            ))
          : null}
      </button>
    </div>
  )
}

/* ================================================================
   Nudge — Figma 13302:8980, inside Floating
   ================================================================ */

/* The caret's 16 square, as Figma places it: rotated and sheared by this
   matrix about its top corner, which sits 28.5 from the Nudge's right edge
   and 13 above the card's bottom. The card hides its upper half, so 7 shows
   below the card, however tall the card grows. 28.5 from the right is the 56 orb's centre in
   Figma; the hub's orb is 52, so the Nudge sits 2.5 past the button's edge to
   keep the caret on its centre. */
const CARET_MATRIX = 'matrix(0.7809, 0.6247, -0.7809, 0.6247, 0, 0)'

export function Nudge({
  text,
  highlight,
  closeLabel = 'Dismiss',
  onClose,
  fading = false,
  className = 'absolute right-[-2.5px] bottom-[calc(100%+12px)]',
}: {
  text: string
  highlight?: string
  closeLabel?: string
  onClose?: () => void
  /** Fade out — the first-time Nudge leaves on its own. */
  fading?: boolean
  className?: string
}) {
  return (
    /* The card + 7 of caret. As wide as its text up to 260, then the text
       wraps (max-content: an absolutely placed box would otherwise shrink to
       its 52-wide anchor). One line is 52 tall, as in the file. */
    <div
      role="status"
      className={`aura-nudge z-[53] w-max max-w-[260px] pb-[7px] ${className}`}
      style={{ opacity: fading ? 0 : undefined }}
    >
      <span
        aria-hidden
        /* Its top-left corner — the matrix origin — sits 28.5 from the right
           (right = 28.5 - 16) and 13 above the card's bottom (bottom = 7 +
           13 - 16). */
        className="aura-nudge-fill absolute right-[12.5px] bottom-[4px] size-[16px] origin-top-left"
        style={{ transform: CARET_MATRIX }}
      />
      <div className="aura-nudge-fill relative rounded-20 py-sp-16 pr-sp-24 pl-sp-16">
        {/* Left-aligned (changed in the file on 2026-10-09; it was right). */}
        <p className="text-left text-md leading-md">
          <span className="font-normal text-nudge-text">{text}</span>
          {highlight ? <span className="font-semibold text-nudge-highlight">{highlight}</span> : null}
        </p>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute top-[4px] right-[4px] flex size-[24px] cursor-pointer items-center justify-center rounded-04 p-[4px] text-nudge-icon outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <TagCloseIcon />
        </button>
      </div>
    </div>
  )
}
