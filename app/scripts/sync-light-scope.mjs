/* Keeps the [data-theme='light'] block in src/index.css in step with @theme.

   Light colour tokens live in @theme, which Tailwind emits on :root. That is
   enough for the page, but not for a Light island inside a Dark page — the
   Composer documentation shows Light and Dark side by side, and under a Dark
   root every custom property already resolves Dark. A [data-theme='light']
   block with the same values re-establishes Light for its subtree.

   The block is generated, never edited: every --color-* declaration in @theme
   is copied between the two markers. Runs before `dev` and `build`. */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const file = fileURLToPath(new URL('../src/index.css', import.meta.url))
const BEGIN = '/* BEGIN generated: light scope — run `npm run tokens:light-scope` */'
const END = '/* END generated: light scope */'

const css = readFileSync(file, 'utf8')

const theme = css.match(/^@theme \{\n([\s\S]*?)^\}/m)
if (!theme) throw new Error('No @theme block in src/index.css')
const declarations = theme[1]
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('--color-'))

const block = [BEGIN, "[data-theme='light'] {", ...declarations.map((d) => `  ${d}`), '}', END].join('\n')

let next
if (css.includes(BEGIN)) {
  const start = css.indexOf(BEGIN)
  const end = css.indexOf(END) + END.length
  next = css.slice(0, start) + block + css.slice(end)
} else {
  // First run: place it straight after the Dark block, so source order puts a
  // Light island below a Dark root, and a Dark island below a Light one.
  const dark = css.indexOf("[data-theme='dark'] {")
  const close = css.indexOf('\n}\n', dark) + 3
  next = css.slice(0, close) + '\n' + block + '\n' + css.slice(close)
}

if (next !== css) {
  writeFileSync(file, next)
  console.log(`light scope: ${declarations.length} tokens written`)
} else {
  console.log(`light scope: ${declarations.length} tokens, up to date`)
}
