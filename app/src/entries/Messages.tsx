import { useState, type ReactNode } from 'react'
import {
  ActionsBar,
  AuraBubble,
  ChatMessages,
  Highlight,
  HumanBubble,
  MessageAction,
  ThinkingIndicator,
  UserBubble,
  type MessageActionType,
} from '../ui/Messages'
import { ChatScreenView } from './ChatScreen'
import { AVATAR } from './chatScreenData'
import { useChatScreen } from './useChatScreen'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '13286-821'

export function Messages() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Messages"
        source="02 - Worker Design System · [AI] Messages · Bubbles 13286:821 · Message action 13263:13017 · Actions bar 13263:13139 · Thinking-Indicator 13286:2206 · Chat message container 13286:819"
        intro="Chat bubbles, message actions and Aura's statuses — the conversational pieces of the Aura chat. Every colour is an Aura · Chat or Aura · General token with a Dark value, so Light and Dark are the hub's theme, not variants."
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
   Preview — the shared Aura chat screen, with the same behaviour as the
   Composer page's preview
   ================================================================ */

function Preview() {
  const chat = useChatScreen()
  const { auraParts, setAuraParts } = chat
  const part = (key: keyof typeof auraParts) => (on: boolean) =>
    setAuraParts((parts) => ({ ...parts, [key]: on }))
  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      <ChatScreenView chat={chat} />

      <div className="min-w-[280px] flex-1 space-y-sp-16">
        <div>
          <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">
            Aura bubble · optional parts
          </div>
          <div className="flex flex-wrap gap-sp-08">
            <Toggle label="Name" on={auraParts.name} onChange={part('name')} />
            <Toggle label="Title" on={auraParts.title} onChange={part('title')} />
            <Toggle label="Subtitle" on={auraParts.subtitle} onChange={part('subtitle')} />
            <Toggle label="Actions" on={auraParts.actions} onChange={part('actions')} />
          </div>
          <p className="mt-sp-08 max-w-[46ch] text-sm leading-sm text-text-tertiary">
            Figma&rsquo;s Name, Title, Subtitle and Actions booleans — on by default. They apply to every
            Aura reply in the conversation, including new ones.
          </p>
        </div>

        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          The same screen as the Composer preview. Tap the field: it opens into Large and the
          keyboard slides up; sending or tapping outside dismisses it. After you send, the
          composer collapses to Stop only and Aura shows the Thinking-Indicator, then answers.
          Scroll the conversation: the Topbar and the composer each switch to Scroll on their own
          edge.
        </p>
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Under each Aura reply, Copy turns into a check and shows a &ldquo;Copied&rdquo; toast,
          Like and Dislike stay pressed (one or the other), Retry asks again and More options
          shows a toast. Switch the hub to Dark to see the Chat tokens invert.
        </p>
        <p className="max-w-[46ch] text-sm leading-sm text-text-tertiary">
          The conversation copy is sample text. The human agent&rsquo;s avatar is the sample image
          from the Figma file.
        </p>
      </div>
    </div>
  )
}

/* ================================================================
   Documentation — follows the Figma frame "Component Docs - Chat &
   Messaging" (13263:11994), part by part
   ================================================================ */

/* The file's own sample body for the Aura bubble — its placeholder copy. */
const SAMPLE_BODY = (
  <>
    Lorem ipsum dolor sit amet consectetur. Ante elementum <Highlight>$30,00.00</Highlight> enim
    augue non ultrices. Lectus nec id tortor <Highlight>eleifend lectus</Highlight> non auctor
    fusce vitae.
  </>
)

const ACTION_TYPES: [MessageActionType, string][] = [
  ['copy', 'Copy'],
  ['like', 'Like'],
  ['dislike', 'Dislike'],
  ['retry', 'Retry'],
  ['more', 'More options'],
]
const ACTION_STATES = ['default', 'hover', 'pressed', 'disabled'] as const

