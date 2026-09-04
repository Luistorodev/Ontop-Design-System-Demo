import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useId, useRef, useState, type ComponentType, type KeyboardEvent } from 'react'

/* Navigation-Bar / Floating — 02 - Worker Design System, node 12253:10731.

   Primary bottom navigation for the Worker app. Icon-only, liquid glass.

   One component driven by a selected index. Figma carries five variants so a
   designer can show any destination active; they are not five components. */

export type NavItem = {
  /** Stable route key. */
  id: string
  /** 24x24 outline icon from Foundations. One icon per destination,
   *  product-wide — never reuse one that means something else elsewhere. */
  icon: ComponentType<{ className?: string }>
  /** Localised. With no label in the UI, this is the only name the
   *  destination has, so it is required rather than optional: an item without
   *  one is an unreachable destination, not a cosmetic omission. */
  accessibilityLabel: string
}

/** Two to five entries. Five is a hard ceiling, so it is enforced by the type
 *  rather than left to a runtime check nobody reads. */
export type NavItems =
  | readonly [NavItem, NavItem]
  | readonly [NavItem, NavItem, NavItem]
  | readonly [NavItem, NavItem, NavItem, NavItem]
  | readonly [NavItem, NavItem, NavItem, NavItem, NavItem]

export function NavigationBarFloating({
  items,
  selectedIndex,
  onSelect,
  surface = 'glass',
  visible = true,
  label = 'Primary',
  className = '',
}: {
  items: NavItems
  /** Zero-based. Must always point at a real item. */
  selectedIndex: number
  /** Fires on tap release, not on press down. */
  onSelect: (index: number) => void
  /** Glass is the default. Opaque is the mandatory fallback wherever backdrop
   *  blur is unavailable — CSS also degrades automatically for reduced
   *  transparency and for browsers without backdrop-filter. */
  surface?: 'glass' | 'opaque'
  /** Only used if hide-on-scroll is enabled. */
  visible?: boolean
  /** Names the landmark, not the tabs. */
  label?: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [pressed, setPressed] = useState<number | null>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  /* The indicator is a single element that travels between items, so its
     layoutId has to be unique per bar — a documentation page renders several
     bars at once, and a shared id would make them animate into each other. */
  const indicatorId = `${useId()}-indicator`

  /* Reduce Motion turns the indicator movement and the hide-on-scroll
     animation off. Both snap — they do not merely go faster. */
  const ease = [0.4, 0, 0.2, 1] as const
  const pill = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 520, damping: 40, mass: 0.9 }
  const fade = reduceMotion ? { duration: 0 } : { duration: 0.15, ease }
  const slide = reduceMotion ? { duration: 0 } : { duration: 0.25, ease }

  /* role="tablist" carries a keyboard contract on the web even though the
     component is touch-only in the product: one tab stop, arrows to move. */
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1
    let next: number | null = null
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    tabs.current[next]?.focus()
    onSelect(next)
  }

  return (
    <nav
      aria-label={label}
      /* Figma draws this 360 x 82, but 360 is the reference screen width, not
         a fixed component width: what is actually specified is the 16 of side
         margin. Filling the container keeps those margins correct on a 402 or
         412 point device instead of stranding a 360 bar in the middle.
         The bottom 8 is unbound in Figma — a raw value there, not sp-08. */
      className={`w-full px-sp-16 pt-sp-08 pb-[8px] ${className}`}
    >
      {/* The hide-on-scroll transform lives on the glass panel itself, never
          on a wrapper around it. An ancestor carrying a transform or an
          opacity starts a new backdrop root, and backdrop-filter then samples
          only what is inside that ancestor — which for this bar is nothing, so
          the blur silently renders as a flat tint with no glass at all. */}
      <motion.div
        role="tablist"
        aria-label={label}
        className={`relative flex items-center rounded-pill p-sp-08 ${
          surface === 'glass'
            ? 'nav-glass nav-glass-edge bg-nav-glass-tint backdrop-blur-[16px]'
            : 'border border-nav-border bg-nav-bg'
        }`}
        initial={false}
        animate={{ y: visible ? 0 : 110, opacity: visible ? 1 : 0 }}
        transition={slide}
        style={{
          /* Elevation/Glass-nav: a soft ambient shadow, softer and wider than
             the opaque version. Figma's BACKGROUND_BLUR radius is 32; its own
             code generation converts that to CSS blur(16px), which is the
             value that reproduces the file's render. */
          boxShadow: surface === 'glass' ? '0 8px 24px -4px rgb(16 24 40 / 0.2)' : undefined,
        }}
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex
          const isPressed = pressed === index
          const Icon = item.icon
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[index] = el
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={item.accessibilityLabel}
              /* Announced as "n of 5, selected" rather than leaving the
                 screen reader to infer position. */
              aria-posinset={index + 1}
              aria-setsize={items.length}
              /* Roving tab stop: the tablist is one stop, arrows move within. */
              tabIndex={selected ? 0 : -1}
              onKeyDown={(event) => onKeyDown(event, index)}
              /* Pressed paints on pointer down; selection commits on release,
                 which is what onClick already means — and a drag off the item
                 correctly commits nothing. */
              onPointerDown={() => setPressed(index)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onPointerCancel={() => setPressed(null)}
              onBlur={() => setPressed(null)}
              onClick={() => onSelect(index)}
              /* Only the selected item carries the 64 minimum, exactly as the
                 Figma component does. Putting it on all five overflows the
                 container at five destinations — 5x64 is 320 against 312 of
                 inner width — and the overflow eats the right-hand padding,
                 so the bar looks lopsided. */
              className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-32 outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-border-focus ${
                selected ? 'min-w-[64px]' : 'min-w-px'
              }`}
            >
              {/* One indicator for the whole bar, not one per item: it is the
                  same element moving, which is what makes the selection read
                  as travel rather than as two things blinking. */}
              {selected ? (
                <motion.span
                  aria-hidden
                  layoutId={indicatorId}
                  className="absolute inset-0 rounded-32 bg-nav-indicator-bg"
                  transition={pill}
                />
              ) : null}

              {/* Pressed sits on top and is neutral on purpose, so a press
                  never reads as a completed navigation. */}
              <AnimatePresence>
                {isPressed ? (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-32 bg-nav-indicator-pressed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                  />
                ) : null}
              </AnimatePresence>

              <span className="relative p-sp-12">
                <Icon
                  className={`block size-[24px] ${
                    reduceMotion ? '' : 'transition-colors duration-200'
                  } ${
                    isPressed
                      ? 'text-nav-icon-pressed'
                      : selected
                        ? 'text-nav-icon-selected'
                        : 'text-nav-icon-default'
                  }`}
                />
              </span>
            </button>
          )
        })}
      </motion.div>
    </nav>
  )
}
