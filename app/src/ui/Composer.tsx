import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import {
  AttachmentCloseIcon,
  AttachmentFileIcon,
  FileIcon,
  MicrophoneIcon,
  PlusMdIcon,
  PlusSmIcon,
  SendIcon,
  StopIcon,
  TagCloseIcon,
} from '../icons/composer'
import { Banner, type BannerType } from './Banner'

/* Composer — 02 - Worker Design System, node 12921:7956.

   The field Aura's chat is written in, with its quick actions: attach, voice,
   send, stop.

   Figma carries four variants, Size x State (Mood is Light only in the file;
   Dark comes from the token collection, so the hub's [data-theme] switch
   covers it, as with Topbar).

   - Size is a layout: Small is a single-line pill with the primary action
     beside it; Large is a card with the text on top and the actions under it.
   - State is behaviour: `scroll` adds the purple fade that lets the
     conversation pass under the composer. The caller flips it from its own
     scroll position — the composer does not listen to anything.

   Both Large states bind the same tokens (aligned in Figma on 2026-10-08):
   general/input, general/stroke, general/title, and a general/help-text
   disclaimer.

   The primary action is derived, not toggled: Send once there is text, Voice
   otherwise — or, with Voice off, a disabled Send. While a reply is being generated the whole composer collapses to
   Stop only. Figma models the three as separate booleans, but they never
   appear together in any variant. */

export type ComposerTag = { id: string; label: string }

/** The Banner in the Large composer's top slot (Figma: Banner instance,
 *  Type=Neutral by default). */
export type ComposerBanner = {
  type?: BannerType
  message: ReactNode
  /** The link's label, e.g. "Retry". Omit for no link. */
  action?: string
}

export type ComposerAttachment = {
  id: string
  /** Shown over the preview — "IMG. 100 KB" in the file. Omit for a tile
   *  with no preview, which draws the generic file glyph instead. */
  label?: string
  previewSrc?: string
}

const DEFAULT_LABELS = {
  attach: 'Attach',
  more: 'More actions',
  file: 'Add a file',
  voice: 'Dictate',
  send: 'Send',
  stop: 'Stop generating',
  removeTag: 'Remove',
  removeAttachment: 'Remove attachment',
}

