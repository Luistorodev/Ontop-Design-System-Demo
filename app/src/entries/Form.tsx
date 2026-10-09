import { useState, type ReactNode } from 'react'
import {
  Chip,
  ChipGroup,
  ChipInput,
  Form as FormCard,
  FormStepper,
  type ChipInputState,
  type ChipState,
} from '../ui/Form'
import { ChatScreenView } from './ChatScreen'
import { useChatScreen } from './useChatScreen'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { figmaUrl } from '../catalog/registry'

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

const NODE = '13302-5748'

export function Form() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Form"
        source="02 - Worker Design System · [AI] Form · Form 13302:5748 · Stepper 13317:13293 · Bar 13317:13242 · Chip 13302:8381 · Chip input 13333:153 · Progressive blur overlay 13306:1472"
        intro="When Aura is unsure, it asks. The Form takes the Composer's place over a blurred conversation and walks the user through 2 to 5 questions — pick an option or write your own answer. Light and Dark are the hub's theme."
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
   Sample questions — copy written for the preview, not from the file
   ================================================================ */

type Question = { title: string; description?: string; options: string[]; short: string }

const QUESTIONS: Question[] = [
  {
    title: 'What do you need help with?',
    description: 'Pick one, or write your own.',
    options: ['A withdrawal', 'A payment I received', 'My tax documents'],
    short: 'Topic',
  },
  {
    title: 'Which account is it about?',
    description: 'The one the money moved through.',
    options: ['Bancolombia ••4471', 'Ontop wallet', 'Ontop card'],
    short: 'Account',
  },
  {
    title: 'When did it happen?',
    description: 'An approximate date is fine.',
    options: ['Today', 'This week', 'Earlier this month'],
    short: 'When',
  },
  {
    title: 'How urgent is it?',
    description: 'We use it to order the queue.',
    options: ['It can wait', 'Today, please', 'Right now'],
    short: 'Urgency',
  },
  {
    title: 'How should we reach you?',
    description: 'We will answer there.',
    options: ['In this chat', 'By email', 'On WhatsApp'],
    short: 'Contact',
  },
]

type Answer = { choice: string | null; text: string }
const blank = (n: number): Answer[] => Array.from({ length: n }, () => ({ choice: null, text: '' }))

/* ================================================================
   Preview — the shared Aura chat screen, with the Form in the
   Composer's place
   ================================================================ */

