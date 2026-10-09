import { useState, type ReactNode } from 'react'
import { Topbar as Bar } from '../ui/Topbar'
import { Background } from '../ui/Background'
import { Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '12792-21495'

export function Topbar() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Topbar"
        source="02 - Worker Design System · Topbar · node 12792:21495"
        intro="The top chrome of Aura's screens: back, a title with an optional qualifier, and a trailing menu. Figma carries two variants, State=Default and State=Scroll. Every colour is an Aura · General token with a Dark value, so the hub's Light/Dark toggle covers the mood."
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
   Preview
   ================================================================ */

function Preview() {
  const [state, setState] = useState<'default' | 'scroll'>('default')
  const [subtitle, setSubtitle] = useState(true)
  const [presses, setPresses] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      {/* A 360 x 800 Aura screen: Background at the root, the bar overlaid at
          the top so content actually runs under it — the only way the fade
          means anything. */}
      <div className="h-[800px] w-[360px] shrink-0 overflow-clip rounded-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
        <Background>
          <div className="relative size-full">
            <div className="device-scroll h-full overflow-y-auto">
              {/* 100 reserved: the 44 status-bar space plus the 56 bar. */}
              <div className="px-sp-16 pt-[100px] pb-sp-32">
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
            <div className="absolute inset-x-0 top-0">
              <Bar
                state={state}
                subtitle={subtitle ? 'Beta' : ''}
                onBack={() => setPresses('Back')}
                onMenu={() => setPresses('Menu')}
              />
            </div>
          </div>
        </Background>
      </div>

      <div className="min-w-[280px] flex-1 space-y-sp-24">
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Switch to Scroll and scroll the screen: the fade lets content pass under the bar instead
          of being cut. In the product the caller flips the state as soon as content leaves the
          top. The 44 above the bar is reserved for the system status bar, which the component
          does not draw.
        </p>

        <Control label="State">
          <Segmented
            options={[
              ['default', 'Default'],
              ['scroll', 'Scroll'],
            ]}
            value={state}
            onChange={setState}
          />
        </Control>

        <Control label="Content">
          <div className="flex flex-wrap gap-sp-08">
            <Toggle label="Subtitle" on={subtitle} onChange={setSubtitle} />
          </div>
        </Control>

        <p className="text-sm leading-sm text-text-tertiary" aria-live="polite">
          {presses ? `Last action: ${presses}` : 'Tap back or menu to see the action fire.'}
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
  'Your history is kept for 90 days, and you can delete any conversation from the menu at the top right.',
  'Aura is available in English, Spanish and Portuguese, and switches language when you do.',
]

/* ================================================================
   Documentation
   ================================================================ */

function Documentation() {
  return (
    <>
      <Section
        title="Anatomy"
        description="A 56 bar under 44 of reserved status-bar space: back, title block, menu."
      >
        <div className="mb-sp-24 flex flex-wrap items-start gap-sp-40">
          <Specimen caption="State=Default">
            <Bar />
          </Specimen>
          <Specimen caption="State=Scroll" tall>
            <Bar state="scroll" />
          </Specimen>
        </div>
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Topbar', 'Full width, fill general/surface-white. 100 tall in the file: 44 of status-bar space plus the 56 bar.'],
            ['2', 'Status-bar space', 'The Status Bar instance in Figma. Not drawn — the system draws its own. Top padding of the larger of 44 and the device’s top inset.'],
            ['3', 'Top bar', '56: padding sp-12 vertical, sp-16 horizontal, gap sp-08.'],
            ['4', 'Back', '32 × 32, padding sp-08. arrow-left glyph, 16 inside a 24 frame, in general/icon.'],
            ['5', 'Title', 'Fills. “Aura AI” in Title/md/semibold (18/22), general/title.'],
            ['6', 'Subtitle', 'Optional. “Beta” in Body/md/regular (14/20), general/help-text, gap sp-04, bottom-aligned with the title.'],
            ['7', 'Menu', '32 × 32, padding sp-08. menu-04 glyph, 20 × 14 inside a 24 frame, in general/icon. Named “Left” in Figma although it sits on the right.'],
            ['8', 'Scroll fade', 'State=Scroll only. 360 × 218 from the top of the component, general/surface-white opaque to 48.87%, fading to general/fade-white at 105.3%.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section
        title="Types"
        description="One type. The title and subtitle are content, not variants."
      >
        <Table head={['Content', 'Default', 'Notes']}>
          {[
            ['title', 'Aura AI', 'The screen’s name. One line, no truncation specified.'],
            ['subtitle', 'Beta', 'A qualifier on the title’s baseline. Pass an empty string to drop it.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section
        title="States"
        description="State is about the content behind the bar, not about the bar itself. The caller flips it from its own scroll position."
      >
        <Table head={['State', 'What changes']}>
          {[
            ['Default', 'Content starts below the bar. Hard bottom edge.'],
            ['Scroll', 'Content has scrolled under the bar. A fade of the surface colour runs 118 past the bar’s bottom edge, so content reads as passing beneath it rather than being cut.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <p className="mt-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          The back and menu buttons have no hover, pressed or disabled state in the file. Both
          show the hub&rsquo;s focus ring under keyboard focus.
        </p>
      </Section>

      <Section title="Usage guidelines">
        <Table head={['Figma', 'Prop', 'Notes']}>
          {[
            ['State', 'state', '"default" | "scroll".'],
            ['Mood', '—', 'The hub theme. Every token has a Dark value.'],
            ['Aura AI', 'title', 'Defaults to the file’s string.'],
            ['Beta', 'subtitle', 'Empty string hides it.'],
            ['Back', 'onBack · backLabel', 'backLabel is the accessible name — the button is icon-only.'],
            ['Left (menu)', 'onMenu · menuLabel', 'menuLabel is the accessible name.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="Do & Don't">
        <DoDont
          dos={[
            'Overlay it on the scrolling content, so the Scroll fade has something to pass over.',
            'Reserve 100 at the top of the content — the status-bar space plus the bar.',
            'Switch to Scroll as soon as the content leaves the top.',
            'Give both buttons a localised accessible name.',
          ]}
          donts={[
            'Do not draw a status bar inside it. The 44 in the file is a measurement, not a shape.',
            'Do not put the bar in the flow of a scroll container — it would scroll away with the content.',
            'Do not add a third action. Back, title and menu are the whole bar.',
          ]}
        />
      </Section>

      <Section title="Application">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          The Aura chat screen: <Mono>Background</Mono> at the root, the Topbar overlaid at the top,
          the conversation scrolling under it and the <Mono>Composer</Mono> at the bottom. The
          Preview tab is that set-up without the Composer, with the state set by hand.
        </p>
      </Section>

      <Section
        title="Accessibility"
        description="Contrast against general/surface-white, measured from the tokens in this build:"
      >
        <Table head={['Pair', 'Light', 'Dark', 'Result']}>
          {[
            ['general/title', '14.34:1', '18.49:1', 'Passes AAA'],
            ['general/help-text (Beta)', '4.85:1', '7.50:1', 'Passes AA'],
            ['general/icon', '10.20:1', '18.49:1', 'Passes (non-text, 3:1)'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <p className="mt-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          Targets: both buttons are 32 × 32, above the 24 minimum of SC 2.5.8 but under the 44 the
          platform guidelines recommend. Both carry an accessible name; the glyphs are hidden from
          assistive technology.
        </p>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Shares the <Mono>Aura · General</Mono> collection with <Mono>Composer</Mono> and{' '}
          <Mono>Background</Mono>, and sits at the top of the same screen. Reserves the status bar
          the same way <Mono>Background</Mono> reserves the home indicator.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

function Specimen({
  caption,
  tall = false,
  children,
}: {
  caption: string
  /** Room for the Scroll fade, which runs 118 below the bar. */
  tall?: boolean
  children: ReactNode
}) {
  return (
    <figure className="m-0">
      <div
        className={`w-[360px] overflow-clip rounded-16 bg-surface-page shadow-[inset_0_0_0_1px_var(--color-border-subtle)] ${
          tall ? 'h-[240px]' : ''
        }`}
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

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string
  on: boolean
  onChange: (on: boolean) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`cursor-pointer rounded-08 border px-sp-12 py-sp-04 text-md leading-md font-medium transition-colors ${
        on
          ? 'border-border-brand bg-accent-purple text-text-on-brand'
          : 'border-border-subtle bg-surface-subtle text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  )
}
