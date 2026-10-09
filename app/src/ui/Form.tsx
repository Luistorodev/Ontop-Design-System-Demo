import type { ReactNode, Ref } from 'react'
import { CloseIcon } from '../icons/info-sheet'
import { ChipPlaceholderIcon, EditIcon } from '../icons/form'

/* Form — 02 - Worker Design System, page "[AI] Form".

   What Aura shows when it needs answers from the user: a card that takes the
   Composer's place over a blurred conversation, one question per step.

   - Form (13302:5748): stepper, close, title, optional description, an
     options slot (Chips), the custom answer field, and the actions — Back +
     Next in a row, Next alone, or both stacked. Step 1 shows Next alone.
   - Chip input (13333:153): the custom-answer field, shaped like a Chip.
     Default, Focus, Filled.
   - Stepper (13317:13293) and Bar (13317:13242): the "1 of N" progress.
   - Chip (13302:8381): a single-choice option. Default, Selected, Pressed.
   - Progressive blur overlay (13306:1472): the gradient and the blur behind
     the card, 360 × 700 from 198 above it.

   Rules from the file: 2 to 5 steps; the text field for a custom answer is
   always there.

   Light and Dark are Aura modes, not variants, so they are the hub's theme.
   Every colour is a tier-3 token: Aura · Form for the card and the chip
   icon, Aura · General, Chat and Semantic for the rest. */

/* ================================================================
   Chip
   ================================================================ */

export type ChipState = 'default' | 'selected' | 'pressed'

/* Per state: fill, inside stroke, label, icon.
   Default  general/input · general/input · chat/text-black · form/icon
   Selected semantic/info-bg · semantic/info · semantic/info · semantic/info
   Pressed  general/surface-white · chat/pressed · chat/text-black · text/secondary
   Default's stroke is its own fill — invisible, but kept so all three
   states share one geometry. Pressed is the :active look. */
const CHIP: Record<ChipState, { box: string; icon: string; label: string }> = {
  default: {
    box: 'group bg-general-input shadow-[inset_0_0_0_1px_var(--color-general-input)] active:bg-general-surface-white active:shadow-[inset_0_0_0_1px_var(--color-chat-pressed)]',
    icon: 'text-form-icon group-active:text-text-secondary',
    label: 'font-normal text-chat-text-black',
  },
  selected: {
    box: 'bg-semantic-info-bg shadow-[inset_0_0_0_1px_var(--color-semantic-info)]',
    icon: 'text-semantic-info',
    label: 'font-medium text-semantic-info',
  },
  pressed: {
    box: 'bg-general-surface-white shadow-[inset_0_0_0_1px_var(--color-chat-pressed)]',
    icon: 'text-text-secondary',
    label: 'font-normal text-chat-text-black',
  },
}

export function Chip({
  label,
  selected = false,
  icon = false,
  forceState,
  onClick,
  className = '',
}: {
  label: string
  selected?: boolean
  /** Figma's leading 20 icon. On by default in the file; off here, by team
   *  decision, while it is still the placeholder ring. */
  icon?: boolean
  /** Documentation only: draw a state without interacting with it. */
  forceState?: ChipState
  onClick?: () => void
  className?: string
}) {
  const state = forceState ?? (selected ? 'selected' : 'default')
  const look = CHIP[state]
  return (
    /* h44, sp-24 × sp-08, br-32, gap 16, label left-aligned. The 1px stroke
       is inside the frame in Figma, so it is an inset shadow and the 44
       holds. */
    <button
      type="button"
      role="radio"
      aria-checked={state === 'selected'}
      onClick={onClick}
      className={`flex h-[44px] w-full cursor-pointer items-center gap-sp-16 rounded-32 px-sp-24 py-sp-08 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus ${look.box} ${className}`}
    >
      {icon ? <ChipPlaceholderIcon className={`shrink-0 ${look.icon}`} /> : null}
      {/* Regular at rest and pressed, Medium when selected. */}
      <span className={`min-w-px flex-[1_0_0] truncate text-md leading-md ${look.label}`}>{label}</span>
    </button>
  )
}

/* ================================================================
   Chip input
   ================================================================ */

export type ChipInputState = 'default' | 'focus' | 'filled'

/* Stroke per state, drawn inside: general/stroke at rest and filled,
   chat/pressed with focus — the Chip's Pressed border. */
