import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  CheckIcon,
  CopyIcon,
  DotsVerticalIcon,
  RefreshIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '../icons/messages'
import { Logo } from './Logo'
import { LogoHero } from './LogoHero'

/* Messages — 02 - Worker Design System, page "[AI] Messages".

   The pieces a conversation with Aura is built from:

   - MessageAction (13263:13017): a 16 icon in a 32 hit area — Copy, Like,
     Dislike, Retry, More options — with Default, Hover, Pressed and Disabled.
   - ActionsBar (13263:13139): the five actions in a row, 8 apart.
   - Bubbles (13286:821): Aura, User and Human.
   - ThinkingIndicator (13286:2206): the logo and "Thinking..." while Aura
     works on a reply.
   - ChatMessages (13286:819): the composition — participant rows 24 apart.

   Every colour is an Aura · Chat or Aura · General token with a Dark value,
   so Light and Dark are the hub's theme, not variants. Strokes are Figma
   strokes drawn inside the frame, so they are inset shadows here — the
   44 and 58 the bubbles report include them. */

/* ================================================================
   Message action
   ================================================================ */

export type MessageActionType = 'copy' | 'like' | 'dislike' | 'retry' | 'more'

const ACTION: Record<MessageActionType, { label: string; Icon: (p: { className?: string }) => ReactNode }> = {
  copy: { label: 'Copy', Icon: CopyIcon },
  like: { label: 'Like', Icon: ThumbsUpIcon },
  dislike: { label: 'Dislike', Icon: ThumbsDownIcon },
  retry: { label: 'Retry', Icon: RefreshIcon },
  more: { label: 'More options', Icon: DotsVerticalIcon },
}

export function MessageAction({
  type,
  pressed = false,
  disabled = false,
  forceState,
  label,
  onClick,
  className = '',
}: {
  type: MessageActionType
  /** A toggled action — a given Like or Dislike — keeps the Pressed look. */
  pressed?: boolean
  disabled?: boolean
  /** Documentation only: draw a state without interacting with it. */
  forceState?: 'default' | 'hover' | 'pressed' | 'disabled'
  /** Localised accessible name; the button is icon-only. */
  label?: string
  onClick?: () => void
  className?: string
}) {
  const { label: fallback, Icon } = ACTION[type]

  /* Copy confirms itself: for 2s after a click the icon is the Foundations
     check and the name reads "Copied", then it returns to Copy. The copying
     itself is the caller's, in onClick. */
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])
  const handleClick = () => {
    if (type === 'copy') {
      setCopied(true)
      window.clearTimeout(copiedTimer.current)
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000)
    }
    onClick?.()
  }
  const Glyph = copied ? CheckIcon : Icon

  const state = forceState ?? (disabled ? 'disabled' : pressed ? 'pressed' : undefined)
  /* Default: chat/actions. Hover: chat/pressed. Pressed: a chat/background
     plate behind the default icon. Disabled: chat/disabled. With no forced
     state the interactive ones come from :hover and :active. */
  const tone =
    state === 'disabled'
      ? 'text-chat-disabled'
      : state === 'pressed'
        ? 'bg-chat-background text-chat-actions'
        : state === 'hover'
          ? 'text-chat-pressed'
          : state === 'default'
            ? 'text-chat-actions'
            : 'text-chat-actions hover:text-chat-pressed active:bg-chat-background active:text-chat-actions'
  return (
    /* 32 x 40 per variant: the 8 of top padding is part of the component,
       so a row of actions sits 8 below the text above it. */
    <span className={`inline-flex pt-sp-08 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'disabled'}
        aria-label={copied ? 'Copied' : (label ?? fallback)}
        aria-pressed={type === 'like' || type === 'dislike' ? pressed : undefined}
        className={`flex size-[32px] cursor-pointer items-center justify-center rounded-04 p-sp-08 outline-none transition-colors disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-border-focus ${tone}`}
      >
        <Glyph />
      </button>
    </span>
  )
}

export function ActionsBar({
  copy = true,
  like = true,
  dislike = true,
  retry = true,
  more = true,
  liked = null,
  onCopy,
  onLike,
  onDislike,
  onRetry,
  onMore,
  className = '',
}: {
  copy?: boolean
  like?: boolean
  dislike?: boolean
  retry?: boolean
  more?: boolean
  /** Which feedback the user gave, if any — that action stays Pressed. */
  liked?: 'like' | 'dislike' | null
  onCopy?: () => void
  onLike?: () => void
  onDislike?: () => void
  onRetry?: () => void
  onMore?: () => void
  className?: string
}) {
  return (
    <div className={`flex items-start gap-sp-08 ${className}`} role="toolbar" aria-label="Message actions">
      {copy ? <MessageAction type="copy" onClick={onCopy} /> : null}
      {like ? <MessageAction type="like" pressed={liked === 'like'} onClick={onLike} /> : null}
      {dislike ? <MessageAction type="dislike" pressed={liked === 'dislike'} onClick={onDislike} /> : null}
      {retry ? <MessageAction type="retry" onClick={onRetry} /> : null}
      {more ? <MessageAction type="more" onClick={onMore} /> : null}
    </div>
  )
}

/* ================================================================
   Bubbles
   ================================================================ */

/** Inline emphasis inside an Aura reply: Semibold in chat/highlight. */
export function Highlight({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-chat-highlight">{children}</strong>
}

/** Type = Aura bubble. No container — Aura speaks on the page itself. */
export function AuraBubble({
  name = 'Aura',
  title,
  subtitle,
  children,
  actions = true,
  actionsProps,
  className = '',
}: {
  /** The sender line, next to the Logo. Pass an empty string to hide it. */
  name?: string
  /** Title/sm/semibold — 16/22 in general/title. Optional. */
  title?: ReactNode
  /** Body/md/md — 14/20 Medium in chat/text-black. Optional. */
  subtitle?: ReactNode
  /** Body/md/regular — 14/20 in chat/text-black; wrap figures in Highlight. */
  children: ReactNode
  actions?: boolean
  actionsProps?: Parameters<typeof ActionsBar>[0]
  className?: string
}) {
  return (
    <div className={`flex w-full max-w-[312px] flex-col items-start gap-sp-08 ${className}`}>
      {name ? (
        <div className="flex w-full items-center gap-sp-04">
          <Logo color="gradient" size={18} />
          <span className="chat-gradient-text chat-name truncate text-sm leading-sm font-medium">{name}</span>
        </div>
      ) : null}
      {title ? (
        <p className="w-full text-lg leading-title-md font-semibold text-general-title">{title}</p>
      ) : null}
      <div className="flex w-full flex-col gap-sp-08 text-md leading-md text-chat-text-black">
        {subtitle ? <p className="font-medium">{subtitle}</p> : null}
        <div>{children}</div>
      </div>
      {actions ? <ActionsBar {...actionsProps} /> : null}
    </div>
  )
}

/** Type = User bubble. Right-aligned, text only, up to 238 wide. */
export function UserBubble({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex justify-end ${className}`}>
      {/* The tail is the 4 bottom-right corner; the rest are 32, 24, 32. */}
      <div className="max-w-[238px] rounded-tl-32 rounded-tr-24 rounded-br-04 rounded-bl-32 bg-chat-actions px-sp-24 py-sp-12 text-right text-md leading-md text-chat-text-white shadow-[inset_0_0_0_1px_var(--color-chat-stroke-negative)]">
        {children}
      </div>
    </div>
  )
}