export function Composer({
  size = 'small',
  state = 'default',
  value,
  onValueChange,
  placeholder = 'Ask anything or search....',
  disclaimer = 'Aura may make mistakes. Check important info.',
  processing = false,
  whileProcessing = 'stop-only',
  onSend,
  onStop,
  onVoice,
  onAttach,
  onMore,
  onFile,
  attach = true,
  more = true,
  file = true,
  voice = true,
  banner,
  onBannerAction,
  tags = [],
  onRemoveTag,
  attachments = [],
  onRemoveAttachment,
  inputRef,
  labels,
  className = '',
}: {
  size?: 'small' | 'large'
  /** `scroll` adds the fade that lets content pass under the composer. */
  state?: 'default' | 'scroll'
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disclaimer?: string
  /** A reply is being generated: the composer collapses to Stop only. */
  processing?: boolean
  /** What stays visible while processing. `stop-only` (default) leaves a lone
   *  Stop; `input` keeps the field beside it, so the next prompt can be
   *  written while Aura answers — Figma's "Input + Stop" configuration. */
  whileProcessing?: 'stop-only' | 'input'
  onSend?: () => void
  onStop?: () => void
  onVoice?: () => void
  /** Small only — the 40 button inside the pill. */
  onAttach?: () => void
  /** Large only — the two buttons under the text. */
  onMore?: () => void
  onFile?: () => void
  attach?: boolean
  more?: boolean
  file?: boolean
  /** Shown when there is no text yet. With it off, an empty composer shows
   *  Send, disabled until there is text. */
  voice?: boolean
  /** Large only. A Banner above the text — see ui/Banner. */
  banner?: ComposerBanner
  onBannerAction?: () => void
  /** Large only. */
  tags?: ComposerTag[]
  onRemoveTag?: (id: string) => void
  /** Large only. */
  attachments?: ComposerAttachment[]
  onRemoveAttachment?: (id: string) => void
  inputRef?: Ref<HTMLInputElement & HTMLTextAreaElement>
  /** Localised accessible names. Every action is icon-only, so these are the
   *  only names they have. */
  labels?: Partial<typeof DEFAULT_LABELS>
  className?: string
}) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const hasText = value.trim().length > 0
  /* With Voice off there is always a Send, disabled until there is text —
     an empty composer never loses its primary action. */
  const action: 'stop' | 'send' | 'voice' = processing
    ? 'stop'
    : hasText || !voice
      ? 'send'
      : 'voice'
  const sendDisabled = action === 'send' && !hasText

  const submit = () => {
    if (hasText && !processing) onSend?.()
  }

  /* Stop only: while a reply is being generated the composer collapses to a
     lone, centred Stop — no field, no attach. It is the Small variant with
     Input, Attach and Voice off and Stop on, the way the Figma documentation
     draws it (instance 13080:943), so it wins over `size`. */
  const stopOnly = processing && whileProcessing === 'stop-only'
  // Input + Stop is drawn on Small in the file, so processing always is.
  const large = size === 'large' && !processing

  /* When a reply finishes, the field and its actions come back with a short
     fade-and-rise rather than snapping in. Only on that return — not on first
     render, not on Small ⇄ Large — and cleared once it has played. */
  const [returning, setReturning] = useState(false)
  const wasStopOnly = useRef(stopOnly)
  useEffect(() => {
    if (wasStopOnly.current && !stopOnly) setReturning(true)
    wasStopOnly.current = stopOnly
  }, [stopOnly])
  const returnClass = returning ? 'composer-return' : ''
  const onReturned = () => setReturning(false)

  return (
    /* 328 is the reference screen's 360 less 16 a side. Like Topbar and
       NavigationBar, the width is the caller's: the composer fills it. Small
       stacks 16 between field and disclaimer, Large 8 — both from the file. */
    <div
      className={`relative flex w-full flex-col ${large ? 'gap-sp-08' : 'gap-sp-16'} ${className}`}
    >
      {state === 'scroll' ? (
        /* Figma draws the fade 16 wider than the composer on each side (the
           screen's margins) and 28 below it, so it reaches the screen edge and
           the home indicator. It is the first child so it paints under
           everything else, the order the file stacks it in. */
        <div
          aria-hidden
          className={`pointer-events-none absolute -inset-x-sp-16 bottom-[-28px] ${
            large ? 'composer-fade-large h-[160px]' : 'composer-fade-small h-[184px]'
          }`}
        />
      ) : null}

      {stopOnly ? (
        <div className="relative flex items-center justify-center">
          <PrimaryAction
            action="stop"
            onSend={submit}
            onStop={onStop}
            onVoice={onVoice}
            className="size-[52px]"
            l={l}
          />
        </div>
      ) : large ? (
        <div className={returnClass} onAnimationEnd={onReturned}>
          <LargeField
            value={value}
            onValueChange={onValueChange}
            placeholder={placeholder}
            onSubmit={submit}
            action={action}
            sendDisabled={sendDisabled}
            onSend={submit}
            onStop={onStop}
            onVoice={onVoice}
            onMore={onMore}
            onFile={onFile}
            more={more}
            file={file}
            banner={banner}
            onBannerAction={onBannerAction}
            tags={tags}
            onRemoveTag={onRemoveTag}
            attachments={attachments}
            onRemoveAttachment={onRemoveAttachment}
            inputRef={inputRef}
            l={l}
          />
        </div>
      ) : (
        <div
          className={`relative flex items-center gap-sp-08 ${returnClass}`}
          onAnimationEnd={onReturned}
        >
          {/* 52 tall, pill. The 1px stroke is an inset shadow: Figma draws it
              inside the frame, and the 52 is fixed either way. */}
          <div className="flex h-[52px] min-w-px flex-[1_0_0] items-center gap-[10px] rounded-32 bg-general-input py-[6px] pr-sp-12 pl-sp-08 shadow-[inset_0_0_0_1px_var(--color-general-stroke)]">
            {attach && !processing ? (
              <IconButton
                label={l.attach}
                onClick={onAttach}
                className="size-[40px] bg-button-secondary-filled-bg text-button-secondary-filled-text"
              >
                <PlusSmIcon />
              </IconButton>
            ) : null}
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  submit()
                }
              }}
              placeholder={placeholder}
              aria-label={placeholder}
              className="min-w-px flex-[1_0_0] bg-transparent text-md leading-md text-general-title outline-none placeholder:text-text-placeholder"
            />
          </div>
          <PrimaryAction
            action={action}
            disabled={sendDisabled}
            onSend={submit}
            onStop={onStop}
            onVoice={onVoice}
            className="size-[52px]"
            l={l}
          />
        </div>
      )}

      {/* Body/sm/regular, help text. nowrap because the file pins the line to
          one 16 row — a longer localised string should be shortened, not
          wrapped under the field. */}
      <p className="relative text-center text-sm leading-sm whitespace-nowrap text-general-help-text">
        {disclaimer}
      </p>
    </div>
  )
}