function Documentation() {
  return (
    <>
      <Part title="Aura bubble" node="Bubbles → Type = Aura bubble">
        Used for assistant responses. Name, Title, Subtitle and Actions are optional, on by default. The body
        supports styled text: a subtitle, highlighted figures and bold emphasis.
      </Part>

      <Section title="Anatomy">
        <Pair>
          {() => (
            <AuraBubble name="Name" title="Heading" subtitle="Subtitle">
              {SAMPLE_BODY}
            </AuraBubble>
          )}
        </Pair>
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Name', 'Optional. Logo (Gradient, 18) and the sender, 12/16 Medium filled with general/gradient-light → gradient-dark. Gap sp-04.'],
            ['2', 'Title', 'Optional. Title/sm/semibold — 16/22 in general/title.'],
            ['3', 'Subtitle', 'Optional. Body/md/md — 14/20 Medium in chat/text-black.'],
            ['4', 'Body', 'Body/md/regular — 14/20 in chat/text-black. Highlight: Semibold in chat/highlight.'],
            ['5', 'Actions bar', 'Optional. See Actions bar below.'],
            ['—', 'Container', 'None: 312 wide, no fill, no stroke — Aura speaks on the page. Parts stack sp-08 apart.'],
          ].map((cells) => (
            <Row key={cells[0] + cells[1]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Part title="Message action" node="Message action → Type × State">
        Five types — Copy, Like, Dislike, Retry, More options — each in four states. They are visual
        controls; the behaviour (copying, sending feedback) is the product&rsquo;s. One piece of
        feedback is built in: after a click, Copy shows the Foundations <Mono>check</Mono> icon for
        two seconds and its accessible name reads &ldquo;Copied&rdquo;.
      </Part>

      <Section
        title="States"
        description="Twenty Type × State combinations, in both modes. Each is 32 × 40: a 32 × 32 hit area under 8 of top padding, with a 16 icon. Default and Disabled are icon colours; Hover changes the icon to chat/pressed; Pressed adds a chat/background plate."
      >
        <div className="grid gap-sp-24 lg:grid-cols-2">
          {(['light', 'dark'] as const).map((mood) => (
            <figure key={mood} className="m-0">
              <div
                data-theme={mood}
                className="overflow-x-auto rounded-16 bg-general-surface-white p-sp-16 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
              >
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      <th />
                      {ACTION_STATES.map((st) => (
                        <th key={st} className="pb-sp-08 text-xs leading-xs font-medium text-text-tertiary capitalize">
                          {st}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ACTION_TYPES.map(([type, name]) => (
                      <tr key={type}>
                        <td className="pr-sp-08 text-left text-sm leading-sm whitespace-nowrap text-text-secondary">
                          {name}
                        </td>
                        {ACTION_STATES.map((st) => (
                          <td key={st}>
                            <MessageAction type={type} forceState={st} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
                {mood === 'light' ? 'Light' : 'Dark'}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Part title="Actions bar" node="Actions bar">
        Copy, Like, Dislike, Retry and More options in a row, 8 apart: 192 × 40 with all five.
      </Part>

      <Section title="Appearance">
        <Pair>{() => <ActionsBar />}</Pair>
        <Table head={['Prop', 'Notes']}>
          {[
            ['copy · like · dislike · retry · more', 'Show or hide each action. All on by default.'],
            ['liked', '"like" | "dislike" | null — the given feedback stays Pressed.'],
            ['onCopy · onLike · onDislike · onRetry · onMore', 'Handlers; the actions do nothing by themselves.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={0} />
          ))}
        </Table>
      </Section>

      <Part title="User bubble" node="Bubbles → Type = User bubble">
        Text-only message, aligned to the right. 76 × 44 with the sample text; it grows with the
        message up to 238 wide.
      </Part>

      <Section title="Anatomy">
        <Pair>{() => <UserBubble>Text</UserBubble>}</Pair>
        <Table head={['Element', 'Notes']}>
          {[
            ['Bubble', 'Fill chat/actions, 1px inset chat/stroke-negative. Padding sp-24 × sp-12. Corners 32 · 24 · 4 · 32 (tl · tr · br · bl) — the 4 is the tail.'],
            ['Text', 'Body/md/regular, right-aligned, chat/text-white.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Part title="Human bubble" node="Bubbles → Type = Human bubble">
        A human sender — support — with avatar, name and message. 131 × 58 with the sample.
      </Part>

      <Section title="Anatomy">
        <Pair>
          {() => (
            <HumanBubble name="Name" avatarSrc={AVATAR}>
              Text
            </HumanBubble>
          )}
        </Pair>
        <Table head={['Element', 'Notes']}>
          {[
            ['Avatar', '32, round, a 1px inset chat/stroke-positive ring. Sits 8 left of the bubble.'],
            ['Bubble', 'Fill chat/background, 1px inset chat/stroke-positive. Padding sp-08 top, sp-12 bottom, sp-16 sides; gap sp-04. Corners 4 · 32 · 32 · 32 — the tail points at the avatar. Up to 230 wide.'],
            ['Name', 'Body/xs/md — 10/14 Medium in chat/highlight.'],
            ['Text', 'Body/md/regular in chat/text-black.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Part title="Chat message container" node="Chat message container">
        A composition with no properties: participant rows stacked sp-24 apart, no outer padding.
        User rows align right; Aura and human rows align left.
      </Part>

      <Section title="Composition">
        <Pair tall>
          {() => (
            <ChatMessages>
              <UserBubble>Text</UserBubble>
              <AuraBubble name="Name" title="Heading" subtitle="Subtitle">
                {SAMPLE_BODY}
              </AuraBubble>
              <UserBubble>Text</UserBubble>
              <HumanBubble name="Name" avatarSrc={AVATAR}>
                Text
              </HumanBubble>
            </ChatMessages>
          )}
        </Pair>
      </Section>

      <Part title="Thinking-Indicator" node="Thinking-Indicator">
        Aura is working on a reply: the 40 logo and &ldquo;Thinking...&rdquo; 16 apart. 14/20
        Medium, filled with the General gradient.
      </Part>

      <Section title="Preview">
        <Pair roomy>{() => <ThinkingIndicator />}</Pair>
        <GapNote severity="warning">
          Figma defines no motion here. The logo is the Logo hero idling — breathing and turning —
          drawn at 40; a team decision (2026-10-08). It is announced as a status to screen readers.
        </GapNote>
      </Section>

      <Section
        title="Variables & appearance"
        description="Aura · Chat group. Light and Dark are modes of the collection, not component variants. Spacing: sp-04, sp-08, sp-12, sp-16, sp-24; the message stack uses sp-24 and the Actions bar sp-08; radius br-04 for action plates."
      >
        <Table head={['Token', 'Light', 'Dark', 'Used by']}>
          {[
            ['chat/background', '#F9FAFB', 'purple-600 at 40%', 'Human bubble fill, Pressed plate'],
            ['chat/actions', '#291B52', '#F3EFFF', 'User bubble fill, action icons'],
            ['chat/pressed', '#7064AC', '#D3C5FC', 'Action icon on hover'],
            ['chat/disabled', '#D0D5DD', 'gray-blue-300 at 50%', 'Disabled action icon'],
            ['chat/text-black', '#475467', '#EAECF0', 'Aura and human body text'],
            ['chat/text-white', '#F2F4F7', '#475467', 'User bubble text'],
            ['chat/highlight', '#6643CE', '#A68AFA', 'Highlights, human name'],
            ['chat/stroke-positive', '#FFFFFF', '#3D287B', 'Human bubble and avatar ring'],
            ['chat/stroke-negative', '#5135A5', '#FFFFFF', 'User bubble stroke'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>
      </Section>

      <Section title="Accessibility">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          Every action is a real button with an accessible name; Like and Dislike expose{' '}
          <Mono>aria-pressed</Mono>. The bar is a <Mono>toolbar</Mono>. The 32 hit area clears the
          24 minimum of SC 2.5.8 but not the 44 the platforms recommend. The Thinking-Indicator is a{' '}
          <Mono>status</Mono>, so its label is announced; its logo is hidden as decoration.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

/** A part's header, as the Figma frame titles each component. */
function Part({ title, node, children }: { title: string; node: string; children: ReactNode }) {
  return (
    <div className="mt-sp-56 mb-sp-24 border-b border-border-subtle pb-sp-16 first:mt-0">
      <h2 className="text-4xl leading-3xl font-semibold text-text-primary">{title}</h2>
      <div className="mt-sp-04 font-mono text-sm leading-sm text-text-tertiary">{node}</div>
      <p className="mt-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">{children}</p>
    </div>
  )
}

/** The same specimen in Light and Dark, each pinned to its mood. */
function Pair({
  children,
  tall = false,
  roomy = false,
}: {
  children: () => ReactNode
  tall?: boolean
  /** Room around the content, for the Thinking-Indicator's halo. */
  roomy?: boolean
}) {
  return (
    <div className="mb-sp-24 flex flex-wrap items-start gap-sp-24">
      {(['light', 'dark'] as const).map((mood) => (
        <figure key={mood} className="m-0">
          <div
            data-theme={mood}
            className={`flex w-[360px] max-w-full justify-center overflow-clip rounded-16 bg-general-surface-white px-sp-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)] ${
              roomy ? 'py-sp-48' : 'py-sp-24'
            } ${tall ? 'min-h-[480px]' : ''}`}
          >
            <div className="w-[312px] max-w-full">{children()}</div>
          </div>
          <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
            {mood === 'light' ? 'Light' : 'Dark'}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function Row({ cells, mono }: { cells: string[]; mono?: number }) {
  return (
    <tr className="border-b border-border-subtle last:border-0">
      {cells.map((cell, i) => (
        <td
          key={i}
          className={`px-sp-16 py-sp-08 ${
            i === mono
              ? 'font-mono text-sm whitespace-nowrap text-text-primary'
              : i === 0
                ? 'font-medium whitespace-nowrap text-text-primary'
                : 'text-sm text-text-secondary'
          }`}
        >
          {cell}
        </td>
      ))}
    </tr>
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
