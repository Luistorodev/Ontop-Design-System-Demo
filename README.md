# Ontop Component Hub

The reference for Ontop's design system: what every token and component looks
like, how it behaves, its states and its interactions — one place the whole team
builds against.

## Why this exists

Ontop's design system lives in Figma, not in code. Every product has been
re-implementing it by hand, and they disagree. `Direct Deposits Experiment`
rebuilt ~1100 lines of UI kit in `app/src/ui/`; `Aura Experiences` and
`Product-Tour` share a legacy `styles.css` with different values again. Across
all three, the brand purple `#7A50F7` is the only token that matches.

So a developer who needs a Button has nowhere to look. They copy from whichever
project is open, with whichever values it happens to hold, or they invent them.
This hub is the answer to that.

## Run

```bash
cd app
npm install
npm run dev
```

| | |
|---|---|
| `npm run dev` | Local hub at `http://localhost:5173` |
| `npm run build` | Type-check and production build |
| `npm run lint` | oxlint |

## Stack

Vite 8 · React 19 · TypeScript · Tailwind v4 · framer-motion · oxlint · npm.

This is the team's existing standard, written down in
`Direct Deposits Experiment/PROTOTYPE-PROMPT.md` — the `tsconfig`s,
`.oxlintrc.json` and `vercel.json` are copied from there so nobody has to learn
a new setup. There is no `tailwind.config.js`: Tailwind v4 keeps the theme in
CSS. There is no router either — hash routing is ~20 lines in
`catalog/routing.ts`, which buys deep links without a dependency or a server
rewrite.

## Layout

```
DESIGN.md          the foundations spec this hub transcribes
CLAUDE.md          working rules for anyone (or anything) editing the repo
app/src/
  index.css        every token, as @theme plus a dark-mode block
  tokens/          foundations as data — ramps, colour, typography, scales,
                   tier backgrounds, contrast maths, accessibility, open gaps
  foundations/     the nine pages that render them
  ui/              the design system components themselves
  entries/         one documentation page per component
  icons/           SVGs exported from Figma
  catalog/         the hub's own chrome — shell, routing, mode toggle,
                   doc primitives, device frames
```

**`ui/` must never import from `catalog/`.** The catalog is this site's
furniture; the components stay extractable if the team later publishes them as a
package.

Foundations are kept as data in `tokens/` and rendered by `foundations/`, so
correcting a value against Figma is an edit in one place rather than a rewrite
of the page that displays it.

## The token system

Three tiers, and **only tier 3 is exposed as utilities**:

| Tier | What | In code |
|---|---|---|
| 1 · Hexes/Values | Raw hex, named by value | Not emitted |
| 2 · Color System | Ramp positions (`color-purple-500`) | Not emitted — documented for traceability only |
| 3 · Semantic | Intent (`accent/purple`) | The only thing components may use |

A component that reaches for `color-purple-500` instead of `accent/purple` is a
bug, not a shortcut — so the lower tiers are deliberately absent from
`index.css` and the compiler enforces the rule for you.

**Naming is 1:1 with Figma.** `text/primary` is `--color-text-primary`, used as
`text-text-primary`. The doubled word is the price of never translating a name
between the file and the code. Two exceptions, both forced by collisions with
Tailwind's own utilities:

- `br-04` → `rounded-04`, `br-100` → `rounded-pill`. `rounded-br-04` would mean
  "bottom-right corner".
- `sp-16` keeps its prefix as `p-sp-16`, so it can never be confused with
  Tailwind's numeric `p-4`, which is 16px rather than 4px.

Light values live in `@theme`; Dark lives in an unlayered `[data-theme='dark']`
block so it wins over Tailwind's theme layer. Every tier-3 colour resolves in
both modes — the toggle is in the sidebar.

## Foundations

Nine pages: token architecture, colour, typography, spacing, radius, elevation &
focus, tier backgrounds, accessibility, and gaps & legacy.

All of it is verified against the Figma variable collection, not transcribed on
trust:

- **112 tier-1/2 ramp steps** read from node `17397-3051`. Every one of the 36
  tier-3 tokens resolves to exactly the ramp position it declares.
