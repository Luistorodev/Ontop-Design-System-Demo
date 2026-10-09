/* Banner icon.

   Exported from Figma (02 - Worker Design System, Banner node 13203:8052 —
   the "placeholder" component the Info, Error, Warning and Success variants
   carry in their icon slot) and transformed in one way only: the baked fill
   is swapped for currentColor, so it takes the banner type's colour. No path
   data was authored here.

   It is a placeholder in the file too: a ring, not a meaningful icon.
   Flagged on the Composer page until Figma puts real icons in the slot.

   Generated from app/public/figma/banner-placeholder.svg. */

export function BannerPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM0.833333 10C0.833333 4.93739 4.93739 0.833333 10 0.833333C15.0626 0.833333 19.1667 4.93739 19.1667 10C19.1667 15.0626 15.0626 19.1667 10 19.1667C4.93739 19.1667 0.833333 15.0626 0.833333 10Z" fill="currentColor" />
    </svg>
  )
}
