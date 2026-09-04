# Ontop Foundations — DESIGN.md

The foundations layer of the Ontop Design System: color, typography, spacing, radius,
elevation, focus and tier backgrounds. This is the source of truth for every value that
components are allowed to consume.

**Source of truth:** Figma file `00 - Ontop Foundations` (`Q111EpmKAhOw3C2mxisUhe`),
pages under the `☉ FOUNDATIONS` divider.
**Scope of this document:** foundations only. The `☉ RESOURCES` section (icons,
illustrations, animations, payment-method icons, app-listing assets) and the
`❌ DUMP [Deprecated]` section are out of scope and documented elsewhere.
**Component APIs** live in the component-layer `DESIGN.md`. This file defines values;
that file defines how values get assembled.

---

## 1. Token architecture

Three tiers. Consumers only ever touch tier 3.

```
Tier 1 — Hexes/Values          Raw hex. Named by value.
  112 variables                "Purple/7A50F7 (Base)"
  1 mode: Base Value
         │
         ▼  alias
Tier 2 — Color System          Scale positions. Named by role in the ramp.
  112 variables                "Purple (Primary)/color-purple-500"
  1 mode: Mode 1
         │
         ▼  alias
Tier 3 — Semantic collections  Intent. Named by what it does, not what it is.
  Typography/Color   9 vars    Light · Dark
  Surface/Color     10 vars    Light · Dark
  Border/Color      10 vars    Light · Dark
  Accent/Color       7 vars    Light · Dark
```

Non-color tokens are single-tier: `Spacing`, `Border-radius`, `Typescale`.
`Membership/Tier Background` is a tier-3 collection with its own mode axis (see §8).

### The rule

- **Design and code consume tier 3 only.** A component that references
  `color-purple-500` instead of `accent/purple` is a bug, not a shortcut.
- **Never a raw hex.** If no semantic token expresses the intent, the answer is a new
  semantic token, not a hardcoded value.
- **Tier 1 and 2 are plumbing.** They exist so a brand refresh is a re-alias, not a
  find-and-replace. Do not extend them ad hoc.
- **Both modes, always.** Every tier-3 color token must resolve in Light and Dark.
  Shipping a token with one mode filled is shipping a broken token.

### Color families

| Family | Role | Used by |
| --- | --- | --- |
| Neutral | White / black anchors | `text/inverse`, `text/on-brand` |
| Gray Blue | Primary neutral ramp | all neutral surfaces, text, borders |
| Gray Iron | Legacy neutral ramp | shadows, legacy focus rings — **being retired** |
| Purple (Primary) | Primary interactive | links, focus, `accent/purple` |
| Indigo (Secondary) | Secondary | dark page background, tier gradients |
| Lavender (Tertiary) | Tertiary | Dark-mode cards, tier gradients |
| Pink (Brand) | Ontop brand | `accent/brand`, `surface/brand` |
| Red · Yellow · Green · Blue | Feedback + data | status borders, accents, chart series |

Two neutral ramps coexist. Gray Blue is the system ramp; Gray Iron survives only in
effect styles. See §10.

---

## 2. Color — Typography

`Typography/Color` · modes: Light, Dark

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `text/primary` | `#1D2939` gray-blue-900 | `#FFFFFF` white | Headings, body. Maximum contrast for essential content. |
| `text/secondary` | `#475467` gray-blue-700 | `#EAECF0` gray-blue-300 | Labels, subtitles. Reduced emphasis, still legible. |
| `text/tertiary` | `#667085` gray-blue-600 | `#D0D5DD` gray-blue-400 | Captions, helper text, metadata. |
| `text/placeholder` | `#98A2B3` gray-blue-500 | `#98A2B3` gray-blue-500 | Form placeholders, pre-input only. |
| `text/disabled` | `#D0D5DD` gray-blue-400 | `#475467` gray-blue-700 | Non-interactive. Low contrast is intentional. |
| `text/inverse` | `#FFFFFF` white | `#101828` gray-blue-950 | Text on surfaces inverted from the page. |
| `text/on-brand` | `#FFFFFF` white | `#FFFFFF` white | Text on brand-colored surfaces. Always white. |
| `text/link` | `#6643CE` purple-600 | `#A68AFA` purple-300 | Hyperlinks and interactive text. |
| `text/link-hover` | `#5135A5` purple-700 | `#BCA7FB` purple-200 | Link hover / pressed. |

