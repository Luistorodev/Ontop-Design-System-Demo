import type { ComponentType } from 'react'

/* The single place the hub learns what exists. The sidebar, the search and the
   router all read from here, so publishing a new page is one entry. */

/** The status conventions the Figma file itself defines on its "Read me first"
 *  page, mirrored so design and development read the same vocabulary. */
export type Status =
  | 'wip'          // 🚫 Work in progress
  | 'review'       // 👁️ For review
  | 'rejected'     // ❌ Review rejected
  | 'approved'     // ✅ Design approved
  | 'ready'        // 🖥️ Ready for development
  | 'implemented'  // 🎉 Fully implemented

export const statusLabel: Record<Status, { emoji: string; label: string }> = {
  wip: { emoji: '🚫', label: 'Work in progress' },
  review: { emoji: '👁️', label: 'For review' },
  rejected: { emoji: '❌', label: 'Review rejected' },
  approved: { emoji: '✅', label: 'Design approved' },
  ready: { emoji: '🖥️', label: 'Ready for development' },
  implemented: { emoji: '🎉', label: 'Fully implemented' },
}

export type Entry = {
  /** Path segment — the page lives at `#/<section>/<id>`. */
  id: string
  name: string
  status: Status
  /** Node in the Figma design system file this page documents. */
  figmaNodeId?: string
  page: ComponentType
}

export type Section = {
  id: string
  title: string
  entries: Entry[]
}

export const FIGMA = {
  foundations: {
    name: '00 - Ontop Foundations',
    fileKey: 'Q111EpmKAhOw3C2mxisUhe',
    nodeId: '7878-28656',
  },
  components: {
    name: '02 - Worker Design System',
    fileKey: 'JStyA6aGuPWj79BFczIGSg',
    nodeId: '6-12',
  },
} as const

export function figmaUrl(file: keyof typeof FIGMA, nodeId?: string): string {
  const f = FIGMA[file]
  const node = nodeId ?? f.nodeId
  return `https://www.figma.com/design/${f.fileKey}/?node-id=${node.replace(':', '-')}`
}
