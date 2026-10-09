import { useState, type ReactNode } from 'react'
import { LogoHero as Logo, LOGO_HERO_INTRO_MS } from '../ui/LogoHero'
import { Background } from '../ui/Background'
import { Topbar } from '../ui/Topbar'
import { Composer } from '../ui/Composer'
import { Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '13153-4281'

/* Lottie exports of the animation, one per phase and mood. Supplied by the
   team (not generated here) and dropped into app/public/lottie/; flip
   `ready` when a file lands. */
const LOTTIES = [
  { phase: 'Intro', note: 'once · 4.2s', mood: 'Light', file: 'logo-hero-intro-light.json', ready: false },
  { phase: 'Intro', note: 'once · 4.2s', mood: 'Dark', file: 'logo-hero-intro-dark.json', ready: false },
  { phase: 'Idle', note: 'loop', mood: 'Light', file: 'logo-hero-idle-light.json', ready: false },
  { phase: 'Idle', note: 'loop', mood: 'Dark', file: 'logo-hero-idle-dark.json', ready: false },
] as const
const CANVAS = 'https://claude.ai/artifact/VyZtB7BLadJgHjMnZeUhSS'

export function LogoHero() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Logo hero"
        source="02 - Worker Design System · Logo · node 13153:4281 · motion from the “Aura Logo Animation” canvas in Claude Design"
        intro="The Aura star over a breathing halo, at the top of the chat's home screen. It draws itself on when the screen opens, then idles. Figma draws it; the Claude Design canvas moves it. Its two Figma variants are the moods, so the hub's Light/Dark toggle switches them."
      >
        <div className="flex flex-wrap gap-sp-16">
          <a
            className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
            href={figmaUrl('components', NODE)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Figma ↗
          </a>
          <a
            className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
            href={CANVAS}
            target="_blank"
            rel="noreferrer"
          >
            Open the animation ↗
          </a>
        </div>
      </PageHeader>

      <ViewTabs views={VIEWS} active={view} onChange={setView} />

      {view === 'preview' ? <Preview /> : null}
      {view === 'documentation' ? <Documentation /> : null}
    </>
  )
}

/* ================================================================
   Preview
   ================================================================ */

function Preview() {
  const [mode, setMode] = useState<'intro' | 'idle'>('intro')
  const [replayKey, setReplayKey] = useState(0)
  const [value, setValue] = useState('')

  const replay = () => {
    setMode('intro')
    setReplayKey((k) => k + 1)
  }

  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      {/* The same 360 x 800 screen as the Background and Composer pages. */}
      <div className="h-[800px] w-[360px] shrink-0 overflow-clip rounded-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
        <Background>
          <div className="relative flex size-full flex-col">
            <Topbar />

            {/* Centred where the canvas centres it, 64 below the bar. The halo
                spills 108.6 past the 140 box, so nothing here clips. */}
            <div className="flex h-[300px] shrink-0 items-center justify-center pt-sp-64">
              <button
                type="button"
                onClick={replay}
                aria-label="Replay the animation"
                className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-8"
              >
                <Logo mode={mode} replayKey={replayKey} />
              </button>
            </div>

            {/* Harness from the same canvas — not a component. */}
            <div key={replayKey} className="relative flex flex-col gap-[6px] px-sp-48 pt-sp-40">
              <p className="greeting-hi text-xl leading-title-md font-medium text-text-primary">
                Hey, Tatiana!
              </p>
              <p className="greeting-title text-4xl leading-3xl font-semibold">
                Can I help you with anything?
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 px-sp-16 pb-sp-08">
              <Composer value={value} onValueChange={setValue} onSend={() => setValue('')} />
            </div>
          </div>
        </Background>
      </div>

      <div className="min-w-[280px] flex-1 space-y-sp-24">
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Intro plays the draw-on — two sparks trace the star, it blooms like glass and turns — and
          hands over to Idle after {(LOGO_HERO_INTRO_MS / 1000).toFixed(1)}s. Tap the logo to play
          it again. Switch the hub to Dark for the other Figma variant.
        </p>

        <Control label="State">
          <Segmented
            options={[
              ['intro', 'Intro'],
              ['idle', 'Idle'],
            ]}
            value={mode}
            onChange={(next) => {
              setMode(next)
              setReplayKey((k) => k + 1)
            }}
          />
        </Control>

        <Control label="Playback">
          <button
            type="button"
            onClick={replay}
            className="cursor-pointer rounded-08 border border-border-default bg-surface-page px-sp-16 py-sp-08 text-md leading-md font-medium text-text-primary"
          >
            Replay intro
          </button>
        </Control>

        <Control label="Lottie">
          <LottieDownloads />
        </Control>

        <p className="max-w-[46ch] text-sm leading-sm text-text-tertiary">
          The greeting comes from the same canvas and is shown for context only. It is not part of
          the component and has no Figma node yet.
        </p>
      </div>
    </div>
  )
}