`text/placeholder` is the only token identical across modes. That is deliberate —
it sits mid-ramp and reads as placeholder on both.

## 3. Color — Surface

`Surface/Color` · modes: Light, Dark

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `surface/page` | `#FCFCFD` gray-blue-50 | `#08051A` indigo-950 | App background. Sets the tone of the screen. |
| `surface/subtle` | `#F9FAFB` gray-blue-100 | `#1D2939` gray-blue-900 | Sections, alternating rows, grouping areas. |
| `surface/card` | ⚠ `#344054` gray-blue-800 | `#2C2B5B` lavender-800 | Default card. Dark mode is anchored on Lavender-800 as an optical adjustment — brand personality without saturating the UI. |
| `surface/card-raised` | ⚠ `#475467` gray-blue-700 | `#1D1D3D` lavender-900 | Elevated / emphasized card. One step from `card`. |
| `surface/card-sunken` | ⚠ `#1D2939` gray-blue-900 | `#121125` lavender-950 | Lower-hierarchy card, nested inside a primary card. |
| `surface/overlay` | ⚠ `#1D2939` gray-blue-900 | `#2C2B5B` lavender-800 | Modals, drawers, sheets, tooltips. |
| `surface/disabled` | `#F2F4F7` gray-blue-200 | `#344054` gray-blue-800 | Disabled element backgrounds. |
| `surface/inverse` | `#1D2939` gray-blue-900 | `#FCFCFD` gray-blue-50 | Toasts, snackbars, text tooltips. |
| `surface/brand` | `#FF5A70` pink-500 | `#DE485D` pink-600 | CTAs, banners, brand headers. |
| `surface/brand-subtle` | ⚠ `#DE485D` pink-600 | `#AA3C4B` pink-700 | Tags, badges, brand highlights. |

⚠ **The Light mode of the card family is unshipped.** See §11 — do not build against
these four Light values.

## 4. Color — Border

`Border/Color` · modes: Light, Dark

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `border/default` | `#D0D5DD` gray-blue-400 | `#7472C3` lavender-400 | Cards and containers. Dark sits 4 steps above `surface/card` for guaranteed chromatic harmony. |
| `border/subtle` | `#EAECF0` gray-blue-300 | `#3B397A` lavender-700 | Dividers, internal separators. |
| `border/strong` | `#98A2B3` gray-blue-500 | `#908ECF` lavender-300 | Card hover, selected elements, emphasis. |
| `border/focus` | `#7A50F7` purple-500 | `#906DF8` purple-400 | Accessible focus ring. Purple to separate it from every other border. |
| `border/disabled` | `#EAECF0` gray-blue-300 | `#475467` gray-blue-700 | Disabled elements. |
| `border/error` | `#F04438` red-600 | `#FDA29B` red-400 | Failed validation. |
| `border/success` | `#12B76A` green-600 | `#6CE9A6` green-400 | Confirmations. |
| `border/warning` | `#F79009` yellow-600 | `#FEC84B` yellow-400 | Alerts requiring attention. |
| `border/brand` | `#6643CE` purple-600 | `#906DF8` purple-400 | Active brand elements: tags, chips, banners. |
| `border/inverse` | `#F2F4F7` gray-blue-200 | `#344054` gray-blue-800 | Borders on inverted surfaces. |

Feedback borders invert direction across modes: 600 in Light, 400 in Dark. Keep that
pattern for any new feedback token.

