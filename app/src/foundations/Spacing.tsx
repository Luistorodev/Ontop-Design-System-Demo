import { spacingScale, spacingIntent } from '../tokens/scales'
import { Copyable, Mono, PageHeader, Section, Table } from '../catalog/docs'

export function Spacing() {
  return (
    <>
      <PageHeader
        title="Spacing"
        source="DESIGN.md §7 · Spacing collection"
        intro="A 4-point base, fine-grained to 16 and then 8-point steps. There is no sp-20: the jump from 16 to 24 is deliberate, to stop the mid-range from drifting."
      />

      <Section
        title="Intent"
        description="Rough guidance, not a rule — but a layout that ignores it usually reads as noisy."
      >
        <Table head={['Range', 'Use']}>
          {spacingIntent.map((i) => (
            <tr key={i.range} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-12 font-mono text-sm whitespace-nowrap text-text-primary">
                {i.range}
              </td>
              <td className="px-sp-16 py-sp-12 text-text-secondary">{i.use}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        title="Scale"
        description={
          <>
            Figma&rsquo;s <Mono>sp-NN</Mono> maps straight through: <Mono>sp-16</Mono> is{' '}
            <Mono>p-sp-16</Mono>, <Mono>gap-sp-16</Mono>, <Mono>mt-sp-16</Mono>. The prefix is kept
            precisely so these never get confused with Tailwind&rsquo;s own numeric scale, where{' '}
            <Mono>p-4</Mono> is 16px rather than 4px.
          </>
        }
      >
        <div className="divide-y divide-border-subtle overflow-hidden rounded-12 border border-border-subtle">
          {spacingScale.map((step) => (
            <div key={step.token} className="flex items-center gap-sp-24 px-sp-24 py-sp-12">
              <Copyable text={step.utility} className="w-[140px] shrink-0">
                <div className="font-mono text-md leading-md font-medium text-text-primary">
                  {step.token}
                </div>
                <div className="mt-sp-04 font-mono text-xs leading-xs text-text-tertiary">
                  {step.value}px
                </div>
              </Copyable>
              <div
                className="h-sp-24 shrink-0 rounded-04 bg-accent-purple"
                style={{ width: step.value }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
