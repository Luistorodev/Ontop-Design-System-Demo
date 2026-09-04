import { useMemo, useState } from 'react'
import { navigate, useHashRoute } from './routing'
import { resolve, sections } from './sections'
import { figmaUrl, statusLabel } from './registry'
import { useMode } from './mode'

export function Shell() {
  const path = useHashRoute()
  const [mode, setMode] = useMode()
  const [query, setQuery] = useState('')
  const { entry } = resolve(path)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections
      .map((s) => ({ ...s, entries: s.entries.filter((e) => e.name.toLowerCase().includes(q)) }))
      .filter((s) => s.entries.length > 0)
  }, [query])

  const Page = entry?.page

  return (
    <div className="flex min-h-full bg-surface-page">
      <aside className="sticky top-0 flex h-screen w-[268px] shrink-0 flex-col border-r border-border-subtle bg-surface-subtle">
        <div className="px-sp-24 pt-sp-24 pb-sp-16">
          <a href="#/foundations/architecture" className="flex items-center gap-sp-08">
            <span className="grid h-sp-32 w-sp-32 place-items-center rounded-08 bg-accent-purple text-md font-semibold text-text-on-brand">
              O
            </span>
            <span className="text-lg leading-lg font-semibold text-text-primary">
              Component Hub
            </span>
          </a>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="mt-sp-16 w-full rounded-08 border border-border-default bg-surface-page px-sp-12 py-sp-08 text-md leading-md text-text-primary outline-none placeholder:text-text-placeholder focus-visible:border-border-focus"
          />

          <div className="mt-sp-12 inline-flex w-full rounded-08 border border-border-subtle bg-surface-page p-sp-04">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-04 px-sp-08 py-sp-04 text-sm leading-sm font-medium capitalize transition-colors ${
                  mode === m
                    ? 'bg-accent-purple text-text-on-brand'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-sp-12 pb-sp-24">
          {visible.map((section) => (
            <div key={section.id} className="mb-sp-24">
              <div className="px-sp-12 pb-sp-08 text-xs leading-xs font-semibold tracking-wide text-text-tertiary uppercase">
                {section.title}
              </div>
              {section.entries.length === 0 ? (
                <p className="px-sp-12 text-sm leading-sm text-text-tertiary">
                  Nothing here yet — components are added one at a time, once the foundations they
                  use are confirmed.
                </p>
              ) : (
                section.entries.map((e) => {
                  const href = `/${section.id}/${e.id}`
                  const active = path === href
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => navigate(href)}
                      className={`flex w-full items-center justify-between rounded-08 px-sp-12 py-sp-08 text-left text-md leading-md transition-colors ${
                        active
                          ? 'bg-accent-purple/15 font-medium text-text-primary'
                          : 'text-text-secondary hover:bg-surface-page'
                      }`}
                    >
                      <span>{e.name}</span>
                      <span title={statusLabel[e.status].label} className="text-xs">
                        {statusLabel[e.status].emoji}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-border-subtle px-sp-24 py-sp-16">
          <a
            className="text-sm leading-sm font-medium text-text-link hover:text-text-link-hover"
            href={figmaUrl('foundations')}
            target="_blank"
            rel="noreferrer"
          >
            00 · Ontop Foundations ↗
          </a>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[980px] px-sp-40 py-sp-48">
          {Page ? <Page /> : <NotFound path={path} />}
        </div>
      </main>
    </div>
  )
}

function NotFound({ path }: { path: string }) {
  return (
    <div className="rounded-12 border border-border-subtle bg-surface-subtle p-sp-40 text-center">
      <div className="text-xl leading-title-md font-semibold text-text-primary">
        Nothing at {path}
      </div>
      <a
        href="#/foundations/architecture"
        className="mt-sp-08 inline-block text-md leading-md text-text-link hover:text-text-link-hover"
      >
        Go to Token architecture
      </a>
    </div>
  )
}
