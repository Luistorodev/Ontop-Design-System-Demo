import type { ReactNode } from 'react'
import { Composer } from '../ui/Composer'
import { LogoHero } from '../ui/LogoHero'
import { Background } from '../ui/Background'
import { Topbar } from '../ui/Topbar'
import { AuraBubble, ChatMessages, HumanBubble, ThinkingIndicator, UserBubble } from '../ui/Messages'
import { AVATAR, BANNERS, KEYBOARD_HEIGHT, KEYBOARD_LIFT, SAMPLE_TAGS } from './chatScreenData'
import type { ChatScreen } from './useChatScreen'

/* The Aura chat screen — hub harness shared by the Composer and Messages
   previews, so both behave the same: a 360 × 800 screen with Background at the
   root, the Topbar and the Composer floating over a live conversation drawn
   with the Messages components.

   What it does:
   - Topbar and Composer each follow their own edge of the scroll (Scroll
     state while there is conversation above / below them).
   - Tapping the field opens the Composer into Large and slides the iOS
     keyboard up; tapping outside or sending dismisses it.
   - Sending shows the Thinking-Indicator with the Composer in Stop only, then
     Aura's reply.
   - Under each reply: Copy (check + toast), Like / Dislike (one stays
     pressed), Retry (asks again), More options (toast).

   The state lives in useChatScreen() (useChatScreen.ts) so a page can put its
   own controls next to the screen; the sample data is in chatScreenData.tsx.
   <ChatScreenView> draws it. Not a design-system component. */

