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
import { InfoSheet } from '../entries/InfoSheet'
import { Topbar } from '../entries/Topbar'
import { Composer } from '../entries/Composer'
import { Background } from '../entries/Background'
import { LogoHero } from '../entries/LogoHero'
import { Logo } from '../entries/Logo'
import { Messages } from '../entries/Messages'
import { Form } from '../entries/Form'
import { FloatingButton } from '../entries/FloatingButton'

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
      {
        id: 'info-sheet',
        name: 'Info sheet',
        status: 'ready',
        figmaNodeId: '12497-17075',
        page: InfoSheet,
      },
    ],
  },
  {
    /* The components of the Aura AI assistant — the "Aura Component 🌠" group
       of pages in the Worker Design System file. They share the Aura ·
       General token group, and are ordered the way they stack on
       the chat screen: Topbar, Background, Composer. */
    id: 'aura',
    title: 'Aura components',
    entries: [
      {
        /* review: the Figma page carries no status emoji, so the status was
           set with the team on 2026-10-06. */
        id: 'topbar',
        name: 'Topbar',
        status: 'review',
        figmaNodeId: '12792-21495',
        page: Topbar,
      },
      {
        /* review: the Figma page carries no status emoji, so the status was
           set with the team on 2026-10-06. Update it here when the page in
           the file gets one. */
        id: 'background',
        name: 'Background',
        status: 'review',
        figmaNodeId: '12986-9473',
        page: Background,
      },
      {
        /* review: set with the team on 2026-10-08, once Large/Scroll and the
           action and attachment colours were tokenised in Figma. Open: the
           attachment glyph's Dark contrast — see the page's Known gaps. */
        id: 'composer',
        name: 'Composer',
        status: 'review',
        figmaNodeId: '12921-7956',
        page: Composer,
      },
      {
        /* review: set with the team on 2026-10-07. The Figma page carries no
           status emoji; update it here when it gets one. */
        id: 'logo',
        name: 'Logo',
        status: 'review',
        figmaNodeId: '13196-7849',
        page: Logo,
      },
      {
        /* review: set with the team on 2026-10-07. Every open decision is
           settled and recorded on the page. */
        id: 'logo-hero',
        name: 'Logo hero',
        status: 'review',
        figmaNodeId: '13153-4281',
        page: LogoHero,
      },
      {
        /* review: set with the team on 2026-10-08, once the Actions bar
           booleans were wired in the file. The Figma page carries no status
           emoji. */
        id: 'messages',
        name: 'Messages',
        status: 'review',
        figmaNodeId: '13286-821',
        page: Messages,
      },
      {
        /* review: set with the team on 2026-10-08. The Figma page carries
           no status emoji; every property is wired and matches the file. */
        id: 'form',
        name: 'Form',
        status: 'review',
        figmaNodeId: '13302-5748',
        page: Form,
      },
      {
        /* wip: new on 2026-10-08. The button follows the Claude Design
           prompt over Figma, whose Floating still draws the old button; the
           Nudge (part of Floating since 2026-10-09) follows Figma. */
        id: 'floating-button',
        name: 'Floating button',
        status: 'wip',
        figmaNodeId: '13149-3819',
        page: FloatingButton,
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
