import { useEffect, useId, useState } from 'react'
import { HaloArt, STAR_PATH } from '../icons/logo-hero'

/* Logo hero — 02 - Worker Design System, Logo (node 13153:4281), animated after
   the "Aura Logo Animation" canvas in Claude Design.

   The Aura star over a breathing halo, at the top of the chat's home screen.
   Figma draws it (140 x 140, the halo's rings and colours, the star and its
   fills); the canvas moves it. Two phases:

   - intro: the halo scales in, two sparks travel the star's two halves and
     draw it on behind them, the finished star blooms like glass and turns
     20deg. 4.2s, then it hands over to idle.
   - idle: the halo breathes, its two layers counter-rotate, morph and shift
     hue; a glow pulses behind the star; the star breathes.

   Figma's two variants (Property 1 = Dark / Light) are the moods, so they
   follow the hub's [data-theme] rather than a prop. Light draws the canvas's
   halo (the Dark rings, saturated, at 72%) rather than Figma's Light variant —
   team decision, 2026-10-07. Figma's Glass effect does not export: the
   canvas's bevel stands in for it, also by decision.

   The component is 140 square, but the halo is 357.2 and spills 108.6 past it
   on every side, as in the file — the caller leaves that room clear and must
   not clip it. */

// The canvas's defaults: breath 3s, logo 3s. Every other duration derives
// from them exactly as the canvas derives it.
const LOGO = 3
const DRAW = LOGO * 0.8
const BLOOM = 0.7
const HOLD = 0.5
const CYCLE = DRAW + BLOOM + HOLD + 0.01
const BEGIN = 0.6
/** Intro length, after which the star hands over to idle. */
export const LOGO_HERO_INTRO_MS = (BEGIN + DRAW + BLOOM + HOLD) * 1000

const k = (t: number) => (t / CYCLE).toFixed(4)
const T1 = k(DRAW)
const T2 = k(DRAW + BLOOM)
const T3 = k(DRAW + BLOOM + HOLD)
const KT_DRAW = `0;${T1};${T3};1`
const KT_SWEEP = `0;${T1};1`
const KT_SPARK = `0;0.02;${k(DRAW - 0.15)};${T1};1`
const KT_GLASS = `0;${T1};${T2};${T3};1`
const DUR = `${CYCLE.toFixed(2)}s`

// The two brush strokes the sparks travel, one per half of the star.
const STROKE_TOP = 'M3,47 Q22,40 32,32 Q24,24 12,12 Q26,26 32,32 Q40,22 47,3'
const STROKE_BOTTOM = 'M72,28 Q54,33 46,45 Q52,50 64,63 Q50,50 46,45 Q36,54 28,72'

