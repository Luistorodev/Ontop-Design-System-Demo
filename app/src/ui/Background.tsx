import type { ReactNode } from 'react'
import { BlobArt } from '../icons/background'

/* Background — 02 - Worker Design System, node 12986:9473.

   The surface Aura's screens sit on: general/surface-white and an optional
   blurred purple-and-blue glow rising from the bottom edge.

   Figma binds the frame's width and height to the Breakpoints collection
   (360 x 800, 390 x 844, 744 x 1133). Those are the screens it is drawn for,
   not a size the component owns, so it fills its container and the caller
   supplies the breakpoint. No radius: the screen's corners are the device's.

   The HomeIndicator instance in the file is a reference for the space to keep
   clear, not something to draw — the operating system draws its own. So the
   bar is not rendered; its 20 strip becomes the bottom padding of the content,
   or the device's real inset where that is larger (34 on a Face ID iPhone).

   The one Figma property is Blob (boolean, default true). */

export function Background({
  blob = true,
  children,
  className = '',
}: {
  /** The glow at the bottom edge. */
  blob?: boolean
  /** The screen's content, painted over the glow and kept clear of the
   *  reserved bottom strip. */
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`relative size-full overflow-clip bg-general-surface-white ${className}`}>
      {blob ? (
        /* Figma pins the Blob group to the bottom edge and to the horizontal
           centre, 4 right of it, so that is how the export is anchored too —
           on the 390 and 744 breakpoints the glow stays at the bottom and
           centred rather than drifting. From the 360 x 800 frame: the group
           sits at left -114, 130 past the bottom; the export's canvas starts
           400 before it on the left and 400 above it, which is 694 left of
           centre and 530 past the bottom edge. */
        <BlobArt className="pointer-events-none absolute bottom-[-530px] left-[calc(50%-694px)] max-w-none" />
      ) : null}

      {children ? (
        <div className="relative size-full pb-[max(20px,env(safe-area-inset-bottom))]">
          {children}
        </div>
      ) : null}
    </div>
  )
}