## 5. Color — Accent

`Accent/Color` · modes: Light, Dark. Decorative and categorical only — never the sole
carrier of meaning, and never used for text on its own.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `accent/brand` | `#FF5A70` pink-500 | `#FF8C9C` pink-400 | Ontop's historic brand color. Identity highlights, badges. |
| `accent/purple` | `#7A50F7` purple-500 | `#906DF8` purple-400 | Primary category. Avatars, decorative icons, tier badges. |
| `accent/lavender` | `#5856B7` lavender-500 | `#7472C3` lavender-400 | Secondary category. Harmonic with `surface/card`. |
| `accent/blue` | `#528BFF` blue-500 | `#84ADFF` blue-400 | Informational / neutral. Metrics, first chart series. |
| `accent/green` | `#32D583` green-500 | `#6CE9A6` green-400 | Positive. Growth, completed payments, second series. |
| `accent/yellow` | `#FDB022` yellow-500 | `#FEC84B` yellow-400 | Attention / pending. In-progress states, third series. |
| `accent/red` | `#F97066` red-500 | `#FDA29B` red-400 | Negative. Rejections, payment failures, fourth series. |

**Chart series order:** blue → green → yellow → red → purple → lavender. Fixed, so the
same metric keeps the same color across surfaces.

---

## 6. Typography

**Family:** General Sans. Weights: Regular 400, Medium 500, Semibold 600. No other
weight is available — do not specify Light, Bold or Black.

### Typescale (`Typescale` collection)

| Token | px | | Token | px | | Token | value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `font-size/xs` | 10 | | `line-height/xs` | 14 | | `font-weight/regular` | 400 |
| `font-size/sm` | 12 | | `line-height/sm` | 16 | | `font-weight/medium` | 500 |
| `font-size/md` | 14 | | `line-height/md` | 20 | | `font-weight/semibold` | 600 |
| `font-size/lg` | 16 | | `line-height/title-md` | 22 | | `letter-spacing/normal` | 0 |
| `font-size/xl` | 18 | | `line-height/lg` | 24 | | `letter-spacing/tight` | 0 |
| `font-size/2xl` | 20 | | `line-height/2xl` | 28 | | | |
| `font-size/3xl` | 24 | | `line-height/3xl` | 32 | | | |
| `font-size/4xl` | 28 | | `line-height/4xl` | 36 | | | |
| `font-size/5xl` | 32 | | `line-height/5xl` | 48 | | | |
| `font-size/6xl` | 40 | | | | | | |

The collection has `Default` and `Mobile` modes. **They currently hold identical
values** — the Mobile axis is declared but not implemented (§11).

### Text styles

Six families. Bound to Typescale variables unless marked.

| Style | Size / LH | Weight | Use |
| --- | --- | --- | --- |
| `Heading/3xl` | 48 / 56 | Semibold | Marketing, hero. **Unbound** |
| `Heading/2xl` | 36 / 40 | Semibold | Marketing, hero. **Unbound** |
| `Heading/xl` | 32 / 36 | Semibold | Page title. **Unbound** |
| `Heading/lg` | 28 / 32 | Semibold | Page title |
| `Heading/md` | 24 / 28 | Semibold | Section heading |
| `Title/lg/semibold` | 20 / 24 | Semibold | Card title, sub-title |
| `Title/md/semibold` · `/medium` | 18 / 22 | Semibold · Medium | List item title, sub-title |
| `Title/sm/semibold` · `/medium` | 16 / 22 | Semibold · Medium | Dense list item title |
| `Body/lg/regular` · `/md` | 16 / 24 | Regular · Medium | Long-form body |
| `Body/md/regular` · `/md` | 14 / 20 | Regular · Medium | **Default UI body** |
| `Body/sm/regular` · `/md` | 12 / 16 | Regular · Medium | Dense body, table cells |
| `Body/xs/regular` · `/md` | 10 / 14 | Regular · Medium | Mobile only |
| `Caption/lg` | 16 / 24 | Semibold | Emphasized label |
| `Caption/md` | 14 / 20 | Semibold | Field label |
| `Caption/sm` | 12 / 16 | Semibold | Dense label, badge text |
| `Link/lg` · `/md` · `/sm` | 16/24 · 14/20 · 12/16 | Medium | Inline links. Pair with `text/link` |
| `Amount/xl` | 40 / 48 | Semibold | Hero balance, primary amount |
| `Amount/lg` | 32 / 36 | Semibold | Section amount |
| `Amount/md` | 24 / 32 | Semibold | Inline amount, table total |

