import { useId } from 'react'

/* Background blob.

   Exported from Figma (02 - Worker Design System, Background node 12986:9473,
   group 12986:9468) and transformed in two ways only: the baked fills are
   swapped for the two Aura · General tokens the ellipses bind
   (Blob azul, Blob Purple), and the filter ids go through useId so two
   Backgrounds on one page cannot collide. Geometry, blur and the group's 70%
   opacity are the export's. No shape was authored here.

   Inline rather than an <img>, because an image cannot read the page's custom
   properties — this way the glow follows the tokens if they ever move.

   Generated from app/public/figma/background-blob.svg. */

export function BlobArt({ className }: { className?: string }) {
  // useId returns characters (":" or "«»") that are awkward inside url(#…).
  const id = `blob${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const blue = `${id}-blue`
  const purple = `${id}-purple`
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      width="1296"
      height="1172"
      viewBox="0 0 1296 1172"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.7">
        <g filter={`url(#${blue})`}>
          <circle cx="856" cy="586" r="140" fill="var(--color-general-blob-azul)" />
        </g>
        <g filter={`url(#${purple})`}>
          <circle cx="586" cy="586" r="186" fill="var(--color-general-blob-purple)" />
        </g>
      </g>
      <defs>
        <filter id={blue} x="416" y="146" width="880" height="880" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur" />
        </filter>
        <filter id={purple} x="0" y="0" width="1172" height="1172" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  )
}
