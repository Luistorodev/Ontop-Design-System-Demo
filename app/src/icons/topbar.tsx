/* Topbar icons.

   Exported from Figma (02 - Worker Design System, Topbar node 12792:21495)
   and transformed only in one way: the baked fill is swapped for
   `currentColor`. Both icons are bound to General/Icon in the file — Light
   resolves #344054, Dark #F9FAFB — so a single export per glyph covers both
   moods and follows the hub's theme with no second asset.
   No path data was authored here.

   The root width/height are the vectors' own sizes inside their 24x24 icon
   frame, not 24: arrow-left is 16x16 at (4,4) and menu-04 is 20x14 at (2,5),
   which is dead centre in both axes. Callers centre them in a 24 box rather
   than stretching them, so the glyph keeps the proportions Figma draws.

   Generated from app/public/figma/topbar-*.svg. */

type IconProps = { className?: string }

export function ArrowLeftIcon({ className }: IconProps) {
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
      <path id="Icon" fillRule="evenodd" clipRule="evenodd" d="M8.70711 0.292893C9.09763 0.683418 9.09763 1.31658 8.70711 1.70711L3.41421 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H3.41421L8.70711 14.2929C9.09763 14.6834 9.09763 15.3166 8.70711 15.7071C8.31658 16.0976 7.68342 16.0976 7.29289 15.7071L0.292893 8.70711C-0.0976311 8.31658 -0.0976311 7.68342 0.292893 7.29289L7.29289 0.292893C7.68342 -0.0976311 8.31658 -0.0976311 8.70711 0.292893Z" fill="currentColor"/>
    </svg>
  )
}

export function Menu04Icon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path id="Icon" fillRule="evenodd" clipRule="evenodd" d="M0 1C0 0.447715 0.447715 0 1 0H19C19.5523 0 20 0.447715 20 1C20 1.55228 19.5523 2 19 2H1C0.447715 2 0 1.55228 0 1ZM0 7C0 6.44772 0.447715 6 1 6H19C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H1C0.447715 8 0 7.55228 0 7ZM6 13C6 12.4477 6.44772 12 7 12H19C19.5523 12 20 12.4477 20 13C20 13.5523 19.5523 14 19 14H7C6.44772 14 6 13.5523 6 13Z" fill="currentColor"/>
    </svg>
  )
}