**`Amount/*` is a currency-only family.** Monetary values use it and nothing else —
it is what keeps figures optically consistent across payroll, invoicing and statements.
Never use `Heading/*` for a number.

`Title` vs `Heading`: Heading is page and section structure. Title is object naming —
the label of a card, row or list item. If it names a thing rather than opens a region,
it is a Title.

Any text style prefixed `❌ Deprecated/` is dead. Fifteen remain in the file for
migration reference only; do not apply them, and remove them from any flow you touch.

---

## 7. Spacing, radius and elevation

### Spacing (`Spacing` collection)

`sp-04` 4 · `sp-08` 8 · `sp-12` 12 · `sp-16` 16 · `sp-24` 24 · `sp-32` 32 · `sp-40` 40 ·
`sp-48` 48 · `sp-56` 56 · `sp-64` 64 · `sp-72` 72 · `sp-80` 80 · `sp-88` 88 ·
`sp-96` 96 · `sp-104` 104

4-point base. Fine-grained to 16, then 8-point steps. There is no `sp-20` — the jump
from 16 to 24 is intentional, to stop the mid-range from drifting.

Rough intent: `04`–`08` inside a component · `12`–`16` between elements ·
`24`–`32` between groups · `40`+ between page sections.

### Border radius (`Border-radius` collection)

`br-04` 4 · `br-08` 8 · `br-12` 12 · `br-16` 16 · `br-20` 20 · `br-24` 24 ·
`br-32` 32 · `br-100` **99999** (pill / full)

`br-100` is a full-round sentinel, not a 100px radius. Use it for pills, avatars and
circular controls; never for a card.

### Elevation (effect styles — not yet variables)

| Style | Definition |
| --- | --- |
| `Shadows/xs` | `0 1 2 0 rgba(13,12,12,.05)` |
| `Shadows/sm` | `0 1 2 0 rgba(13,12,12,.06)` + `0 1 3 0 rgba(13,12,12,.10)` |
| `Shadows/md` | `0 2 4 -2 rgba(13,12,12,.06)` + `0 4 8 -2 rgba(13,12,12,.10)` |
| `Shadows/lg` | `0 4 6 -2 rgba(13,12,12,.03)` + `0 12 16 -4 rgba(13,12,12,.08)` |

`Shadows/*` is the canonical set. `Containers/containers` and `Containers/sm-containers`
duplicate `sm` and `xs` with a gray-blue tint instead of gray-iron — treat them as
deprecated and migrate to `Shadows/*`.

Shadows are not tokenized. They have no Dark-mode variant, which is why elevation in
Dark is carried by the `card` → `card-raised` → `card-sunken` surface ramp instead.
Do not apply `Shadows/*` on dark surfaces.

### Focus

`border/focus` (purple-500 Light / purple-400 Dark) is the token. The four
`Focus ring/4px *` effect styles predate it, are built on Gray Iron, and are not
mode-aware. **Use the token.** The effect styles exist for legacy components only.

Focus indication is never removed. If a control shows focus differently, it still
shows it — and at 3:1 minimum against its adjacent background.

---

## 8. Membership tier backgrounds

`Membership/Tier Background` · modes: **Purple**, **Indigo**, **Lavender**, **Reverse**

