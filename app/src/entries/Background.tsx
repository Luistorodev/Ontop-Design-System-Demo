import { useState, type ReactNode } from 'react'
import { Background as Surface } from '../ui/Background'
import { Composer } from '../ui/Composer'
import { Topbar } from '../ui/Topbar'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '12986-9473'

/* The Breakpoints collection the frame's width and height are bound to. */
const BREAKPOINTS = [
  { id: 'mobile-360', label: 'Mobile 360', width: 360, height: 800 },
  { id: 'mobile-390', label: 'Mobile 390', width: 390, height: 844 },
  { id: 'tablet', label: 'Tablet', width: 744, height: 1133 },
] as const

export function Background() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Background"
        source="02 - Worker Design System · Background · node 12986:9473"
        intro="The surface Aura's screens sit on: general/surface-white, an optional purple-and-blue glow rising from the bottom edge, and the home indicator. Mood is the hub's Light/Dark toggle; size comes from the Breakpoints collection."
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
  const [breakpointId, setBreakpointId] = useState<string>(BREAKPOINTS[0].id)
  const [blob, setBlob] = useState(true)
  const [content, setContent] = useState(false)
  const [value, setValue] = useState('')

  const bp = BREAKPOINTS.find((b) => b.id === breakpointId) ?? BREAKPOINTS[0]

  /* Tablet gets 40 of side margin instead of the phones' 16. */
  const margin = bp.id === 'tablet' ? 'px-sp-40' : 'px-sp-16'

  return (
    <div className="space-y-sp-24">
      <BreakpointPicker active={breakpointId} onChange={setBreakpointId} />

      <div className="flex flex-wrap items-start gap-sp-40">
        <Frame width={bp.width} height={bp.height}>
          <Surface blob={blob}>
            {content ? (
              <div className="flex size-full flex-col">
                <Topbar />
                <div className="flex-1" />
                {/* Background already keeps the bottom 20 clear; 8 more puts the
                    disclaimer where the file draws it. */}
                <div className={`${margin} pb-sp-08`}>
                  <Composer value={value} onValueChange={setValue} onSend={() => setValue('')} />
                </div>
              </div>
            ) : null}
          </Surface>
        </Frame>

        <div className="min-w-[280px] flex-1 space-y-sp-24">
          <p className="max-w-[46ch] text-md leading-md text-text-secondary">
            Switch the hub to Dark to see the surface change mood. The glow does not, by design: its
            two tokens resolve the same in both moods.
          </p>

          <Control label="Properties">
            <div className="flex flex-wrap gap-sp-08">
              <Toggle label="Blob" on={blob} onChange={setBlob} />
              <Toggle label="Topbar + Composer" on={content} onChange={setContent} />
            </div>
          </Control>
        </div>
      </div>
    </div>
  )
}

/* Tablet is drawn at 60%, so it fits next to the controls. The scale is on a
   wrapper that has no backdrop-filter anywhere inside it, so it is safe. */