function LargeField({
  value,
  onValueChange,
  placeholder,
  onSubmit,
  action,
  sendDisabled,
  onSend,
  onStop,
  onVoice,
  onMore,
  onFile,
  more,
  file,
  banner,
  onBannerAction,
  tags,
  onRemoveTag,
  attachments,
  onRemoveAttachment,
  inputRef,
  l,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  onSubmit: () => void
  action: 'stop' | 'send' | 'voice'
  sendDisabled: boolean
  onSend: () => void
  onStop?: () => void
  onVoice?: () => void
  onMore?: () => void
  onFile?: () => void
  more: boolean
  file: boolean
  banner?: ComposerBanner
  onBannerAction?: () => void
  tags: ComposerTag[]
  onRemoveTag?: (id: string) => void
  attachments: ComposerAttachment[]
  onRemoveAttachment?: (id: string) => void
  inputRef?: Ref<HTMLInputElement & HTMLTextAreaElement>
  l: typeof DEFAULT_LABELS
}) {
  return (
    /* A real border here, unlike every other stroke in the hub: this frame has
       "include strokes in layout" on, so the stroke does take 1 on each side —
       8 + 32 + 8 + 44 + 12 + 2 = 106, which with the 8 gap and the 16
       disclaimer is the 130 the variant reports. An inset shadow lands at 128. */
    <div className="relative flex flex-col items-start justify-end gap-sp-08 rounded-12 border border-general-stroke bg-general-input px-sp-12 pt-sp-08 pb-sp-12">
      {banner ? (
        <Banner type={banner.type} action={banner.action} onAction={onBannerAction}>
          {banner.message}
        </Banner>
      ) : null}

      {tags.length > 0 ? (
        <div className="flex flex-wrap items-start gap-sp-08">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center justify-center gap-sp-04 rounded-04 bg-tag-purple-background px-sp-08 py-[2px] text-tag-purple-content"
            >
              <span className="max-w-[200px] truncate text-sm leading-sm font-semibold">
                {tag.label}
              </span>
              <button
                type="button"
                onClick={() => onRemoveTag?.(tag.id)}
                aria-label={`${l.removeTag} ${tag.label}`}
                className="flex size-[16px] shrink-0 cursor-pointer items-center justify-center rounded-04 outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <TagCloseIcon />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {attachments.length > 0 ? (
        /* 304 in the file — the composer's 328 less its 12 of padding a side.
           Fill, so it holds when the composer is wider. */
        <div className="flex w-full flex-wrap items-start gap-sp-04">
          {attachments.map((item) => (
            <AttachmentTile
              key={item.id}
              item={item}
              onRemove={() => onRemoveAttachment?.(item.id)}
              removeLabel={l.removeAttachment}
            />
          ))}
        </div>
      ) : null}

      {/* 32 in the file, with the 20 line at the top. It grows with the text
          instead of scrolling inside 32 — five lines, then it scrolls. */}
      <textarea
        ref={inputRef}
        value={value}
        rows={1}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            onSubmit()
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field-sizing-content max-h-[100px] min-h-[32px] w-full resize-none bg-transparent text-md leading-md text-general-title outline-none placeholder:text-text-placeholder"
      />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-sp-08">
          {more ? (
            <IconButton
              label={l.more}
              onClick={onMore}
              className="size-[44px] bg-button-secondary-filled-bg text-button-secondary-filled-text"
            >
              <PlusMdIcon />
            </IconButton>
          ) : null}
          {file ? (
            /* 1.5 stroke on a fixed 44 — inset, so the circle stays 44. */
            <IconButton
              label={l.file}
              onClick={onFile}
              className="size-[44px] bg-button-secondary-outline-bg text-button-secondary-outline-text shadow-[inset_0_0_0_1.5px_var(--color-button-secondary-outline-border)]"
            >
              <FileIcon />
            </IconButton>
          ) : null}
        </div>
        <PrimaryAction
          action={action}
          disabled={sendDisabled}
          onSend={onSend}
          onStop={onStop}
          onVoice={onVoice}
          className="size-[44px]"
          l={l}
        />
      </div>
    </div>
  )
}

