import { useState, type CSSProperties, type ReactNode } from 'react'
import { Logo as Mark, LOGO_MIN_SIZE } from '../ui/Logo'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '13196-7849'


export function Logo() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Logo"
        source="02 - Worker Design System · Logo Aura · node 13196:7849"
        intro="The Aura mark: the four-pointed star, 40 × 40. Three colours and no others: Gradient for the app's own surface in either mood, White for dark backgrounds, Purple for light ones."
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

/* The default variant on the app's own surface, which follows the hub's
   theme like the Gradient does — the one view the team wants here. White and
   Purple, each on its fixed background, are in the Documentation tab. */
function Preview() {
  const [size, setSize] = useState(40)

  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      <div className="flex h-[320px] w-[480px] max-w-full shrink-0 items-center justify-center rounded-16 bg-general-surface-white shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
        <Mark color="gradient" size={size} />
      </div>

      <div className="min-w-[240px] flex-1 space-y-sp-24">
        <Control label="Size">
          <Segmented
            options={[LOGO_MIN_SIZE, 24, 32, 40, 64].map((n) => [
              String(n),
              n === 40 ? '40 · Figma' : n === LOGO_MIN_SIZE ? `${n} · min` : String(n),
            ])}
            value={String(size)}
            onChange={(next) => setSize(Number(next))}
          />
        </Control>
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Color=Gradient on the app surface (<Mono>general/surface-white</Mono>). Switch the hub to
          Dark: the surface and the gradient change together.
        </p>
      </div>
    </div>
  )
}

/* The Documentation tab mirrors the "Section - Logo Aura" frame in Figma
   (node 13202:315): description, the colours with their sample surfaces, then
   usage details — with a size strip first, as the team asked. */

/* The Gradient samples pin a mood regardless of the hub's theme, the way the
   Figma samples set the Aura collection's mode explicitly. Dark reuses the
   theme's own dark block; Light needs the two Light values restated, because
   Light lives in @theme and has no attribute to scope it to. */
const GRADIENT_LIGHT_VARS = {
  '--color-general-gradient-light': '#7a50f7',
  '--color-general-gradient-dark': '#21136c',
} as CSSProperties

const SIZES = [
  { px: LOGO_MIN_SIZE, note: 'Minimum' },
  { px: 24, note: '' },
  { px: 32, note: '' },
  { px: 40, note: 'Product surfaces' },
  { px: 64, note: '' },
] as const