export function ChatScreenView({
  chat,
  replaceComposer,
  onBack,
}: {
  chat: ChatScreen
  /** Drawn in the Composer's place while set — the Form, when Aura asks. */
  replaceComposer?: ReactNode
  /** The Topbar's back arrow — leaving the chat, where a page models that. */
  onBack?: () => void
}) {
  const {
    turns, processing, feedback, setFeedback, toast, say, size, state, underTopbar, keyboard,
    dockHeight, scroller, input, dock, measure, run, send, stop, onDockFocus, onDockBlur,
    addAttachment, value, type, voice, banner, setBanner, tags, setTags, attachments,
    setAttachments, lastPrompt, auraParts,
  } = chat

  return (
    /* The same 360 × 800 screen as the Background page (Mobile 360). */
    <div className="relative h-[800px] w-[360px] shrink-0 overflow-clip rounded-24 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]">
      <Background>
        <div className="relative size-full">
          {/* The conversation fills the screen and both bars float over it.
              Its padding reserves them: 100 for the Topbar (status-bar space
              plus the bar) and the Composer's measured height, plus the
              keyboard while it is up. */}
          {/* While something replaces the Composer (the Form) the
              conversation is frozen: no scrolling, no taps — inert also
              keeps focus out of it. The position is kept for when it closes. */}
          <div
            ref={scroller}
            inert={!!replaceComposer}
            className={`device-scroll absolute inset-0 ${replaceComposer ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
            onScroll={(event) => measure(event.currentTarget)}
          >
            {turns.length === 0 && !processing ? (
              /* The chat's start: the Logo hero playing its intro, and the
                 greeting — laid out as on the Logo hero page (64 under the
                 bar, the greeting 40 under the logo's 300 block). Copy from
                 the canvas, for context. */
              <div className="pt-[100px]">
                <div className="flex h-[300px] items-center justify-center pt-sp-64">
                  <LogoHero mode="intro" />
                </div>
                <div className="flex flex-col gap-[6px] px-sp-48 pt-sp-40">
                  <p className="greeting-hi text-xl leading-title-md font-medium text-text-primary">
                    Hey, Tatiana!
                  </p>
                  <p className="greeting-title text-4xl leading-3xl font-semibold">
                    Can I help you with anything?
                  </p>
                </div>
              </div>
            ) : (
            <div
              className="px-sp-24 pt-[124px]"
              style={{ paddingBottom: dockHeight + 24 + (keyboard ? KEYBOARD_LIFT : 0) }}
            >
              <ChatMessages>
                {turns.map((turn) =>
                  turn.from === 'user' ? (
                    <UserBubble key={turn.id}>{turn.text}</UserBubble>
                  ) : turn.from === 'human' ? (
                    <HumanBubble key={turn.id} name={turn.name} avatarSrc={AVATAR}>
                      {turn.text}
                    </HumanBubble>
                  ) : (
                    <AuraBubble
                      key={turn.id}
                      name={auraParts.name ? 'Aura' : ''}
                      title={auraParts.title ? turn.title : undefined}
                      subtitle={auraParts.subtitle ? turn.subtitle : undefined}
                      actions={auraParts.actions}
                      actionsProps={{
                        liked: feedback[turn.id] ?? null,
                        // The clipboard can be refused (no permission, an
                        // embedded frame); the check still confirms the tap.
                        onCopy: () => {
                          navigator.clipboard
                            ?.writeText([turn.title, turn.subtitle, turn.copy].filter(Boolean).join('\n'))
                            .catch(() => {})
                          say('Copied')
                        },
                        onLike: () =>
                          setFeedback((f) => ({ ...f, [turn.id]: f[turn.id] === 'like' ? null : 'like' })),
                        onDislike: () =>
                          setFeedback((f) => ({ ...f, [turn.id]: f[turn.id] === 'dislike' ? null : 'dislike' })),
                        onRetry: () => run(lastPrompt.current || 'Retry'),
                        onMore: () => say('More options'),
                      }}
                    >
                      {turn.body}
                    </AuraBubble>
                  ),
                )}
                {processing ? <ThinkingIndicator /> : null}
              </ChatMessages>
            </div>
            )}
          </div>

          {/* Above the dock, so the Form's overlay passes under the bar. */}
          <div className="absolute inset-x-0 top-0 z-10">
            <Topbar state={underTopbar ? 'scroll' : 'default'} onBack={onBack} />
          </div>

          {/* 8 above the reserved strip puts the disclaimer where the
              Background page draws it. With the keyboard up, the composer rides
              on top of it, on the keyboard's own timing. */}
          <div
            ref={dock}
            onFocus={onDockFocus}
            onBlur={onDockBlur}
            className="absolute inset-x-0 px-sp-16 pb-sp-08 transition-[bottom] duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
            style={{ bottom: keyboard ? KEYBOARD_LIFT : 0 }}
          >
            {replaceComposer ?? (
              <Composer
                size={size}
                state={state}
                value={value}
                onValueChange={type}
                processing={processing}
                onSend={send}
                onStop={stop}
                onAttach={addAttachment}
                onFile={addAttachment}
                onMore={() => setTags((t) => (t.length ? t : SAMPLE_TAGS))}
                voice={voice}
                banner={banner ? BANNERS[banner] : undefined}
                onBannerAction={() => {
                  // Only the error banner's Retry does something in this demo.
                  if (banner === 'error') run(lastPrompt.current || 'Retry')
                  else setBanner(null)
                }}
                tags={tags}
                onRemoveTag={(id) => setTags((t) => t.filter((tag) => tag.id !== id))}
                attachments={attachments}
                onRemoveAttachment={(id) => setAttachments((a) => a.filter((x) => x.id !== id))}
                inputRef={input}
              />
            )}
          </div>

          {toast ? (
            <div
              role="status"
              className="absolute top-[112px] left-1/2 -translate-x-1/2 rounded-pill bg-surface-inverse px-sp-12 py-sp-04 text-sm leading-sm font-medium text-text-inverse"
            >
              {toast}
            </div>
          ) : null}
        </div>
      </Background>

      {/* The keyboard slides up from the bottom edge. Pressing it keeps focus in
          the field, as a real keyboard would; it is a picture, so its keys do
          not type. */}
      <div
        aria-hidden
        onMouseDown={(event) => event.preventDefault()}
        className={`absolute inset-x-0 bottom-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
          keyboard ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: KEYBOARD_HEIGHT }}
      >
        <img src="/figma/ios-keyboard-light.svg" alt="" width={360} height={KEYBOARD_HEIGHT} className="keyboard-light block" />
        <img src="/figma/ios-keyboard-dark.svg" alt="" width={360} height={KEYBOARD_HEIGHT} className="keyboard-dark block" />
      </div>
    </div>
  )
}
