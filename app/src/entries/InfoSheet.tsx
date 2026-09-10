import { useState, type ReactNode } from 'react'
import { InfoSheet as Sheet, StepItem } from '../ui/InfoSheet'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { DeviceFrame, DevicePicker } from '../catalog/DeviceFrame'
import { devices } from '../catalog/devices'
import { WorkerScreen } from './WorkerScreen'
import { figmaUrl } from '../catalog/registry'
import { contrastRatio } from '../tokens/contrast'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'stepitem', label: 'StepItem' },
] as const

const SHEET_NODE = '12497-17075'
const STEPITEM_NODE = '12497-17258'

export function InfoSheet() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Info sheet"
        source="02 - Worker Design System · InfoSheet · node 12497:17075 · guidance 12538:10425"
        intro="Bottom sheet for explanation and confirmation: a content slot the caller fills, and up to two actions. It spans the viewport edge to edge and its height hugs the slot and the action stack. Its private child StepItem is documented in its own tab."
      >
        <a
          className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
          href={figmaUrl('components', SHEET_NODE)}
          target="_blank"
          rel="noreferrer"
        >
          Open in Figma ↗
        </a>
      </PageHeader>

      <ViewTabs views={VIEWS} active={view} onChange={setView} />

      {view === 'preview' ? <Preview /> : null}
      {view === 'documentation' ? <Documentation /> : null}
      {view === 'stepitem' ? <StepItemDocs /> : null}
    </>
  )
}

/* ================================================================
   Preview
   ================================================================ */

const STEPS = [
  {
    title: 'Add your bank account',
    description: 'We use it to send your money. It takes about two minutes.',
  },
  {
    title: 'Confirm your identity',
    description: 'A photo of your ID is enough. We review it the same day.',
  },
  {
    title: 'Get paid',
    description: 'Your money lands in the account you added, on your usual payday.',
  },
] as const