Tier identity is expressed by switching the mode on a container, not by swapping fills.
One gradient component, four tiers.

**Light stops** — `bg/gradient-01` → `04`, plus `bg/flat`:

| Token | Purple | Indigo | Lavender | Reverse |
| --- | --- | --- | --- | --- |
| `bg/gradient-01` | purple-400 | indigo-300 | lavender-400 | gray-blue-600 |
| `bg/gradient-02` | purple-300 | indigo-200 | lavender-300 | gray-blue-500 |
| `bg/gradient-03` | purple-100 | indigo-100 | lavender-100 | gray-blue-400 |
| `bg/gradient-04` | purple-50 | indigo-50 | lavender-50 | gray-blue-200 |
| `bg/flat` | purple-50 | indigo-50 | lavender-50 | gray-blue-200 |

**Dark stops** — `bg-dark/gradient-01` → `05`, plus `bg-dark/flat`:

| Token | Purple | Indigo | Lavender | Reverse |
| --- | --- | --- | --- | --- |
| `bg-dark/gradient-01` | purple-600 | indigo-600 | lavender-600 | gray-blue-900 |
| `bg-dark/gradient-02` | purple-300 | indigo-300 | lavender-300 | gray-blue-600 |
| `bg-dark/gradient-03` | purple-400 | indigo-400 | lavender-400 | gray-blue-700 |
| `bg-dark/gradient-04` | purple-700 | indigo-700 | lavender-700 | gray-blue-950 |
| `bg-dark/gradient-05` | indigo-950 | indigo-950 | indigo-950 | indigo-950 |
| `bg-dark/flat` | indigo-950 | indigo-950 | indigo-950 | indigo-950 |

**Reverse** is the neutral / no-tier state, not a fourth tier.

Notes for consumers: `gradient-04` and `flat` are the same value in Light, as are
`gradient-05` and `flat` in Dark — `flat` exists so a non-gradient fallback can be
bound without re-pointing. Every tier terminates on indigo-950 in Dark, by design:
the gradients differ at the top of the ramp and converge into the page.

Text on tier backgrounds uses `text/primary` on Light stops and `text/inverse` on
Dark stops. Do not place `text/link` on a gradient — verify contrast per stop.

---

## 9. Accessibility floor

- Body text: **4.5:1** minimum. Text ≥ 18.66px Semibold or ≥ 24px: **3:1**.
- Non-text (icons, borders, focus, chart strokes): **3:1**.
- Color is never the only channel. Status carries an icon or a label as well.
- Every interactive element has a visible focus state at 3:1.
- Motion respects `prefers-reduced-motion`.

Verified pairings on the shipped ramp:

| Pairing | Light | Dark |
| --- | --- | --- |
| `text/primary` on `surface/page` | 14.34 AAA | 20.06 AAA |
| `text/secondary` on `surface/page` | 7.50 AAA | 16.96 AAA |
| `text/tertiary` on `surface/page` | 4.85 AA | 13.61 AAA |
| `text/link` on `surface/page` | 6.28 AA | 7.29 AAA |
| `text/primary` on `surface/subtle` | 14.07 AAA | 14.70 AAA |
| `text/inverse` on `surface/inverse` | 14.70 AAA | 17.31 AAA |
| `text/primary` on `surface/card` | **1.41 FAIL** | 13.09 AAA |
| `text/on-brand` on `surface/brand` | **3.02 FAIL** | **4.05 FAIL** |

`text/tertiary` at 4.85 passes but has almost no headroom. Do not use it below 14px.

---

## 10. Legacy surface

The file predates the token system and still carries its earlier state. None of the
following is part of foundations; all of it is migration debt.

- **Legacy fill styles** — `Primary/*`, `Grey/*`, `Blue/*`, `Red/*`, `Green/*`,
  `Yellow/*`, `Feedback/*`, `Text/*`, `Base/*`, `Background/25`, `Darks/Blue`,
  and the `Blue-pale/*`, `Blue-russian/*`, `Green-mindaro/*`, `Yellow-saffron/*`
  palettes. All superseded by tier-3 variables.