/** Type = Human bubble. A person from support: avatar, name, message. */
export function HumanBubble({
  name,
  avatarSrc,
  children,
  className = '',
}: {
  name: string
  avatarSrc: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-start gap-[8px] ${className}`}>
      {/* 32 with a 1px chat/stroke-positive ring drawn inside, like Figma
          (24 and 0.5 until 2026-10-08). The ring is an overlay, not the
          wrapper's own inset shadow: the photo would paint over that. */}
      <span className="relative size-[32px] shrink-0 overflow-clip rounded-pill">
        <img src={avatarSrc} alt="" className="size-full rounded-pill object-cover" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-pill shadow-[inset_0_0_0_1px_var(--color-chat-stroke-positive)]"
        />
      </span>
      {/* The tail is the 4 top-left corner, pointing at the avatar. */}
      <div className="flex max-w-[230px] min-w-px flex-col gap-sp-04 rounded-tl-04 rounded-tr-32 rounded-br-32 rounded-bl-32 bg-chat-background px-sp-16 pt-sp-08 pb-sp-12 shadow-[inset_0_0_0_1px_var(--color-chat-stroke-positive)]">
        <span className="text-xs leading-xs font-medium whitespace-nowrap text-chat-highlight">{name}</span>
        <p className="text-md leading-md text-chat-text-black">{children}</p>
      </div>
    </div>
  )
}

/* ================================================================
   Thinking indicator
   ================================================================ */

export function ThinkingIndicator({
  label = 'Thinking...',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-sp-16 ${className}`} role="status">
      {/* The Logo hero, idling, drawn at 40: its 140 box scaled by 40/140.
          Figma defines no motion for this component; the idle breathing is
          a team decision (2026-10-08). The halo spills well past the 40 —
          the caller leaves room and does not clip it. */}
      <span className="relative size-[40px] shrink-0" aria-hidden="true">
        <span className="absolute top-0 left-0 origin-top-left scale-[0.2857]">
          <LogoHero mode="idle" />
        </span>
      </span>
      <span className="chat-gradient-text chat-thinking truncate text-md leading-md font-medium">{label}</span>
    </div>
  )
}

/* ================================================================
   Chat message container
   ================================================================ */

/** The conversation column: participant rows 24 apart, no outer padding.
 *  Pass one child per message, already a bubble. */
export function ChatMessages({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex w-full flex-col gap-sp-24 ${className}`}>{children}</div>
}
