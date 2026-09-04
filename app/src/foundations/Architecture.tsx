import { ramps, rampsReadFrom, readFindings, tierTable, architectureRules } from '../tokens/primitives'
import { colorCollections } from '../tokens/color'
import { GapNote, Mono, PageHeader, Section, Table } from '../catalog/docs'

export function Architecture() {
  const stepCount = ramps.reduce((n, r) => n + r.steps.length, 0)
  const tokenCount = colorCollections.reduce((n, c) => n + c.tokens.length, 0)

  return (
    <>
      <PageHeader
        title="Token architecture"
        source="DESIGN.md §1 · Foundations"
        intro="Three tiers. Consumers only ever touch tier 3. The lower tiers exist so a brand refresh is a re-alias rather than a find-and-replace, which is why they are documented here but deliberately not exposed as utilities."
      >
        <div className="rounded-08 border-l-4 border-border-success bg-accent-green/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary">
          <span className="font-semibold">Verified · </span>
          All {stepCount} ramp steps read from Figma on {rampsReadFrom.readOn} (node{' '}
          <Mono>{rampsReadFrom.nodeId}</Mono>). Every one of the {tokenCount} tier-3 tokens
          resolves to exactly the ramp position it declares.
        </div>
      </PageHeader>

      <Section title="Tiers">
        <Table head={['Tier', 'Size', 'Modes', 'Naming', 'Example']}>
          {tierTable.map((t) => (
            <tr key={t.tier} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-12 font-medium whitespace-nowrap text-text-primary">
                {t.tier}
              </td>
              <td className="px-sp-16 py-sp-12 whitespace-nowrap text-text-secondary">{t.count}</td>
              <td className="px-sp-16 py-sp-12 whitespace-nowrap text-text-secondary">{t.modes}</td>
              <td className="px-sp-16 py-sp-12 text-text-secondary">{t.naming}</td>
              <td className="px-sp-16 py-sp-12 font-mono text-sm whitespace-nowrap text-text-tertiary">
                {t.example}
              </td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="The rule">
        <ol className="space-y-sp-12">
          {architectureRules.map((rule, i) => (
            <li
              key={rule}
              className="flex gap-sp-12 rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12"
            >
              <span className="shrink-0 font-semibold text-accent-purple">{i + 1}</span>
              <span className="text-md leading-md text-text-secondary">{rule}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Color families"
        description="Two neutral ramps coexist. Gray Blue is the system ramp; Gray Iron survives only inside effect styles and is being retired. These are tier 2 — reference them to understand a token, never to build with."
      >
        <div className="space-y-sp-32">
          {ramps.map((ramp) => (
            <div key={ramp.name}>
              <div className="mb-sp-08 flex flex-wrap items-baseline gap-sp-08">
                <h3 className="text-xl leading-title-md font-semibold text-text-primary">
                  {ramp.name}
                </h3>
                {ramp.legacy ? (
                  <span className="rounded-pill bg-accent-yellow/20 px-sp-08 py-[2px] text-xs leading-xs font-medium text-text-primary">
                    Legacy
                  </span>
                ) : null}
                <span className="text-sm leading-sm text-text-tertiary">
                  {ramp.role} · {ramp.usedBy}
                </span>
              </div>
              <div className="flex overflow-hidden rounded-08 border border-border-subtle">
                {ramp.steps.map((s) => (
                  <div key={s.step} className="min-w-0 flex-1">
                    <div className="h-sp-56" style={{ background: s.value ?? 'transparent' }} />
                    <div className="bg-surface-subtle px-sp-04 py-sp-08 text-center">
                      <div className="text-xs leading-xs font-medium text-text-primary">
                        {s.step}
                      </div>
                      <div className="font-mono text-[9px] leading-xs text-text-tertiary">
                        {s.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Found in the variable read"
        description="Details the variable collection carries that DESIGN.md does not mention. None is urgent; each is a small decision someone still has to make."
      >
        <div className="space-y-sp-12">
          {readFindings.map((f) => (
            <div
              key={f.title}
              className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12"
            >
              <h3 className="text-md leading-md font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-sp-04 text-sm leading-sm text-text-secondary">{f.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-sp-16">
          <GapNote severity="warning">
            The Gray Iron finding matters beyond naming: the warm text ramp hardcoded across the
            Direct Deposits prototype is Gray Iron, the ramp being retired — not Gray Blue. Any
            migration of that prototype is a ramp change, not a rename.
          </GapNote>
        </div>
      </Section>
    </>
  )
}
