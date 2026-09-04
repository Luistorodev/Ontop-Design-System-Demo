import type { Section } from './registry'
import { Architecture } from '../foundations/Architecture'
import { Color } from '../foundations/Color'
import { Typography } from '../foundations/Typography'
import { Spacing } from '../foundations/Spacing'
import { Radius } from '../foundations/Radius'
import { Elevation } from '../foundations/Elevation'
import { TierBackgrounds } from '../foundations/TierBackgrounds'
import { Accessibility } from '../foundations/Accessibility'
import { Status } from '../foundations/Status'
import { NavigationBar } from '../entries/NavigationBar'

/* Adding a page to the hub is adding a line here.

   Components are added one at a time, each traced back to its node in the
   Worker Design System file, and only once the foundations they consume are
   confirmed. */

export const sections: Section[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    entries: [
      { id: 'architecture', name: 'Token architecture', status: 'ready', page: Architecture },
      { id: 'color', name: 'Color', status: 'ready', page: Color },
      { id: 'typography', name: 'Typography', status: 'ready', page: Typography },
      { id: 'spacing', name: 'Spacing', status: 'ready', page: Spacing },
      { id: 'radius', name: 'Radius', status: 'ready', page: Radius },
      { id: 'elevation', name: 'Elevation & focus', status: 'ready', page: Elevation },
      { id: 'tiers', name: 'Tier backgrounds', status: 'ready', page: TierBackgrounds },
      { id: 'accessibility', name: 'Accessibility', status: 'ready', page: Accessibility },
      { id: 'status', name: 'Gaps & legacy', status: 'ready', page: Status },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    entries: [
      {
        id: 'navigation-bar',
        name: 'Navigation bar',
        status: 'ready',
        figmaNodeId: '12253-10731',
        page: NavigationBar,
      },
    ],
  },
]

export function resolve(path: string) {
  const [, sectionId, entryId] = path.split('/')
  const section = sections.find((s) => s.id === sectionId)
  const entry = section?.entries.find((e) => e.id === entryId)
  return { section, entry }
}