/* ================================================================
   Documentation
   ================================================================ */

function Documentation() {
  return (
    <>
      <Section
        title="Anatomy"
        description="A 140 box with a 357.2 halo centred on it and a 76 star in the middle. The halo spills 108.6 past the box on every side, as in the file."
      >
        <div className="mb-sp-24 flex flex-wrap items-start gap-sp-40">
          <Specimen caption="Idle">
            <Logo mode="idle" />
          </Specimen>
        </div>
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Halo · layer A', 'Figma’s four rings (Blur XXL, XL, X, M): stroked circles of r 59–70 with radial gradients and 60 / 108.6 / 30.2 / 10.7 layer blurs. Clipped to a circle whose radius morphs.'],
            ['2', 'Halo · layer B', 'The three outer rings again, mirrored, at 40% with a screen blend. Spins the other way and shifts hue.'],
            ['3', 'Inner glow', '150 radial glow behind the star. From the canvas — not in Figma.'],
            ['4', 'Star', 'Figma’s Union, 76 × 76 at (32, 32) in both moods. Dark: #F3EFFF at 40%. Light: purple-500 → purple-200. A white bevel stands in for Figma’s Glass effect.'],
            ['5', 'Sparks', 'Intro only. Two glowing dots that travel the star’s two halves and draw it on. From the canvas.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section
        title="Types"
        description="One type. Figma’s two variants, Property 1 = Dark and Light, are the moods: they follow the theme rather than a prop."
      >
        <Table head={['Mood', 'Halo', 'Star']}>
          {[
            ['Light', 'Figma’s rings, saturate(1.5) brightness(1.12), at 72% — the canvas’s treatment', 'purple-500 → purple-200 gradient'],
            ['Dark', 'Figma’s rings, untouched', '#F3EFFF at 40%'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section
        title="States"
        description="Two phases. Every duration and curve is the canvas’s, at its defaults: 3s per breath, 3s for the logo."
      >
        <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Intro — once, {(LOGO_HERO_INTRO_MS / 1000).toFixed(1)}s
        </h3>
        <Table head={['At', 'What happens', 'Timing']}>
          {[
            ['0s', 'Halo scales in, 0.85 → 1, fading up', '0.9s · cubic-bezier(.22,1,.36,1)'],
            ['0.5s', 'Star box fades in, untwisting from -4deg', '0.5s · cubic-bezier(.22,1,.36,1)'],
            ['0.6s', 'Two sparks travel the star’s halves; brush masks draw it on behind them', '2.4s · cubic-bezier(.45,.05,.55,.95)'],
            ['3.0s', 'Glass bloom: a blurred flash to 90%, a crisp tint to 55%, both fading', '0.7s up, 0.5s down'],
            ['3.0s', 'Star turns 20deg', '0.7s · cubic-bezier(.45,0,.2,1)'],
            ['4.2s', 'Hand-over to Idle, easing the 20deg back to 0', '1.2s · cubic-bezier(.45,0,.2,1)'],
          ].map((cells) => (
            <Row key={cells[0] + cells[1]} cells={cells} mono={2} />
          ))}
        </Table>
        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Idle — loops
        </h3>
        <Table head={['Layer', 'Motion', 'Period']}>
          {[
            ['Halo', 'Breathes, scale 0.92 ↔ 1.06', '3s · ease-in-out'],
            ['Layer A', 'Spins clockwise; clip radius morphs', '4.5s linear · 3.75s ease-in-out'],
            ['Layer B', 'Spins anticlockwise; hue shifts to -35deg', '6.75s linear · 5.25s ease-in-out'],
            ['Inner glow', 'Pulses, 35% ↔ 80%, scale 0.9 ↔ 1.15', '1.8s · ease-in-out'],
            ['Star', 'Breathes, scale 0.94 ↔ 1.05, 88% ↔ 100%', '3s · ease-in-out'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={2} />
          ))}
        </Table>
      </Section>

      <Section
        title="Downloads"
        description="Lottie exports for native and web, one file per phase and mood. Play Intro once when the chat home opens, then loop Idle."
      >
        <LottieDownloads />
      </Section>

      <Section title="Usage guidelines">
        <Table head={['Figma / canvas', 'Prop', 'Notes']}>
          {[
            ['Property 1', '—', 'The theme. Dark and Light switch with the hub.'],
            ['Intro / Idle', 'mode', '"intro" (default) plays the draw-on, then idles. "idle" starts idling.'],
            ['Replay', 'replayKey', 'Change it to play the intro again.'],
            ['—', 'label', 'An accessible name. Without it the logo is decorative and hidden.'],
          ].map((cells) => (
            <Row key={cells[0] + cells[1]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="Do & Don't">
        <DoDont
          dos={[
            'Play the intro once, when the chat home opens. Idle from then on.',
            'Leave 108.6 of clear space around the 140 box — the halo spills into it.',
            'Let it sit on the Background surface, which it was drawn for.',
          ]}
          donts={[
            'Do not clip it with overflow on a parent: the halo would be cut square.',
            'Do not replay the intro on every message. It is an arrival, not a loading state.',
            'Do not scale it down for a small avatar — the blurs are tuned for this size.',
          ]}
        />
      </Section>

      <Section title="Application">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          The chat home: <Mono>Background</Mono>, <Mono>Topbar</Mono>, the logo 64 below the bar,
          the greeting under it and the <Mono>Composer</Mono> at the bottom. The Preview tab is
          that screen. The greeting there is copied from the canvas for context only.
        </p>
      </Section>

      <Section title="Accessibility">
        <div className="space-y-sp-12">
          <p className="max-w-[70ch] text-md leading-md text-text-secondary">
            Decorative by default (<Mono>aria-hidden</Mono>). Pass <Mono>label</Mono> when the logo
            is the only thing naming the screen.
          </p>
          <p className="max-w-[70ch] text-md leading-md text-text-secondary">
            Under <Mono>prefers-reduced-motion</Mono> the intro is skipped and nothing loops: the
            star and halo are shown still. The idle motion is continuous and nothing stops it
            otherwise, so this matters for SC 2.2.2 — it qualifies only because the animation is
            decorative and runs alongside, not instead of, content.
          </p>
        </div>
      </Section>

      <Section title="Decisions" description="Settled with the team on 2026-10-07, recorded so they are not reopened by accident. Nothing is open.">
        <div className="space-y-sp-12">
          <Deviation title="The bevel stands in for Glass — accepted">
            Figma&rsquo;s Glass effect on the star does not export. The canvas&rsquo;s white bevel
            and glass bloom are the accepted rendering, not a placeholder.
          </Deviation>
          <Deviation title="Loose colours stay as they are — accepted">
            The halo binds tier-2 primitives (purple, blue, pink) and three raw hexes (#AF1DBF,
            #FFE9D8, #CAEAFF); the spark, glass and glow colours exist only in the canvas. None
            becomes a token. They live in the component&rsquo;s own scope in{' '}
            <Mono>index.css</Mono>.
          </Deviation>
          <Deviation title="One star, 76 × 76">
            Figma now draws the star at 76 in both variants (it was 75.2 and 76.4). The hub uses
            that path for both moods.
          </Deviation>
          <Deviation title="Light uses the animation’s halo">
            Figma&rsquo;s Light variant draws its own halo (other rings, a 300 blur, a Glass
            disc). The hub uses the animation&rsquo;s instead: Figma&rsquo;s Dark rings, saturated
            and at 72%. Compared side by side and chosen by the team.
          </Deviation>
          <Deviation title="Dark uses Figma’s rings untouched">
            The canvas recoloured the halo and boosted it with saturate(1.9). Both the hub and the
            canvas now use Figma&rsquo;s colours, with no boost in Dark.
          </Deviation>
        </div>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Sits on <Mono>Background</Mono>, under <Mono>Topbar</Mono> and above{' '}
          <Mono>Composer</Mono> on the chat home.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

function Specimen({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="m-0">
      <div
        className="flex size-[360px] items-center justify-center overflow-clip rounded-16 bg-general-surface-white shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
      >
        {children}
      </div>
      <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">{caption}</figcaption>
    </figure>
  )
}

function Row({ cells, mono }: { cells: string[]; mono?: number }) {
  return (
    <tr className="border-b border-border-subtle last:border-0">
      {cells.map((cell, i) => (
        <td
          key={i}
          className={`px-sp-16 py-sp-08 ${
            i === 0
              ? 'font-medium whitespace-nowrap text-text-primary'
              : i === mono
                ? 'font-mono text-sm whitespace-nowrap text-text-primary'
                : 'text-sm text-text-secondary'
          }`}
        >
          {cell}
        </td>
      ))}
    </tr>
  )
}

function LottieDownloads() {
  return (
    <ul className="grid max-w-[560px] gap-sp-08 sm:grid-cols-2">
      {LOTTIES.map((item) => (
        <li
          key={item.file}
          className="flex items-center justify-between gap-sp-12 rounded-08 border border-border-subtle bg-surface-subtle px-sp-12 py-sp-08"
        >
          <span className="min-w-0">
            <span className="block text-md leading-md font-medium text-text-primary">
              {item.phase} · {item.mood}
            </span>
            <span className="block truncate text-sm leading-sm text-text-tertiary">
              {item.ready ? item.file : `${item.note} · pending file`}
            </span>
          </span>
          {item.ready ? (
            <a
              href={`/lottie/${item.file}`}
              download
              className="shrink-0 rounded-08 bg-accent-purple px-sp-12 py-sp-04 text-sm leading-sm font-medium text-text-on-brand"
            >
              Download
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="shrink-0 rounded-08 border border-dashed border-border-strong px-sp-12 py-sp-04 text-sm leading-sm text-text-tertiary"
            >
              Pending
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function Deviation({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12">
      <h3 className="text-md leading-md font-semibold text-text-primary">{title}</h3>
      <p className="mt-sp-04 max-w-[80ch] text-sm leading-sm text-text-secondary">{children}</p>
    </div>
  )
}

function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-sp-16 lg:grid-cols-2">
      <div className="space-y-sp-12">
        {dos.map((t) => (
          <div
            key={t}
            className="rounded-08 border-l-4 border-border-success bg-accent-green/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary"
          >
            {t}
          </div>
        ))}
      </div>
      <div className="space-y-sp-12">
        {donts.map((t) => (
          <div
            key={t}
            className="rounded-08 border-l-4 border-border-error bg-accent-red/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary"
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">{label}</div>
      {children}
    </div>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: [T, string][]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="inline-flex flex-wrap gap-sp-04 rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`cursor-pointer rounded-04 px-sp-12 py-sp-04 text-sm leading-sm font-medium transition-colors ${
            value === id
              ? 'bg-accent-purple text-text-on-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