function AttachmentTile({
  item,
  onRemove,
  removeLabel,
}: {
  item: ComposerAttachment
  onRemove: () => void
  removeLabel: string
}) {
  const preview = Boolean(item.previewSrc)
  return (
    /* 72 x 72, radius 12. The tile with no preview sits on white under a 30%
       overlay, which is what turns it grey; previews take a lighter 20%. */
    <div
      className={`relative size-[72px] shrink-0 overflow-clip rounded-12 shadow-[inset_0_0_0_1px_var(--color-composer-attachment-stroke)] ${
        preview ? '' : 'bg-composer-attachment-bg'
      }`}
    >
      {item.previewSrc ? (
        <img
          src={item.previewSrc}
          alt=""
          className="absolute inset-0 size-full rounded-12 object-cover"
        />
      ) : null}
      <div
        aria-hidden
        className={`absolute inset-0 bg-surface-overlay ${preview ? 'opacity-20' : 'opacity-30'}`}
      />
      {preview ? null : (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-inverse">
          <AttachmentFileIcon />
        </span>
      )}
      {item.label ? (
        /* Placed absolutely at (5, 53) and 62 wide in the file, over the
           image, with a 4px black text-shadow to hold it on any photo. */
        <p className="absolute top-[53px] left-[5px] w-[62px] truncate text-xs leading-xs font-medium text-text-inverse [text-shadow:0_1px_4px_#000]">
          {item.label}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onRemove}
        aria-label={item.label ? `${removeLabel} ${item.label}` : removeLabel}
        className="absolute top-[3px] left-[55px] flex cursor-pointer items-center rounded-32 bg-composer-attachment-bg text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <AttachmentCloseIcon />
      </button>
    </div>
  )
}

function PrimaryAction({
  action,
  disabled = false,
  onSend,
  onStop,
  onVoice,
  className,
  l,
}: {
  action: 'stop' | 'send' | 'voice'
  /** Send with nothing to send. Primary · Filled · disabled: a flat fill in
   *  place of the gradient, the icon in its disabled colour. */
  disabled?: boolean
  onSend: () => void
  onStop?: () => void
  onVoice?: () => void
  className: string
  l: typeof DEFAULT_LABELS
}) {
  const props = {
    stop: { label: l.stop, onClick: onStop, icon: <StopIcon /> },
    send: { label: l.send, onClick: onSend, icon: <SendIcon /> },
    voice: { label: l.voice, onClick: onVoice, icon: <MicrophoneIcon /> },
  }[action]
  return (
    <IconButton
      label={props.label}
      onClick={props.onClick}
      disabled={disabled}
      className={`${
        disabled
          ? 'bg-button-primary-filled-bg-disabled text-button-primary-filled-icon-disabled'
          : 'composer-action text-button-primary-filled-text'
      } ${className}`}
    >
      {props.icon}
    </IconButton>
  )
}

function IconButton({
  label,
  onClick,
  disabled = false,
  className,
  children,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  className: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex shrink-0 cursor-pointer items-center disabled:cursor-not-allowed justify-center overflow-clip rounded-pill outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  )
}
