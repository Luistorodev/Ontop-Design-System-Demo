import { useState, type ReactNode } from 'react'
import { Composer as Field } from '../ui/Composer'
import { Banner, type BannerType } from '../ui/Banner'
import { ChatScreenView } from './ChatScreen'
import { SAMPLE_ATTACHMENTS, SAMPLE_TAGS } from './chatScreenData'
import { useChatScreen } from './useChatScreen'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'banner', label: 'Banner' },
] as const

const NODE = '12921-7956'
const BANNER_NODE = '13203-8052'

export function Composer() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Composer"
        source="02 - Worker Design System · Composer · node 12921:7956"
        intro="The field Aura's chat is written in, with its quick actions: attach, voice, send and stop. Figma carries four variants, Size x State. Mood is Light only in the file; Dark comes from the token collection, so the hub's Light/Dark toggle covers it."
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
      {view === 'banner' ? <BannerDocs /> : null}
    </>
  )
}

/* ================================================================
   Preview
   ================================================================ */

/* Figma's "Configurations" section (node 13075:2646): each supported
   combination, with the file's own description. The texts are the file's;
   the field shows the file's sample prompt where it draws one. */
const noop = () => {}
const CONFIGURATIONS: {
  title: string
  description: string
  /** Room for the scroll fade in the specimen. */
  scroll?: boolean
  gap?: ReactNode
  render: () => ReactNode
}[] = [
  {
    title: 'Default actions',
    description:
      'Small Default with the Attach (plus) button and Voice visible. Send and Stop are off. This is the standard starting configuration for an empty prompt state.',
    render: () => <Field value="" onValueChange={noop} />,
  },
  {
    title: 'Input only',
    description:
      'Small Default with only the Input Container visible. Attach, Voice, and Stop are all hidden. Use this when the composer should display a clean text entry without any action controls. Send stays, disabled until there is text.',
    render: () => <Field value="" onValueChange={noop} attach={false} voice={false} />,
  },
  {
    title: 'Stop only',
    description:
      'Small Default with only the Stop button visible. Input, Attach, Voice, and Send are hidden. Use this as the primary action state while Aura is generating a response, so the user can cancel at any time.',
    render: () => <Field value="" onValueChange={noop} processing />,
  },
  {
    title: 'Input + Stop',
    description:
      'Small Default with the Input Container and Stop button visible. Attach, Voice, and Send are hidden. Use this when the user can edit their prompt while a response is being generated, keeping the stop action always reachable.',
    render: () => <Field value="" onValueChange={noop} processing whileProcessing="input" />,
  },
  {
    title: 'Attachments',
    description:
      'Large Default with only the Attachments strip enabled. Tags and Banner are off. The attachment row shows file thumbnails above the input; use this when the user has uploaded one or more files before submitting. Send is visible and Voice is hidden because content is ready to submit.',
    render: () => (
      <Field size="large" value="What is our gross margi" onValueChange={noop} attachments={SAMPLE_ATTACHMENTS} />
    ),
  },
  {
    title: 'Tags',
    description:
      'Large Default with only the Tags row enabled. Attachments and Banner are off. Tags appear above the input to give the user contextual labels for the current prompt. Use this when the composer is scoped to a specific topic or filter. Send is visible and Voice is hidden because the prompt context is defined.',
    render: () => <Field size="large" value="What is our gross margi" onValueChange={noop} tags={SAMPLE_TAGS} />,
  },
  {
    title: 'Banner',
    description:
      'Large Default with only the status Banner enabled. Tags and Attachments are off. The banner sits at the top of the composer container and surfaces errors, warnings, or processing states. Send is visible and Voice is hidden so the user can act on the banner message immediately.',
    render: () => (
      <Field
        size="large"
        value="What is our gross margi"
        onValueChange={noop}
        banner={{ type: 'neutral', message: 'Text', action: 'Link' }}
      />
    ),
  },
  {
    title: 'Scroll state',
    description:
      'Large Scroll preserves the same base height and adds a fade overlay. There is conversation below the fold: the purple fade rises from the screen edge under the composer, so messages read as passing beneath it rather than being cut off.',
    scroll: true,
    render: () => <Field size="large" state="scroll" value="" onValueChange={noop} />,
  },
]

const BANNER_TYPES = ['neutral', 'info', 'error', 'warning', 'success'] as const

