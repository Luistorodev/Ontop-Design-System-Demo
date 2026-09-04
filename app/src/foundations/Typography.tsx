import {
  fontFamily,
  fontSizes,
  letterSpacings,
  lineHeights,
  textStyleFamilies,
  typographyFindings,
  typographyReadFrom,
} from '../tokens/typography'
import { Copyable, GapNote, Mono, PageHeader, Section, Table } from '../catalog/docs'

export function Typography() {
  return (
    <>
      <PageHeader
        title="Typography"
        source="DESIGN.md §6 · Typescale collection and text styles"
        intro="General Sans, three weights, one scale. Twenty-seven text styles grouped into six families — the family you pick carries meaning, so Heading opens a region, Title names a thing, and Amount is for currency and nothing else."
      >
        <div className="rounded-08 border-l-4 border-border-success bg-accent-green/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary">
          <span className="font-semibold">Verified · </span>
          Read from Figma on {typographyReadFrom.readOn} (node{' '}
          <Mono>{typographyReadFrom.nodeId}</Mono>). All 19 Typescale variables and all 27 text
          styles match, plus the letter-spacing bindings the document could only guess at.
        </div>
      </PageHeader>

      <Section
        title="Family"
        description={`${fontFamily.name}. Loaded from ${fontFamily.loadedFrom}. These three weights are all that ship — Light, Bold and Black are not available and must never be specified.`}
      >
        <div className="rounded-12 border border-border-subtle bg-surface-subtle p-sp-32">
          <div className="text-6xl leading-5xl font-semibold text-text-primary">Ag</div>
          <div className="mt-sp-24 flex flex-wrap gap-sp-32">
            {fontFamily.weights.map((w) => (
              <div key={w.value}>
                <div
                  className="text-3xl leading-3xl text-text-primary"
                  style={{ fontWeight: w.value }}
                >
                  Ontop
                </div>
                <div className="mt-sp-04 text-sm leading-sm text-text-secondary">
                  {w.label} · {w.value}
                </div>
                <div className="font-mono text-xs leading-xs text-text-tertiary">{w.token}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Typescale" description="The raw variables. Text styles below compose them.">
        <div className="grid gap-sp-24 lg:grid-cols-2">
          <div>
            <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
              Font size
            </h3>
            <Table head={['Token', 'Utility', 'px']}>
              {fontSizes.map((s) => (
                <tr key={s.token} className="border-b border-border-subtle last:border-0">
                  <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                    {s.token}
                  </td>
                  <td className="px-sp-16 py-sp-08">
                    <Copyable text={s.utility}>
                      <Mono>{s.utility}</Mono>
                    </Copyable>
                  </td>
                  <td className="px-sp-16 py-sp-08 text-right font-mono text-sm text-text-primary">
                    {s.value}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
          <div>
            <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
              Line height
            </h3>
            <Table head={['Token', 'Utility', 'px']}>
              {lineHeights.map((s) => (
                <tr key={s.token} className="border-b border-border-subtle last:border-0">
                  <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                    {s.token}
                  </td>
                  <td className="px-sp-16 py-sp-08">
                    <Copyable text={s.utility}>
                      <Mono>{s.utility}</Mono>
                    </Copyable>
                  </td>
                  <td className="px-sp-16 py-sp-08 text-right font-mono text-sm text-text-primary">
                    {s.value}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </div>

        <div className="mt-sp-24 space-y-sp-12">
          <GapNote severity="warning">
            <Mono>font-size/6xl</Mono> (40) has no matching line-height — the line-height scale
            ends at <Mono>5xl</Mono> (48). <Mono>Amount/xl</Mono> pairs the two, which works but
            reads as a mismatch. (Gap 9)
          </GapNote>
          <GapNote severity="warning">
            The Typescale collection declares <Mono>Default</Mono> and <Mono>Mobile</Mono> modes,
            but both hold identical values. A declared axis that does nothing will be trusted by
            someone eventually. (Gap 6)
          </GapNote>
          <GapNote severity="warning">
            {letterSpacings.map((l) => l.token).join(' and ')} both resolve to 0, so the two are
            indistinguishable today. The variable read settles what gap 7 could only guess:{' '}
            <Mono>tight</Mono> is bound by exactly four styles — <Mono>Title/md/semibold</Mono>{' '}
            and the three <Mono>Amount/*</Mono>. No heading uses it. Give{' '}
            <Mono>tight</Mono> a real value and precisely those four move.
          </GapNote>
        </div>
      </Section>

      {textStyleFamilies.map((family) => (
        <Section key={family.name} title={family.name} description={family.intro}>
          <div className="divide-y divide-border-subtle overflow-hidden rounded-12 border border-border-subtle">
            {family.styles.map((style) => (
              <div
                key={style.name}
                className="flex flex-wrap items-baseline gap-x-sp-32 gap-y-sp-08 px-sp-24 py-sp-16"
              >
                <div className="w-[220px] shrink-0">
                  <Copyable text={style.name}>
                    <div className="flex items-center gap-sp-08 text-md leading-md font-medium text-text-primary">
                      {style.name}
                      {style.unbound ? (
                        <span
                          title="Not bound to a Typescale variable in Figma (gap 8)"
                          className="rounded-pill bg-accent-yellow/20 px-sp-08 py-[1px] text-xs leading-xs text-text-primary"
                        >
                          unbound
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-sp-04 font-mono text-xs leading-xs text-text-tertiary">
                      {style.size}/{style.lineHeight} · {style.weight}
                      {style.tracking === 'tight' ? (
                        <span
                          title="Binds letter-spacing/tight, which is 0 today"
                          className="ml-sp-04 rounded-pill bg-accent-purple/15 px-sp-04 text-text-secondary"
                        >
                          tight
                        </span>
                      ) : null}
                    </div>
                  </Copyable>
                  <div className="mt-sp-04 text-xs leading-xs text-text-secondary">{style.use}</div>
                </div>
                <div
                  className="min-w-0 flex-1 text-text-primary"
                  style={{
                    fontSize: style.size,
                    lineHeight: `${style.lineHeight}px`,
                    fontWeight: style.weight,
                  }}
                >
                  {family.name === 'Amount' ? '$12,480.50' : 'The quick brown fox'}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section
        title="Found in the variable read"
        description="What checking DESIGN.md against the Figma collection changed or settled."
      >
        <div className="space-y-sp-12">
          {typographyFindings.map((f) => (
            <div
              key={f.title}
              className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12"
            >
              <div className="flex flex-wrap items-center gap-sp-08">
                <h3 className="text-md leading-md font-semibold text-text-primary">{f.title}</h3>
                <span
                  className={`rounded-pill px-sp-08 py-[1px] text-xs leading-xs font-medium capitalize text-text-primary ${
                    f.kind === 'corrected'
                      ? 'bg-accent-red/20'
                      : f.kind === 'new'
                        ? 'bg-accent-yellow/20'
                        : 'bg-accent-green/15'
                  }`}
                >
                  {f.kind}
                </span>
              </div>
              <p className="mt-sp-04 text-sm leading-sm text-text-secondary">{f.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Deprecated">
        <GapNote severity="warning">
          Any text style prefixed <Mono>❌ Deprecated/</Mono> is dead. Fifteen remain in the file
          for migration reference only — do not apply them, and remove them from any flow you
          touch.
        </GapNote>
      </Section>
    </>
  )
}
