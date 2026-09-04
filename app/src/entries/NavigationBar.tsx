import { useState, type ReactNode } from 'react'
import { NavigationBarFloating, type NavItems } from '../ui/NavigationBar'
import { ActivityIcon, CardsIcon, HomeIcon, PaymentsIcon, ProfileIcon } from '../icons/nav'
import { GapNote, Mono, PageHeader, Section, Table, ViewTabs } from '../catalog/docs'
import { DeviceFrame, DevicePicker } from '../catalog/DeviceFrame'
import { devices } from '../catalog/devices'
import { WorkerScreen, type ScreenTone } from './WorkerScreen'
import { figmaUrl } from '../catalog/registry'

const ALL: NavItems = [
  { id: 'home', icon: HomeIcon, accessibilityLabel: 'Home' },
  { id: 'payments', icon: PaymentsIcon, accessibilityLabel: 'Payments' },
  { id: 'cards', icon: CardsIcon, accessibilityLabel: 'Cards' },
  { id: 'activity', icon: ActivityIcon, accessibilityLabel: 'Activity' },
  { id: 'profile', icon: ProfileIcon, accessibilityLabel: 'Profile' },
]

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'documentation', label: 'Documentation' },
] as const

export function NavigationBar() {
  const [view, setView] = useState<string>('preview')

  return (
    <>
      <PageHeader
        title="Navigation bar"
        source="02 - Worker Design System · Navigation-Bar / Floating · node 12253:10731"
        intro="Primary bottom navigation for the Worker app. Icon-only, liquid glass. One component driven by a selected index — the five Figma variants exist so a designer can show any destination active, they are not five components."
      >
        <a
          className="text-md leading-md font-medium text-text-link hover:text-text-link-hover"
          href={figmaUrl('components', '12253-10731')}
          target="_blank"
          rel="noreferrer"
        >
          Open in Figma ↗
        </a>
      </PageHeader>

      <ViewTabs views={VIEWS} active={view} onChange={setView} />

      {view === 'preview' ? <Preview /> : <Documentation />}
    </>
  )
}

/* ================================================================
   Preview
   ================================================================ */

