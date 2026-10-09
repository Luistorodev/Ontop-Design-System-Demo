import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FloatingButton as FloatingButtonUI, Nudge as NudgeUI } from '../ui/FloatingButton'
import { NavigationBarFloating, type NavItems } from '../ui/NavigationBar'
import { ActivityIcon, CardsIcon, HomeIcon, PaymentsIcon, ProfileIcon } from '../icons/nav'
import { ChatScreenView } from './ChatScreen'
import { useChatScreen } from './useChatScreen'
import { WorkerScreen } from './WorkerScreen'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '13149-3819'

const NAV: NavItems = [
  { id: 'home', icon: HomeIcon, accessibilityLabel: 'Home' },
  { id: 'payments', icon: PaymentsIcon, accessibilityLabel: 'Payments' },
  { id: 'cards', icon: CardsIcon, accessibilityLabel: 'Cards' },
  { id: 'activity', icon: ActivityIcon, accessibilityLabel: 'Activity' },
  { id: 'profile', icon: ProfileIcon, accessibilityLabel: 'Profile' },
]

/* The prompt places the button at right 16 / bottom 101 over a 106
   navigation bar on a 390 × 844 screen. This screen is 360 × 800 and its bar
   ends 102 up (82 on a 20 inset), so the button sits 8 above it. */
const RIGHT = 16
const BOTTOM = 110

export function FloatingButton() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Floating button"
        source="Claude Design · Ontop Walkthroughs (Aura FAB prompt) · Figma: [AI] Floating button · Floating 13149:3819"
        intro="The way into Aura from anywhere in the Worker app: a 52 orb with the Logo hero inside, floating over the screen. It can be dragged, greets first-time users, and opens the chat's start. The same in Light and Dark."
      >
        <a
          className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
          href={figmaUrl('components', NODE)}
          target="_blank"
          rel="noreferrer"
        >
          Open in Figma ↗
        </a>
      </PageHeader>

      <ViewTabs views={VIEWS} active={view} onChange={setView} />

      {view === 'preview' ? <Preview /> : null}
      {view === 'documentation' ? <Documentation /> : null}
    </>
  )
}

/* ================================================================
   Preview — the Worker home with the button; tapping it opens the
   Aura chat, and the chat's back arrow returns
   ================================================================ */