const TYPE_LABEL: Record<BannerType, string> = {
  neutral: 'Neutral',
  info: 'Info',
  error: 'Error',
  warning: 'Warning',
  success: 'Success',
}

function Preview() {
  const chat = useChatScreen()
  const {
    sizeMode, setSizeMode, stateMode, setStateMode, banner, setBanner, tags, setTags,
    attachments, setAttachments, voice, setVoice, failNext, setFailNext,
  } = chat

  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      <ChatScreenView chat={chat} />

      <div className="min-w-[280px] flex-1 space-y-sp-24">
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Tap the field: it opens into Large, the keyboard slides up and the composer rides on it;
          sending or tapping anywhere outside dismisses it. Voice turns into Send as soon as there
          is text. Once you send, the composer collapses to Stop only until Aura answers. Enter
          sends; in Large, Shift+Enter starts a new line. Scroll the conversation: the Topbar
          switches to Scroll as soon as messages pass under it, and the purple fade appears under
          the composer while there is conversation below. The conversation is drawn with the
          Messages components.
        </p>

        <Control label="Size">
          <Segmented
            options={[
              ['auto', 'Follow content'],
              ['small', 'Small'],
              ['large', 'Large'],
            ]}
            value={sizeMode}
            onChange={setSizeMode}
          />
        </Control>

        <Control label="State">
          <Segmented
            options={[
              ['auto', 'Follow scroll'],
              ['default', 'Default'],
              ['scroll', 'Scroll'],
            ]}
            value={stateMode}
            onChange={setStateMode}
          />
        </Control>

        <Control label="Large · banner">
          <Segmented
            options={[['none', 'None'], ...BANNER_TYPES.map((t) => [t, TYPE_LABEL[t]] as [string, string])]}
            value={banner ?? 'none'}
            onChange={(next) => setBanner(next === 'none' ? null : (next as BannerType))}
          />
        </Control>

        <Control label="Large · slots">
          <div className="flex flex-wrap gap-sp-08">
            <Toggle
              label="Tags"
              on={tags.length > 0}
              onChange={(on) => setTags(on ? SAMPLE_TAGS : [])}
            />
            <Toggle
              label="Attachments"
              on={attachments.length > 0}
              onChange={(on) => setAttachments(on ? SAMPLE_ATTACHMENTS : [])}
            />
          </div>
        </Control>

        <Control label="Behaviour">
          <div className="flex flex-wrap gap-sp-08">
            <Toggle label="Voice" on={voice} onChange={setVoice} />
            <Toggle label="Fail the next reply" on={failNext} onChange={setFailNext} />
          </div>
        </Control>

        <p className="max-w-[46ch] text-sm leading-sm text-text-tertiary">
          The + and file buttons add the file&rsquo;s sample attachments one by one; the + in Large
          adds the sample tags. With &ldquo;Fail the next reply&rdquo; on, the next send ends in
          the Error banner, and Retry runs it again. Banner and conversation copy is sample text.
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
        description="A field, its actions and a disclaimer. Small keeps everything on one row; Large stacks the text over the actions and gains three optional slots above the text."
      >
        <div className="mb-sp-24 flex flex-wrap items-start gap-sp-40">
          <Specimen caption="Size=Small">
            <Field value="" onValueChange={() => {}} />
          </Specimen>
          <Specimen caption="Size=Large">
            <Field size="large" value="What is our gross margi" onValueChange={() => {}} />
          </Specimen>
        </div>
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Input Container (Small)', '52 tall, radius br-32. Fill general/input, 1px inset general/stroke. Padding 6 / sp-12 right / sp-08 left, gap 10. Placeholder Body/md/Regular in text/placeholder.'],
            ['2', 'Attach button', 'Small only. Button Secondary · Filled · sm · Only Icon — 40, 16 glyph.'],
            ['3', 'Primary action', 'Voice, Send or Stop. 52 in Small, 44 in Large. Fill is a gradient from composer/action-start to composer/action-end, not Primary/Filled/bg; glyph Primary/Filled/text.'],
            ['4', 'Composer card (Large)', 'Radius br-12, fill general/input, 1px general/stroke. Padding sp-08 top, sp-12 sides and bottom, gap sp-08.'],
            ['5', 'Banner', 'Large only, optional. The Banner component — Neutral by default, or Info, Error, Warning, Success. See the Banner tab.'],
            ['6', 'Tags', 'Large only, optional. Tag[New] purple: tag/purple/background, 12/16 semibold, dismiss glyph.'],
            ['7', 'Attachments', 'Large only, optional. 72 tiles, radius br-12, gap sp-04, with a remove control.'],
            ['8', 'Text', 'Body/md/Regular in general/title. 32 tall in Large, growing to five lines.'],
            ['9', 'Button Left (Large)', 'More — Secondary · Filled · md, 44. File — Secondary · Outline · md, 44, 1.5 stroke.'],
            ['10', 'Disclaimer', 'Body/sm/regular, general/help-text, centred, one line. sp-16 below the field in Small, sp-08 in Large.'],
            ['11', 'Scroll fade', 'State=Scroll only. 360 wide, 184 (Small) or 160 (Large) tall, from general/surface-purple to general/fade-purple.'],
          ].map(([n, el, note]) => (
            <Row key={n} cells={[n, el, note]} />
          ))}
        </Table>
      </Section>

      <Section
        title="Types"
        description="Size is a layout, not a scale: the two sizes are different arrangements of the same parts."
      >
        <Table head={['Size', 'Height', 'When']}>
          {[
            ['Small', '84', 'At rest. An empty field and one primary action — the way into a conversation.'],
            ['Large', '130, growing', 'While writing, or when there is something to show above the text: tags, attachments, an error.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <h3 className="mt-sp-32 mb-sp-12 text-xl leading-2xl font-semibold text-text-primary">Behaviour</h3>
        <Table head={['Moment', 'What the composer does']}>
          {[
            ['Focus', 'Small opens into Large the moment the field takes focus, and the keyboard comes up. It returns to Small when focus leaves with nothing to show.'],
            ['Empty field', 'Voice is the primary action. With Voice off, Send stays, disabled until there is text.'],
            ['Send', 'The keyboard goes down and the composer collapses to Stop only while Aura answers.'],
            ['Answer ready', 'The field and its actions come back with a subtle settle: a 320ms fade and a 6 rise.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <p className="mt-sp-08 max-w-[70ch] text-sm leading-sm text-text-tertiary">
          Figma draws the sizes and states but not the moves between them; these were set with the
          team on 2026-10-07 and 2026-10-08.
        </p>
      </Section>

      <Section
        title="States"
        description="Every configuration the Figma file documents (node 13075:2646), each in Light and Dark. The action set follows what the user is doing; the Scroll state follows the page behind the composer, and the caller flips it from its own scroll position."
      >
        <div className="mb-sp-32 space-y-sp-32">
          {CONFIGURATIONS.map((config) => (
            <div key={config.title}>
              <h3 className="mb-sp-04 text-xl leading-title-md font-semibold text-text-primary">
                {config.title}
              </h3>
              <p className="mb-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
                {config.description}
              </p>
              <div className="flex flex-wrap items-start gap-sp-24">
                {(['light', 'dark'] as const).map((mood) => (
                  <Specimen
                    key={mood}
                    mood={mood}
                    caption={mood === 'light' ? 'Light' : 'Dark'}
                    padded={config.scroll}
                  >
                    {config.render()}
                  </Specimen>
                ))}
              </div>
              {config.gap ? <div className="mt-sp-12">{config.gap}</div> : null}
            </div>
          ))}
        </div>
        <Table head={['State', 'What changes']}>
          {[
            ['Default', 'Nothing behind the composer. The conversation ends above it.'],
            ['Scroll', 'There is conversation below the fold. A purple fade rises from the screen edge under the composer, so messages read as passing beneath it rather than being cut off.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Primary action
        </h3>
        <Table head={['Condition', 'Action']}>
          {[
            ['A reply is being generated', 'Stop only — the field and every other action hide; a 52 Stop sits centred above the disclaimer'],
            ['There is text', 'Send'],
            ['Empty, voice on', 'Voice'],
            ['Empty, voice off', 'Send, disabled — Primary · Filled · disabled: purple-300 fill and white icon in Light, purple-800 and #98A2B3 in Dark'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section title="Usage guidelines">
        <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Figma properties → props
        </h3>
        <Table head={['Figma', 'Prop', 'Notes']}>
          {[
            ['Size', 'size', '"small" | "large".'],
            ['State', 'state', '"default" | "scroll".'],
            ['Mood', '—', 'The hub theme. Both moods resolve the same tokens.'],
            ['Input', 'value / onValueChange', 'The field is always present; the boolean exists only so the file can show a layout without it.'],
            ['Attach', 'attach', 'Small only.'],
            ['More · File', 'more · file', 'Large only.'],
            ['Voice', 'voice', 'Whether an empty composer offers dictation. Off: a disabled Send stands in until there is text.'],
            ['Send · Stop', 'processing', 'Derived — see the primary action table. Never set both.'],
            ['Banner', 'banner · onBannerAction', 'Large only. { type, message, action }; the link calls onBannerAction.'],
            ['Tags', 'tags · onRemoveTag', 'Large only.'],
            ['Attachments', 'attachments · onRemoveAttachment', 'Large only.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="Do & Don't">
        <DoDont
          dos={[
            'Pin it to the bottom of the chat screen, inside the screen’s 16 margins.',
            'Open into Large when the user starts writing or adds something Large alone can show.',
            'Turn on State=Scroll whenever there is conversation below the fold.',
            'Pick the banner type by meaning: Neutral for Aura’s own notes, Error when a reply failed — with Retry.',
          ]}
          donts={[
            'Do not show Send and Stop together, or Send on an empty field.',
            'Do not wrap the disclaimer onto two lines. Shorten the string instead.',
            'Do not use the composer outside a conversation — a plain search field is a different component.',
            'Do not recolour the primary action. Its gradient is the same in both moods by design.',
          ]}
        />
      </Section>

      <Section
        title="Application"
        description="The composer floats over the conversation: the scroll area reserves its height so the last message can always be scrolled above it."
      >
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          The Preview tab is the reference set-up: a 360 × 800 screen with{' '}
          <Mono>Background</Mono> at the root, the conversation filling it, and both bars floating
          over it — the <Mono>Topbar</Mono> at the top, the composer at the bottom with{' '}
          <Mono>sp-16</Mono> of margin, above the home indicator&rsquo;s reserved 20. The
          conversation reserves both bars, the composer by its measured height since Large grows
          with its slots and text. Each bar&rsquo;s <Mono>state</Mono> follows its own edge: the
          Topbar is in Scroll while there is conversation above it, the composer while there is
          conversation below it.
        </p>
      </Section>

      <Section
        title="Accessibility"
        description="Every action is icon-only, so each carries an accessible name (the labels prop localises them). Contrast, measured from the tokens in this build:"
      >
        <Table head={['Pair', 'Light', 'Dark', 'Result']}>
          {[
            ['Text on general/input', '14.07:1', '17.41:1', 'Passes AAA'],
            ['Placeholder on general/input', '2.46:1', '7.07:1', 'Placeholder is exempt, but low in Light'],
            ['Disclaimer on page', '4.85:1', '—', 'Passes AA'],
            ['Disclaimer on scroll fade', '3.12:1', '3.97:1', 'Below 4.5 for 12px text'],
            ['Tag label on tag background', '4.04:1', '2.37:1', 'Below 4.5 in both'],
            ['Glyph on primary action', '4.86:1', '—', 'Passes'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
        <p className="mt-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          Targets: the Small actions are 40 and 52, the Large ones 44 — all at or above the 24
          minimum of SC 2.5.8. The tag and attachment remove controls are 16 and 12, which fails
          it: they need a larger hit area in the product.
        </p>
      </Section>

      <Section
        title="Known gaps"
        description="Transcribed from Figma, flagged, not corrected."
      >
        <div className="space-y-sp-12">
          <GapNote severity="warning">
            The attachment&rsquo;s remove glyph binds <Mono>text/secondary</Mono>, which is #475467
            in Light but #EAECF0 in Dark — on a tile that stays white in both modes, so in Dark the
            glyph almost disappears. Transcribed as the file has it; the tile or the glyph needs a
            Dark value that contrasts.
          </GapNote>
          <GapNote severity="warning">
            Composer/Action start, Action end, Attachment bg and Attachment stroke alias the same
            primitive in Light and Dark, so the gradient and the tile do not change with the mode.
            That is how the file has always drawn them; give them Dark values in the collection if
            they should change.
          </GapNote>
        </div>
      </Section>

      <Section title="Related">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Sits under the <Mono>Topbar</Mono> on the Aura chat screen and shares its collection
          (<Mono>Aura · General</Mono>). Uses Button (Secondary · Filled, Secondary · Outline,
          Primary · Filled with a gradient override) and Tag[New], neither of which is in the hub
          yet — both are drawn inside the composer from their tokens until they are.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Banner — its own component, shown in the Large composer's top slot
   ================================================================ */

function BannerDocs() {
  return (
    <>
      <div className="mb-sp-32">
        <a
          className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
          href={figmaUrl('components', BANNER_NODE)}
          target="_blank"
          rel="noreferrer"
        >
          Open Banner in Figma ↗
        </a>
      </div>

      <Section
        title="Types"
        description="Five types, one shape: an icon or the Aura logo, a one-line message, an optional link. Each type colours the border, icon, text and link with one token and fills with its -bg token. Switch the hub to Dark to see the 30% tints."
      >
        <div className="w-[302px] max-w-full space-y-sp-08">
          {BANNER_TYPES.map((t) => (
            <Banner key={t} type={t} action="Link">
              Text
            </Banner>
          ))}
        </div>
      </Section>

      <Section title="Anatomy">
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Container', 'Fills the slot (302 in the Large composer). Padding sp-12, radius br-08, 1px inset border in the type colour, fill in the type’s -bg. 44 tall on one line.'],
            ['2', 'Icon', '20, in the type colour. Neutral shows the Logo (Gradient, 18) instead — Aura speaking.'],
            ['3', 'Message', 'Body/md/md — 14/20 Medium, in the type colour. Fills, wraps if it must.'],
            ['4', 'Link', 'Optional. Link · sm · Primary, recoloured to the type colour. 14/20 Medium, underlined. 12 from the message.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section title="Tokens" description="Aura · Semantic group. Dark backgrounds are a darker step of the hue at 30%, so they tint the surface beneath.">
        <Table head={['Type', 'Colour · Light', 'Colour · Dark', 'Background · Light', 'Background · Dark']}>
          {[
            ['Neutral', '#6643CE', '#A68AFA', '#F3EFFF', 'purple-700 at 30%'],
            ['Info', '#2970FF', '#84ADFF', '#EFF4FF', 'blue-800 at 30%'],
            ['Error', '#F04438', '#FDA29B', '#FEE4E2', 'red-700 at 30%'],
            ['Warning', '#DC6803', '#FDB022', '#FEEFC7', 'yellow-600 at 30%'],
            ['Success', '#039855', '#12B76A', '#ECFDF3', 'green-700 at 30%'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="Usage guidelines">
        <Table head={['Figma', 'Prop', 'Notes']}>
          {[
            ['Type', 'type', '"neutral" (default) | "info" | "error" | "warning" | "success".'],
            ['Text', 'children', 'The message. Keep it to one line.'],
            ['Link', 'action · onAction', 'The link’s label and handler. Omit for no link.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
        <p className="mt-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          In the Composer, pass it as <Mono>banner=&#123;&#123; type, message, action &#125;&#125;</Mono>{' '}
          with <Mono>onBannerAction</Mono>. Error and Warning are announced to screen readers (
          <Mono>role=&quot;alert&quot;</Mono>); the others are polite status updates.
        </p>
      </Section>

      <Section title="Known gaps" description="Transcribed from Figma, flagged, not corrected.">
        <GapNote severity="warning">
          Info, Error, Warning and Success carry the <Mono>placeholder</Mono> component in their
          icon slot — a plain ring, the same for all four, not a meaningful icon. The hub draws it
          as the file does. Put real icons in the slot in Figma and they will be downloaded here.
        </GapNote>
      </Section>
    </>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

function Specimen({
  caption,
  padded = false,
  mood,
  children,
}: {
  caption: string
  /** Room for the scroll fade, which extends 16 to the sides and 28 below. */
  padded?: boolean
  /** Pin the specimen to one mood, whatever the hub's theme. */
  mood?: 'light' | 'dark'
  children: ReactNode
}) {
  return (
    <figure className="m-0">
      <div
        data-theme={mood}
        /* Inset, not border: a border would leave the composer at 326. */
        className={`w-[360px] overflow-clip rounded-16 bg-surface-page px-sp-16 shadow-[inset_0_0_0_1px_var(--color-border-subtle)] ${
          padded ? 'pt-[120px] pb-[28px]' : 'py-sp-24'
        }`}
      >
        <div className="relative">{children}</div>
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