function Preview() {
  const chat = useChatScreen()
  const [steps, setSteps] = useState(5)
  const [description, setDescription] = useState(true)
  const [stepper, setStepper] = useState(true)
  const [secondButton, setSecondButton] = useState(true)
  const [actions, setActions] = useState<'horizontal' | 'vertical'>('horizontal')
  const [icon, setIcon] = useState(false)
  const [composer, setComposer] = useState(true)

  const [open, setOpen] = useState(true)
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answer[]>(() => blank(5))
  // A new key replays the enter animation each time the form opens.
  const [openKey, setOpenKey] = useState(0)

  const restart = (n = steps) => {
    setAnswers(blank(n))
    setStep(1)
    setOpen(true)
    setOpenKey((k) => k + 1)
  }

  const questions = QUESTIONS.slice(0, steps)
  const q = questions[step - 1]
  const a = answers[step - 1] ?? { choice: null, text: '' }
  const setAnswer = (next: Answer) => setAnswers((list) => list.map((x, i) => (i === step - 1 ? next : x)))

  const close = () => setOpen(false)
  const back = () => setStep(Math.max(1, step - 1))
  const next = () => {
    if (step < steps) return setStep(step + 1)
    /* The last Next sends everything as one user message, the way the
       answers would reach Aura. */
    const lines = questions.map((qq, i) => {
      const ans = answers[i]
      return `${qq.short}: ${ans.text.trim() || ans.choice || '—'}`
    })
    close()
    chat.post(lines.join(' · '))
  }

  const form = open ? (
    <FormCard
      key={openKey}
      animate
      step={step}
      steps={steps}
      stepper={stepper}
      composer={composer}
      title={q.title}
      description={description ? q.description : undefined}
      answer={a.text}
      // Single choice: typing your own answer clears the chip.
      onAnswerChange={(text) => setAnswer({ choice: text ? null : a.choice, text })}
      actions={actions}
      secondButton={secondButton}
      onBack={back}
      onNext={next}
      onClose={close}
    >
      <ChipGroup label={q.title}>
        {q.options.map((option) => (
          <Chip
            key={option}
            label={option}
            icon={icon}
            selected={a.choice === option}
            // Picking a chip replaces a typed answer.
            onClick={() => setAnswer({ choice: a.choice === option ? null : option, text: '' })}
          />
        ))}
      </ChipGroup>
    </FormCard>
  ) : undefined

  return (
    <div className="flex flex-wrap items-start gap-sp-40">
      <ChatScreenView chat={chat} replaceComposer={form} />

      <div className="min-w-[280px] flex-1 space-y-sp-16">
        <Control label="Steps">
          {[2, 3, 4, 5].map((n) => (
            <Toggle
              key={n}
              label={String(n)}
              on={steps === n}
              onChange={() => {
                setSteps(n)
                restart(n)
              }}
            />
          ))}
        </Control>
        <Control label="Actions">
          <Toggle label="Horizontal" on={actions === 'horizontal'} onChange={() => setActions('horizontal')} />
          <Toggle label="Vertical" on={actions === 'vertical'} onChange={() => setActions('vertical')} />
        </Control>
        <Control label="Optional parts">
          <Toggle label="Stepper" on={stepper} onChange={setStepper} />
          <Toggle label="Description" on={description} onChange={setDescription} />
          <Toggle label="Second button" on={secondButton} onChange={setSecondButton} />
          <Toggle label="Composer" on={composer} onChange={setComposer} />
          <Toggle label="Chip icon" on={icon} onChange={setIcon} />
        </Control>
        <div>
          <button
            type="button"
            onClick={() => restart()}
            className="cursor-pointer rounded-08 border border-border-subtle bg-surface-subtle px-sp-12 py-sp-04 text-md leading-md font-medium text-text-primary hover:border-border-strong"
          >
            {open ? 'Restart the form' : 'Ask again'}
          </button>
        </div>

        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Aura is asking. Pick an option, or type your own answer in the Chip input — one or the other: typing clears
          the chip, and picking a chip clears what you typed. Next moves on and the stepper fills;
          Back goes back — the first step has Next alone, with nothing to go back to. The last step&rsquo;s Next sends all the
          answers as one message, and Aura replies. While the form is open the conversation is
          locked — it does not scroll and the overlay does not close the form on tap. The close
          button is the only way out, and the Composer returns.
        </p>
        <p className="max-w-[46ch] text-md leading-md text-text-secondary">
          Tapping the answer field brings up the keyboard, and the form rides on it like the
          Composer does. Switch the hub to Dark to see the card, the overlay and the chips follow.
        </p>
        <p className="max-w-[46ch] text-sm leading-sm text-text-tertiary">
          The questions are sample copy. The chip icon is the file&rsquo;s placeholder ring, off
          by default.
        </p>
      </div>
    </div>
  )
}

/* ================================================================
   Documentation — follows the Figma docs frame (13302:4236): Forms
   (Variants, Properties), In context, Stepper, Chip, Chip input
   ================================================================ */

const SAMPLE_OPTIONS = ['Label', 'Label', 'Label', 'Label']

function SampleForm({
  description = true,
  secondButton = true,
  actions = 'horizontal',
  steps = 5,
}: {
  description?: boolean
  secondButton?: boolean
  actions?: 'horizontal' | 'vertical'
  steps?: number
}) {
  const [choice, setChoice] = useState<number | null>(null)
  return (
    <FormCard
      overlay={false}
      // Back only exists from step 2 on, so the two-button samples show step 2.
      step={secondButton ? 2 : 1}
      steps={steps}
      title="Title"
      description={description ? 'Subtitle' : undefined}
      actions={actions}
      secondButton={secondButton}
    >
      <ChipGroup label="Title">
        {SAMPLE_OPTIONS.map((label, i) => (
          <Chip key={i} label={label} selected={choice === i} onClick={() => setChoice(choice === i ? null : i)} />
        ))}
      </ChipGroup>
    </FormCard>
  )
}

