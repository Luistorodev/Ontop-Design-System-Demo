import { useId } from 'react'

/* Logo hero art.

   Exported from Figma (02 - Worker Design System, Logo node 13153:4281,
   variant Property 1=Dark → app/public/figma/logo-dark.svg). Nothing here is
   authored:

   - The halo is the export's four blurred rings — geometry, gradient
     transforms, stops and blurs untouched. The Claude Design canvas draws the
     same rings with its own colours; by team decision Figma's are used.
     useId keeps the filter and gradient ids unique per instance.
   - The star is the Union path, 76 x 76 in both variants since 2026-10-07,
     taken from the Light export and translated by (-332, -332) so it fills
     its own 76-unit box at 1:1 — the coordinate space the canvas's draw-on
     masks and spark paths are written in.
   Figma's Light variant draws its own halo; it is not used — Light takes
     the canvas's treatment of these rings (team decision, 2026-10-07). */

/** The star outline, filling a 76 x 76 box. */
export const STAR_PATH =
  'M71.638 25.115C76.098 24.412 77.791 30.722 73.579 32.338H73.575L55.813 39.148C53.069 40.2 52.144 43.627 53.998 45.911L65.975 60.69C67.395 62.445 66.948 64.478 65.71 65.716C64.472 66.954 62.444 67.396 60.686 65.98L45.912 54.002C43.628 52.147 40.197 53.069 39.15 55.813L32.337 73.577C30.721 77.79 24.412 76.101 25.119 71.641L28.011 53.416C28.028 53.281 28.05 53.151 28.076 53.012C28.215 52.213 28.45 51.448 28.771 50.728C29.093 50.007 29.496 49.337 29.974 48.721C30.707 47.778 31.607 46.975 32.632 46.358C33.657 45.737 34.808 45.303 36.032 45.099C36.553 45.012 37.083 44.955 37.63 44.955C39.641 44.955 41.504 45.568 43.055 46.614C43.185 46.701 43.311 46.788 43.436 46.884L48.635 50.571C49.269 51.023 49.981 50.858 50.42 50.424C50.854 49.985 51.023 49.272 50.571 48.634L46.88 43.436C46.789 43.31 46.698 43.183 46.611 43.058C45.565 41.507 44.952 39.639 44.952 37.633C44.952 37.086 45.013 36.555 45.1 36.034C45.512 33.576 46.837 31.439 48.722 29.976C49.955 29.02 51.414 28.347 53.017 28.073C53.151 28.052 53.281 28.03 53.416 28.013L71.638 25.115ZM43.659 2.423C45.275 -1.79 51.584 -0.101 50.877 4.359H50.881L47.988 22.584C47.971 22.718 47.95 22.853 47.924 22.987C47.785 23.786 47.55 24.552 47.228 25.272C46.907 25.989 46.503 26.667 46.025 27.279C44.562 29.168 42.421 30.493 39.968 30.901C39.447 30.988 38.912 31.045 38.369 31.045C36.359 31.045 34.496 30.432 32.945 29.386C32.815 29.303 32.689 29.212 32.563 29.116L27.365 25.429C26.731 24.977 26.019 25.142 25.58 25.581C25.146 26.015 24.977 26.728 25.429 27.366L29.119 32.564C29.21 32.69 29.302 32.817 29.389 32.942C30.435 34.497 31.048 36.361 31.048 38.367C31.048 38.914 30.987 39.444 30.9 39.97C30.488 42.424 29.163 44.565 27.278 46.028C26.045 46.984 24.586 47.653 22.983 47.927C22.849 47.948 22.719 47.97 22.584 47.992L4.362 50.885C-0.098 51.588 -1.792 45.277 2.421 43.661L20.183 36.852C22.927 35.8 23.852 32.373 21.993 30.089L10.02 15.309C8.601 13.554 9.048 11.522 10.285 10.284C11.523 9.046 13.551 8.603 15.31 10.019L30.084 21.997C32.368 23.852 35.799 22.931 36.846 20.187L43.659 2.423Z'

/* The rings, back to front, exactly as exported. `blur` is the SVG
   stdDeviation (half Figma's layer-blur radius); `box` is the export's filter
   region. */
const RINGS = [
  {
    // Blur XXL
    r: 59, width: 22, blur: 30, box: [48.6, 260],
    gradient: 'matrix(48.6803 200 -237.665 18.7628 150.11 96.3778)',
    stops: [[0, '#906DF8'], [0.27885, '#AF1DBF'], [0.524046, '#004EEB'], [0.812511, '#AF1DBF'], [1, '#7A50F7']],
  },
  {
    // Blur XL
    r: 59, width: 22, blur: 54.3, box: [0, 357.2],
    gradient: 'matrix(47.9087 187.778 -223.548 20.1355 150.882 108.6)',
    stops: [[0, '#7A50F7'], [0.236537, '#FFBDC6'], [0.485584, '#84ADFF'], [0.745203, '#A68AFA'], [1, '#906DF8']],
  },
  {
    // Blur X
    r: 63, width: 14, blur: 15.1, box: [78.4, 200.4],
    gradient: 'matrix(91.3227 -174.815 184.333 131.353 140.299 283.415)',
    stops: [[0, '#BCA7FB'], [0.500007, '#FFBDC6'], [0.961552, '#155EEF']],
  },
  {
    // Blur M — the only ring with partly transparent stops, and stroke at 90%
    r: 70, width: 7, blur: 5.35, box: [94.4, 168.4], strokeOpacity: 0.9,
    gradient: 'matrix(133.965 -161.852 162.025 176.151 107.091 251.193)',
    stops: [[0.0444872, '#FFFFFF'], [0.361802, '#FFE9D8', 0], [0.696713, '#CAEAFF', 0.33], [1, '#FFBDC6']],
  },
] as const

/** The halo, 357.2 square. `rings` takes the first n rings — the canvas's
 *  counter-rotating second layer draws only the three outer blurs. */
export function HaloArt({ rings = 4, className }: { rings?: number; className?: string }) {
  const id = `halo${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      width="357.2"
      height="357.2"
      viewBox="0 0 357.2 357.2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {RINGS.slice(0, rings).map((ring, i) => (
        <g key={i} filter={`url(#${id}-f${i})`}>
          <circle
            cx="178.6"
            cy="178.6"
            r={ring.r}
            stroke={`url(#${id}-g${i})`}
            strokeWidth={ring.width}
            strokeOpacity={'strokeOpacity' in ring ? ring.strokeOpacity : undefined}
          />
        </g>
      ))}
      <defs>
        {RINGS.slice(0, rings).map((ring, i) => (
          <filter
            key={`f${i}`}
            id={`${id}-f${i}`}
            x={ring.box[0]}
            y={ring.box[0]}
            width={ring.box[1]}
            height={ring.box[1]}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={ring.blur} />
          </filter>
        ))}
        {RINGS.slice(0, rings).map((ring, i) => (
          <radialGradient
            key={`g${i}`}
            id={`${id}-g${i}`}
            cx="0"
            cy="0"
            r="1"
            gradientTransform={ring.gradient}
            gradientUnits="userSpaceOnUse"
          >
            {ring.stops.map(([offset, color, opacity], j) => (
              <stop key={j} offset={offset} stopColor={color} stopOpacity={opacity} />
            ))}
          </radialGradient>
        ))}
      </defs>
    </svg>
  )
}