const CHIP_INPUT_STROKE: Record<ChipInputState, string> = {
  default: 'shadow-[inset_0_0_0_1px_var(--color-general-stroke)] focus-within:shadow-[inset_0_0_0_1px_var(--color-chat-pressed)]',
  filled: 'shadow-[inset_0_0_0_1px_var(--color-general-stroke)] focus-within:shadow-[inset_0_0_0_1px_var(--color-chat-pressed)]',
  focus: 'shadow-[inset_0_0_0_1px_var(--color-chat-pressed)]',
}

export function ChipInput({
  value = '',
  onValueChange,
  placeholder = 'Type custom answer...',
  onEnter,
  inputRef,
  forceState,
  className = '',
}: {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  /** Enter in the field — the Form uses it as Next. */
  onEnter?: () => void
  inputRef?: Ref<HTMLInputElement>
  /** Documentation only: draw a state without interacting with it. */
  forceState?: ChipInputState
  className?: string
}) {
  /* Focus comes from :focus-within and Filled from the value, unless a
     state is forced. Filled only changes the text: chat/text-black where
     the placeholder is text/placeholder. */
  const state: ChipInputState = forceState ?? (value ? 'filled' : 'default')
  const shown = forceState === 'filled' && !value ? 'My own answer' : value
  return (
    /* h52, br-32, 24 left and 12 right, gap 16, 20 icon — the Chip's geometry with
       the Composer's field colours. */
    <label
      className={`flex h-[52px] w-full items-center gap-sp-16 rounded-32 bg-general-input pr-sp-12 pl-sp-24 transition-shadow ${CHIP_INPUT_STROKE[state]} ${className}`}
    >
      <EditIcon className="shrink-0 text-form-icon" />
      <input
        ref={inputRef}
        value={shown}
        readOnly={!!forceState}
        tabIndex={forceState ? -1 : undefined}
        onChange={(event) => onValueChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onEnter?.()
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-px flex-[1_0_0] bg-transparent text-md leading-md text-chat-text-black outline-none placeholder:text-text-placeholder"
      />
    </label>
  )
}

/** The options slot: chips 8 apart, single choice. */
export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full flex-col gap-sp-08">
      {children}
    </div>
  )
}

/* ================================================================
   Stepper
   ================================================================ */

/* Stepper (13317:13293) of Bars (13317:13242). Each Bar is Completed (full),
   Start (the current step, filled to 11.2 of 28 — 40%) or Next (empty). The
   first two bars are always there; Step 3, 4 and 5 add the rest. */
const CURRENT_FILL = 0.4

