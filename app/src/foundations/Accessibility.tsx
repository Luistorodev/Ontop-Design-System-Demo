import { useState } from 'react'
import { floor, matrixSurfaces, matrixText, verifiedPairings } from '../tokens/a11y'
import { colorCollections } from '../tokens/color'
import { contrastRatio, rate } from '../tokens/contrast'
import type { Mode } from '../tokens/types'
import { Mono, PageHeader, Section, Table } from '../catalog/docs'

/* Ratios are measured here, not transcribed. DESIGN.md's table is compared
   against the live calculation so it cannot rot silently when a token moves. */

const allTokens = colorCollections.flatMap((c) => c.tokens)

function hex(name: string, mode: Mode): string | undefined {
  const token = allTokens.find((t) => t.name === name)
  return token ? token[mode] : undefined
}

export function Accessibility() {
  const [mode, setMode] = useState<Mode>('light')

  return (
    <>
      <PageHeader
        title="Accessibility"
        source="DESIGN.md §9 · Accessibility floor"
        intro="The floor every component has to clear, and a live contrast matrix computed from the tokens themselves rather than copied from a table."
      >
        <ModeToggle mode={mode} onChange={setMode} />
      </PageHeader>

      <Section title="The floor">
        <ul className="space-y-sp-08">
          {floor.map((rule) => (
            <li
              key={rule}
              className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12 text-md leading-md text-text-secondary"
            >
              {rule}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Documented pairings"
        description="Every ratio DESIGN.md states, recomputed. A drift column would appear if any measured value disagreed with the document."
      >
        <Table head={['Pairing', 'Light — stated', 'Light — measured', 'Dark — stated', 'Dark — measured']}>
          {verifiedPairings.map((p) => {
            const lf = hex(p.fg, 'light')
            const lb = hex(p.bg, 'light')
            const df = hex(p.fg, 'dark')
            const db = hex(p.bg, 'dark')
            const lm = lf && lb ? contrastRatio(lf, lb) : null
            const dm = df && db ? contrastRatio(df, db) : null
            return (
              <tr key={`${p.fg}-${p.bg}`} className="border-b border-border-subtle last:border-0">
                <td className="px-sp-16 py-sp-12 font-mono text-sm whitespace-nowrap text-text-primary">
                  {p.fg} on {p.bg}
                </td>
                <td className="px-sp-16 py-sp-12 text-right font-mono text-sm text-text-tertiary">
                  {p.stated.light.toFixed(2)}
                </td>
                <td className="px-sp-16 py-sp-12">
                  <Ratio value={lm} stated={p.stated.light} />
                </td>
                <td className="px-sp-16 py-sp-12 text-right font-mono text-sm text-text-tertiary">
                  {p.stated.dark.toFixed(2)}
                </td>
                <td className="px-sp-16 py-sp-12">
                  <Ratio value={dm} stated={p.stated.dark} />
                </td>
              </tr>
            )
          })}
        </Table>
      </Section>

      <Section
        title="Full matrix"
        description={
          <>
            Every text token against every surface it could sit on, in{' '}
            <Mono>{mode}</Mono> mode. This is the check DESIGN.md §12 requires before a
            foundations change merges. Cells below 4.5 are not necessarily bugs — a token pairing
            that is never legal in practice simply must not be used.
          </>
        }
      >
        <div className="overflow-x-auto rounded-12 border border-border-subtle">
          <table className="w-full border-collapse text-sm leading-sm">
            <thead>
              <tr className="bg-surface-subtle">
                <th className="border-b border-border-subtle px-sp-12 py-sp-12 text-left font-semibold whitespace-nowrap text-text-secondary">
                  text \ surface
                </th>
                {matrixSurfaces.map((s) => (
                  <th
                    key={s}
                    className="border-b border-border-subtle px-sp-08 py-sp-12 text-center font-mono text-xs leading-xs font-normal whitespace-nowrap text-text-secondary"
                  >
                    {s.replace('surface-', '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixText.map((t) => (
                <tr key={t} className="border-b border-border-subtle last:border-0">
                  <td className="px-sp-12 py-sp-08 font-mono text-xs leading-xs whitespace-nowrap text-text-primary">
                    {t.replace('text-', '')}
                  </td>
                  {matrixSurfaces.map((s) => {
                    const f = hex(t, mode)
                    const b = hex(s, mode)
                    const r = f && b ? contrastRatio(f, b) : null
                    return (
                      <td key={s} className="px-sp-08 py-sp-08 text-center">
                        <Cell ratio={r} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
      {(['light', 'dark'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`rounded-04 px-sp-16 py-sp-08 text-md leading-md font-medium capitalize transition-colors ${
            mode === m
              ? 'bg-accent-purple text-text-on-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}

function Ratio({ value, stated }: { value: number | null; stated: number }) {
  if (value === null) return <span className="text-text-tertiary">—</span>
  const drift = Math.abs(value - stated) > 0.06
  const level = rate(value)
  return (
    <div className="flex items-center justify-end gap-sp-08">
      <span className="font-mono text-sm text-text-primary">{value.toFixed(2)}</span>
      <LevelChip level={level} />
      {drift ? (
        <span
          className="rounded-pill bg-accent-yellow/20 px-sp-08 py-[1px] text-xs leading-xs text-text-primary"
          title={`DESIGN.md states ${stated.toFixed(2)}`}
        >
          drift
        </span>
      ) : null}
    </div>
  )
}

function Cell({ ratio }: { ratio: number | null }) {
  if (ratio === null) return <span className="text-text-tertiary">—</span>
  const level = rate(ratio)
  const tone =
    level === 'FAIL'
      ? 'bg-accent-red/20 text-text-primary'
      : level === 'AA Large'
        ? 'bg-accent-yellow/20 text-text-primary'
        : 'bg-accent-green/15 text-text-primary'
  return (
    <span
      className={`inline-block min-w-[52px] rounded-04 px-sp-04 py-[2px] font-mono text-xs leading-xs ${tone}`}
      title={level}
    >
      {ratio.toFixed(2)}
    </span>
  )
}

function LevelChip({ level }: { level: ReturnType<typeof rate> }) {
  const tone =
    level === 'FAIL'
      ? 'bg-accent-red/20'
      : level === 'AA Large'
        ? 'bg-accent-yellow/20'
        : 'bg-accent-green/15'
  return (
    <span className={`rounded-pill px-sp-08 py-[1px] text-xs leading-xs text-text-primary ${tone}`}>
      {level}
    </span>
  )
}
