import { useEffect, useState } from 'react'
import type { Mode } from '../tokens/types'

/* Every tier-3 color token resolves in both Light and Dark, so the hub has to
   be viewable in both. The toggle writes data-theme on <html>; the unlayered
   [data-theme='dark'] block in index.css then wins over Tailwind's theme
   layer and every semantic utility re-resolves. */

const KEY = 'ontop-hub-mode'

export function useMode(): [Mode, (m: Mode) => void] {
  const [mode, setMode] = useState<Mode>(read)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    try {
      window.localStorage.setItem(KEY, mode)
    } catch {
      // Private windows and blocked site data: the toggle still works for the
      // session, it just does not persist.
    }
  }, [mode])

  return [mode, setMode]
}

function read(): Mode {
  try {
    const stored = window.localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Fall through to the system preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
