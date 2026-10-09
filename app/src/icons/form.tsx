/* Form icons.

   Exported from Figma (02 - Worker Design System, [AI] Form) and transformed
   only in one way: the baked fill is swapped for `currentColor`. No path data
   was authored here. Both icons are drawn at 20 since 2026-10-08: Figma
   scaled the instances from 24 to 20 without touching the vectors, so the
   24 viewBox is kept and only the rendered size changes. The close glyph is the InfoSheet one — same path, same
   #667085 — so the Form imports CloseIcon from ./info-sheet instead.

   Generated from app/public/figma/form-chip-placeholder.svg and
   app/public/figma/form-chip-input-edit.svg. */

type IconProps = { className?: string }

/** The Chip's optional leading 20 icon, node 13302:8384 — Figma's generic
 *  `placeholder` instance, a ring. Each variant bakes its label colour into
 *  the export (#475467, #004EEB, #6643CE, white), so it follows the label
 *  through currentColor. A placeholder until the team picks real icons. */
export function ChipPlaceholderIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g id="placeholder">
      <path id="Icon" fillRule="evenodd" clipRule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z" fill="currentColor"/>
      </g>
    </svg>
  )
}

/** The Chip input's leading 20 icon, `edit-01` (node 13333:141). Figma bakes
 *  #667085 — form/icon in Light — into the export; currentColor lets Dark
 *  resolve. */
export function EditIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g id="edit-01">
      <path id="Icon" fillRule="evenodd" clipRule="evenodd" d="M16.2929 2.29289C17.788 0.797797 20.212 0.797799 21.7071 2.29289C23.2022 3.78799 23.2022 6.21201 21.7071 7.70711L8.50081 20.9134C8.48404 20.9301 8.46743 20.9468 8.45095 20.9633C8.20606 21.2086 7.99004 21.4249 7.73337 21.5942C7.50771 21.743 7.26297 21.8606 7.00581 21.9439C6.7133 22.0386 6.40939 22.0721 6.06485 22.1101C6.04168 22.1126 6.01832 22.1152 5.99477 22.1178L2.6104 22.4939C2.30848 22.5274 2.00767 22.4219 1.79287 22.2071C1.57806 21.9923 1.47254 21.6915 1.50609 21.3896L1.88213 18.0052C1.88475 17.9816 1.88732 17.9583 1.88988 17.9351C1.92788 17.5906 1.96141 17.2867 2.0561 16.9942C2.13935 16.737 2.25698 16.4923 2.40578 16.2666C2.57504 16.0099 2.79141 15.7939 3.03669 15.549C3.0532 15.5325 3.06983 15.5159 3.0866 15.4992L16.2929 2.29289ZM20.2929 3.70711C19.5788 2.99306 18.4212 2.99306 17.7071 3.7071L4.50081 16.9134C4.1783 17.2359 4.11843 17.3024 4.07544 17.3676C4.02583 17.4428 3.98663 17.5244 3.95888 17.6101C3.93482 17.6844 3.92026 17.7728 3.8699 18.2261L3.6319 20.3681L5.77391 20.1301C6.22721 20.0797 6.31553 20.0652 6.38983 20.0411C6.47555 20.0133 6.55713 19.9741 6.63235 19.9245C6.69755 19.8815 6.76409 19.8217 7.08659 19.4992L20.2929 6.29289C21.0069 5.57885 21.0069 4.42115 20.2929 3.70711Z" fill="currentColor"/>
      </g>
    </svg>
  )
}
