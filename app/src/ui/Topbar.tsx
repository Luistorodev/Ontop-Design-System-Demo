import { ArrowLeftIcon, Menu04Icon } from '../icons/topbar'

/* Topbar — 02 - Worker Design System, node 12792:21495.

   The screen's top chrome: back, title with an optional qualifier, and a
   trailing action.

   Figma carries four variants, Mood x State. Mood is not modelled as a prop
   here: Light and Dark resolve the same three tokens (text/primary for the
   title and both icons, text/tertiary for the subtitle, topbar/surface for the
   bar), so the hub's own [data-theme] switch reproduces both moods with one
   component. What is left is State, which is a real behaviour rather than a
   theme — see the `state` prop.

   The variant frames are 360 x 100, but 44 of that is the status bar, which
   this hub deliberately does not build: the component is the 360 x 56 "Top bar"
   frame inside it. */

export function Topbar({
  title = 'Aura AI',
  subtitle = 'Beta',
  state = 'default',
  onBack,
  onMenu,
  backLabel = 'Back',
  menuLabel = 'Menu',
  className = '',
}: {
  /** Title/md/semibold. Defaults to the string the Figma node draws. */
  title?: string
  /** The qualifier sitting on the title's baseline — "Beta" in the file.
   *  Body/md/regular, and a step down the text ramp, so it reads as a note on
   *  the title rather than as a second title. */
  subtitle?: string
  /** `scroll` adds the fade that lets content pass under the bar. It is a
   *  state of the bar, not of the page: the caller flips it from its own
   *  scroll position — the bar does not listen to anything. */
  state?: 'default' | 'scroll'
  onBack?: () => void
  onMenu?: () => void
  /** Localised. Both actions are icon-only, so these are the only names they
   *  have; they are not decorative. */
  backLabel?: string
  menuLabel?: string
  className?: string
}) {
  return (
    /* Figma draws this 360 wide, but 360 is the reference screen width, not a
       fixed component width — what is specified is the 16 of side padding.
       Filling the container keeps those margins right on a wider device
       instead of stranding a 360 bar in the middle. Same call as
       NavigationBar. */
    <header className={`relative w-full bg-topbar-surface ${className}`}>
      {/* The fade is the first child so it paints over the bar's own
          background and under its content, which is the order Figma stacks
          them in. It overflows the 56 of bar height on purpose — that overhang
          below the bar is the whole point, and nothing here may clip it. */}
      {state === 'scroll' ? (
        <div aria-hidden className="topbar-fade pointer-events-none absolute inset-x-0 top-0 h-[174px]" />
      ) : null}

      {/* 12 + 32 + 12 = the 56 the Figma frame reports. The height is composed
          from the padding rather than set, so a taller action can never be
          silently cropped. */}
      <div className="relative flex items-center justify-center gap-sp-08 px-sp-16 py-sp-12">
        {/* Both action frames are 32 x 32 in Figma with 8 of padding and a 24
            icon inside — 8 + 24 + 8 is 40, so the icon overflows its own
            padding box and Figma centres it, landing at (4,4). Centring a
            shrink-0 24 box inside a border-box 32 reproduces exactly that, and
            keeps the declared padding visible in the code rather than quietly
            rewriting it to 4.
            The vertical 8 is a raw value in Figma, not sp-08; only the
            horizontal one is bound. */}
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center px-sp-08 py-[8px] text-text-primary outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <span className="flex size-[24px] shrink-0 items-center justify-center">
            <ArrowLeftIcon />
          </span>
        </button>

        <div className="flex min-w-px flex-[1_0_0] items-center gap-sp-08">
          {/* items-end, not baseline: Figma bottom-aligns the two boxes, and
              their 22 and 20 line boxes both end at 22. Baseline alignment
              would shift "Beta" down by the 2px difference in descender room. */}
          <div className="flex shrink-0 items-end gap-sp-04 whitespace-nowrap">
            <p className="text-xl leading-title-md font-semibold text-text-primary">{title}</p>
            {subtitle ? <p className="text-md leading-md text-text-tertiary">{subtitle}</p> : null}
          </div>
        </div>

        {/* Named "Left" in Figma although it sits on the right — the layer name
            is kept out of the code rather than propagated. */}
        <button
          type="button"
          onClick={onMenu}
          aria-label={menuLabel}
          className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center px-sp-08 py-[8px] text-text-primary outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <span className="flex size-[24px] shrink-0 items-center justify-center">
            <Menu04Icon />
          </span>
        </button>
      </div>
    </header>
  )
}