- **19 Typescale variables and 27 text styles** read from node `11807-8549`.
  All reproduce. One name in `DESIGN.md` was mis-transcribed on the way in: the
  medium Body variants are `Body/md/md`, not `Body/md/medium`.
- **16 contrast pairings** recomputed from the tokens rather than copied. Every
  one matches the documented figure exactly.

Three things to know before building on them:

- **Four tokens are knowingly broken.** They are rendered with warnings, not
  quietly corrected — a hub that "fixes" a value diverges from Figma and stops
  being a reference. Light-mode cards measure 1.41:1 for primary text, and white
  on `surface/brand` fails in both modes. See *Gaps & legacy*.
- **The warm text ramp in the Direct Deposits prototype is Gray Iron**, the ramp
  being retired — not Gray Blue. Migrating that prototype is a ramp change, not
  a rename.
- **`letter-spacing/tight` is bound by exactly four styles**: `Title/md/semibold`
  and the three `Amount/*`. It is 0 today, so the binding is invisible — but
  `Title/md/semibold` and `Title/md/medium` are one value away from silently
  diverging.

## Components

Each component page splits into **Preview** — the thing running in a device
frame with live controls — and **Documentation**, which follows the section
order the Figma file itself uses: Anatomy · Types · States · Usage guidelines ·
Do & Don't · Application · Related.

### Navigation bar

`Navigation-Bar / Floating`, node `12253:10731`. Primary bottom navigation for
the Worker app: icon-only, liquid glass, driven by a selected index. Five
destinations maximum, enforced by the type. The indicator travels between
destinations; that, the pressed fill and the hide-on-scroll slide all snap under
Reduce Motion. The mandatory opaque fallback is implemented and degrades
automatically via `prefers-reduced-transparency` and `@supports`.

The Preview offers five devices — iPhone 16 Pro, 16, SE, Pixel 8 and Pixel 8 on
3-button navigation — chosen for their bottom insets rather than their widths,
since the safe area is where floating navigation actually goes wrong. A
saturated/calm content toggle makes the spec's contrast warning demonstrable
instead of theoretical.

Eight deviations from the Figma documentation are recorded on the page. The ones
that bite:

- The indicator is a **full-width pill**, not the documented 48×48.
- The 64 minimum width belongs to the **selected item alone**. On all five it
  sums to 320 against 312 of inner width and quietly eats the right padding.
- The docs say `blur(32px)`; Figma's own render is **16px**. A Figma blur radius
  is about twice its CSS equivalent.

## Adding a component

One at a time, on request, never ahead of the foundations it consumes.

1. Read its node in Figma with `get_design_context` (load the
   `figma-design-to-code` skill first — it is mandatory) and download its assets.
2. Write the component in `src/ui/`.
3. Write its page in `src/entries/`, following the Figma section order.
4. Register it in `src/catalog/sections.ts` — one line drives the sidebar,
   search and routing.

## Conventions

- `export function Name({...}: {...})` — props typed inline, no `React.FC`, no
  separate `interface Props`, no default export.
- **Nothing visual is hand-drawn.** Icons come from Figma via `download_assets`,
  never from an icon library, an emoji, or an SVG written by hand.
- **A value that was not published is a gap, never a guess.** Missing values are
  stored as `null` and rendered as gap markers.
- **Never animate a wrapper around a `backdrop-filter` surface.** A transform or
  fractional opacity on an ancestor starts a new backdrop root and the glass
  silently renders as a flat tint, with no error.
- Code and comments in English; comments explain *why* something matches the
  design.

## Sources of truth

| What | Where |
|---|---|
| Foundations spec | `DESIGN.md` |
| Foundations variables | Figma `Q111EpmKAhOw3C2mxisUhe` — 00 · Ontop Foundations |
| Components | Figma `JStyA6aGuPWj79BFczIGSg` — 02 · Worker Design System |

Figma outranks `DESIGN.md`. If the two disagree, Figma wins and `DESIGN.md` is
corrected in the same change.

## Deploy

Vercel, configured in `vercel.json` at the repo root — it installs and builds
from `app/` and serves `app/dist`.