function Frame({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const scale = width > 400 ? 0.6 : 1
  return (
    <figure className="m-0">
      <div style={{ width: width * scale, height: height * scale }}>
        <div
          className="relative origin-top-left"
          style={{ width, height, transform: scale === 1 ? undefined : `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
      <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
        {width} × {height}
        {scale === 1 ? '' : ` · shown at ${scale * 100}%`}
      </figcaption>
    </figure>
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
        description="Two layers, back to front: the surface and the glow. The screen's content goes on top, kept clear of a reserved strip at the bottom."
      >
        <div className="mb-sp-24 flex flex-wrap items-start gap-sp-40">
          <Specimen caption="Blob = true">
            <Surface />
          </Specimen>
          <Specimen caption="Blob = false">
            <Surface blob={false} />
          </Specimen>
        </div>
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Background', 'Fills the screen. Fill general/surface-white, no radius, clips its content.'],
            ['2', 'Blob', 'Group at 70% opacity, pinned to the bottom edge and centred 4 to the right. Blue: a 280 circle in general/blob-azul with a 300 layer blur. Purple: a 372 circle in general/blob-purple with a 400 layer blur. Hangs 130 below the frame, which clips it.'],
            ['3', 'Reserved space', 'The HomeIndicator instance in Figma, a 20 strip across the bottom. Not drawn — the system draws its own. Content is padded by the larger of 20 and the device’s bottom inset.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section
        title="Types"
        description="One type. The size is not a property of the component — Figma binds width and height to the Breakpoints collection, and the component fills whatever screen it is placed in."
      >
        <Table head={['Breakpoint', 'Width', 'Height']}>
          {BREAKPOINTS.map((b) => (
            <Row key={b.id} cells={[b.label, String(b.width), String(b.height)]} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="States">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          None. The background is not interactive. Its one property, Blob, is a choice made per
          screen.
        </p>
      </Section>

      <Section title="Usage guidelines">
        <Table head={['Figma', 'Prop', 'Notes']}>
          {[
            ['Blob', 'blob', 'Boolean, true by default.'],
            ['Mood', '—', 'The hub theme. surface-white changes; the two blob tokens resolve the same in both moods.'],
            ['Breakpoints', '—', 'The caller sizes the container. The glow stays anchored to the bottom centre at every size.'],
            ['—', 'children', 'The screen. Painted over the glow, padded clear of the reserved strip.'],
          ].map((cells) => (
            <Row key={cells[0] + cells[1]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="Do & Don't">
        <DoDont
          dos={[
            'Use it as the root of an Aura screen and put the screen inside it.',
            'Keep the glow on screens where the bottom is quiet — the chat with only the Composer in it.',
            'Let the component keep the bottom clear. Do not add the 20 again in the screen.',
          ]}
          donts={[
            'Do not put text or icons over the brightest part of the glow without checking contrast there.',
            'Do not resize or reposition the glow. Its geometry is the export’s; only its colours are tokens.',
            'Do not draw a home indicator. The 20 in the file is a measurement, not a shape.',
            'Do not nest it inside another screen surface — it is the screen.',
          ]}
        />
      </Section>

      <Section title="Application">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          The Aura chat screen: Background at the root, Topbar at the top, the conversation, and
          the Composer at the bottom, clear of the reserved strip. Turn on Topbar + Composer in the
          Preview tab to see it. Side margins are 16 on the two phone breakpoints and 40 on
          tablet; the margin belongs to the screen&rsquo;s content, not to the background.
        </p>
      </Section>

      <Section
        title="Accessibility"
        description="The background carries no text of its own, but whatever sits at the bottom of the screen sits on the glow. Sampled across the bottom 120 of a 360 × 800 screen — Light from Figma's own render of the component, Dark from the export composited over the Dark surface (the file has no Dark render):"
      >
        <Table head={['Text over the glow', 'Light', 'Dark', 'Result']}>
          {[
            ['text/primary, worst point', '9.57:1', '10.89:1', 'Passes AAA'],
            ['general/help-text — the Composer disclaimer', '3.26:1', '4.57:1', 'Fails AA in Light'],
            ['general/help-text, worst point', '3.24:1', '4.23:1', 'Fails AA in both'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <div className="mt-sp-12">
          <GapNote severity="warning">
            The Composer&rsquo;s disclaimer is 12px <Mono>general/help-text</Mono> and lands on the
            densest part of the glow: 3.26:1 in Light, under the 4.5:1 AA asks for small text.
            Neither component is wrong on its own — it is the pairing. Darkening{' '}
            <Mono>general/help-text</Mono> to <Mono>text/secondary</Mono> (#475467) would clear it;
            that is a design decision, not made here.
          </GapNote>
        </div>
      </Section>

      <Section title="Known gaps" description="Transcribed from Figma, flagged, not corrected.">
        <div className="space-y-sp-12">
          <GapNote severity="warning">
            The browser draws the glow slightly lighter than Figma does: against Figma&rsquo;s render
            of the component the mean difference is 2 of 255, peaking at 11 in the densest part
            (e.g. 216 213 252 here, 209 204 251 in Figma). The geometry and colours are the
            export&rsquo;s; the gap is how each renderer approximates a 300 and 400 layer blur. It
            is left alone rather than tuned by eye.
          </GapNote>
        </div>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Shares the <Mono>Aura · General</Mono> collection with <Mono>Composer</Mono>, and
          sits under <Mono>Topbar</Mono> and <Mono>Composer</Mono> on the Aura chat screen.
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
      <div className="h-[400px] w-[180px]">
        <div className="h-[800px] w-[360px] origin-top-left scale-50">{children}</div>
      </div>
      <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
        {caption} · 360 × 800 at 50%
      </figcaption>
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

/* Same chrome as DevicePicker on the Navigation bar page, so the two pages
   read alike; it lists the Breakpoints collection instead of devices. */
function BreakpointPicker({
  active,
  onChange,
}: {
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-sp-04 rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
      {BREAKPOINTS.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => onChange(b.id)}
          className={`cursor-pointer rounded-04 px-sp-12 py-sp-04 text-sm leading-sm font-medium transition-colors ${
            active === b.id
              ? 'bg-accent-purple text-text-on-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {b.label}
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
