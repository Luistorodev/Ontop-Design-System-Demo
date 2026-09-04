import { shadowScale } from '../tokens/scales'
import { Copyable, GapNote, Mono, PageHeader, Section } from '../catalog/docs'

export function Elevation() {
  return (
    <>
      <PageHeader
        title="Elevation & focus"
        source="DESIGN.md §7 · Effect styles"
        intro="Four shadows and one focus token. Shadows are effect styles in Figma rather than variables, and they have no Dark variant at all — in Dark, elevation is carried by the card → card-raised → card-sunken surface ramp instead."
      />

      <Section title="Shadows">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-sp-32 rounded-12 bg-surface-subtle p-sp-32">
          {shadowScale.map((s) => (
            <Copyable key={s.token} text={s.utility}>
              <div
                className="rounded-12 bg-surface-page p-sp-16"
                style={{ boxShadow: s.value }}
              >
                <div className="font-mono text-md leading-md font-medium text-text-primary">
                  {s.token}
                </div>
                <div className="mt-sp-04 font-mono text-xs leading-xs text-text-tertiary">
                  {s.utility}
                </div>
                <div className="mt-sp-12 font-mono text-xs leading-xs break-all text-text-tertiary">
                  {s.value}
                </div>
              </div>
            </Copyable>
          ))}
        </div>

        <div className="mt-sp-24 space-y-sp-12">
          <GapNote severity="blocking">
            Do not apply <Mono>Shadows/*</Mono> on dark surfaces. They have no Dark-mode variant,
            so a shadow tuned for a white page reads as dirt on a dark one.
          </GapNote>
          <GapNote severity="warning">
            <Mono>Containers/containers</Mono> and <Mono>Containers/sm-containers</Mono> duplicate{' '}
            <Mono>sm</Mono> and <Mono>xs</Mono> with a gray-blue tint instead of gray-iron. Treat
            them as deprecated and migrate to <Mono>Shadows/*</Mono>.
          </GapNote>
          <GapNote severity="warning">
            Shadows are not tokenized. Making them variables with a Dark variant is open gap 10.
          </GapNote>
        </div>
      </Section>

      <Section
        title="Focus"
        description="border/focus is the token: purple-500 in Light, purple-400 in Dark. Purple specifically, so a focus ring can never be confused with a default, error or brand border."
      >
        <div className="flex flex-wrap items-center gap-sp-32 rounded-12 border border-border-subtle bg-surface-subtle p-sp-32">
          <button
            type="button"
            className="rounded-08 border-2 border-border-focus bg-surface-page px-sp-24 py-sp-12 text-md leading-md font-medium text-text-primary"
          >
            Focused
          </button>
          <button
            type="button"
            className="rounded-08 border-2 border-border-default bg-surface-page px-sp-24 py-sp-12 text-md leading-md font-medium text-text-primary outline-none focus-visible:border-border-focus"
          >
            Tab to me
          </button>
          <p className="max-w-[42ch] text-sm leading-sm text-text-secondary">
            Focus indication is never removed. A control may show focus differently, but it still
            shows it — and at 3:1 minimum against its adjacent background.
          </p>
        </div>

        <div className="mt-sp-16">
          <GapNote severity="warning">
            The four <Mono>Focus ring/4px *</Mono> effect styles predate the token, are built on
            Gray Iron, and are not mode-aware. Use <Mono>border-border-focus</Mono>; the effect
            styles exist for legacy components only.
          </GapNote>
        </div>
      </Section>
    </>
  )
}