export function FormStepper({
  step,
  steps,
  label = `${step} of ${steps}`,
}: {
  /** 1-based. */
  step: number
  steps: number
  label?: string
}) {
  return (
    <div className="flex items-center gap-sp-08">
      <span className="text-md leading-md font-medium whitespace-nowrap text-chat-text-black">{label}</span>
      <div
        className="flex items-center gap-sp-04"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-valuenow={step}
        aria-label="Question"
      >
        {Array.from({ length: steps }, (_, i) => {
          const fill = i + 1 < step ? 1 : i + 1 === step ? CURRENT_FILL : 0
          return (
            /* 28 × 16 per bar; the 4 track sits centred in it. */
            <span key={i} className="flex h-[16px] w-[28px] items-center">
              <span className="relative h-[4px] w-full overflow-clip rounded-08 bg-chat-disabled">
                <span
                  className="absolute inset-y-0 left-0 rounded-08 bg-general-gradient-light transition-[width] duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
                  style={{ width: `${fill * 100}%` }}
                />
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ================================================================
   Form
   ================================================================ */

export function Form({
  step = 1,
  steps = 5,
  stepper = true,
  title,
  description,
  children,
  composer = true,
  answer = '',
  onAnswerChange,
  answerPlaceholder = 'Type custom answer...',
  answerRef,
  actions = 'horizontal',
  secondButton = true,
  backLabel = 'Back',
  nextLabel = 'Next',
  onBack,
  onNext,
  onClose,
  closeLabel = 'Close',
  overlay = true,
  animate = false,
  className = '',
}: {
  /** 1-based current step. */
  step?: number
  /** 2 to 5 — the file's rule. Clamped. */
  steps?: number
  stepper?: boolean
  title: ReactNode
  /** Optional. Body/md/regular in chat/text-black. */
  description?: ReactNode
  /** The options slot — a ChipGroup of Chips. */
  children?: ReactNode
  /** Figma's Composer boolean: shows the Chip input. On by default — the
   *  file's rule asks for a custom answer on every form. */
  composer?: boolean
  answer?: string
  onAnswerChange?: (value: string) => void
  answerPlaceholder?: string
  answerRef?: Ref<HTMLInputElement>
  /** Figma's horizontalActions / verticalActions booleans, as one choice:
   *  the file never shows both. */
  actions?: 'horizontal' | 'vertical'
  /** Back. Off leaves Next alone, full width. Never shown on step 1 —
   *  there is nothing to go back to. */
  secondButton?: boolean
  backLabel?: string
  nextLabel?: string
  onBack?: () => void
  onNext?: () => void
  onClose?: () => void
  closeLabel?: string
  /** The progressive blur overlay behind the card. On inside a screen; off
   *  for a card shown on its own. It blocks taps; it never closes the form. */
  overlay?: boolean
  /** Enter animation — the overlay fades and the card rises. */
  animate?: boolean
  className?: string
}) {
  const total = Math.min(5, Math.max(2, steps))
  /* In a row the two buttons share the width; stacked, each is full width. */
  const fit = actions === 'vertical' ? 'w-full' : 'min-w-px flex-[1_0_0]'
  const current = Math.min(total, Math.max(1, step))
  // Team rule (2026-10-08): the first step always has a single button.
  const showBack = secondButton && current > 1
  return (
    <div className={`relative flex w-[328px] max-w-full flex-col justify-end ${className}`}>
      {overlay ? (
        <>
          {/* 360 × 700, from 16 left and 198 above the card, as in Figma. */}
          <div aria-hidden className={`form-overlay-blur pointer-events-none absolute top-[-198px] left-[-16px] h-[700px] w-[360px] ${animate ? 'form-enter-fade' : ''}`} />
          {/* The fill is a blocking scrim: it takes the taps meant for the
              conversation and does nothing with them. The close button is the
              only way out (team decision, 2026-10-08). */}
          <div
            aria-hidden
            className={`form-overlay-fill absolute top-[-198px] left-[-16px] h-[700px] w-[360px] ${animate ? 'form-enter-fade' : ''}`}
          />
        </>
      ) : null}

      {/* The card: form/background, br-20, with the 1px form/stroke drawn
          inside. 328 × 454 in the file with five options. */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Form'}
        className={`relative flex w-full flex-col rounded-20 bg-form-background shadow-[inset_0_0_0_1px_var(--color-form-stroke)] ${animate ? 'form-enter-card' : ''}`}
      >
        {/* Header: 16 × 12 around the 20 stepper line. The close button is
            its own element (no longer inside the Stepper): 36, 12 from the
            top and the right edge, hanging past the header's 44. */}
        <div className="relative min-h-[44px] px-sp-16 py-sp-12">
          {stepper ? <FormStepper step={current} steps={total} /> : null}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute top-sp-12 right-sp-12 flex size-[36px] cursor-pointer items-center justify-center rounded-pill bg-close-bg text-close-icon outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-sp-16 px-sp-16 pt-sp-08 pb-sp-16">
          <div className="flex w-full flex-col gap-sp-08">
            <h2 className="pr-sp-40 text-xl leading-title-md font-semibold text-general-title">{title}</h2>
            {description ? <p className="text-md leading-md text-chat-text-black">{description}</p> : null}
          </div>

          <div className="flex w-full flex-col gap-sp-08">
            {children}
            {/* The custom answer, behind Figma's Composer boolean. */}
            {composer ? (
            <ChipInput
              value={answer}
              onValueChange={onAnswerChange}
              placeholder={answerPlaceholder}
              onEnter={onNext}
              inputRef={answerRef}
            />
            ) : null}
          </div>

          <div
            className={`flex w-full gap-sp-08 pt-sp-08 ${actions === 'vertical' ? 'flex-col' : 'items-start'}`}
          >
            {showBack ? (
              /* Secondary · Outline · lg, in a row and stacked alike. Its 1.5
                 border is inside in Figma. */
              <button
                type="button"
                onClick={onBack}
                className={`flex h-[44px] ${fit} cursor-pointer items-center justify-center rounded-pill bg-button-secondary-outline-bg px-sp-24 text-lg leading-lg font-medium text-button-secondary-outline-text shadow-[inset_0_0_0_1.5px_var(--color-button-secondary-outline-border)] outline-none focus-visible:ring-2 focus-visible:ring-border-focus`}
              >
                {backLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onNext}
              className={`flex h-[44px] ${fit} cursor-pointer items-center justify-center rounded-pill bg-button-primary-filled-bg px-sp-24 text-lg leading-lg font-medium text-button-primary-filled-text outline-none focus-visible:ring-2 focus-visible:ring-border-focus`}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