function Preview() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  /* A new key remounts the button: its entry, the Logo hero intro and, with
     `firstTime`, the sparkles and the Nudge play again. A fresh chat each time
     the button opens, so it always lands on the start. */
  const [fabKey, setFabKey] = useState(0)
  const [firstTime, setFirstTime] = useState(true)
  const [nudge, setNudge] = useState(false)
  const [chatKey, setChatKey] = useState(0)

  const replay = (withIntro: boolean) => {
    setFirstTime(withIntro)
    setFabKey((k) => k + 1)
  }

  /* The press settles first — the open waits for the button's 150ms shrink —
     then the chat grows out of where the button rests. */
  const openChat = () =>
    window.setTimeout(() => {
      setChatKey((k) => k + 1)
      setOpen(true)
    }, reduce ? 0 : 150)
  const origin = `${360 - RIGHT - 26}px ${800 - BOTTOM - 26}px`

  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      <div className="relative h-[800px] w-[360px] shrink-0 overflow-clip rounded-24 bg-surface-page shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
        {/* Home. Static: the Navigation bar is glass, and a transform on an
            ancestor would flatten its backdrop blur. */}
        <div className="device-scroll h-full overflow-y-auto pt-[44px] pb-[140px]" inert={open}>
          <WorkerScreen tone="calm" />
        </div>
        <div className="absolute inset-x-0 bottom-[20px] flex justify-center" inert={open}>
          <NavigationBarFloating items={NAV} selectedIndex={tab} onSelect={setTab} />
        </div>
        <div className="contents" inert={open}>
          <FloatingButtonUI
            key={`${fabKey}-${nudge}`}
            intro={firstTime}
            nudge={nudge}
            right={RIGHT}
            bottom={BOTTOM}
            onOpen={openChat}
          />
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              key="chat"
              className="absolute inset-0 z-[60]"
              style={{ transformOrigin: origin }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.12 }}
              transition={{ duration: reduce ? 0.15 : 0.36, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <ChatStart key={chatKey} onBack={() => setOpen(false)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="min-w-[280px] flex-1 space-y-sp-16">
        <div>
          <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">Replay</div>
          <div className="flex flex-wrap gap-sp-08">
            <ActionButton onClick={() => replay(true)}>First-time intro</ActionButton>
            <ActionButton onClick={() => replay(false)}>Entry only</ActionButton>
          </div>
        </div>
        <div>
          <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">Nudge</div>
          <ActionButton
            onClick={() => {
              setFirstTime(false)
              setNudge((n) => !n)
            }}
          >
            {nudge ? 'Turn off' : 'Turn on'}
          </ActionButton>
          <p className="mt-sp-08 max-w-[46ch] text-sm leading-sm text-text-tertiary">
            Figma&rsquo;s Nudge property. On, the hint stays until it is closed; in the first-time
            intro it fades on its own after 3s.
          </p>
        </div>
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          The button scales in over the Worker home and its Logo hero plays the intro, then idles.
          The first time, sparkles burst from it and the Nudge says hello, fading after 3s. Drag it
          anywhere on the screen — it keeps its place, and a drag never opens Aura.
        </p>
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Tap it: it shrinks subtly, then the chat&rsquo;s start grows out of it — the Logo hero
          playing its intro and the greeting. Send a message to begin the conversation; the back
          arrow returns to the home.
        </p>
        <p className="max-w-[46ch] text-sm leading-sm text-text-tertiary">
          The home screen and the greeting are stand-ins.
        </p>
      </div>
    </div>
  )
}

/** The chat, opened on its start. Its own state, so every open is fresh. */
function ChatStart({ onBack }: { onBack: () => void }) {
  const chat = useChatScreen({ start: 'home' })
  return <ChatScreenView chat={chat} onBack={onBack} />
}

/* ================================================================
   Documentation
   ================================================================ */

function Documentation() {
  return (
    <>
      <Section
        title="Anatomy"
        description="A 52 button with no fill of its own. Inside, the orb: a #6A3FE0 circle clipping the Logo hero, dark, scaled so the star is 32. A drop shadow lifts it off the screen."
      >
        <Pair>{() => <FloatingButtonUI right={40} bottom={24} persist={false} nudge />}</Pair>
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Button', '52 × 52, round, transparent, z-index 50. Shadow: drop-shadow(0 10 22 rgba(43,22,112,.38)). Accessible name “Aura”.'],
            ['2', 'Orb', 'Fills the button, round, clips, #6A3FE0.'],
            ['3', 'Logo hero', 'Dark. Scaled 32/76 so the star is 32; the halo spills past the 52 and is clipped. Overrides: the halo does not breathe or scale in, and its first layer is square instead of morphing.'],
            ['4', 'Sparkles', 'First time only. Six Aura stars, 14, purple-500, from the button’s centre.'],
            ['5', 'Nudge', 'Figma’s Nudge (13302:8980), inside Floating behind the Nudge boolean. 12 above the orb, right-aligned so its caret points at the orb’s centre; it moves with the button. A card, br-20, 16 · 24 · 16 · 16, as wide as its text up to 260, then the text wraps (52 tall on one line, 72 on two). 14/20, left-aligned: plain in nudge/text and a Semibold highlight in nudge/highlight. A 24 close button 4 from the corner, x-close in nudge/icon. A 16 caret, rotated and sheared as in the file, 7 below the card. Fill: nudge/gradient-light → nudge/gradient-dark.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section title="Nudge" description="Up to 260 wide, then the text wraps. Left-aligned.">
        <div className="mb-sp-24 flex flex-wrap items-start gap-sp-24">
          {(['light', 'dark'] as const).map((mood) => (
            <figure key={mood} className="m-0">
              <div
                data-theme={mood}
                className="flex w-[320px] max-w-full flex-col items-end gap-sp-24 rounded-16 bg-surface-page p-sp-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
              >
                <NudgeUI className="relative" text="Need a hand? " highlight="Ask Aura." />
                <NudgeUI
                  className="relative"
                  text="I’ll be here whenever you need a hand. "
                  highlight="Just tap me."
                />
              </div>
              <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
                {mood === 'light' ? 'Light' : 'Dark'}
              </figcaption>
            </figure>
          ))}
        </div>
        <Table head={['Token', 'Light', 'Dark']}>
          {[
            ['nudge/gradient-light', '#7A50F7 (purple-500)', '#906DF8 (purple-400)'],
            ['nudge/gradient-dark', '#21136C (indigo-600)', '#3D287B (purple-800)'],
            ['nudge/text', '#F2F4F7', '#FFFFFF'],
            ['nudge/highlight', '#D3C5FC (purple-100)', '#D3C5FC'],
            ['nudge/icon', '#F9FAFB', '#FFFFFF'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section title="Behaviour">
        <Table head={['Moment', 'What happens']}>
          {[
            ['Entry', 'Scales from 0.4 and fades in, 0.45s on cubic-bezier(.2,.9,.3,1.2) — a slight overshoot. The Logo hero plays its 4.2s intro, then idles: the halo layers counter-rotate (4.5s and 6.75s), the second shifts hue, the glow pulses and the star breathes every 3s.'],
            ['Nudge on', 'The Nudge rises in from its caret at 0.1s and stays until it is closed.'],
            ['First time', 'Six sparkles burst outwards and turn 90° in 0.6s, staggered 0.06s from 0.12s. The Nudge rises in at 0.1s, fades at 3s and is gone at 3.45s, or when closed.'],
            ['Drag', 'Starts past 5px. Stays 8 inside its parent and 52 clear of the top (the status bar). Follows the pointer with no easing; on release it settles in 0.25s. The position is kept between screens.'],
            ['Tap', 'Shrinks to 0.94, then opens the chat on its start — the Logo hero and the greeting. A tap that ends a drag does nothing.'],
            ['Reduced motion', 'Every animation runs once, in 0.01s.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section title="Usage guidelines">
        <ul className="max-w-[70ch] list-disc space-y-sp-08 pl-sp-24 text-md leading-md text-text-secondary">
          <li>One per screen, as the single way into Aura from that screen.</li>
          <li>Rest it just above the Navigation bar, clear of the system inset, so it never covers a tab.</li>
          <li>Show the first-time intro once per user, not on every visit.</li>
          <li>Hide it while the chat is open — the chat is where it leads.</li>
          <li>Localise the accessible name and the Nudge. Prefer one short line; past 260 it wraps.</li>
        </ul>
      </Section>

      <Section title="Variables & appearance">
        <div className="space-y-sp-08">
          <GapNote severity="blocking">
            The button follows the Claude Design prompt, not Figma (team decision, 2026-10-08). The
            Figma component Floating still draws a 56 indigo-900 disc with four blurred rings and
            the logo in glass. Update the file to match, or this page and the file disagree. The
            Nudge does follow Figma.
          </GapNote>
          <GapNote severity="warning">
            No token exists for the button: #6A3FE0 and the shadow are the prompt&rsquo;s raw
            values, the sparkles purple-500 (#7A50F7). The same in Light and Dark.
          </GapNote>
          <GapNote severity="warning">
            The Nudge has its own Aura tokens since 2026-10-09 (it shared General/Gradient light and
            dark, whose Dark values made it unreadable). Light keeps the file&rsquo;s colours except
            the highlight, raised from #6643CE to purple-100. Dark lifts the card a step:
            #906DF8 → #3D287B with white text and close glyph.
          </GapNote>
          <GapNote severity="warning">
            Figma&rsquo;s caret sits 28.5 from the Nudge&rsquo;s right edge — the centre of its 56
            orb. The hub&rsquo;s orb is 52, so the Nudge hangs 2.5 past the button&rsquo;s edge to
            keep the caret on the centre. Its copy here is sample text: the file draws
            &ldquo;text text&rdquo;.
          </GapNote>
          <GapNote severity="warning">
            The prompt asks for four-point stars as sparkles but names no icon, and the library has
            none; they are the Aura star from the Logo. The prompt&rsquo;s positions are for a 390 ×
            844 screen; on this 360 × 800 one the button rests 8 above the Navigation bar.
          </GapNote>
          <GapNote severity="warning">
            The prompt&rsquo;s orb is <Mono>AuraOrb</Mono> from <Mono>aura-intro.jsx</Mono>, which
            the hub does not have. It is the same canvas as the Logo hero, so the hub uses its Logo
            hero; the prompt&rsquo;s blob scale(1.6) maps to scale(1) in the hub&rsquo;s geometry.
          </GapNote>
        </div>
      </Section>

      <Section title="Accessibility">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          A real <Mono>button</Mono> named &ldquo;Aura&rdquo;; the orb is decoration. 52 meets the
          platforms&rsquo; target size. The Nudge is a <Mono>status</Mono>, so it is announced,
          and has a labelled close button. Dragging is pointer-only: keyboard and assistive-tech
          users reach the button where it rests, and Enter or Space opens Aura.
        </p>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Opens the Aura chat on its start (Topbar, Background, <Mono>Logo hero</Mono>, Composer).
          The orb is the <Mono>Logo hero</Mono>; it rests above the <Mono>Navigation bar</Mono>.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

/** The button on a Light and a Dark page surface. */
function Pair({ children }: { children: () => ReactNode }) {
  return (
    <div className="mb-sp-24 flex flex-wrap items-start gap-sp-24">
      {(['light', 'dark'] as const).map((mood) => (
        <figure key={mood} className="m-0">
          <div
            data-theme={mood}
            className="relative h-[180px] w-[320px] max-w-full rounded-16 bg-surface-page shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
          >
            {children()}
          </div>
          <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
            {mood === 'light' ? 'Light' : 'Dark'}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function Row({ cells }: { cells: string[] }) {
  return (
    <tr className="border-b border-border-subtle last:border-0">
      {cells.map((cell, i) => (
        <td
          key={i}
          className={`px-sp-16 py-sp-08 ${i === 0 ? 'font-medium whitespace-nowrap text-text-primary' : 'text-sm text-text-secondary'}`}
        >
          {cell}
        </td>
      ))}
    </tr>
  )
}

function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-08 border border-border-subtle bg-surface-subtle px-sp-12 py-sp-04 text-md leading-md font-medium text-text-primary hover:border-border-strong"
    >
      {children}
    </button>
  )
}