function Preview() {
  const [selected, setSelected] = useState(0)
  const [count, setCount] = useState(5)
  const [surface, setSurface] = useState<'glass' | 'opaque'>('glass')
  const [visible, setVisible] = useState(true)
  const [deviceId, setDeviceId] = useState(devices[0].id)
  const [tone, setTone] = useState<ScreenTone>('vivid')

  const items = ALL.slice(0, count) as unknown as NavItems
  const safeSelected = Math.min(selected, count - 1)
  const device = devices.find((d) => d.id === deviceId) ?? devices[0]

  return (
    <div className="space-y-sp-24">
      <DevicePicker active={deviceId} onChange={setDeviceId} />

      <div className="flex flex-wrap items-start gap-sp-40">
        <DeviceFrame
          device={device}
          overlayHeight={82}
          overlay={
            <NavigationBarFloating
              items={items}
              selectedIndex={safeSelected}
              onSelect={setSelected}
              surface={surface}
              visible={visible}
            />
          }
        >
          <WorkerScreen tone={tone} />
        </DeviceFrame>

        <div className="min-w-[280px] flex-1 space-y-sp-24">
          <p className="max-w-[46ch] text-md leading-md text-text-secondary">
            Scroll the screen behind the bar. The tint samples whatever passes underneath, so the
            surface is never the same twice — that is the whole argument for the glass, and the
            whole reason its contrast cannot be guaranteed.
          </p>

          <Control label="Content behind the bar">
            <Segmented
              options={[
                { id: 'vivid', label: 'Saturated' },
                { id: 'calm', label: 'Calm' },
              ]}
              active={tone}
              onChange={(id) => setTone(id as ScreenTone)}
            />
            <p className="mt-sp-08 max-w-[42ch] text-sm leading-sm text-text-tertiary">
              Saturated is the case the spec says to review screen by screen: scroll to the
              gradient at the bottom and watch the unselected icons lose the surface.
            </p>
          </Control>

          <Control label="Destinations">
            <Segmented
              options={[2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n) }))}
              active={String(count)}
              onChange={(id) => {
                const n = Number(id)
                setCount(n)
                if (selected > n - 1) setSelected(n - 1)
              }}
            />
            <p className="mt-sp-08 text-sm leading-sm text-text-tertiary">
              Two minimum, five maximum. The ceiling is enforced by the type.
            </p>
          </Control>

          <Control label="Surface">
            <Segmented
              options={[
                { id: 'glass', label: 'Glass' },
                { id: 'opaque', label: 'Opaque' },
              ]}
              active={surface}
              onChange={(id) => setSurface(id as 'glass' | 'opaque')}
            />
            <p className="mt-sp-08 text-sm leading-sm text-text-tertiary">
              Opaque is the mandatory fallback, not a style choice.
            </p>
          </Control>

          <Control label="Hide on scroll">
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="cursor-pointer rounded-08 border border-border-default bg-surface-page px-sp-16 py-sp-08 text-md leading-md font-medium text-text-primary"
            >
              {visible ? 'Hide the bar' : 'Show the bar'}
            </button>
          </Control>

          <div className="rounded-12 border border-border-subtle bg-surface-subtle p-sp-16">
            <div className="mb-sp-08 text-md leading-md font-semibold text-text-primary">
              Safe area on this device
            </div>
            <p className="text-sm leading-sm text-text-secondary">
              {device.navMode}. The screen adds{' '}
              <strong className="text-text-primary">{device.bottomInset}</strong> below the
              component, and the scroll area reserves{' '}
              <strong className="text-text-primary">{82 + device.bottomInset}</strong> of bottom
              padding — 82 of component plus the inset. Switch to the SE and the 3-button Pixel to
              see the two extremes.
            </p>
          </div>

          <div>
            <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">Code</div>
            <pre className="overflow-x-auto rounded-12 border border-border-subtle bg-surface-subtle p-sp-16 font-mono text-sm leading-sm text-text-secondary">
              {[
                '<NavigationBarFloating',
                '  items={items}',
                `  selectedIndex={${safeSelected}}`,
                '  onSelect={setSelected}',
                ...(surface !== 'glass' ? ['  surface="opaque"'] : []),
                ...(visible ? [] : ['  visible={false}']),
                '/>',
              ].join('\n')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Documentation
   ================================================================ */

function Documentation() {
  return (
    <>
      <Section
        title="Anatomy"
        description="Overall dimensions are unchanged from the labelled version — removing the label was absorbed by the indicator padding, not by shrinking the bar."
      >
        <Table head={['Element', 'Property', 'Value', 'Token']}>
          {[
            ['Component', 'width × height', '360 × 82', ''],
            ['', 'padding top', '8', 'sp-08'],
            ['', 'padding left / right', '16', 'sp-16'],
            ['', 'padding bottom', '8', 'unbound — raw value in Figma'],
            ['Container', 'width × height', '328 × 66', ''],
            ['', 'corner radius', 'fully rounded (33)', 'br-100'],
            ['', 'padding, all sides', '8', 'sp-08'],
            ['', 'border', '1, inside', 'container/border'],
            ['', 'surface', 'glass + blur 32', 'Elevation/Glass-nav'],
            ['Item (tap target)', 'width', 'equal share; 64 minimum on the selected item', ''],
            ['', 'height', '48', ''],
            ['Indicator', 'height', '48', ''],
            ['', 'corner radius', '32 (renders as a pill)', 'br-32'],
            ['', 'padding', '12', 'sp-12'],
            ['Icon', 'size', '24 × 24', ''],
          ].map(([el, prop, val, token], i) => (
            <tr key={i} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                {el}
              </td>
              <td className="px-sp-16 py-sp-08 whitespace-nowrap text-text-secondary">{prop}</td>
              <td className="px-sp-16 py-sp-08 text-text-primary">{val}</td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-tertiary">
                {token}
              </td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-16 space-y-sp-12">
          <GapNote severity="warning">
            The tap target is the full item box, never the indicator. Do not bind the hit area to
            the pill.
          </GapNote>
          <GapNote severity="warning">
            The 64 minimum belongs to the selected item only. Applying it to all five overflows the
            container at five destinations — 5 × 64 is 320 against 312 of inner width — and the
            overflow silently eats the right-hand padding.
          </GapNote>
        </div>
      </Section>

      <Section
        title="Types"
        description="Two supported surfaces, and you must implement both. Glass is the default; opaque is not a style choice but a mandatory fallback."
      >
        <div className="grid gap-sp-24 lg:grid-cols-2">
          <div>
            <h3 className="mb-sp-08 text-xl leading-title-md font-semibold text-text-primary">
              Glass — default
            </h3>
            <p className="mb-sp-12 text-sm leading-sm text-text-secondary">
              <Mono>container/glass-tint</Mono> over a backdrop blur, a specular top edge and a
              soft ambient shadow. White 52% in Light, 14% in Dark.
            </p>
            <Stage>
              <NavigationBarFloating
                items={ALL}
                selectedIndex={0}
                onSelect={() => {}}
                surface="glass"
              />
            </Stage>
          </div>
          <div>
            <h3 className="mb-sp-08 text-xl leading-title-md font-semibold text-text-primary">
              Opaque — fallback
            </h3>
            <p className="mb-sp-12 text-sm leading-sm text-text-secondary">
              <Mono>container/bg</Mono> with <Mono>Elevation/Floating-nav</Mono>. Used wherever
              blur is unavailable, or the viewer asked for reduced transparency.
            </p>
            <Stage>
              <NavigationBarFloating
                items={ALL}
                selectedIndex={0}
                onSelect={() => {}}
                surface="opaque"
              />
            </Stage>
          </div>
        </div>

        <div className="mt-sp-24 space-y-sp-12">
          <Table head={['Property', 'Value', 'Notes']}>
            {[
              ['Backdrop blur', '32 (Figma radius)', 'Web: backdrop-filter: blur(16px) — Figma’s own code generation converts radius 32 to 16px, and that is what reproduces the file’s render. iOS: .ultraThinMaterial. Android: RenderEffect.'],
              ['Ambient shadow', '0 8 24 -4 rgba(16,24,40,0.20)', 'Softer and wider than the opaque version'],
              ['Specular edge', '1px vertical white gradient', '70% top → 16% mid → 38% bottom. Not tokenised.'],
            ].map(([p, v, n]) => (
              <tr key={p} className="border-b border-border-subtle last:border-0">
                <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                  {p}
                </td>
                <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{v}</td>
                <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
              </tr>
            ))}
          </Table>
          <GapNote severity="blocking">
            The fallback is not optional. Backdrop blur needs RenderEffect on Android (API 31+) and
            is switched off by reduce-transparency on both platforms. This implementation degrades
            automatically in CSS — <Mono>prefers-reduced-transparency</Mono> and{' '}
            <Mono>@supports not (backdrop-filter)</Mono> — as well as through the{' '}
            <Mono>surface</Mono> prop.
          </GapNote>
        </div>
      </Section>

      <Section
        title="States"
        description="Three states, and only three. There is no hover — the component is touch only — and no disabled: a destination that is unavailable should be removed from the bar, because a permanently dead tab is worse than a shorter bar."
      >
        <div className="grid gap-sp-16 sm:grid-cols-3">
          {[
            { name: 'Default', note: 'Neutral icon, no indicator fill.' },
            { name: 'Selected', note: 'Filled indicator behind the icon.' },
            { name: 'Pressed', note: 'Neutral indicator. Never reads as a completed navigation.' },
          ].map((s) => (
            <div
              key={s.name}
              className="rounded-12 border border-border-subtle bg-surface-subtle p-sp-16"
            >
              <div className="text-md leading-md font-semibold text-text-primary">{s.name}</div>
              <p className="mt-sp-04 text-sm leading-sm text-text-secondary">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-sp-24">
          <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
            Figma → code
          </h3>
          <Table head={['Figma', 'Code', 'Notes']}>
            {[
              ['Option Actived = 1…5', 'selectedIndex = 0…4', 'One component. Never build five.'],
              ['Status = Default', 'not selected, at rest', 'Neutral icon, no indicator fill.'],
              ['Status = Selected', 'index === selectedIndex', 'Filled indicator behind the icon.'],
              ['Status = Pressed', 'pointer down on the item', 'Neutral indicator. Ripple suppressed.'],
              ['Icon (instance swap)', 'item.icon', '24 outline from Foundations.'],
              ['— (removed)', 'item.accessibilityLabel', 'No visual counterpart. Still required.'],
            ].map(([f, c, n]) => (
              <tr key={f} className="border-b border-border-subtle last:border-0">
                <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                  {f}
                </td>
                <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                  {c}
                </td>
                <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
              </tr>
            ))}
          </Table>
        </div>

        <div className="mt-sp-24">
          <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
            Motion
          </h3>
          <p className="mb-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
            The indicator is one element that travels between items, so selection reads as
            movement. Because the selected item is the one carrying the 64 minimum width, the pill
            also resizes slightly as it lands.
          </p>
          <Table head={['Transition', 'Value', 'Under Reduce Motion']}>
            {[
              ['Indicator travel', 'spring · stiffness 520, damping 40, mass 0.9', 'Snaps'],
              ['Icon colour', '200ms · cubic-bezier(.4,0,.2,1)', 'Snaps'],
              ['Pressed fill', '150ms · cubic-bezier(.4,0,.2,1)', 'Snaps'],
              ['Hide on scroll', '250ms · cubic-bezier(.4,0,.2,1)', 'Snaps'],
            ].map(([t, d, r]) => (
              <tr key={t} className="border-b border-border-subtle last:border-0">
                <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                  {t}
                </td>
                <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{d}</td>
                <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
              </tr>
            ))}
          </Table>
          <div className="mt-sp-12">
            <GapNote severity="warning">
              Figma calls this a cross-fade and only specifies that Reduce Motion must turn it off.
              It is built here as a travelling indicator, which is a deliberate departure — the
              movement carries the relationship between the old and new destination in a way a
              cross-fade does not. Neither the timing nor the choice comes from the design system;
              both need a designer&rsquo;s sign-off before other components copy them.
            </GapNote>
          </div>
        </div>
      </Section>

      <Section title="Usage guidelines">
        <h3 className="mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">Props</h3>
        <Table head={['Property', 'Type', 'Required', 'Notes']}>
          {[
            ['items', 'NavItems', 'yes', 'Two to five entries. Five is a hard ceiling, enforced by the type.'],
            ['selectedIndex', 'number', 'yes', 'Zero-based. Must always point at a real item.'],
            ['onSelect', '(index) => void', 'yes', 'Fires on tap release, not on press down.'],
            ['surface', "'glass' | 'opaque'", 'no', 'Defaults to glass. CSS also falls back on its own.'],
            ['visible', 'boolean', 'no', 'Defaults true. Only used if hide-on-scroll is enabled.'],
          ].map(([p, t, r, n]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
            </tr>
          ))}
        </Table>

        <h3 className="mt-sp-24 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          NavItem
        </h3>
        <Table head={['Field', 'Type', 'Required', 'Notes']}>
          {[
            ['id', 'string', 'yes', 'Stable route key.'],
            ['icon', 'Component', 'yes', '24×24 outline icon from Foundations.'],
            ['accessibilityLabel', 'string', 'yes', 'Localised. The only name this destination has.'],
            ['badge', 'number?', '—', 'Not in the Figma component yet. Agree with design before using.'],
          ].map(([p, t, r, n]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {p}
              </td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-secondary">
                {t}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{r}</td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{n}</td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-12">
          <GapNote severity="blocking">
            There is no label field. <Mono>accessibilityLabel</Mono> replaces it and is required on
            every item — an item without one is an unreachable destination for screen reader users,
            not a cosmetic omission.
          </GapNote>
        </div>

        <h3 className="mt-sp-32 mb-sp-12 text-xl leading-title-md font-semibold text-text-primary">
          Safe area
        </h3>
        <p className="mb-sp-12 max-w-[70ch] text-md leading-md text-text-secondary">
          The component&rsquo;s own 8 of bottom padding is the gap <em>above</em> the system inset.
          It is not the inset. The screen adds the platform inset below the component.
        </p>
        <Table head={['Context', 'Inset below the component', 'Source']}>
          {[
            ['iOS, home indicator', '34', 'Read from safeAreaInsets'],
            ['iOS, home button', '0', 'Read from safeAreaInsets'],
            ['Android, gesture navigation', '~24', 'WindowInsets.navigationBars'],
            ['Android, 3-button navigation', '~48', 'Review this case explicitly'],
          ].map(([c, i, s]) => (
            <tr key={c} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 whitespace-nowrap text-text-primary">{c}</td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-primary">{i}</td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-secondary">{s}</td>
            </tr>
          ))}
        </Table>
        <div className="mt-sp-12">
          <GapNote severity="blocking">
            Scrolling content must reserve 82 plus the inset as bottom padding. Without it the last
            list row, the last form field or a floating action button stays permanently trapped
            behind the bar. This is the single most common bug with floating navigation.
          </GapNote>
        </div>
      </Section>

      <Section title="Do & Don't">
        <div className="grid gap-sp-16 lg:grid-cols-2">
          <div className="space-y-sp-12">
            {[
              'Drive the bar with one selected index — never build five components.',
              'Distribute items by equal flex, not fixed widths.',
              'Make the whole item box the tap target.',
              'Give every item a localised accessibility label.',
              'Resolve every colour from NavigationBar/Color.',
              'Implement the opaque fallback as well as the glass surface.',
              'Re-tapping the active tab scrolls to top, then pops to root.',
            ].map((t) => (
              <div
                key={t}
                className="rounded-08 border-l-4 border-border-success bg-accent-green/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary"
              >
                {t}
              </div>
            ))}
          </div>
          <div className="space-y-sp-12">
            {[
              'Do not grey out an unavailable destination — remove it from the bar.',
              'Do not bind the hit area to the indicator pill.',
              'Do not signal selection with colour alone; the indicator shape carries it too.',
              'Do not recolour an icon locally, and never hardcode a hex.',
              'Do not reuse a bar icon for another meaning elsewhere in the product.',
              'Do not place the bar over photography or saturated imagery without reviewing contrast.',
              'Do not treat the 8 bottom padding as the system inset.',
            ].map((t) => (
              <div
                key={t}
                className="rounded-08 border-l-4 border-border-error bg-accent-red/10 px-sp-16 py-sp-12 text-md leading-md text-text-primary"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Application"
        description="The bar floats above content — which is exactly why its contrast is a property of the screen, not of the component."
      >
        <div className="space-y-sp-12">
          <GapNote severity="blocking">
            Icon contrast is no longer guaranteed. On an opaque surface the icons held a fixed
            4.92:1. On glass the icon sits over whatever content passes underneath, so contrast
            becomes a property of the screen. Because the item has no label, an icon washed out
            over bright content has nothing to rescue it.
          </GapNote>
          <p className="max-w-[70ch] text-md leading-md text-text-secondary">
            Screens that place this bar over photography, charts or saturated imagery must be
            reviewed individually. If a screen cannot hold contrast, use the opaque fallback on
            that screen rather than tuning the blur.
          </p>
        </div>
      </Section>

      <Section title="Accessibility">
        <Table head={['Pair', 'Ratio', 'Result']}>
          {[
            ['Opaque fallback — default icon on container', '4.92:1', 'Passes (icons need 3:1)'],
            ['Opaque fallback — selected icon on indicator', '7.30:1', 'Passes'],
            ['Glass — icon on container', 'not fixed', 'Depends on what scrolls underneath'],
            ['Dark — default vs selected icon', '1.08:1', 'No lightness cue; selection rides the indicator'],
          ].map(([p, r, res]) => (
            <tr key={p} className="border-b border-border-subtle last:border-0">
              <td className="px-sp-16 py-sp-08 text-text-primary">{p}</td>
              <td className="px-sp-16 py-sp-08 font-mono text-sm whitespace-nowrap text-text-primary">
                {r}
              </td>
              <td className="px-sp-16 py-sp-08 text-sm text-text-secondary">{res}</td>
            </tr>
          ))}
        </Table>

        <div className="mt-sp-16 space-y-sp-12">
          <GapNote severity="warning">
            In Dark, default and selected icons both resolve near-white — 1.08:1 apart — so
            selection leans entirely on the indicator. Design has logged moving{' '}
            <Mono>item/icon/selected</Mono> in Dark to purple-300. Not blocking.
          </GapNote>
          <Table head={['Platform', 'Container', 'Item']}>
            {[
              ['Web', '<nav> landmark, role="tablist"', 'role="tab", aria-selected, aria-label on each tab'],
              ['iOS', 'accessibilityElement(children: .contain)', 'Button trait, .isSelected on active, accessibilityLabel required'],
              ['Android', 'Modifier.selectableGroup()', 'Role.Tab, selected = true / false, contentDescription required'],
            ].map(([p, c, i]) => (
              <tr key={p} className="border-b border-border-subtle last:border-0">
                <td className="px-sp-16 py-sp-08 font-medium whitespace-nowrap text-text-primary">
                  {p}
                </td>
                <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-secondary">{c}</td>
                <td className="px-sp-16 py-sp-08 font-mono text-sm text-text-secondary">{i}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Section>

      <Section
        title="Deviations found while building"
        description="Places where the Figma documentation and the built component disagree, or where a decision had to be made that the file does not cover. Recorded rather than silently resolved."
      >
        <div className="space-y-sp-12">
          {[
            {
              title: 'The indicator is not 48 × 48',
              detail:
                'Both the anatomy table and the component description say the indicator is 48×48 and centred inside a ~62×48 item. The built component disagrees: _Nav.item.floating is 64×48 and its indicator is width-fill, so the indicator is a pill that spans the whole item. The screenshot agrees with the component. This implementation follows the component; the height of 48 is right either way, since it is 24 of icon plus sp-12 top and bottom.',
            },
            {
              title: 'The 64 minimum belongs to the selected item only',
              detail:
                'Easy to miss in the Figma output, and it matters: at five destinations the container has 312 of inner width, so a 64 minimum on every item sums to 320 and overflows. The overflow is absorbed on the right, which makes the right-hand padding visibly smaller than the left. Only the selected item carries the minimum; the rest shrink to about 62.',
            },
            {
              title: '360 is a reference width, not a fixed one',
              detail:
                'Figma draws the component 360 x 82, which is the width of the screen it was drawn on. Taken literally it strands a 360 bar in the middle of a 402 or 412 point device and breaks the 16 side margins that are actually specified. The bar fills its container here, so the margins stay 16 on every device — switch devices in the Preview tab to see it. If design intends a hard 360 cap on larger screens, that needs saying explicitly.',
            },
            {
              title: 'Motion is specified as a cross-fade, built as travel',
              detail:
                'Figma says "indicator cross-fade" and requires Reduce Motion to disable it. This implementation moves a single indicator between items instead, which shows the relationship between the old and new destination. It is a departure from the written spec and needs design sign-off.',
            },
            {
              title: 'Backdrop blur: the docs say 32px, the render is 16px',
              detail:
                'The effect style is BACKGROUND_BLUR radius 32 and the documentation table states backdrop-filter: blur(32px) for web, but Figma’s own code generation converts that same effect to blur(16px) — a Figma blur radius is about twice its CSS equivalent. Compared side by side against the file, 16px is the value that matches; 32px reads as a flat milky panel with no structure showing through. Built at 16px. The documentation table is the thing that needs correcting.',
            },
            {
              title: 'Glass breaks silently if a parent is animated',
              detail:
                'backdrop-filter samples only within its nearest backdrop root, and any ancestor carrying a transform, a filter or a fractional opacity starts a new one. The first build put the hide-on-scroll animation on a wrapper around the bar, which made the blur sample the inside of the bar — nothing — so the surface rendered as a flat tint with no glass and no error. The animation now lives on the glass panel itself. Anything else in the system that animates a glass surface has to follow the same rule.',
            },
            {
              title: 'Elevation/Floating-nav is never defined',
              detail:
                'The opaque fallback is mandatory and its effect style is named in three places, but no numeric definition appears anywhere in the documentation, and the variable read does not return it. The opaque surface here carries the container/border stroke and no shadow. It needs the real value.',
            },
            {
              title: 'item/label/* is orphaned',
              detail:
                'Three label tokens remain in NavigationBar/Color with nothing consuming them, since the item is icon-only. Per the spec they are filtered out of the generated constants here and are not in index.css. Remove them upstream if labels are not coming back.',
            },
          ].map((d) => (
            <div
              key={d.title}
              className="rounded-08 border border-border-subtle bg-surface-subtle px-sp-16 py-sp-12"
            >
              <h3 className="text-md leading-md font-semibold text-text-primary">{d.title}</h3>
              <p className="mt-sp-04 text-sm leading-sm text-text-secondary">{d.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Related">
        <p className="text-md leading-md text-text-secondary">
          Consumes <Mono>Purple (Primary)</Mono> and <Mono>Gray Blue</Mono> from Foundations
          through the <Mono>NavigationBar/Color</Mono> collection, plus <Mono>sp-08</Mono>,{' '}
          <Mono>sp-12</Mono>, <Mono>sp-16</Mono>, <Mono>br-32</Mono> and <Mono>br-100</Mono>.
        </p>
      </Section>
    </>
  )
}

/* ================================================================
   Local chrome
   ================================================================ */

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-sp-08 text-sm leading-sm font-medium text-text-secondary">{label}</div>
      {children}
    </div>
  )
}

function Segmented({
  options,
  active,
  onChange,
}: {
  options: readonly { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="inline-flex rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`cursor-pointer rounded-04 px-sp-16 py-sp-04 text-md leading-md font-medium transition-colors ${
            active === o.id
              ? 'bg-accent-purple text-text-on-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* A demo stage: the bar is translucent, so showing it on flat paper hides the
   only thing that makes it interesting. Content has to pass underneath. */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex justify-center overflow-hidden rounded-16 border border-border-subtle pt-sp-24"
      style={{
        background: 'linear-gradient(135deg, #7A50F7 0%, #FF5A70 42%, #FDB022 72%, #32D583 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 grid grid-cols-6 gap-sp-08 p-sp-16 opacity-90">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="rounded-08 bg-white/25" style={{ height: 12 + (i % 5) * 9 }} />
        ))}
      </div>
      <div className="relative w-[360px] pb-sp-24">{children}</div>
    </div>
  )
}
