import { useState } from 'react'
import {
  darkStops,
  lightStops,
  resolveRamp,
  tierModes,
  tierNotes,
  type TierMode,
  type TierStop,
} from '../tokens/tiers'
import { MissingValue, Mono, PageHeader, Section } from '../catalog/docs'

export function TierBackgrounds() {
  const [mode, setMode] = useState<TierMode>('Purple')

  return (
    <>
      <PageHeader
        title="Tier backgrounds"
        source="DESIGN.md §8 · Membership/Tier Background"
        intro="Tier identity is expressed by switching the mode on a container, not by swapping fills. One gradient component, four modes — and Reverse is the neutral no-tier state, not a fourth tier."
      >
        <div className="inline-flex rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
          {tierModes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-04 px-sp-16 py-sp-08 text-md leading-md font-medium transition-colors ${
                mode === m
                  ? 'bg-accent-purple text-text-on-brand'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </PageHeader>

      <Section
        title="Light stops"
        description="bg/gradient-01 through 04, plus bg/flat."
        aside={<Mono>{mode}</Mono>}
      >
        <StopSet stops={lightStops} mode={mode} />
      </Section>

      <Section
        title="Dark stops"
        description="bg-dark/gradient-01 through 05, plus bg-dark/flat."
        aside={<Mono>{mode}</Mono>}
      >
        <StopSet stops={darkStops} mode={mode} />
      </Section>

      <Section title="Notes for consumers">
        <ul className="space-y-sp-08">
          {tierNotes.map((note) => (
            <li
              key={note}
              className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12 text-md leading-md text-text-secondary"
            >
              {note}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

function StopSet({ stops, mode }: { stops: TierStop[]; mode: TierMode }) {
  const resolved = stops.map((s) => ({
    stop: s,
    position: s.ramps[mode],
    hex: resolveRamp(s.ramps[mode]),
  }))
  const gradient = resolved.filter((r) => r.stop.token.includes('gradient') && r.hex)

  return (
    <div className="space-y-sp-16">
      {gradient.length === resolved.filter((r) => r.stop.token.includes('gradient')).length ? (
        <div
          className="h-sp-104 rounded-12 border border-border-subtle"
          style={{
            background: `linear-gradient(135deg, ${gradient.map((g) => g.hex).join(', ')})`,
          }}
          aria-hidden
        />
      ) : (
        <div className="flex h-sp-104 items-center justify-center rounded-12 border border-dashed border-border-strong bg-surface-subtle px-sp-24 text-center text-sm leading-sm text-text-tertiary">
          The composed gradient cannot be previewed for {mode} — DESIGN.md does not publish every
          ramp position it references.
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-sp-12">
        {resolved.map(({ stop, position, hex }) => (
          <div key={stop.token} className="overflow-hidden rounded-08 border border-border-subtle">
            {hex ? (
              <div className="h-sp-56" style={{ background: hex }} />
            ) : (
              <div className="checker flex h-sp-56 items-center justify-center">
                <span className="text-2xl text-text-tertiary">⌀</span>
              </div>
            )}
            <div className="bg-surface-subtle px-sp-12 py-sp-08">
              <div className="font-mono text-xs leading-xs text-text-primary">{stop.token}</div>
              <div className="mt-sp-04 font-mono text-xs leading-xs text-text-tertiary">
                {position}
              </div>
              <div className="mt-sp-04">
                {hex ? (
                  <span className="font-mono text-xs leading-xs text-text-secondary">{hex}</span>
                ) : (
                  <MissingValue label="no hex" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