function InContextSample() {
  const chat = useChatScreen()
  return (
    <ChatScreenView
      chat={chat}
      replaceComposer={
        <FormCard step={1} steps={5} title="Title" description="Subtitle">
          <ChipGroup label="Title">
            {['Label', 'Label', 'Label'].map((label, i) => (
              <Chip key={i} label={label} />
            ))}
          </ChipGroup>
        </FormCard>
      }
    />
  )
}

const CHIP_STATES: ChipState[] = ['default', 'selected', 'pressed']
const CHIP_INPUT_STATES: ChipInputState[] = ['default', 'focus', 'filled']

function Documentation() {
  return (
    <>
      <Part title="Forms" node="Form 13302:5748">
        The card Aura uses to ask questions. Form is a single component: Light and Dark are Aura
        modes, not variants. Configurable: Stepper, Description, Second button and the actions
        layout. Rules: a form has a minimum of 2 steps and a maximum of 5, the text field for a
        custom answer is always there, and the first step always has a single button — Next.
      </Part>

      <Section title="Variants" description="Light and Dark are the hub's theme — the card is 328 wide and hugs its content.">
        <Pair>{() => <SampleForm />}</Pair>
      </Section>

      <Section title="Anatomy">
        <Table head={['#', 'Element', 'Notes']}>
          {[
            ['1', 'Card', '328 wide, br-20, form/background with a 1px form/stroke drawn inside.'],
            ['2', 'Stepper', 'Optional. See Stepper below. Header padding 16 × 12.'],
            ['3', 'Close', '36 round, close/bg, 24 close icon in close/icon. 12 from the top and the right edge. Independent of the Stepper.'],
            ['4', 'Title', 'Title/md/semibold — 18/22 in general/title.'],
            ['5', 'Description', 'Optional. Body/md/regular — 14/20 in chat/text-black. sp-08 under the title.'],
            ['6', 'Options', 'A slot of Chips, sp-08 apart. Single choice.'],
            ['7', 'Chip input', 'Always present: the custom answer. See Chip input below.'],
            ['8', 'Actions', 'Secondary Outline (Back) and Primary Filled (Next), lg: h44, br-100, 16/24 Medium. sp-08 apart, sp-08 above. Step 1 shows Next alone.'],
            ['—', 'Content', 'Padding sp-08 top, sp-16 sides and bottom; sections sp-16 apart.'],
          ].map((cells) => (
            <Row key={cells[0] + cells[1]} cells={cells} />
          ))}
        </Table>
      </Section>

      <Section title="Properties">
        <Table head={['Figma property', 'Prop', 'Notes']}>
          {[
            ['Stepper', 'stepper · step · steps', 'On by default. steps is clamped to 2–5.'],
            ['Description', 'description', 'On by default in Figma; pass the text to show it.'],
            ['Second button', 'secondButton', 'Back. Off leaves Next alone, full width. Never shown on step 1, whatever the prop says.'],
            ['Horizontal actions / Vertical actions', 'actions', '"horizontal" | "vertical". The file never turns both on, so the hub makes it one choice.'],
            ['Slot', 'children', 'A ChipGroup of Chips.'],
            ['Composer', 'composer · answer · onAnswerChange · answerPlaceholder', 'Shows the Chip input. On by default; the file’s rule asks for a custom answer on every form, so turn it off only with a reason.'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={1} />
          ))}
        </Table>

        <h3 className="mt-sp-32 mb-sp-12 text-xl leading-2xl font-semibold text-text-primary">All properties</h3>
        <Pair>{() => <SampleForm steps={2} />}</Pair>
        <h3 className="mb-sp-12 text-xl leading-2xl font-semibold text-text-primary">One button</h3>
        <Pair>{() => <SampleForm description={false} secondButton={false} />}</Pair>
        <h3 className="mb-sp-12 text-xl leading-2xl font-semibold text-text-primary">Vertical buttons</h3>
        <Pair>{() => <SampleForm actions="vertical" />}</Pair>
      </Section>

      <Part title="In context" node="Form over the conversation · Progressive blur overlay 13306:1472">
        The same Form, placed in the Composer&rsquo;s place over the conversation — a composition,
        not a separate component. The overlay behind the card is 360 × 700, from 198 above it: a
        gradient from general/surface-white at 60% (71.214%) to general/fade-white (106.07%), with
        a progressive background blur that rises from 0 at 10.64% of its height to 40 at 47.43%.
        The card stays sharp; the Topbar stays above it.
      </Part>

      <Section title="Variants">
        <div className="mb-sp-24 flex flex-wrap items-start gap-sp-24">
          {(['light', 'dark'] as const).map((mood) => (
            <figure key={mood} className="m-0">
              <div data-theme={mood}>
                <InContextSample />
              </div>
              <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
                {mood === 'light' ? 'Light' : 'Dark'}
              </figcaption>
            </figure>
          ))}
        </div>
        <GapNote severity="warning">
          Figma&rsquo;s blur radius is twice CSS&rsquo;s standard deviation, so the 40 is drawn as{' '}
          <Mono>blur(20px)</Mono>. The blur and the gradient are two elements, each animating
          itself, so the backdrop is never flattened by a wrapper.
        </GapNote>
      </Section>

      <Part title="Stepper" node="Stepper 13317:13293 · Bar 13317:13242 → Step">
        &ldquo;1 of N&rdquo; and one Bar per step, 8 apart; bars 4 apart. The first two bars are
        always there; Step 3, Step 4 and Step 5 add the rest. Each Bar is 28 × 16 with a 4 track:
        Completed (full), Start — the current step, filled to 40% — or Next (empty). The label is
        Body/md/md in chat/text-black, the track chat/disabled and the fill general/gradient-light.
      </Part>

      <Section title="Steps">
        <Pair>
          {() => (
            <div className="space-y-sp-12">
              {[2, 3, 4, 5].map((n) => (
                <FormStepper key={n} step={Math.min(2, n)} steps={n} />
              ))}
            </div>
          )}
        </Pair>
      </Section>

      <Part title="Chip" node="Chip 13302:8381 → State">
        The selection chip used in conversational forms: Default, Selected and Pressed. There is no
        Mood property any more — Light and Dark are Aura modes. h44, sp-24 × sp-08, br-32, gap 16,
        label 14/20 left-aligned and truncated: Regular at rest and pressed, Medium when selected.
        The leading 20 icon is a boolean, on by default in the file.
      </Part>

      <Section title="States" description="Pressed is the :active look; Selected is the chosen option.">
        <div className="grid gap-sp-24 lg:grid-cols-2">
          {(['light', 'dark'] as const).map((mood) => (
            <figure key={mood} className="m-0">
              <div
                data-theme={mood}
                className="space-y-sp-16 rounded-16 bg-form-background p-sp-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
              >
                {CHIP_STATES.map((state) => (
                  <div key={state}>
                    <div className="mb-sp-04 text-xs leading-xs font-medium text-text-tertiary capitalize">{state}</div>
                    <div role="radiogroup" aria-label={state} className="grid gap-sp-08 sm:grid-cols-2">
                      <Chip label="Label" forceState={state} icon />
                      <Chip label="Label" forceState={state} />
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
                {mood === 'light' ? 'Light' : 'Dark'} · with and without the icon
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-sp-12">
          <GapNote severity="warning">
            The icon is still Figma&rsquo;s placeholder ring, so the hub keeps it off by default
            (the file has it on) until the team picks real icons.
          </GapNote>
        </div>
      </Section>

      <Part title="Chip input" node="Chip input 13333:153 → State">
        The custom-answer field, shaped like a Chip so it reads as one more option: h52, br-32, 24
        left and 12 right, gap 16, with the 20 <Mono>edit-01</Mono> icon in form/icon. Fill
        general/input with a 1px general/stroke inside. The placeholder &ldquo;Type custom
        answer...&rdquo; is Body/md/regular in text/placeholder; typed text is chat/text-black.
        Created on 2026-10-08 from the Form&rsquo;s own field — a different element from the
        Composer.
      </Part>

      <Section title="States" description="Focus comes from the field itself and borrows the Chip's Pressed border, chat/pressed. Filled only changes the text colour.">
        <div className="grid gap-sp-24 lg:grid-cols-2">
          {(['light', 'dark'] as const).map((mood) => (
            <figure key={mood} className="m-0">
              <div
                data-theme={mood}
                className="space-y-sp-16 rounded-16 bg-form-background p-sp-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
              >
                {CHIP_INPUT_STATES.map((state) => (
                  <div key={state}>
                    <div className="mb-sp-04 text-xs leading-xs font-medium text-text-tertiary capitalize">{state}</div>
                    <ChipInput forceState={state} />
                  </div>
                ))}
              </div>
              <figcaption className="mt-sp-08 text-sm leading-sm text-text-tertiary">
                {mood === 'light' ? 'Light' : 'Dark'}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-sp-12">
          <GapNote severity="warning">
            Figma first drew only the empty state. Focus and Filled were added with the team on
            2026-10-08, in the file and here.
          </GapNote>
        </div>
      </Section>

      <Section
        title="Variables & appearance"
        description="Every colour is a tier-3 token. Light and Dark are modes of the collections, not variants."
      >
        <Table head={['Token', 'Light', 'Dark', 'Used by']}>
          {[
            ['form/background', '#FFFFFF', '#1B0F57', 'Card fill'],
            ['form/stroke', '#EAECF0', '#281782', 'Card stroke'],
            ['form/icon', '#667085', '#EAECF0', 'Chip icon (Default), Chip input icon'],
            ['general/input', '#F9FAFB', '#140B41', 'Chip Default fill and stroke, Chip input fill'],
            ['general/stroke', '#FFFFFF', '#21136C', 'Chip input stroke'],
            ['semantic/info-bg', '#EFF4FF', 'blue-800 at 30%', 'Chip Selected fill'],
            ['semantic/info', '#2970FF', '#84ADFF', 'Chip Selected stroke, label, icon'],
            ['general/surface-white', '#FCFCFD', '#0D082B', 'Chip Pressed fill, overlay'],
            ['chat/pressed', '#7064AC', '#D3C5FC', 'Chip Pressed stroke, Chip input Focus stroke'],
            ['chat/text-black', '#475467', '#EAECF0', 'Chip label, Chip input text, stepper label, description'],
            ['chat/disabled', '#D0D5DD', 'gray-blue-300 at 50%', 'Stepper track'],
            ['general/gradient-light', '#7A50F7', '#D3C5FC', 'Stepper fill'],
          ].map((cells) => (
            <Row key={cells[0]} cells={cells} mono={0} />
          ))}
        </Table>
      </Section>

      <Section title="Accessibility">
        <p className="max-w-[70ch] text-md leading-md text-text-secondary">
          The card is a <Mono>dialog</Mono> named by its title. The options are a{' '}
          <Mono>radiogroup</Mono> of <Mono>radio</Mono> buttons with <Mono>aria-checked</Mono>; the
          stepper is a <Mono>progressbar</Mono> with the step as its value. The answer field has an
          accessible name, and Enter in it acts as Next. The card is modal (<Mono>aria-modal</Mono>)
          and the conversation behind it is <Mono>inert</Mono>, so focus cannot wander there; the
          labelled close button is the only way out. Chips are 44 tall, so they meet the platforms&rsquo; target
          size; the close button is 36.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Helpers — hub chrome, local to this page
   ================================================================ */

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
function Pair({ children }: { children: () => ReactNode }) {
  return (
    <div className="mb-sp-24 flex flex-wrap items-start gap-sp-24">
      {(['light', 'dark'] as const).map((mood) => (
        <figure key={mood} className="m-0">
          <div
            data-theme={mood}
            className="flex w-[360px] max-w-full justify-center rounded-16 bg-surface-page px-sp-16 py-sp-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]"
          >
            {children()}
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

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">{label}</div>
      <div className="flex flex-wrap gap-sp-08">{children}</div>
    </div>
  )
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
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
