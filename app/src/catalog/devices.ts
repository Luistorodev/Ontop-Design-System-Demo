/* Device presets for component previews.

   Each entry carries its platform's real bottom inset, because for floating
   navigation the inset is the whole game: a component's own bottom padding
   sits ABOVE it, and content has to reserve the component height plus the
   inset. The SE at 0 and the 3-button Pixel at 48 are the two extremes worth
   checking any bottom-anchored component against. */

export type Device = {
  id: string
  name: string
  os: 'ios' | 'android'
  /** Logical points, matching how the design file measures. */
  width: number
  height: number
  /** Screen corner radius. */
  radius: number
  statusBar: number
  /** System inset below a floating element. */
  bottomInset: number
  chrome: 'dynamic-island' | 'punch-hole' | 'home-button'
  navMode: string
}

export const devices: Device[] = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    os: 'ios',
    width: 402,
    height: 874,
    radius: 55,
    statusBar: 62,
    bottomInset: 34,
    chrome: 'dynamic-island',
    navMode: 'Home indicator',
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    os: 'ios',
    width: 393,
    height: 852,
    radius: 55,
    statusBar: 59,
    bottomInset: 34,
    chrome: 'dynamic-island',
    navMode: 'Home indicator',
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    os: 'ios',
    width: 375,
    height: 667,
    radius: 4,
    statusBar: 20,
    bottomInset: 0,
    chrome: 'home-button',
    navMode: 'Home button — no inset',
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    os: 'android',
    width: 412,
    height: 915,
    radius: 42,
    statusBar: 48,
    bottomInset: 24,
    chrome: 'punch-hole',
    navMode: 'Gesture navigation',
  },
  {
    id: 'pixel-8-3button',
    name: 'Pixel 8 · 3-button',
    os: 'android',
    width: 412,
    height: 915,
    radius: 42,
    statusBar: 48,
    bottomInset: 48,
    chrome: 'punch-hole',
    navMode: '3-button navigation',
  },
]
