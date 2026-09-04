import type { ReactNode } from 'react'
import { devices, type Device } from './devices'

/* Device chrome for component previews.

   This is the hub's own harness, not a design system component — the bezels,
   status bar and home indicator are OS furniture, deliberately drawn here
   rather than pulled from Figma.

   The device list carries each platform's real bottom inset, because for
   floating navigation the inset is the whole game: the component's own 8 of
   bottom padding sits ABOVE it, and content has to reserve the component
   height plus the inset. Switching devices here is what makes that visible. */

export function DeviceFrame({
  device,
  children,
  overlay,
  /** Height the overlay occupies, so content can reserve it plus the inset. */
  overlayHeight = 0,
}: {
  device: Device
  children: ReactNode
  overlay?: ReactNode
  overlayHeight?: number
}) {
  const seLike = device.chrome === 'home-button'
  const sideBezel = seLike ? 12 : 11
  const topBezel = seLike ? 62 : sideBezel
  const bottomBezel = seLike ? 82 : sideBezel

  return (
    <div className="shrink-0">
      <div
        className="relative bg-[#1c1c1e]"
        style={{
          width: device.width + sideBezel * 2,
          paddingLeft: sideBezel,
          paddingRight: sideBezel,
          paddingTop: topBezel,
          paddingBottom: bottomBezel,
          borderRadius: seLike ? 40 : device.radius + sideBezel,
          boxShadow:
            '0 0 0 2px #3a3a3c, 0 24px 48px -12px rgb(16 24 40 / 0.45), inset 0 0 0 1px rgb(255 255 255 / 0.08)',
        }}
      >
        {/* Side buttons, so the body reads as hardware rather than a rectangle. */}
        <span className="absolute top-[112px] -left-[3px] h-[32px] w-[3px] rounded-l-04 bg-[#3a3a3c]" />
        <span className="absolute top-[164px] -left-[3px] h-[56px] w-[3px] rounded-l-04 bg-[#3a3a3c]" />
        <span className="absolute top-[232px] -left-[3px] h-[56px] w-[3px] rounded-l-04 bg-[#3a3a3c]" />
        <span className="absolute top-[186px] -right-[3px] h-[88px] w-[3px] rounded-r-04 bg-[#3a3a3c]" />

        {seLike ? (
          <>
            <span className="absolute top-[28px] left-1/2 h-[6px] w-[56px] -translate-x-1/2 rounded-pill bg-[#3a3a3c]" />
            <span className="absolute bottom-[16px] left-1/2 h-[50px] w-[50px] -translate-x-1/2 rounded-pill border-2 border-[#3a3a3c]" />
          </>
        ) : null}

        {/* Screen */}
        <div
          className="relative overflow-hidden bg-surface-page"
          style={{ width: device.width, height: device.height, borderRadius: device.radius }}
        >
          <StatusBar device={device} />

          <div
            className="h-full overflow-y-auto"
            style={{
              paddingTop: device.statusBar,
              /* The rule the spec calls the single most common bug with
                 floating navigation: reserve the component height plus the
                 system inset, or the last row stays trapped behind the bar. */
              paddingBottom: overlayHeight + device.bottomInset,
            }}
          >
            {children}
          </div>

          {overlay ? (
            <div
              className="absolute inset-x-0 flex justify-center"
              style={{ bottom: device.bottomInset }}
            >
              {overlay}
            </div>
          ) : null}

          <SystemNav device={device} />
        </div>
      </div>

      <div className="mt-sp-12 text-center text-sm leading-sm text-text-tertiary">
        {device.name} · {device.width} × {device.height} · {device.navMode}
        {device.bottomInset > 0 ? ` · inset ${device.bottomInset}` : ''}
      </div>
    </div>
  )
}

function StatusBar({ device }: { device: Device }) {
  const ios = device.os === 'ios'
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between text-text-primary"
      style={{ height: device.statusBar, paddingLeft: 26, paddingRight: 26, paddingTop: ios ? 14 : 8 }}
    >
      <span className="text-sm leading-sm font-semibold">9:41</span>

      {device.chrome === 'dynamic-island' ? (
        <span className="absolute top-[11px] left-1/2 h-[37px] w-[125px] -translate-x-1/2 rounded-pill bg-black" />
      ) : null}
      {device.chrome === 'punch-hole' ? (
        <span className="absolute top-[12px] left-1/2 size-[11px] -translate-x-1/2 rounded-pill bg-black" />
      ) : null}

      <span className="flex items-center gap-[5px]">
        {/* Signal bars */}
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => (
            <span
              key={h}
              className="w-[3px] rounded-[1px] bg-current"
              style={{ height: h, opacity: h === 10 ? 0.35 : 1 }}
            />
          ))}
        </span>
        {/* Battery */}
        <span className="ml-[2px] flex h-[11px] w-[22px] items-center rounded-[3px] border border-current px-[1px] opacity-70">
          <span className="h-[7px] w-[13px] rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  )
}

function SystemNav({ device }: { device: Device }) {
  if (device.chrome === 'home-button') return null

  if (device.navMode === '3-button navigation') {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[48px] items-center justify-center gap-[56px] text-text-primary/45">
        <span className="size-[13px] rotate-45 border-b-2 border-l-2 border-current" />
        <span className="size-[13px] rounded-[2px] border-2 border-current" />
        <span className="size-[13px] rounded-full border-2 border-current" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[24px] items-end justify-center pb-[8px]">
      <span className="h-[5px] w-[134px] rounded-pill bg-text-primary/35" />
    </div>
  )
}

export function DevicePicker({
  active,
  onChange,
}: {
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-sp-04 rounded-08 border border-border-subtle bg-surface-subtle p-sp-04">
      {devices.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onChange(d.id)}
          className={`cursor-pointer rounded-04 px-sp-12 py-sp-04 text-sm leading-sm font-medium transition-colors ${
            active === d.id
              ? 'bg-accent-purple text-text-on-brand'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {d.name}
        </button>
      ))}
    </div>
  )
}