- **Gradient fill styles** — thirteen one-off `Gradients/*` styles
  (`gradient-main`, `Gradient-Dusk`, `Gradient-Atlas`, `Gradient-Coral`, and others).
  Superseded for tier work by §8; the remainder are unowned.
- **`❌ Deprecated/*` text styles** — fifteen, retained for migration reference.
- **Gray Iron ramp** — survives only inside shadow and focus-ring effect styles.
  Gray Blue is the system neutral.
- **Grid styles** — `NEW GRIDS/center CLIENT`, `sidebar + right content CLIENT`,
  `center WORKER`. Still in use; not yet tokenized or documented here.

Rule: touching a flow means migrating the legacy styles in it. No new usage, ever.

---

## 11. Known gaps

Ordered by severity. These are open, not decided.

1. **`Surface/Color` Light mode is unshipped for the card family.** `surface/card`
   (#344054), `card-raised` (#475467), `card-sunken` (#1D2939) and `overlay` (#1D2939)
   hold dark neutrals in Light mode, against a `surface/page` of #FCFCFD. Primary text
   on a Light card measures 1.41:1. The values read like the Dark ramp landed in the
   Light column. **Blocking — do not build Light-mode cards until this is resolved.**
2. **`text/on-brand` fails on `surface/brand` in both modes** (3.02 Light, 4.05 Dark).
   White on pink-500 does not reach 4.5:1. Either darken the brand surface for text
   contexts or restrict `surface/brand` to large text and non-text use.
3. **`surface/brand-subtle` is inverted.** It resolves to pink-600 (Light) and pink-700
   (Dark) — darker than `surface/brand` itself. Its description calls for a very soft
   brand tint; it should sit at pink-50/100.
4. **`surface/brand` description contradicts its value.** The description says Purple;
   the token resolves to Pink. Purple is the primary interactive color, Pink is brand
   identity — the description needs to follow the value, or the decision needs revisiting.
5. **Three Light tokens share one value.** `card-sunken`, `overlay` and `inverse` all
   resolve to #1D2939 in Light. Three intents, no differentiation.
6. **`Typescale` Mobile mode is a no-op.** Both modes carry identical values. Either
   fill in the mobile ramp or drop the mode — a declared axis that does nothing will
   be trusted by someone eventually.
7. **`letter-spacing/normal` and `/tight` are both 0.** Undifferentiated. `tight` is
   presumably meant for `Amount/*` and large headings.
8. **`Heading/xl`, `2xl` and `3xl` are unbound.** Their sizes (32, 36, 48) partly fall
   outside the Typescale, which tops out at 40. Extend the scale or move these three
   into a display family with its own ramp.
9. **`font-size/6xl` (40) has no matching line-height.** `line-height/*` ends at
   `5xl` (48). `Amount/xl` pairs 6xl with 5xl, which works but reads as a mismatch.
10. **Shadows are not tokenized and have no Dark variant.** Elevation in Dark relies
    entirely on the surface ramp. Worth making explicit as tokens.
11. **No motion tokens.** Durations and easings live in the `Spinner Animation` page,
    not in variables.

---

## 12. Changing foundations

1. Any change lands in Figma first. The file is the source of truth; code follows.
2. New semantic tokens alias tier 2. New tier-1 or tier-2 entries require a brand
   decision, not a design one.
3. Every color token ships both modes and a description stating **intent**, not value.
   "Purple 500" is not a description; "focus ring for interactive elements" is.
4. Contrast is verified before merge — every text token against every surface it can
   legally sit on.
5. Removing a token means migrating its consumers first, then deleting. Renaming in
   place breaks silently.
6. This document is updated in the same change. A foundations edit that does not
   touch `DESIGN.md` is incomplete.
