import type { ReactNode } from 'react'
import type { ComposerAttachment, ComposerBanner, ComposerTag } from '../ui/Composer'
import type { BannerType } from '../ui/Banner'
import { Highlight } from '../ui/Messages'

/* Sample data for the shared Aura chat screen (see ChatScreen.tsx). Hub
   harness — copy written for the previews, not from the file. */

export type Turn =
  | { id: number; from: 'user'; text: string }
  | { id: number; from: 'aura'; title?: string; subtitle?: string; body: ReactNode; copy: string }
  | { id: number; from: 'human'; name: string; text: string }

/* Sample conversation — copy written for the previews, not from the file. */
export const FIRST: Turn[] = [
  { id: 1, from: 'user', text: 'How much did I earn in September?' },
  {
    id: 2,
    from: 'aura',
    title: 'September earnings',
    subtitle: 'Two payments landed this month.',
    copy: 'You received $4,820.00 from payroll and $2,150.00 from contractor invoice #4471 — a total of $6,970.00.',
    body: (
      <>
        You received <Highlight>$4,820.00</Highlight> from payroll and{' '}
        <Highlight>$2,150.00</Highlight> from contractor invoice #4471 — a total of{' '}
        <Highlight>$6,970.00</Highlight>.
      </>
    ),
  },
  { id: 3, from: 'user', text: 'Can someone check the invoice?' },
  { id: 4, from: 'human', name: 'Valentina', text: 'Sure — I’m on it.' },
  { id: 5, from: 'user', text: 'Thanks! And how long does a withdrawal take?' },
  {
    id: 6,
    from: 'aura',
    title: 'Withdrawal times',
    subtitle: 'Usually less than a day.',
    copy: 'Bancolombia credits most transfers within a few hours on business days. Each local withdrawal costs $2.00.',
    body: (
      <>
        Bancolombia credits most transfers within <Highlight>a few hours</Highlight> on business
        days. Each local withdrawal costs <Highlight>$2.00</Highlight>.
      </>
    ),
  },
]

export const REPLY = {
  title: 'Gross margin',
  subtitle: 'Up four points on last quarter.',
  copy: 'Your gross margin this quarter is 38%, up from 34%. Most of the change comes from lower transfer fees.',
  body: (
    <>
      Your gross margin this quarter is <Highlight>38%</Highlight>, up from{' '}
      <Highlight>34%</Highlight>. Most of the change comes from lower transfer fees.
    </>
  ),
}

export const SAMPLE_ATTACHMENTS: ComposerAttachment[] = [
  { id: 'empty' },
  { id: 'img', label: 'IMG. 100 KB', previewSrc: '/figma/composer-attachment-image.jpg' },
  { id: 'pdf', label: 'PDF. 100 KB', previewSrc: '/figma/composer-attachment-pdf.jpg' },
]

export const SAMPLE_TAGS: ComposerTag[] = [
  { id: 'a', label: 'Label' },
  { id: 'b', label: 'Label' },
  { id: 'c', label: 'Label' },
]

/* Sample copy for each banner type — the file draws "Text" and "Link". Error
   keeps the composer's original failure message. */
export const BANNERS: Record<BannerType, ComposerBanner> = {
  neutral: { type: 'neutral', message: 'Answers use your last 90 days of activity.', action: 'Learn more' },
  info: { type: 'info', message: 'Your payout account changed today.', action: 'View' },
  error: { type: 'error', message: 'Something went wrong. Try it again.', action: 'Retry' },
  warning: { type: 'warning', message: 'Your connection is unstable.', action: 'Details' },
  success: { type: 'success', message: 'Thanks — your feedback was sent.', action: 'Undo' },
}

/* The iOS keyboard from the file's Native iOS Components page
   (Keyboard/Default, 393 × 287), drawn at the preview's 360 width. OS
   furniture, like the device chrome. */
export const KEYBOARD_HEIGHT = Math.round((287 * 360) / 393)
/** Background already keeps the bottom 20 clear; the keyboard covers that
 *  strip too, so the composer only needs to rise by the rest. */
export const KEYBOARD_LIFT = KEYBOARD_HEIGHT - 20

export const AVATAR = '/figma/messages-avatar.png'

