/* InfoSheet icons.

   Exported from Figma (02 - Worker Design System, InfoSheet) and transformed
   only in one way: the baked fill is swapped for `currentColor` so the glyph
   can resolve close/icon and link/primary/default from the token layer. No
   path data was authored here.

   Generated from app/public/figma/info-sheet-close.svg and
   app/public/figma/link-chevron-right.svg. */

type IconProps = { className?: string }

/* Illustration/Send, node 12497:17648 — the default payload of the StepItem
   illustration slot.

   The only raster asset in the repo. Figma exports it as a 1024 PNG, not a
   vector, so it cannot be transcribed the way the glyphs above are: it stays a
   file and is served from public/. Both dimensions are set explicitly, because
   an `auto` here would paint the image at its intrinsic 1024. It is decorative
   — the step title and description carry the meaning — so the alt is empty. */
export function SendIllustration({ className }: IconProps) {
  return (
    <img
      src="/figma/illustration-send.png"
      alt=""
      width={80}
      height={80}
      /* Figma exports this at 1024 for an 80 slot — a 13x oversample. The file
         is kept exactly as exported, because a re-drawn or re-sampled asset
         stops being traceable to the source, but the decode is pushed off the
         main thread: without this it lands on the same frame that starts the
         sheet's slide and the first frames of the animation drop. */
      decoding="async"
      className={className ?? 'size-[80px]'}
    />
  )
}

/** Close-button glyph, node 12511:34980. Figma bakes #667085 — close/icon in
 *  Light — into the export; it is swapped for currentColor so Dark resolves. */
export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g id="Close Button Icon">
      <path id="Icon" fillRule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="currentColor"/>
      </g>
    </svg>
  )
}

/* The trailing glyph of the Link inside StepItem. The Figma layer is named
   `link-external-02`, but the vector it actually exports is a chevron — the
   layer name is wrong, not the glyph, so the component is named after what it
   draws and the file keeps the shape it really is. */
export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g id="chevron-right">
      <path id="Icon" fillRule="evenodd" clipRule="evenodd" d="M5.5286 3.5286C5.78895 3.26825 6.21106 3.26825 6.4714 3.5286L10.4714 7.5286C10.7318 7.78895 10.7318 8.21106 10.4714 8.4714L6.4714 12.4714C6.21106 12.7318 5.78895 12.7318 5.5286 12.4714C5.26825 12.2111 5.26825 11.7889 5.5286 11.5286L9.05719 8L5.5286 4.4714C5.26825 4.21106 5.26825 3.78895 5.5286 3.5286Z" fill="currentColor"/>
      </g>
    </svg>
  )
}
