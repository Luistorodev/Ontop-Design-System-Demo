# Ontop Component Hub — working rules

The reference hub for Ontop's design system. Every component the product teams
build should be visible here first: how it looks, how it behaves, its states and
its interactions.

## Stack

Vite 8 · React 19 · TypeScript · Tailwind v4 (`@tailwindcss/vite`) · framer-motion
· oxlint · npm. Same as `Direct Deposits Experiment/app` — the standard written
down in that project's `PROTOTYPE-PROMPT.md`. Do not introduce a different
framework, styling system or package manager.

Everything lives under `app/`. Run from there: `npm run dev`, `npm run build`,
`npm run lint`.

## Sources of truth

| What | Where |
|---|---|
| Foundations spec | `DESIGN.md` at the repo root — the written transcription of the Figma foundations |
| Foundations / tokens | Figma `Q111EpmKAhOw3C2mxisUhe` — 00 - Ontop Foundations, node `7878-28656` |
| Components | Figma `JStyA6aGuPWj79BFczIGSg` — 02 - Worker Design System |

`DESIGN.md` is the spec the token files transcribe. Figma still outranks it: if
the two disagree, Figma wins and `DESIGN.md` is corrected in the same change.

The token system is three tiers, and **only tier 3 is exposed as utilities**.
The ramps in `src/tokens/primitives.ts` exist purely for traceability — a
component that reaches for `color-purple-500` instead of `accent/purple` is a
bug. Never add a tier-1 or tier-2 value to `index.css`.

## Ground rules

- **Nothing visual is hand-drawn.** Icons and assets are downloaded from Figma
  with the MCP `download_assets`. Never approximate one with an icon library, an
  emoji, or an SVG written by the model.
- **A value that was not published is a gap, never a guess.** If a ramp position
  has no hex, store it as `null` and let the UI render a gap marker — never fill
  one in by eye. (As of 2026-09-04 there are none: all 112 steps were read from
  Figma node `17397-3051`.)
- **Broken tokens are transcribed, then flagged.** Four tokens are knowingly
  wrong in Figma (see `DESIGN.md` §11). The hub shows the real value with a
  warning attached; it never quietly corrects one, because a hub that diverges
  from Figma stops being a reference.
- **Every tier-3 color ships both modes.** Light lives in `@theme`, Dark in the
  unlayered `[data-theme='dark']` block. A token with one mode filled is broken.
- **Never animate a wrapper around a `backdrop-filter` surface.** A transform,
  filter or fractional opacity on any ancestor starts a new backdrop root, and
  the blur then samples the inside of the element instead of the page behind
  it — the glass silently renders as a flat tint, with no error. Put the
  animation on the glass element itself.
- Code and comments in English. Comments explain *why* something matches the
  design, not what the line does.
- `src/ui/` must not import from `src/catalog/`. The catalog is the hub's own
  chrome; the design system components stay extractable.

## Component conventions

`export function Name({...}: {...})` — props typed inline, no `React.FC`, no
`interface Props` block, no default export. Styling is Tailwind utility classes;
`style={{}}` only for genuinely dynamic values.

## Verified against Figma

Foundations were cross-checked against the variable collection on 2026-09-04:
colour ramps at node `17397-3051`, typography at `11807-8549`. All 112 tier-1/2
steps, all 36 tier-3 tokens, all 19 Typescale variables and all 27 text styles
reproduce. When re-reading, re-run those two nodes and diff — do not assume
`DESIGN.md` is current.

## Naming

Token names are 1:1 with Figma: `text/primary` is `--color-text-primary`, used
as `text-text-primary`. The doubled word is the cost of never having to
translate a name between the file and the code.

Two deliberate exceptions, both forced by collisions with Tailwind's own
utilities:

- `br-04` → `rounded-04`, `br-100` → `rounded-pill`. `rounded-br-04` would mean
  "bottom-right".
- `sp-16` keeps its prefix as `p-sp-16`, so it can never be confused with
  Tailwind's numeric `p-4` (16px, not 4px).

## Adding a page

One entry in `src/catalog/sections.ts`. The sidebar, search and routing all read
from it.

## Adding a component

Components are added **one at a time, when asked** — not in batches, and not
ahead of the foundations they depend on. For each:

1. Read its node in Figma (`get_design_context`, preceded by the mandatory
   `figma-design-to-code` skill) and download its assets.
2. Write the component in `src/ui/`.
3. Write its page in `src/entries/`, following the section order the Figma file
   itself uses: **Anatomy · Types · States · Usage guidelines · Do & Don't ·
   Application · Related**.
4. Register it in `src/catalog/sections.ts` with its status and Figma node.

## Status vocabulary

Mirrors the conventions the Figma file defines on its "Read me first" page:
🚫 wip · 👁️ review · ❌ rejected · ✅ approved · 🖥️ ready · 🎉 implemented.

## Reading Figma variables

`get_variable_defs` needs a node that actually carries variables. Passing the
Foundations cover node (`7878-28656`) returns *"You currently have nothing
selected"*, which reads like a desktop-selection problem but is not: the
variable frame is `17397-3051`, and that node resolves remotely with no
selection at all. If a node errors that way, ask for a `?node-id=` URL pointing
at the frame in question rather than assuming the desktop app is at fault.
