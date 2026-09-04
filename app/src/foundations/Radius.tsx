import { radiusScale } from '../tokens/scales'
import { Copyable, GapNote, Mono, PageHeader, Section } from '../catalog/docs'

export function Radius() {
  return (
    <>
      <PageHeader
        title="Radius"
        source="DESIGN.md §7 · Border-radius collection"
        intro="Eight steps. br-100 is a full-round sentinel rather than a 100px radius — it is for pills, avatars and circular controls, never for a card."
      />

      <Section title="Naming">
        <GapNote severity="warning">
          Figma&rsquo;s <Mono>br-NN</Mono> cannot be mirrored literally here:{' '}
          <Mono>rounded-br-04</Mono> would collide with Tailwind&rsquo;s bottom-right corner
          utility. The mapping is <Mono>br-04</Mono> → <Mono>rounded-04</Mono>, and{' '}
          <Mono>br-100</Mono> → <Mono>rounded-pill</Mono>. This is the one place where the code
          name deviates from the Figma name.
        </GapNote>
      </Section>

      <Section title="Scale">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-sp-16">
          {radiusScale.map((step) => (
            <Copyable key={step.token} text={step.utility}>
              <div className="rounded-12 border border-border-subtle bg-surface-subtle p-sp-16">
                <div
                  className="h-sp-80 w-full border-2 border-accent-purple bg-accent-purple/10"
                  style={{ borderRadius: step.display }}
                  aria-hidden
                />
                <div className="mt-sp-12 font-mono text-md leading-md font-medium text-text-primary">
                  {step.token}
                </div>
                <div className="mt-sp-04 font-mono text-xs leading-xs text-text-tertiary">
                  {step.utility} · {step.value === 99999 ? '99999px' : `${step.value}px`}
                </div>
                {step.use ? (
                  <div className="mt-sp-08 text-xs leading-xs text-text-secondary">{step.use}</div>
                ) : null}
              </div>
            </Copyable>
          ))}
        </div>
      </Section>
    </>
  )
}
