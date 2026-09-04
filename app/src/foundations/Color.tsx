import { colorCollections, chartSeriesOrder } from '../tokens/color'
import type { ColorToken } from '../tokens/types'
import { contrastRatio } from '../tokens/contrast'
import { Copyable, GapNote, Mono, PageHeader, Section } from '../catalog/docs'

/* Every token is shown in both modes at once. The hub's own Light/Dark toggle
   changes the page chrome, but a token reference has to show both values side
   by side — that is the whole point of a two-mode system. */

export function Color() {
  return (
    <>
      <PageHeader
        title="Color"
        source="DESIGN.md §2–5 · Typography, Surface, Border and Accent collections"
        intro="Thirty-six tier-3 tokens across four collections, each resolving in Light and Dark. Click any swatch to copy the utility. Values are transcribed from Figma exactly as they are — including the four that DESIGN.md flags as broken, which are marked rather than quietly corrected."
      />

      {colorCollections.map((collection) => (
        <Section
          key={collection.figma}
          title={collection.title}
          description={collection.intro}
          aside={<Mono>{collection.figma}</Mono>}
        >
          <div className="space-y-sp-12">
            {collection.tokens.map((token) => (
              <TokenRow key={token.name} token={token} />
            ))}
          </div>
        </Section>
      ))}

      <Section
        title="Chart series order"
        description="Fixed, so the same metric keeps the same color across surfaces."
      >
        <div className="flex flex-wrap items-center gap-sp-08">
          {chartSeriesOrder.map((name, i) => (
            <div key={name} className="flex items-center gap-sp-08">
              <span className="w-sp-24 text-sm leading-sm text-text-tertiary">{i + 1}</span>
              <span
                className="h-sp-24 w-sp-24 rounded-04 border border-border-subtle"
                style={{ background: `var(--color-${name})` }}
              />
              <span className="font-mono text-sm leading-sm text-text-secondary">{name}</span>
              {i < chartSeriesOrder.length - 1 ? (
                <span className="ml-sp-04 text-text-tertiary">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

function TokenRow({ token }: { token: ColorToken }) {
  return (
    <div className="overflow-hidden rounded-12 border border-border-subtle">
      <div className="flex flex-col sm:flex-row">
        <Copyable text={token.utility} className="sm:w-[320px] sm:shrink-0">
          <div className="flex h-full">
            <ModeChip hex={token.light} mode="Light" ramp={token.lightRamp} />
            <ModeChip hex={token.dark} mode="Dark" ramp={token.darkRamp} />
          </div>
        </Copyable>

        <div className="min-w-0 flex-1 bg-surface-subtle px-sp-16 py-sp-12">
          <div className="flex flex-wrap items-baseline gap-x-sp-12 gap-y-sp-04">
            <span className="font-mono text-md leading-md font-medium text-text-primary">
              {token.figma}
            </span>
            <Mono>{token.utility}</Mono>
          </div>
          <p className="mt-sp-08 text-sm leading-sm text-text-secondary">{token.use}</p>
          {token.gap ? (
            <div className="mt-sp-12">
              <GapNote severity={token.gap.severity}>{token.gap.note}</GapNote>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ModeChip({ hex, mode, ramp }: { hex: string; mode: string; ramp: string }) {
  /* White-on-swatch is unreadable on a light token, so pick the label color by
     measuring rather than guessing. */
  const label = contrastRatio(hex, '#FFFFFF') >= 3 ? '#FFFFFF' : '#101828'
  return (
    <div className="flex-1 px-sp-12 py-sp-12" style={{ background: hex }}>
      <div className="text-xs leading-xs font-semibold opacity-70" style={{ color: label }}>
        {mode}
      </div>
      <div className="mt-sp-08 font-mono text-sm leading-sm" style={{ color: label }}>
        {hex}
      </div>
      <div className="font-mono text-xs leading-xs opacity-70" style={{ color: label }}>
        {ramp}
      </div>
    </div>
  )
}