function Preview() {
  const [open, setOpen] = useState(true)
  const [secondary, setSecondary] = useState(true)
  const [numbered, setNumbered] = useState(true)
  const [link, setLink] = useState(true)
  const [steps, setSteps] = useState(3)
  const [deviceId, setDeviceId] = useState(devices[0].id)

  const device = devices.find((d) => d.id === deviceId) ?? devices[0]

  return (
    <div className="space-y-sp-24">
      <DevicePicker active={deviceId} onChange={setDeviceId} />

      <div className="flex flex-wrap items-start gap-sp-40">
        {/* The sheet goes in the `sheet` slot, not the `overlay` one: overlay
            centres a fixed-height bar above the safe-area inset, while this
            spans the viewport edge to edge and must not scroll with the
            content behind it. */}
        <DeviceFrame
          device={device}
          sheet={
            <Sheet
              open={open}
              onClose={() => setOpen(false)}
              label="Finish setting up your account"
              primaryLabel="Continue"
              onPrimary={() => setOpen(false)}
              secondaryLabel={secondary ? 'Not now' : undefined}
              onSecondary={() => setOpen(false)}
            >
              {STEPS.slice(0, steps).map((step, i) => (
                <StepItem
                  key={step.title}
                  title={step.title}
                  description={step.description}
                  number={numbered ? i + 1 : undefined}
                  link={link ? { label: 'Link', href: '#' } : undefined}
                />
              ))}
            </Sheet>
          }
        >
          <WorkerScreen tone="calm" />
        </DeviceFrame>

        <div className="min-w-[280px] flex-1 space-y-sp-24">
          <p className="max-w-[46ch] text-md leading-md text-text-secondary">
            Close it with the button, with a tap on the scrim, or with Escape — the guidance is
            explicit that dismissal must not depend on the close button alone. Focus moves into the
            panel on open, cannot leave it with Tab, and returns to the trigger on close.
          </p>

          <Control label="Sheet">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer rounded-08 border border-border-default bg-surface-page px-sp-16 py-sp-08 text-md leading-md font-medium text-text-primary"
            >
              {open ? 'Close the sheet' : 'Open the sheet'}
            </button>
          </Control>

          <Control label="Show Secondary-Button">
            <Segmented
              options={[
                { id: 'on', label: 'true' },
                { id: 'off', label: 'false' },
              ]}
              active={secondary ? 'on' : 'off'}
              onChange={(id) => setSecondary(id === 'on')}
            />
            <p className="mt-sp-08 max-w-[42ch] text-sm leading-sm text-text-tertiary">
              Off gives a single action and the sheet drops from 428 to 368. An outline button with
              nothing to say is noise.
            </p>
          </Control>

          <Control label="Steps in the slot">
            <Segmented
              options={[1, 2, 3].map((n) => ({ id: String(n), label: String(n) }))}
              active={String(steps)}
              onChange={(id) => setSteps(Number(id))}
            />
            <p className="mt-sp-08 max-w-[42ch] text-sm leading-sm text-text-tertiary">
              The height hugs whatever the slot contains, up to 90% of the screen. Pick three and
              the slot starts scrolling: the fade appears at the top edge, the close button stays
              floating, and the action stack holds its place.
            </p>
          </Control>

          <Control label="StepItem — optional parts">
            <div className="flex flex-wrap gap-sp-08">
              <Toggle label="Number" on={numbered} onChange={setNumbered} />
              <Toggle label="Link" on={link} onChange={setLink} />
            </div>
            <p className="mt-sp-08 max-w-[42ch] text-sm leading-sm text-text-tertiary">
              The number and the link are optional; the title and description are not. The card
              hugs, so it shortens with each part switched off.
            </p>
          </Control>

          <div>
            <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">Code</div>
            <pre className="overflow-x-auto rounded-12 border border-border-subtle bg-surface-subtle p-sp-16 font-mono text-sm leading-sm text-text-secondary">
              {[
                '<InfoSheet',
                `  open={${open}}`,
                '  onClose={close}',
                '  label="Finish setting up your account"',
                '  primaryLabel="Continue"',
                ...(secondary ? ['  secondaryLabel="Not now"'] : []),
                '>',
                '  <StepItem',
                '    title="Add your bank account"',
                '    description="We use it to send your money."',
                ...(numbered ? ['    number={1}'] : []),
                ...(link ? ['    link={{ label: \'Link\', href: \'#\' }}'] : []),
                '  />',
                '</InfoSheet>',
              ].join('\n')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Documentation — InfoSheet
   ================================================================ */

function Documentation() {
  return (
    <>
      <Section
        title="Anatomy"
        description="A fixed 360 sheet that hugs its content: close affordance, content slot, action stack and home indicator."
      >
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Sheet', 'Full viewport width, hug height capped at 90% of the screen. Fill sheet/bg, 1px inset sheet/border, top radius br-20. Vertical stack, gap sp-16.'],
            ['2', 'Close-button.space', 'Full width × 48 reserved strip. Holds no content — it clears room for the absolutely positioned close button.'],
            ['3', 'Close-button', '48 × 48, radius br-100. Fill close/bg, glyph close/icon. Floats: absolute against the sheet, so content scrolls beneath it.'],
            ['4', 'Slot-Content', 'The SLOT. Fills the width inside sp-16 side padding, gap sp-12. Scrolls once it runs out of room. Whatever goes in brings its own tokens.'],
            ['5', 'Actions', 'Primary button, plus an optional secondary. Padding sp-24 vertical / sp-16 horizontal, gap sp-12.'],
            ['6', 'HomeIndicator', 'Full width × 21 strip with a 58 × 5 bar. Fills home-indicator/bg and home-indicator/bar.'],
            ['7', 'Scroll fade', '112 tall gradient from sheet/bg, opaque for its first third then eased to transparent. Not in Figma — appears only while the slot is scrolled.'],
          ].map(([n, el, note]) => (
            <tr key={n} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-tertiary">{n}</td>
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {el}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{note}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        title="Types"
        description="One shape, two configurations — the boolean is the only axis the sheet has. Everything else is the slot."
      >
        <Table head={['Configuration', 'Height', 'When']}>
          {[
            ['Default', '428', 'Two actions. A real choice: continue, or step back.'],
            ['Single action', '368', 'Show Secondary-Button = false. One action and a close affordance.'],
            ['Scrolling', 'capped at 90%', 'The slot outgrew the screen. Fade at the top edge, floating close button, actions pinned.'],
          ].map(([c, h, w]) => (
            <tr key={c} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {c}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{h}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{w}</td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-16">
          <GapNote severity="warning">
            Both heights assume the placeholder payload at 168. They are a consequence of the slot,
            not a specification — the sheet is designed to grow, so never set a fixed height and
            never nest a scroll container that fights the hug.
          </GapNote>
        </div>
      </Section>

      <Section
        title="States"
        description="The sheet itself has two: present and absent. There is no hover and no disabled — a sheet that cannot be acted on should not be open."
      >
        <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">Motion</h3>
        <Table head={['Transition', 'Value', 'Under Reduce Motion']}>
          {[
            ['Panel enter', 'translateY 100% → 0 · 340ms · cubic-bezier(0,0,.2,1) decelerate', 'Snaps'],
            ['Panel exit', 'translateY 0 → 100% · 200ms · cubic-bezier(.4,0,1,1) accelerate', 'Snaps'],
            ['Scrim enter / exit', 'opacity 0 → 1 · 200ms · cubic-bezier(.4,0,.2,1)', 'Snaps'],
            ['Scroll fade', 'opacity 0 → 1 · 200ms · cubic-bezier(.4,0,.2,1)', 'Snaps'],
          ].map(([t, v, r]) => (
            <tr key={t} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{v}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-12">
          <GapNote severity="warning">
            Neither transition comes from Figma — the file specifies no motion for this component,
            and <Mono>DESIGN.md</Mono> §11.11 records that there are no motion tokens at all. Both
            values are a build decision and need a designer&rsquo;s sign-off before other sheets
            copy them.
          </GapNote>
        </div>
      </Section>

      <Section title="Usage guidelines">
        <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Figma properties
        </h3>
        <Table head={['Property', 'Type', 'Default', 'Notes']}>
          {[
            ['Slot-Content', 'SLOT', '_SlotContent', 'Two preferred values. The payload brings its own tokens — the sheet never recolours it.'],
            ['Show Secondary-Button', 'BOOLEAN', 'true', 'Hides the outline button. Sheet height drops from 428 to 368.'],
          ].map(([p, t, d, n]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-secondary">{d}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
            </tr>
          ))}
        </Table>

        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Props
        </h3>
        <Table head={['Property', 'Type', 'Required', 'Notes']}>
          {[
            ['open', 'boolean', 'yes', 'The sheet is presence, not visibility — it unmounts when closed.'],
            ['onClose', '() => void', 'yes', 'Honoured by the close button, the scrim and Escape alike.'],
            ['label', 'string', 'yes', 'Names the dialog. The slot is the caller’s, so only the caller knows what the sheet is about.'],
            ['children', 'ReactNode', 'yes', 'The slot. Side padding and gap are applied by the sheet; colour is not.'],
            ['primaryLabel', 'string', 'yes', 'Instance override in Figma, a real prop here.'],
            ['secondaryLabel', 'string?', '—', 'Omit for a single action. This is Show Secondary-Button.'],
            ['onPrimary / onSecondary', '() => void', '—', 'Optional: an action that only dismisses can rely on onClose.'],
            ['closeLabel', 'string?', '—', 'Localised accessible name for the close button. Defaults to "Close".'],
          ].map(([p, t, r, n]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-12">
          <GapNote severity="warning">
            Figma exposes neither button label as a property — both are instance overrides, and the
            guidance says so. They are props here because a sheet whose primary action cannot be
            named has no contract. If a caller needs to drive them in Figma too, they should become
            TEXT properties on the Button instances, not on the sheet.
          </GapNote>
        </div>

        <h3 className="mt-sp-32 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Sizing & measurements
        </h3>
        <Table head={['Element', 'Size', 'Token', 'Notes']}>
          {[
            ['Sheet', 'fill × hug', '—', 'Spans the viewport. 360 in Figma is the reference screen width — see Deviations. Height hugs the slot and the action stack.'],
            ['Sheet max height', '90% of screen', '—', 'The cap that turns the slot into a scroll region. Not in Figma — see Deviations.'],
            ['Sheet top radius', '20', 'br-20', 'Bottom corners are square — the sheet sits flush with the screen edge.'],
            ['Sheet padding', '24 top only', 'sp-24', 'Sides and bottom are 0. Horizontal padding belongs to the children.'],
            ['Sheet gap', '16', 'sp-16', 'Between the close strip, slot, actions and home indicator.'],
            ['Close-button.space', 'fill × 48', '—', 'Empty reserved strip. Keeps the slot clear of the absolute close button.'],
            ['Close-button', '48 × 48', 'br-100', 'Absolute, 16 from the right and 24 from the top. Meets the 44 px target minimum.'],
            ['Slot-Content', 'fill × hug', '—', 'Side padding sp-16, inner gap sp-12.'],
            ['Slot payload', 'fill × hug', '—', '328 on a 360 screen — the slot width less sp-16 either side. 168 tall with the placeholder in; any height is valid, and past the cap it scrolls.'],
            ['Scroll fade', 'fill × 112', '—', 'sheet/bg, opaque to 36% then eased to transparent. Fades in over 200ms once scrollTop leaves 0.'],
            ['Actions', 'fill × hug', '—', 'Padding sp-24 vertical, sp-16 horizontal. Gap sp-12.'],
            ['Button', 'fill × 48', '—', 'Size lg, 328 on a 360 screen. The secondary is optional.'],
            ['HomeIndicator', 'fill × 21', '—', 'Bar is 58 × 5, radius br-100.'],
            ['Default height', '428', '—', 'Placeholder slot with both buttons on. Drops to 368 with the secondary off.'],
          ].map(([el, size, token, note]) => (
            <tr key={el} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {el}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {size}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-tertiary">
                {token}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{note}</td>
            </tr>
          ))}
        </Table>

        <h3 className="mt-sp-32 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Colour & tokens
        </h3>
        <p className="mb-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          Six semantic tokens in <Mono>InfoSheet/Color</Mono>, aliased to Color System, mirroring
          the values of <Mono>Buttom_Sheet [New]</Mono>. Subcomponents are deliberately excluded.
        </p>
        <TokenTable rows={SHEET_TOKENS} />

        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Non-colour tokens
        </h3>
        <Table head={['Property', 'Token', 'Value', 'Status']}>
          {[
            ['Sheet top padding', 'sp-24', '24', 'Bound'],
            ['Sheet gap', 'sp-16', '16', 'Bound'],
            ['Sheet top radius', 'br-20', '20', 'Bound'],
            ['Slot side padding', 'sp-16', '16', 'Bound'],
            ['Slot gap', 'sp-12', '12', 'Bound'],
            ['Actions padding', 'sp-24 · sp-16', '24 · 16', 'Bound'],
            ['Actions gap', 'sp-12', '12', 'Bound — was 10 and off-scale'],
            ['Close-button radius', 'br-100', 'full', 'Bound'],
          ].map(([p, t, v, s]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{v}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{s}</td>
            </tr>
          ))}
        </Table>

        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Not tokenised by this component
        </h3>
        <Table head={['Element', 'Owns', 'Why']}>
          {[
            ['Button (primary, secondary)', 'Button/Color', 'Full state matrix already tokenised. Driven at screen level.'],
            ['Slot payload', 'its own collection', 'Whatever is inserted keeps its own tokens. The sheet never recolours it.'],
            ['_SlotContent placeholder', '— none', 'Raw #F3F2F2 / #C9C5C5. It is scaffolding meant to be deleted, so it stays flat in Dark.'],
          ].map(([el, owns, why]) => (
            <tr key={el} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {el}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {owns}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{why}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Do & Don't">
        <DoDont
          dos={[
            'Use it for explanation and confirmation — content the user reads, then acts on with one or two choices.',
            'Put StepItem lists or copy blocks in the slot. That is what it is for.',
            'Turn the secondary action off when there is only one real action. An outline button with nothing to say is noise.',
            'Let the height hug. The sheet is designed to grow with the slot.',
            'Delete the _SlotContent placeholder once the real content is in — it is scaffolding, not a default.',
          ]}
          donts={[
            'Do not recolour anything inside the slot from the sheet. The payload owns its tokens.',
            'Do not paint the inner frames. They are transparent on purpose so sheet/bg stays the single source of truth.',
            'Do not set a fixed height, and do not nest a scroll container that fights the hug.',
            'Do not put more than two actions in the stack. Three or more means the sheet is doing a menu’s job.',
            'Do not use it for transient feedback — that is Alert, not a sheet the user has to dismiss.',
          ]}
        />
      </Section>

      <Section
        title="Application"
        description="The sheet is a modal surface: while it is open it owns the screen, and everything behind it is inert."
      >
        <div className="space-y-sp-12">
          <p className="max-w-[70ch] text-md leading-md text-text-secondary">
            In the product the sheet is a portal to the document root. Here it is positioned{' '}
            <Mono>absolute</Mono> so it can be demonstrated inside a device frame — the only
            difference is <Mono>absolute</Mono> becoming <Mono>fixed</Mono>.
          </p>
          <GapNote severity="warning">
            The scrim resolves <Mono>surface/overlay</Mono>, which <Mono>DESIGN.md</Mono> §11.5
            flags: in Light it is <Mono>#1D2939</Mono>, the same value as{' '}
            <Mono>surface/card-sunken</Mono> and <Mono>surface/inverse</Mono>. Three intents, one
            value. A dark neutral is correct for a scrim, so it is used exactly as published — the
            collision is a Foundations gap, not a licence to invent a value here.
          </GapNote>
        </div>
      </Section>

      <Section
        title="Accessibility"
        description="Contrast for the chrome the sheet owns, plus target sizes. Ratios are measured from the tokens in this build and compared with the figure the Figma guidance states, so the table cannot rot silently."
      >
        <MeasuredTable rows={SHEET_A11Y} />
        <div className="mt-sp-16 space-y-sp-12">
          <Table head={['Target', 'Size', 'Result']}>
            {[
              ['Close-button', '48 × 48', 'Passes — above the 44 minimum of SC 2.5.8 and 2.5.5'],
              ['Button', '328 × 48', 'Passes'],
            ].map(([t, s, r]) => (
              <tr key={t} className="border-b border-border-subtle last:border-0">
                <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                  {t}
                </td>
                <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{s}</td>
                <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
              </tr>
            ))}
          </Table>
          <p className="max-w-[70ch] text-md leading-md text-text-secondary">
            The circle-on-sheet, home-bar and border pairs all sit near 1:1 and are marked{' '}
            <strong className="text-text-primary">Review</strong> in the guidance rather than
            failed: each reads by fill alone and carries no meaning on its own. The close glyph is
            what has to pass, and it does in both modes.
          </p>
          <GapNote severity="warning">
            The scroll region is a tab stop only while it overflows, so its content is reachable
            without a pointer (SC 2.1.1), but it carries no accessible name: the only name this
            component knows is the dialog&rsquo;s, and reusing it would announce the same string
            twice. A product implementation whose slot warrants one should name the region.
          </GapNote>
          <GapNote severity="warning">
            Dismissal must not depend on the close button alone — the scrim tap and the system back
            gesture need to close the sheet too. This build wires the close button, the scrim and
            Escape; a native implementation must add the back gesture.
          </GapNote>
        </div>
      </Section>

      <Section
        title="Deviations found while building"
        description="Where the Figma guidance and the Figma component disagree, or where a decision had to be made that the file does not cover. CLAUDE.md says the component wins and the document gets corrected — so these are recorded, never silently resolved."
      >
        <div className="space-y-sp-12">
          <Deviation title="Button/Color has Dark values, and the guidance says it does not">
            The Light and Dark stages both resolve the button tokens
            (<Mono>Primary/Outline/bg/default</Mono> moves from <Mono>#FFFFFF</Mono> to{' '}
            <Mono>#181031</Mono>), yet the note under the Light and Dark section states the buttons
            &ldquo;do not follow in this preview&rdquo;. They do. The values are transcribed from
            the resolved stages rather than the note.
          </Deviation>
          <Deviation title="The slot scrolls, which the guidance tells you not to do">
            The Don&rsquo;t list says <em>&ldquo;don&rsquo;t set a fixed height, and don&rsquo;t
            nest a scroll container that fights the hug&rdquo;</em>. That holds while the slot is
            Figma&rsquo;s fixed 168 placeholder, and breaks the moment a caller puts three steps in
            it: at 254 a step, three of them plus the sheet&rsquo;s own chrome ask for more than a
            phone has. This build caps the sheet at 90% of the screen and scrolls the slot past
            that point — the hug is untouched below the cap, so the 428 and 368 heights still hold.
            The alternative was a sheet that grows off the bottom of the screen and takes its
            action stack with it, which is worse than the deviation. Needs a designer&rsquo;s
            decision on the cap: 90% is a build choice, not a specified value.
          </Deviation>
          <Deviation title="The scroll fade and the floating close button are additions">
            Neither exists in the Figma component, because neither has anything to do until the
            slot scrolls. The close button was already absolute, so it floats for free; what is new
            is that the reserved 48 strip now sits <em>inside</em> the scroll region, so content
            travels up behind the button rather than stopping short of it. The fade — 112 of{' '}
            <Mono>sheet/bg</Mono>, opaque for its first third and then eased to transparent —
            exists so that content does not hard-cut at the panel edge, which reads as a clipping
            bug rather than as more content above. The opaque stretch is deliberate: it masks the
            grab handle and the top of the close button, so content reads as passing under the
            chrome. It carries no token of its own and resolves in both modes from{' '}
            <Mono>sheet/bg</Mono>.
          </Deviation>
          <Deviation title="360 is a reference width, not a component width">
            The frame is drawn 360 wide, but a bottom sheet spans the screen —
            stranding a 360 panel in the middle of a 402 or 412 point device would leave a gutter
            of page down both sides. What the file actually specifies is the <Mono>sp-16</Mono> of
            side padding its children carry, so the sheet fills the viewport and the buttons land
            at 328 only on a 360 screen. Same reading the navigation bar takes of its own 360.
          </Deviation>
          <Deviation title="The buttons and the link are provisional">
            Button and Link do not exist in <Mono>src/ui</Mono> yet, so both are drawn inside these
            components from their real token values. Only the <Mono>default</Mono> state is
            covered: hover, pressed, disabled and loading belong to Button. The token block in{' '}
            <Mono>index.css</Mono> is marked scaffolding and should be deleted when Button ships.
          </Deviation>
          <Deviation title="Offsets of −1px are stroke compensation, not measurements">
            Figma pins the home indicator at <Mono>top: −1</Mono> and the close button at{' '}
            <Mono>15 / 23</Mono> so both sit over the 1px stroke. With CSS{' '}
            <Mono>border-box</Mono> the equivalent is 0 and 16 / 24 from the border box, which is
            the 16 and 24 the measurement table states.
          </Deviation>
          <Deviation title="The scrim is not part of the Figma component">
            The component is the panel alone. The scrim, the motion and the focus handling are
            added here because the component&rsquo;s own accessibility section requires them.
          </Deviation>
          <Deviation title="No motion is specified anywhere">
            The file defines no transition for this component, and{' '}
            <Mono>DESIGN.md</Mono> §11.11 records that Foundations has no motion tokens at all.
            The 280ms slide and 200ms fade are a build decision awaiting sign-off.
          </Deviation>
        </div>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Mirrors <Mono>Buttom_Sheet [New]</Mono>, so the two sheets are visually identical in
          either mode. Consumes <Mono>Gray Blue</Mono> and <Mono>Indigo (Secondary)</Mono> from
          Foundations through <Mono>InfoSheet/Color</Mono>, plus <Mono>sp-12</Mono>,{' '}
          <Mono>sp-16</Mono>, <Mono>sp-24</Mono>, <Mono>br-20</Mono> and <Mono>br-100</Mono>. Its
          private child is documented in the StepItem tab. For transient feedback use Alert
          instead.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Documentation — StepItem
   ================================================================ */

function StepItemDocs() {
  return (
    <>
      <Section
        title="StepItem"
        description="A private child of InfoSheet — one numbered step: display number, title, description and an optional link. It is not a standalone card, and it has no page of its own in Figma’s component list for that reason."
        aside={
          <a
            className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
            href={figmaUrl('components', STEPITEM_NODE)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Figma ↗
          </a>
        }
      >
        {/* The stage paints sheet/bg, not surface/subtle: the card is only ever
            seen against the InfoSheet background, and in Dark surface/subtle
            resolves to the very same #1D2939 as card/bg — on that stage the
            card would vanish, hiding the 1.36:1 the accessibility table is
            about. */}
        {/* Each card is boxed at 328 here — the width it has inside a 360
            reference screen. The component itself fills its slot, so the
            constraint belongs to the stage, not to StepItem. */}
        <div className="flex flex-wrap items-start gap-sp-24 rounded-16 border border-border-subtle bg-sheet-bg p-sp-24">
          <div className="w-[328px]">
            <StepItem
              title="Tittle Label"
              description="Description Label"
              number={1}
              link={{ label: 'Link', href: '#' }}
            />
          </div>
          <div className="w-[328px]">
            <StepItem title="Tittle Label" description="Description Label" number={2} />
          </div>
        </div>
      </Section>

      <Section
        title="Anatomy"
        description="Container, display number, title, description and trailing link. The number and the link are optional; the title and description are not. Figma also carries an illustration slot, dropped here by team decision — see Deviations."
      >
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Container', 'Vertical auto-layout, 328 fixed / hug height. Radius br-12, padding sp-12. Fill card/bg.'],
            ['2', 'Step number', 'Display text 48/56 Semibold, colour number/text. Sits outside the Typescale.'],
            ['3', 'Title', 'font-size/lg + line-height/title-md, Semibold. Colour text/primary. One line.'],
            ['4', 'Description', 'font-size/lg + line-height/lg, Regular. Colour text/secondary. Wraps freely.'],
            ['5', 'Link', 'Link · Size sm · Colour Primary. Optional. Owns its colour from Component/Link.'],
            ['6', 'Inner spacing', 'sp-04 between title and description. Root gap sp-08.'],
          ].map(([n, el, note]) => (
            <tr key={n} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-tertiary">{n}</td>
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {el}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{note}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        title="Sizing & measurements"
        description="Height always hugs, so it drops with each optional part switched off."
      >
        <Table head={['Element', 'Size', 'Token', 'Notes']}>
          {[
            ['Container', 'fill × hug', '—', 'Fills the slot — 328 on a 360 screen. Height hugs so the description can wrap to any length.'],
            ['Container padding', '12 all sides', 'sp-12', 'Bound.'],
            ['Container radius', '12', 'br-12', 'Bound.'],
            ['Root gap', '8', 'sp-08', 'Bound — the guidance still calls this an unbound 10. See Deviations.'],
            ['Step number', '48 / 56', '— none', 'Heading/3xl, unbound. Typescale caps at font-size/6xl 40 and line-height/5xl 48.'],
            ['Title', '16 / 22', 'font-size/lg · line-height/title-md', 'Fills the container width. One line.'],
            ['Description', '16 / 24', 'font-size/lg · line-height/lg', 'Fills the container width, wraps freely.'],
            ['Title → description gap', '4', 'sp-04', 'Bound.'],
            ['Link', 'hug × 20', '—', 'Size sm. Optional.'],
            ['Default height', '166', '—', 'Number, title, description and link at 328 wide. Drops to 138 with the link off. Figma states 254, which includes the illustration slot.'],
          ].map(([el, size, token, note]) => (
            <tr key={el} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {el}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {size}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-tertiary">
                {token}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{note}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Usage guidelines">
        <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Figma properties
        </h3>
        <Table head={['Property', 'Type', 'Default', 'Notes']}>
          {[
            ['Ilustration Slot', 'SLOT', 'Illustration/Send', 'Not implemented — dropped by team decision. 93 preferred values in Figma, effectively the whole illustration library.'],
            ['Show Ilustration Slot', 'BOOLEAN', 'true', 'Not implemented — the slot it toggles no longer exists in code.'],
            ['Show Numer Tittle', 'BOOLEAN', 'true', 'Hides the display number. The name is ambiguous — it reads as if it also controlled the title.'],
            ['Show Link', 'BOOLEAN', 'true', 'Hides the trailing link.'],
            ['Title', '— not exposed', 'Tittle Label', 'Should be a TEXT property. Without it the component has no contract.'],
            ['Description', '— not exposed', 'Description Label', 'Should be a TEXT property.'],
            ['Number', '— not exposed', '1', 'Should be a TEXT property, driven by the parent list order.'],
          ].map(([p, t, d, n]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-secondary">{d}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
            </tr>
          ))}
        </Table>

        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Props
        </h3>
        <Table head={['Property', 'Type', 'Required', 'Notes']}>
          {[
            ['title', 'string', 'yes', 'One line. Let the description carry the detail.'],
            ['description', 'string', 'yes', 'Wraps freely — which is why the container must keep hugging.'],
            ['number', 'number?', '—', 'Decorative and aria-hidden. Let the parent own it so the sequence stays consecutive.'],
            ['link', '{ label, href }?', '—', 'Provisional until Link is built.'],
          ].map(([p, t, r, n]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-12">
          <GapNote severity="warning">
            The three text layers are not exposed as properties in Figma — they are edited by
            override only, which the guidance itself lists as a gap. They are ordinary props here.
          </GapNote>
        </div>

        <h3 className="mt-sp-32 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Colour & tokens
        </h3>
        <p className="mb-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          Five semantic tokens in <Mono>StepItem/Color</Mono>, aliased to Color System. The title
          and description previously borrowed from <Mono>BottomSheet/Color</Mono> — that coupling
          was removed on purpose. In code the collection is prefixed{' '}
          <Mono>stepitem-</Mono> because <Mono>text/primary</Mono> and{' '}
          <Mono>text/secondary</Mono> collide with the tier-3 globals of the same name and carry a
          different Dark value.
        </p>
        <TokenTable rows={STEPITEM_TOKENS} />
        <div className="mt-sp-16">
          <GapNote severity="blocking">
            <Mono>card/border</Mono> exists in the collection and is bound to nothing. It is
            emitted in both modes and deliberately left unapplied here, because a hub that binds a
            token Figma leaves loose stops matching the file. In Dark the card separates from the
            sheet by fill alone at 1.36:1 — bind it before shipping Dark.
          </GapNote>
        </div>
      </Section>

      <Section title="Do & Don't">
        <DoDont
          dos={[
            'Use StepItem only inside InfoSheet. It is a private child, not a standalone card.',
            'Let the parent own the numbering so the sequence stays consecutive when a step is added or removed.',
            'Keep the title to one line and let the description carry the detail.',
            'Turn the number off when the list is not a sequence — the container hugs and the card shortens.',
            'Bind card/border before shipping Dark; without it the card sits at 1.36:1 against the sheet.',
          ]}
          donts={[
            'Do not hardcode the title or description colour — both resolve from StepItem/Color.',
            'Do not pull text/primary or text/secondary from BottomSheet/Color. That coupling was removed on purpose.',
            'Do not reuse the 48/56 display number elsewhere until it exists in Typescale.',
            'Do not set a fixed height. The container hugs so the description can wrap to any length.',
            'Do not use StepItem for status messages (use Alert) or for selectable options (use SelectableCard).',
          ]}
        />
      </Section>

      <Section
        title="Accessibility"
        description="Measured against the resolved card fill in each mode, and against the InfoSheet background for the surface pairs."
      >
        <MeasuredTable rows={STEPITEM_A11Y} />
        <div className="mt-sp-16 space-y-sp-12">
          <GapNote severity="blocking">
            The Dark hierarchy step has collapsed. <Mono>text/secondary</Mono> resolves to
            gray-blue-100 <Mono>#F9FAFB</Mono> against a <Mono>#FFFFFF</Mono> title — 1.05:1, so
            the description reads as bright as the heading above it. In Light the same pair sits at
            1.91:1. The guidance describes this token as gray-blue-400, which would have given
            1.47:1; the component no longer resolves that value. Either restore a darker step or
            accept that Dark has no visual hierarchy inside the card.
          </GapNote>
          <p className="max-w-[70ch] text-md leading-md text-text-secondary">
            The step number is decorative: it is <Mono>aria-hidden</Mono> here, because order must
            be conveyed by the reading sequence rather than by the digit. Screen readers should
            announce title then description as one group.
          </p>
        </div>
      </Section>

      <Section
        title="Deviations found while building"
        description="The StepItem guidance frame is the one place where the written spec and the component measurably disagree."
      >
        <div className="space-y-sp-12">
          <Deviation title="The illustration slot was dropped by team decision">
            Figma carries an 80 × 80 <Mono>Ilustration Slot</Mono> with 93 preferred values,
            defaulting to <Mono>Illustration/Send</Mono>, plus the{' '}
            <Mono>Show Ilustration Slot</Mono> boolean that toggles it. Neither is implemented: the
            team removed the illustration, so the card is number, title, description and link, and
            the default height drops from 254 to <strong className="text-text-primary">166</strong>.
            The file and this component now disagree, which is the one thing this hub is not
            supposed to do — the slot needs to come out of Figma too, or this page will keep
            reporting a property that no longer exists anywhere but the file.
          </Deviation>
          <Deviation title="The root gap is bound, and the heights are 6px shorter">
            The guidance calls the root gap &ldquo;10 px, unbound, off-scale&rdquo; and gives 260
            for the default height and 140 with the illustration and link off. The component binds{' '}
            <Mono>sp-08</Mono>, and all three numbers follow: the Figma symbol — which still has
            the illustration slot in it — measures{' '}
            <strong className="text-text-primary">328 × 254</strong>, and the reduced variant 138.
            Three gaps at 8 instead of 10 is exactly the 6px difference. The gap was fixed after
            the guidance was written.
          </Deviation>
          <Deviation title="Two Dark colour values in the guidance are stale">
            The guidance Dark column states <Mono>number/text</Mono> = indigo-100{' '}
            <Mono>#B7B2D5</Mono> and <Mono>text/secondary</Mono> = gray-blue-400{' '}
            <Mono>#D0D5DD</Mono>. Both Dark stages — <Mono>12500:32071</Mono> and{' '}
            <Mono>12538:10529</Mono> — resolve indigo-50 <Mono>#EFEDFD</Mono> and gray-blue-100{' '}
            <Mono>#F9FAFB</Mono> instead. The resolved values are transcribed, and the two
            accessibility ratios that depended on them are recomputed above rather than copied.
          </Deviation>
          <Deviation title="The Link glyph is not the glyph its layer is named after">
            The trailing icon layer is called <Mono>link-external-02</Mono>, but the vector Figma
            exports is a chevron. The component is named after what it draws.
          </Deviation>
          <Deviation title="Show Numer Tittle is ambiguously named">
            It hides the display number only, not the title. Recorded in the guidance as a gap and
            repeated here because the name will mislead whoever wires the property next.
          </Deviation>
        </div>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Lives only inside <Mono>InfoSheet</Mono>. Consumes <Mono>Gray Blue</Mono> and{' '}
          <Mono>Indigo (Secondary)</Mono> through <Mono>StepItem/Color</Mono>, the{' '}
          <Mono>Link</Mono> component through <Mono>Component/Link</Mono>, and{' '}
          <Mono>sp-04</Mono>, <Mono>sp-08</Mono>, <Mono>sp-12</Mono> and <Mono>br-12</Mono>.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Token and contrast data

   Every hex is the value the Figma node resolves, read with
   get_variable_defs on the Light node and on the Dark stage. The page
   recomputes each ratio from these values and prints it next to the figure
   the guidance states, so drift surfaces instead of being inherited.
   ================================================================ */

type TokenRow = { token: string; light: string; dark: string; alias: string; appliedTo: string }

const SHEET_TOKENS: TokenRow[] = [
  { token: 'sheet/bg', light: '#FFFFFF', dark: '#08051A', alias: 'base-white / indigo-950', appliedTo: 'Sheet surface' },
  { token: 'sheet/border', light: '#F2F4F7', dark: '#344054', alias: 'gray-blue-200 / gray-blue-800', appliedTo: '1px sheet edge' },
  { token: 'close/bg', light: '#F2F4F7', dark: '#344054', alias: 'gray-blue-200 / gray-blue-800', appliedTo: 'Close button circle' },
  { token: 'close/icon', light: '#667085', dark: '#D0D5DD', alias: 'gray-blue-600 / gray-blue-400', appliedTo: 'Close button glyph' },
  { token: 'home-indicator/bg', light: '#FFFFFF', dark: '#08051A', alias: 'base-white / indigo-950', appliedTo: 'Home indicator strip' },
  { token: 'home-indicator/bar', light: '#D0D5DD', dark: '#667085', alias: 'gray-blue-400 / gray-blue-600', appliedTo: 'Home indicator bar' },
]

const STEPITEM_TOKENS: TokenRow[] = [
  { token: 'card/bg', light: '#F2F4F7', dark: '#1D2939', alias: 'gray-blue-200 / gray-blue-900', appliedTo: 'Container fill' },
  { token: 'card/border', light: '#EAECF0', dark: '#475467', alias: 'gray-blue-300 / gray-blue-700', appliedTo: 'Optional edge — created, not bound' },
  { token: 'number/text', light: '#281782', dark: '#EFEDFD', alias: 'indigo-500 / indigo-50', appliedTo: 'Display step number' },
  { token: 'text/primary', light: '#1D2939', dark: '#FFFFFF', alias: 'gray-blue-900 / base-white', appliedTo: 'Step title' },
  { token: 'text/secondary', light: '#475467', dark: '#F9FAFB', alias: 'gray-blue-700 / gray-blue-100', appliedTo: 'Step description' },
]

type A11yRow = { pair: string; fg: string; bg: string; stated: number; verdict: string; note: string }

const SHEET_A11Y: A11yRow[] = [
  { pair: 'Close glyph on circle · Light', fg: '#667085', bg: '#F2F4F7', stated: 4.42, verdict: 'Pass', note: 'Non-text UI needs 3:1. Comfortable margin.' },
  { pair: 'Close glyph on circle · Dark', fg: '#D0D5DD', bg: '#344054', stated: 7.01, verdict: 'Pass', note: 'gray-blue-400 on gray-blue-800.' },
  { pair: 'Close circle on sheet · Light', fg: '#F2F4F7', bg: '#FFFFFF', stated: 1.11, verdict: 'Review', note: 'The circle reads by fill alone. Acceptable — the glyph carries the meaning.' },
  { pair: 'Close circle on sheet · Dark', fg: '#344054', bg: '#08051A', stated: 1.94, verdict: 'Review', note: 'Same situation, slightly stronger.' },
  { pair: 'Home bar on strip · Light', fg: '#D0D5DD', bg: '#FFFFFF', stated: 1.47, verdict: 'Review', note: 'Platform affordance, decorative. Matches the OS treatment.' },
  { pair: 'Home bar on strip · Dark', fg: '#667085', bg: '#08051A', stated: 4.07, verdict: 'Pass', note: '' },
  { pair: 'Sheet border on sheet · Light', fg: '#F2F4F7', bg: '#FFFFFF', stated: 1.11, verdict: 'Review', note: 'Decorative edge, not a functional boundary.' },
]

const STEPITEM_A11Y: A11yRow[] = [
  { pair: 'Title on card · Light', fg: '#1D2939', bg: '#F2F4F7', stated: 13.03, verdict: 'Pass', note: 'text/primary on card/bg.' },
  { pair: 'Description on card · Light', fg: '#475467', bg: '#F2F4F7', stated: 6.83, verdict: 'Pass', note: 'text/secondary on card/bg. AAA at large sizes.' },
  { pair: 'Step number on card · Light', fg: '#281782', bg: '#F2F4F7', stated: 12.28, verdict: 'Pass', note: 'Decorative, but clears AA as body text anyway.' },
  { pair: 'Title on card · Dark', fg: '#FFFFFF', bg: '#1D2939', stated: 14.53, verdict: 'Pass', note: 'base-white on gray-blue-900.' },
  { pair: 'Description on card · Dark', fg: '#F9FAFB', bg: '#1D2939', stated: 9.85, verdict: 'Pass', note: 'Stated for gray-blue-400; the token now resolves gray-blue-100.' },
  { pair: 'Step number on card · Dark', fg: '#EFEDFD', bg: '#1D2939', stated: 7.15, verdict: 'Pass', note: 'Stated for indigo-100; the token now resolves indigo-50.' },
  { pair: 'Title vs description · Light', fg: '#475467', bg: '#1D2939', stated: 0, verdict: 'Review', note: 'The hierarchy step inside the card. Not in the guidance.' },
  { pair: 'Title vs description · Dark', fg: '#F9FAFB', bg: '#FFFFFF', stated: 0, verdict: 'Fail', note: 'The step has collapsed — see the note below.' },
  { pair: 'Card on sheet · Light', fg: '#F2F4F7', bg: '#FFFFFF', stated: 1.11, verdict: 'Review', note: 'Surface on surface. The card reads by fill difference alone.' },
  { pair: 'Card on sheet · Dark', fg: '#1D2939', bg: '#08051A', stated: 1.38, verdict: 'Review', note: 'Against indigo-950. Bind card/border or the card disappears.' },
  { pair: 'Card border on sheet · Dark', fg: '#475467', bg: '#08051A', stated: 2.64, verdict: 'Review', note: 'Below the 3:1 of SC 1.4.11. Fine as decoration.' },
]

/* ================================================================
   Local chrome
   ================================================================ */

function TokenTable({ rows }: { rows: TokenRow[] }) {
  return (
    <Table head={['Token', 'Light', 'Dark', 'Alias', 'Applied to']}>
      {rows.map((r) => (
        <tr key={r.token} className="border-b border-border-subtle last:border-0">
          <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
            {r.token}
          </td>
          <td className="px-sp-16 py-sp-08">
            <Swatch hex={r.light} />
          </td>
          <td className="px-sp-16 py-sp-08">
            <Swatch hex={r.dark} />
          </td>
          <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-tertiary">
            {r.alias}
          </td>
          <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r.appliedTo}</td>
        </tr>
      ))}
    </Table>
  )
}

function Swatch({ hex }: { hex: string }) {
  return (
    <span className="flex items-center gap-sp-08 whitespace-nowrap">
      <span
        className="checker inline-block size-[20px] shrink-0 rounded-04 border border-border-subtle"
        style={{ background: hex }}
      />
      <span className="font-mono text-sm text-text-secondary">{hex}</span>
    </span>
  )
}

/* The measured column is the point of this table: contrast.ts recomputes every
   ratio from the tokens in this build, so a value that drifts from the figure
   the guidance states shows up here instead of being inherited on trust. */
function MeasuredTable({ rows }: { rows: A11yRow[] }) {
  return (
    <Table head={['Pair', 'Stated', 'Measured', 'Result', 'Note']}>
      {rows.map((r) => {
        const measured = contrastRatio(r.fg, r.bg)
        const drifted = r.stated > 0 && Math.abs(measured - r.stated) > 0.5
        return (
          <tr key={r.pair} className="border-b border-border-subtle last:border-0">
            <td className="px-sp-16 py-sp-08 text-text-primary">{r.pair}</td>
            <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-tertiary">
              {r.stated > 0 ? `${r.stated.toFixed(2)}:1` : '—'}
            </td>
            <td
              className={`px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap ${
                drifted ? 'font-semibold text-accent-red' : 'text-text-primary'
              }`}
            >
              {measured.toFixed(2)}:1
              {drifted ? ' ⚠' : ''}
            </td>
            <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r.verdict}</td>
            <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r.note}</td>
          </tr>
        )
      })}
    </Table>
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

function Deviation({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12">
      <h3 className="text-md leading-md font-semibold text-text-primary">{title}</h3>
      <p className="mt-sp-04 max-w-[80ch] text-sm leading-sm text-text-secondary">{children}</p>
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

function Segmented({
  options,
  active,
  onChange,
}: {
  options: readonly { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="inline-flex rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`cursor-pointer rounded-04 px-sp-16 py-sp-04 text-md leading-md font-medium transition-colors ${
            active === o.id
              ? 'bg-accent-purple text-text-on-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {o.label}
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