function Documentation() {
  return (
    <>
      <Section
        title="Sizes"
        description="40 × 40 on product surfaces, never smaller than 18. Keep the original aspect ratio when scaling."
      >
        <div className="flex flex-wrap items-end gap-sp-40 rounded-12 bg-general-surface-white px-sp-40 pt-sp-40 pb-sp-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
          {SIZES.map(({ px, note }) => (
            <figure key={px} className="m-0 flex flex-col items-center gap-sp-12">
              <Mark size={px} />
              <figcaption className="text-center">
                <span className="block font-mono text-sm leading-sm text-text-primary">{px} px</span>
                <span className="block min-h-[16px] text-xs leading-xs text-text-tertiary">{note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        title="Colors"
        description="The Aura logo is a compact mark used across the product. It has three official variants: Gradient, White, and Purple. Use the Color property to choose the right variant for the current surface."
      >
        <div className="space-y-sp-32 rounded-20 bg-surface-subtle px-sp-56 py-sp-32">
          <ColorBlock title="Gradient">
            <div className="grid gap-sp-16 sm:grid-cols-2">
              <Sample tone="light" caption="Light surface" style={GRADIENT_LIGHT_VARS}>
                <Mark color="gradient" />
              </Sample>
              <Sample tone="dark" caption="Dark surface" mood="dark">
                <Mark color="gradient" />
              </Sample>
            </div>
          </ColorBlock>

          <ColorBlock title="White">
            <Sample tone="dark" caption="Dark background">
              <Mark color="white" />
            </Sample>
          </ColorBlock>

          <ColorBlock title="Purple">
            <Sample tone="light" caption="Light background">
              <Mark color="purple" />
            </Sample>
          </ColorBlock>

          <ColorBlock title="Usage details">
            <dl className="space-y-sp-12 rounded-12 bg-[#ffffff] p-sp-16 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
              {[
                ['Size', 'Use the 40×40 px mark for product surfaces. Keep the original aspect ratio when scaling. Never go below 18 px.'],
                ['Variant selection', 'Gradient: use Light for light surfaces and Dark for dark surfaces (Appearance Aura). White: use only on dark backgrounds. Purple: use on light backgrounds.'],
                ['Color', 'Use the Color property to switch between Gradient, White, and Purple without changing the component instance.'],
              ].map(([term, text]) => (
                <div key={term}>
                  <dt className="text-md leading-md font-medium text-[#1d2939]">{term}</dt>
                  <dd className="mt-sp-04 text-sm leading-sm text-[#475467]">{text}</dd>
                </div>
              ))}
            </dl>
          </ColorBlock>
        </div>
        <p className="mt-sp-12 max-w-[70ch] text-sm leading-sm text-text-tertiary">
          The sample surfaces are fixed, as in Figma: white (#FFFFFF) and indigo 900 (#0D082B).
          The two Gradient samples pin their mood, so both read the same whichever theme the hub is
          in.
        </p>
      </Section>

      <Section
        title="Accessibility"
        description="The mark is a graphic, so the bar is 3:1 against what it sits on (SC 1.4.11) when it carries meaning — and none when it is decorative."
      >
        <Table head={['Pairing', 'Contrast', 'Result']}>
          {[
            ['Gradient · Light on white', '4.74 – 14.90:1', 'Passes'],
            ['Gradient · Dark on indigo 900', '3.00 – 12.11:1', 'Passes'],
            ['White · Dark on indigo 900', '19.32:1', 'Passes'],
            ['White · Light on indigo 900', '3.97:1', 'Passes, narrowly — the mark is #7A50F7 in Light'],
            ['Purple on white', '3.58:1', 'Passes'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
        <p className="mt-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          Decorative by default (<Mono>aria-hidden</Mono>). Pass <Mono>label</Mono> when the mark is
          the only thing naming Aura, for example alone in an icon button.
        </p>
      </Section>

      <Section title="Known gaps" description="Flagged, not corrected.">
        <div className="space-y-sp-12">
          <GapNote severity="warning">
            In the Figma documentation frame, the White and Purple sections are still titled
            &ldquo;Light&rdquo; and &ldquo;Dark&rdquo;, and their logo instances still point at{' '}
            <Mono>Color=Light</Mono> and <Mono>Color=Dark</Mono> — names from before the variants
            became Gradient, White and Purple. The hub uses the current names.
          </GapNote>
          <GapNote severity="warning">
            <Mono>General/Logo white</Mono> is #7A50F7 in Light since 2026-10-08 (it was white in
            both modes). So in a Light screen the White variant is purple: 3.97:1 on indigo 900,
            2.81:1 on the dark end of the primary-action gradient. Confirmed by the team; recorded
            because it reverses the variant&rsquo;s name.
          </GapNote>
          <GapNote severity="warning">
            Purple binds <Mono>general/blob-purple</Mono> — the token the <Mono>Background</Mono>{' '}
            glow uses. If the glow is ever recoloured, the logo moves with it. A dedicated logo
            token would keep them apart.
          </GapNote>
        </div>
      </Section>
    </>
  )
}

function ColorBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      {/* Title/lg/semibold in purple-700, as the Figma frame sets it. */}
      <h3 className="mb-sp-12 text-2xl leading-lg font-semibold text-[#5135a5]">{title}</h3>
      {children}
    </div>
  )
}

/** A 160-tall sample surface, radius 12, with the mark centred — the Figma
 *  frame's own spec. `mood` pins the theme inside it. */
function Sample({
  tone,
  caption,
  mood,
  style,
  children,
}: {
  tone: 'light' | 'dark'
  caption: string
  mood?: 'dark'
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <figure className="m-0">
      <div
        data-theme={mood}
        style={style}
        className={`flex h-[160px] items-center justify-center rounded-12 ${
          tone === 'light'
            ? 'bg-[#ffffff] shadow-[inset_0_0_0_1px_var(--color-border-subtle)]'
            : 'bg-[#0d082b]'
        }`}
      >
        {children}
      </div>
      <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">{caption}</figcaption>
    </figure>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

function Row({ cells, mono }: { cells: string[]; mono?: number }) {
  return (
    <tr className="border-b border-border-subtle last:border-0">
      {cells.map((cell, i) => (
        <td
          key={i}
          className={`px-sp-16 py-sp-08 ${
            i === 0
              ? 'font-medium whitespace-nowrap text-text-primary'
              : i >= (mono ?? 99)
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

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">{label}</div>
      {children}
    </div>
  )
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: [string, string][]
  value: string
  onChange: (value: string) => void
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
