import { useState } from 'react'
import { Topbar as Bar } from '../ui/Topbar'
import { GapNote, Mono, PageHeader, Section } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

/* Preview page for Topbar. The full component page — Anatomy · Types · States ·
   Usage guidelines · Do & Don't · Application · Related — is not written yet;
   this shows the component running so the maquetación can be checked against
   the file. */

const NODE = '12792-21495'

export function Topbar() {
  return (
    <>
      <PageHeader
        title="Topbar"
        source="02 - Worker Design System · Topbar · node 12792:21495"
        intro="The screen's top chrome: back, a title with an optional qualifier, and a trailing action. Figma carries four variants, Mood x State — Mood is the hub's own Light/Dark toggle here, because both moods resolve the same three tokens. What is left is State, which is behaviour rather than theme."
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

      <Section
        title="The bar"
        description={
          <>
            360 x 56 — the "Top bar" frame inside the variant. The variant frames
            are 360 x 100, but 44 of that is the status bar, which this hub does
            not build. Flip the hub's Light/Dark toggle to see Mood=Dark.
          </>
        }
      >
        <div className="w-[360px] overflow-clip rounded-16 border border-border-subtle">
          <Bar />
        </div>
      </Section>

      <Section
        title="States"
        description={
          <>
            <Mono>state="scroll"</Mono> swaps the bar's hard bottom edge for a fade
            that runs 174 past the top of the bar, so content reads as passing
            under the chrome rather than being cut by it. The bar does not listen
            to anything — the caller flips the prop from its own scroll position,
            which is what the scroller below does.
          </>
        }
      >
        <ScrollDemo />
      </Section>

      <Section
        title="Known gap"
        description="Carried from Figma, not corrected here."
      >
        <GapNote severity="warning">
          <Mono>Mood=Dark</Mono> binds the tier-1 primitive{' '}
          <Mono>Indigo (Secondary)/color-indigo-900</Mono> (#0D082B) straight onto
          the frame instead of a token from the <Mono>Topbar/Color</Mono>{' '}
          collection — which publishes only <Mono>Surface</Mono>, bound by the
          Light variants alone. The hex is transcribed as the Dark value of{' '}
          <Mono>--color-topbar-surface</Mono> so the component ships both modes,
          but the collection still has no Dark column: a component reaching past
          tier 3 into a ramp.
        </GapNote>
      </Section>
    </>
  )
}

const MODES = [
  { id: 'auto', label: 'Follow scroll' },
  { id: 'default', label: 'Default' },
  { id: 'scroll', label: 'Scroll' },
] as const

function ScrollDemo() {
  const [mode, setMode] = useState<string>('auto')
  const [scrolled, setScrolled] = useState(false)
  const state = mode === 'auto' ? (scrolled ? 'scroll' : 'default') : (mode as 'default' | 'scroll')

  return (
    <div className="flex flex-wrap items-start gap-sp-24">
      <div className="w-[360px] overflow-clip rounded-16 border border-border-subtle bg-surface-page">
        <div className="relative h-[420px]">
          <div
            className="device-scroll h-full overflow-y-auto"
            onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
          >
            {/* The bar is overlaid rather than in flow, so content actually runs
                under it — which is the only way the fade means anything. The
                first row is reserved so nothing starts life hidden. */}
            <div className="px-sp-16 pt-[56px] pb-sp-32">
              {PARAGRAPHS.map((text, index) => (
                <p
                  key={index}
                  className="mt-sp-16 text-md leading-md text-text-secondary first:mt-sp-24"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* Nothing between here and the bar may clip: the fade overflows the
              56 of bar height by design, and the scroller's own overflow-clip
              box is 420 tall, which is what bounds it. */}
          <div className="absolute inset-x-0 top-0">
            <Bar state={state} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-sp-08">
        <div className="flex flex-wrap gap-sp-04 rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
          {MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              className={`cursor-pointer rounded-04 px-sp-12 py-sp-04 text-sm leading-sm font-medium transition-colors ${
                mode === option.id
                  ? 'bg-accent-purple text-text-on-brand'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="max-w-[28ch] text-sm leading-sm text-text-tertiary">
          Scroll the panel. The state flips as soon as the content leaves the top,
          which is the same threshold the product uses.
        </p>
      </div>
    </div>
  )
}

const PARAGRAPHS = [
  'Ask anything about your payments, your contract or your account, and get an answer in the language you write in.',
  'Aura reads only what it needs to answer. It never sees your password, and it cannot move money on your behalf.',
  'Answers about amounts and dates come from your own records, so they are current at the moment you ask rather than cached from a previous session.',
  'If a question needs a human, the conversation is handed to support with the context already attached — you do not repeat yourself.',
  'Beta means the answers are getting better week to week. Tell us when one is wrong and it feeds straight back into the model.',
  'Nothing you write here is used to train a public model. Conversations stay inside your account.',
]
