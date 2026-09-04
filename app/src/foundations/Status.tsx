import { changeProcess, knownGaps, legacyRule, legacySurface } from '../tokens/status'
import { PageHeader, Section } from '../catalog/docs'

export function Status() {
  const blocking = knownGaps.filter((g) => g.severity === 'blocking')

  return (
    <>
      <PageHeader
        title="Gaps & legacy"
        source="DESIGN.md §10–12"
        intro="What is open, what is dead, and how a foundations change lands. These are not decided questions — they are here because a developer needs to know a token is contested before they build on it, not after."
      >
        <div className="rounded-08 border-l-4 border-border-error bg-accent-red/10 px-sp-16 py-sp-12">
          <span className="text-md leading-md font-semibold text-text-primary">
            {blocking.length} blocking gaps.
          </span>{' '}
          <span className="text-md leading-md text-text-secondary">
            Light-mode cards and white-on-brand text are both unsafe to build today.
          </span>
        </div>
      </PageHeader>

      <Section
        title="Known gaps"
        description="Ordered by severity, as DESIGN.md orders them."
      >
        <div className="space-y-sp-12">
          {knownGaps.map((gap) => (
            <div
              key={gap.n}
              className="overflow-hidden rounded-12 border border-border-subtle bg-surface-subtle"
            >
              <div className="flex items-start gap-sp-12 px-sp-16 py-sp-12">
                <span className="mt-[2px] shrink-0 font-mono text-sm leading-sm text-text-tertiary">
                  {gap.n.toString().padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-sp-08">
                    <h3 className="text-md leading-md font-semibold text-text-primary">
                      {gap.title}
                    </h3>
                    <SeverityChip severity={gap.severity} />
                  </div>
                  <p className="mt-sp-08 text-sm leading-sm text-text-secondary">{gap.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Legacy surface"
        description="The file predates the token system and still carries its earlier state. None of this is part of foundations; all of it is migration debt."
      >
        <div className="space-y-sp-12">
          {legacySurface.map((item) => (
            <div
              key={item.title}
              className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12"
            >
              <h3 className="text-md leading-md font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-sp-04 text-sm leading-sm text-text-secondary">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-sp-16 rounded-08 border-l-4 border-border-warning bg-accent-yellow/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary">
          <span className="font-semibold">Rule · </span>
          {legacyRule}
        </div>
      </Section>

      <Section
        title="Changing foundations"
        description="Code follows Figma, never the other way round."
      >
        <ol className="space-y-sp-12">
          {changeProcess.map((step, i) => (
            <li
              key={step}
              className="flex gap-sp-12 rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12"
            >
              <span className="shrink-0 font-semibold text-accent-purple">{i + 1}</span>
              <span className="text-md leading-md text-text-secondary">{step}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}

function SeverityChip({ severity }: { severity: 'blocking' | 'high' | 'medium' }) {
  const tone =
    severity === 'blocking'
      ? 'bg-accent-red/20'
      : severity === 'high'
        ? 'bg-accent-yellow/20'
        : 'bg-surface-disabled'
  return (
    <span
      className={`rounded-pill px-sp-08 py-[1px] text-xs leading-xs font-medium capitalize text-text-primary ${tone}`}
    >
      {severity}
    </span>
  )
}