export function LogoHero({
  mode = 'intro',
  replayKey = 0,
  label,
  className = '',
}: {
  /** `intro` plays the draw-on, then idles. `idle` starts idling at once. */
  mode?: 'intro' | 'idle'
  /** Change it to play the intro again. */
  replayKey?: number
  /** An accessible name, when the logo is the only thing naming the screen.
   *  Without one it is decorative and hidden from assistive technology. */
  label?: string
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <div
      className={`logo-hero relative size-[140px] ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* Remounted on every replay: SMIL timelines start when their SVG is
          inserted, and this is the only reliable way to restart them. */}
      <Stage key={`${mode}-${replayKey}`} intro={mode === 'intro' && !reduced} />
    </div>
  )
}

function Stage({ intro }: { intro: boolean }) {
  const [phase, setPhase] = useState<'intro' | 'idle'>(intro ? 'intro' : 'idle')

  useEffect(() => {
    if (!intro) return
    const timer = window.setTimeout(() => setPhase('idle'), LOGO_HERO_INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [intro])

  return (
    <>
      {/* The halo: Figma's 357.2 export, centred on the 140 box. */}
      <div className={`absolute -inset-[108.6px] ${intro ? 'halo-in' : ''}`}>
        <div
          className="halo-breath absolute inset-0"
          style={{ filter: 'var(--logo-halo-filter)', opacity: 'var(--logo-halo-opacity)' }}
        >
          <div className="halo-a absolute inset-0 overflow-clip rounded-full">
            <HaloArt />
          </div>
          <div className="halo-b absolute inset-0 opacity-40 mix-blend-screen">
            <HaloArt rings={3} className="-scale-x-100" />
          </div>
        </div>
      </div>

      <div className="inner-glow absolute top-1/2 left-1/2 -mt-[75px] -ml-[75px] size-[150px] rounded-full" />

      {/* The star, 76 square at 1:1 with the file. */}
      <div className={`absolute top-1/2 left-1/2 -mt-[38px] -ml-[38px] size-[76px] ${intro ? 'star-in' : ''}`}>
        {phase === 'intro' ? <DrawOn /> : <Star className={`star-breath ${intro ? 'untilt' : ''}`} />}
      </div>
    </>
  )
}

/** The idle star: one static drawing, breathing through CSS. */
function Star({ className }: { className?: string }) {
  const id = useIds()
  return (
    <svg className={`block overflow-visible ${className}`} viewBox="0 0 76 76" width="76" height="76" aria-hidden="true">
      <StarDefs id={id} />
      <StarFills id={id} />
    </svg>
  )
}

/** The intro: the canvas's SMIL timeline, unchanged. */
function DrawOn() {
  const id = useIds()
  const smil = { dur: DUR, begin: `${BEGIN}s`, repeatCount: '1', fill: 'freeze' } as const
  const spline = { calcMode: 'spline' } as const

  const brush = (d: string, dash: string, offset: string, values: string, keyTimes: string, keySplines: string) => (
    <path
      d={d}
      pathLength={100}
      fill="none"
      stroke="#ffffff"
      strokeWidth={17}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={dash}
      strokeDashoffset={offset}
    >
      <animate attributeName="stroke-dashoffset" values={values} keyTimes={keyTimes} keySplines={keySplines} {...spline} {...smil} />
    </path>
  )

  const spark = (path: string) => (
    <g opacity="0">
      <animateMotion
        path={path}
        keyPoints="0;1;1"
        keyTimes={KT_SWEEP}
        keySplines="0.45 0.05 0.55 0.95;0 0 1 1"
        rotate="0"
        {...spline}
        {...smil}
      />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes={KT_SPARK} {...smil} />
      <circle r="11" style={{ fill: 'var(--logo-spark-glow)' }} filter={`url(#${id.spark})`} />
      <circle r="4.5" style={{ fill: 'var(--logo-spark-mid)' }} filter={`url(#${id.spark})`} />
      <circle r="1.9" style={{ fill: 'var(--logo-spark-core)' }} />
    </g>
  )

  const DRAW_SPLINES = '0.45 0.05 0.55 0.95;0 0 1 1;0 0 1 1'
  const SWEEP_SPLINES = '0.45 0.05 0.55 0.95;0 0 1 1'
  const GLASS_SPLINES = '0 0 1 1;0.2 0.8 0.2 1;0.4 0 0.6 1;0 0 1 1'

  return (
    <svg className="block overflow-visible" viewBox="0 0 76 76" width="76" height="76" aria-hidden="true">
      <StarDefs id={id} />
      <defs>
        <filter id={id.spark} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id={id.reveal} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id={id.bloom} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        {/* Draw-on: two brush strokes uncover the star behind the sparks. */}
        <mask id={id.drawMask} maskUnits="userSpaceOnUse" x="-10" y="-10" width="96" height="96">
          <g filter={`url(#${id.reveal})`}>
            {brush(STROKE_TOP, '100', '100', '100;0;0;0', KT_DRAW, DRAW_SPLINES)}
            {brush(STROKE_BOTTOM, '100', '100', '100;0;0;0', KT_DRAW, DRAW_SPLINES)}
          </g>
        </mask>
        {/* Sweep: a short bright segment riding just behind each spark. */}
        <mask id={id.sweepMask} maskUnits="userSpaceOnUse" x="-10" y="-10" width="96" height="96">
          <g filter={`url(#${id.reveal})`}>
            {brush(STROKE_TOP, '14 86', '14', '14;-100;-100', KT_SWEEP, SWEEP_SPLINES)}
            {brush(STROKE_BOTTOM, '14 86', '14', '14;-100;-100', KT_SWEEP, SWEEP_SPLINES)}
          </g>
        </mask>
      </defs>

      <g>
        {/* The 20deg turn once the drawing is complete, through bloom and hold. */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 38 38;0 38 38;20 38 38;20 38 38"
          keyTimes={KT_DRAW}
          keySplines="0 0 1 1;0.45 0 0.2 1;0 0 1 1"
          {...spline}
          {...smil}
        />
        <g mask={`url(#${id.drawMask})`}>
          <StarFills id={id} />
        </g>
        <g mask={`url(#${id.sweepMask})`}>
          <path d={STAR_PATH} style={{ fill: 'var(--logo-spark-core)' }} fillOpacity={0.55} />
        </g>
        {/* Glass bloom: a blurred flash, then a crisp bevelled tint. */}
        <g opacity="0" filter={`url(#${id.bloom})`}>
          <path d={STAR_PATH} style={{ fill: 'var(--logo-glass)' }} />
          <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes={KT_GLASS} keySplines={GLASS_SPLINES} {...spline} {...smil} />
        </g>
        <g opacity="0">
          <path d={STAR_PATH} style={{ fill: 'var(--logo-glass)' }} filter={`url(#${id.bevel})`} />
          <animate attributeName="opacity" values="0;0;0.55;0;0" keyTimes={KT_GLASS} keySplines={GLASS_SPLINES} {...spline} {...smil} />
        </g>
      </g>

      {spark(STROKE_TOP)}
      {spark(STROKE_BOTTOM)}
    </svg>
  )
}

/** Both of Figma's star fills; the mood shows one (see .logo-star-* in
 *  index.css). Dark: #F3EFFF at 40%. Light: purple-500 → purple-200 along
 *  the export's gradient line, moved into the 76 box. */
function StarFills({ id }: { id: Ids }) {
  return (
    <>
      <path className="logo-star-dark" d={STAR_PATH} fill="#F3EFFF" fillOpacity={0.4} filter={`url(#${id.bevel})`} />
      <path className="logo-star-light" d={STAR_PATH} fill={`url(#${id.gradient})`} filter={`url(#${id.bevel})`} />
    </>
  )
}

/** The bevel standing in for Figma's Glass, and the Light star gradient. */
function StarDefs({ id }: { id: Ids }) {
  return (
    <defs>
      <filter id={id.bevel} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feOffset in="SourceAlpha" dx="0.9" dy="0.9" result="o1" />
        <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1" />
        <feGaussianBlur in="e1" stdDeviation="0.35" result="b1" />
        <feFlood floodColor="#FFFFFF" floodOpacity="0.6" />
        <feComposite in2="b1" operator="in" result="hi" />
        <feOffset in="SourceAlpha" dx="-0.7" dy="-0.7" result="o2" />
        <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2" />
        <feGaussianBlur in="e2" stdDeviation="0.35" result="b2" />
        <feFlood floodColor="#FFFFFF" floodOpacity="0.18" />
        <feComposite in2="b2" operator="in" result="lo" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="lo" />
          <feMergeNode in="hi" />
        </feMerge>
      </filter>
      <linearGradient id={id.gradient} x1="12.032" y1="5.7" x2="65.234" y2="75.993" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7A50F7" />
        <stop offset="1" stopColor="#BCA7FB" />
      </linearGradient>
    </defs>
  )
}

type Ids = ReturnType<typeof useIds>

function useIds() {
  const base = `logo${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return {
    bevel: `${base}-bevel`,
    gradient: `${base}-grad`,
    spark: `${base}-spark`,
    reveal: `${base}-reveal`,
    bloom: `${base}-bloom`,
    drawMask: `${base}-draw`,
    sweepMask: `${base}-sweep`,
  }
}

function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setReduced(list.matches)
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [])
  return reduced
}
