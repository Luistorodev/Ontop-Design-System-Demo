/* A stand-in Worker screen, so the navigation bar has something real to float
   over. Harness content, not a design system component — but it is built out
   of the accent tokens so the colours are at least the product's own.

   Two presets exist on purpose. The component spec says icon contrast on glass
   "becomes a property of the screen, not of the component", and that screens
   over saturated imagery must be reviewed individually. `vivid` is what that
   warning looks like; `calm` is the case where glass is safe. */

export type ScreenTone = 'calm' | 'vivid'

const TX = [
  { name: 'Payroll · October', meta: 'Deposited', amount: '+$4,820.00', up: true },
  { name: 'Spotify', meta: 'Subscription', amount: '−$11.99', up: false },
  { name: 'Withdrawal to Bancolombia', meta: 'Completed', amount: '−$1,200.00', up: false },
  { name: 'Contractor invoice #4471', meta: 'Received', amount: '+$2,150.00', up: true },
  { name: 'Amazon', meta: 'Card ending 4417', amount: '−$86.40', up: false },
  { name: 'Payroll · September', meta: 'Deposited', amount: '+$4,820.00', up: true },
  { name: 'Uber', meta: 'Card ending 4417', amount: '−$23.10', up: false },
  { name: 'Currency exchange', meta: 'USD → COP', amount: '−$500.00', up: false },
]

const BARS = [42, 68, 35, 88, 54, 76, 61, 94, 48, 70]

export function WorkerScreen({ tone }: { tone: ScreenTone }) {
  const vivid = tone === 'vivid'

  return (
    <div className="px-sp-16">
      {/* Greeting */}
      <div className="flex items-center justify-between pt-sp-12 pb-sp-16">
        <div>
          <div className="text-sm leading-sm text-text-tertiary">Good morning</div>
          <div className="text-2xl leading-2xl font-semibold text-text-primary">Luis</div>
        </div>
        <div
          className="size-sp-40 rounded-pill"
          style={{ background: 'linear-gradient(135deg,#7A50F7,#FF5A70)' }}
        />
      </div>

      {/* Balance hero */}
      <div
        className="relative mb-sp-16 overflow-hidden rounded-24 p-sp-24"
        style={{
          background: vivid
            ? 'radial-gradient(120% 140% at 0% 0%, #7A50F7 0%, #5856B7 38%, #FF5A70 78%, #FDB022 100%)'
            : 'linear-gradient(135deg,#3D287B 0%,#5135A5 100%)',
        }}
      >
        <div className="text-sm leading-sm text-white/75">Available balance</div>
        <div className="mt-sp-04 text-6xl leading-5xl font-semibold text-white">$12,480.50</div>
        <div className="mt-sp-16 flex gap-sp-08">
          <span className="rounded-pill bg-white/20 px-sp-12 py-sp-04 text-sm leading-sm font-medium text-white">
            + $4,820 this month
          </span>
          <span className="rounded-pill bg-white/20 px-sp-12 py-sp-04 text-sm leading-sm font-medium text-white">
            USD
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-sp-24 grid grid-cols-4 gap-sp-08">
        {[
          { label: 'Send', color: 'var(--color-accent-purple)' },
          { label: 'Request', color: 'var(--color-accent-blue)' },
          { label: 'Exchange', color: 'var(--color-accent-green)' },
          { label: 'Cards', color: 'var(--color-accent-brand)' },
        ].map((a) => (
          <div key={a.label} className="flex flex-col items-center gap-sp-08">
            <div
              className="size-sp-48 rounded-pill"
              style={{ background: vivid ? a.color : 'var(--color-surface-subtle)' }}
            />
            <span className="text-sm leading-sm text-text-secondary">{a.label}</span>
          </div>
        ))}
      </div>

      {/* Spending chart */}
      <div className="mb-sp-24 rounded-16 border border-border-subtle p-sp-16">
        <div className="mb-sp-04 text-md leading-md font-semibold text-text-primary">
          Spending
        </div>
        <div className="mb-sp-16 text-sm leading-sm text-text-tertiary">Last 10 weeks</div>
        <div className="flex h-[96px] items-end gap-sp-04">
          {BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-04"
              style={{
                height: `${h}%`,
                background: vivid
                  ? ['#528BFF', '#32D583', '#FDB022', '#F97066', '#7A50F7', '#5856B7'][i % 6]
                  : 'var(--color-accent-purple)',
                opacity: vivid ? 1 : 0.25 + (h / 100) * 0.75,
              }}
            />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="mb-sp-24">
        <div className="mb-sp-12 text-2xl leading-2xl font-semibold text-text-primary">
          Your cards
        </div>
        <div className="flex gap-sp-12">
          {[
            vivid
              ? 'linear-gradient(135deg,#FF5A70,#FDB022)'
              : 'linear-gradient(135deg,#344054,#1D2939)',
            vivid
              ? 'linear-gradient(135deg,#32D583,#528BFF)'
              : 'linear-gradient(135deg,#475467,#344054)',
          ].map((bg, i) => (
            <div
              key={i}
              className="h-[124px] flex-1 rounded-16 p-sp-16"
              style={{ background: bg }}
            >
              <div className="text-sm leading-sm text-white/80">Ontop card</div>
              <div className="mt-sp-32 text-md leading-md font-semibold text-white">
                •••• 44{i}7
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="mb-sp-12 text-2xl leading-2xl font-semibold text-text-primary">
        Recent activity
      </div>
      {TX.map((t, i) => (
        <div key={i} className="flex items-center gap-sp-12 border-b border-border-subtle py-sp-12">
          <div
            className="size-sp-40 shrink-0 rounded-pill"
            style={{
              background: vivid
                ? ['#7A50F7', '#FF5A70', '#528BFF', '#32D583', '#FDB022'][i % 5]
                : 'var(--color-surface-subtle)',
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-md leading-md font-medium text-text-primary">
              {t.name}
            </div>
            <div className="text-sm leading-sm text-text-tertiary">{t.meta}</div>
          </div>
          <div
            className={`text-md leading-md font-semibold ${
              t.up ? 'text-accent-green' : 'text-text-primary'
            }`}
          >
            {t.amount}
          </div>
        </div>
      ))}

      {/* The band the bar ends up floating over once you scroll to the bottom.
          On `vivid` this is exactly the case the spec says to review. */}
      <div
        className="mt-sp-24 flex h-[220px] items-end rounded-24 p-sp-24"
        style={{
          background: vivid
            ? 'conic-gradient(from 210deg at 40% 30%, #FDB022, #32D583, #528BFF, #7A50F7, #FF5A70, #FDB022)'
            : 'linear-gradient(135deg,#F9FAFB,#F2F4F7)',
        }}
      >
        <div
          className={`text-2xl leading-2xl font-semibold ${
            vivid ? 'text-white' : 'text-text-primary'
          }`}
        >
          Refer a friend
        </div>
      </div>
    </div>
  )
}
