import { useState, type ReactNode } from 'react'

/* Shared chrome for every documentation page. This belongs to the hub, not to
   the design system — nothing in src/ui may import from here. */

export function PageHeader({
  title,
  intro,
  source,
  children,
}: {
  title: string
  intro?: string
  /** Where this page comes from, e.g. "DESIGN.md §2 · Typography/Color". */
  source?: string
  children?: ReactNode
}) {
  return (
    <header className="mb-sp-40 border-b border-border-subtle pb-sp-32">
      <h1 className="text-5xl leading-5xl font-semibold text-text-primary">{title}</h1>
      {source ? (
        <div className="mt-sp-08 text-sm leading-sm text-text-tertiary">{source}</div>
      ) : null}
      {intro ? (
        <p className="mt-sp-16 max-w-[70ch] text-lg leading-lg text-text-secondary">{intro}</p>
      ) : null}
      {children ? <div className="mt-sp-24">{children}</div> : null}
    </header>
  )
}

export function Section({
  title,
  description,
  aside,
  children,
}: {
  title: string
  description?: ReactNode
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mb-sp-48">
      <div className="mb-sp-12 flex flex-wrap items-center gap-sp-12">
        <h2 className="text-3xl leading-3xl font-semibold text-text-primary">{title}</h2>
        {aside}
      </div>
      {description ? (
        <div className="mb-sp-24 max-w-[70ch] text-md leading-md text-text-secondary">
          {description}
        </div>
      ) : null}
      {children}
    </section>
  )
}

/** Click-to-copy: the reason a developer opens this page is to get a token
 *  name into their editor. */
export function Copyable({
  text,
  children,
  className = '',
}: {
  text: string
  children: ReactNode
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      }}
      className={`group relative cursor-pointer text-left ${className}`}
      title={`Copy "${text}"`}
    >
      {children}
      <span
        className={`pointer-events-none absolute top-sp-08 right-sp-08 z-10 rounded-04 bg-surface-inverse px-sp-08 py-sp-04 text-xs leading-xs font-medium text-text-inverse transition-opacity ${
          copied ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Copied
      </span>
    </button>
  )
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-04 bg-surface-subtle px-sp-04 py-[2px] font-mono text-sm leading-sm text-text-secondary">
      {children}
    </code>
  )
}

/* A token that DESIGN.md flags is documented with the flag attached. A hub
   that renders a contested value as though it were settled is worse than no
   hub — it launders a guess into a decision. */
export function GapNote({
  severity,
  children,
}: {
  severity: 'blocking' | 'warning'
  children: ReactNode
}) {
  const blocking = severity === 'blocking'
  return (
    <div
      className={`rounded-08 border-l-4 px-sp-12 py-sp-08 text-sm leading-sm ${
        blocking
          ? 'border-border-error bg-accent-red/10 text-text-primary'
          : 'border-border-warning bg-accent-yellow/10 text-text-primary'
      }`}
    >
      <span className="font-semibold">{blocking ? 'Blocking · ' : 'Caution · '}</span>
      {children}
    </div>
  )
}

/** Marks a value DESIGN.md references but never publishes. Never invent one. */
export function MissingValue({ label = 'Not in DESIGN.md' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-sp-04 rounded-04 border border-dashed border-border-strong px-sp-08 py-[2px] text-xs leading-xs text-text-tertiary">
      ⌀ {label}
    </span>
  )
}

export function Table({
  head,
  children,
}: {
  head: string[]
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto rounded-12 border border-border-subtle">
      <table className="w-full border-collapse text-md leading-md">
        <thead>
          <tr className="bg-surface-subtle">
            {head.map((h) => (
              <th
                key={h}
                className="border-b border-border-subtle px-sp-16 py-sp-12 text-left text-sm leading-sm font-semibold whitespace-nowrap text-text-secondary"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

/* Every component page splits the same way: the thing itself, running, and the
   documentation behind it. Keeping the split here means each entry file only
   supplies the two panels. */
export function ViewTabs({
  views,
  active,
  onChange,
}: {
  views: readonly { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="View"
      className="mb-sp-32 flex gap-sp-04 border-b border-border-subtle"
    >
      {views.map((view) => {
        const selected = view.id === active
        return (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(view.id)}
            className={`-mb-px cursor-pointer border-b-2 px-sp-16 py-sp-12 text-md leading-md font-medium transition-colors ${
              selected
                ? 'border-accent-purple text-text-primary'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {view.label}
          </button>
        )
      })}
    </div>
  )
}
