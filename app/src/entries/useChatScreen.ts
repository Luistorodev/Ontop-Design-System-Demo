import { useEffect, useRef, useState, type FocusEvent } from 'react'
import type { ComposerAttachment, ComposerTag } from '../ui/Composer'
import type { BannerType } from '../ui/Banner'
import { FIRST, REPLY, SAMPLE_ATTACHMENTS, type Turn } from './chatScreenData'

/* State and behaviour of the shared Aura chat screen (see ChatScreen.tsx),
   kept apart from the view so a page can put its own controls beside it. */

type Mode3<T extends string> = 'auto' | T

/** `start: 'home'` opens on the chat's start — the Logo hero and the
 *  greeting, no conversation yet; the first message begins one. */
export function useChatScreen({ start = 'conversation' }: { start?: 'conversation' | 'home' } = {}) {
  const [sizeMode, setSizeMode] = useState<Mode3<'small' | 'large'>>('auto')
  const [stateMode, setStateMode] = useState<Mode3<'default' | 'scroll'>>('auto')
  const [voice, setVoice] = useState(true)
  const [failNext, setFailNext] = useState(false)
  const [banner, setBanner] = useState<BannerType | null>(null)
  const [tags, setTags] = useState<ComposerTag[]>([])
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([])
  /* The Aura bubble's optional parts — Figma's Name, Title, Subtitle and
     Actions booleans, all on by default. */
  const [auraParts, setAuraParts] = useState({ name: true, title: true, subtitle: true, actions: true })

  const [value, setValue] = useState('')
  const [turns, setTurns] = useState<Turn[]>(start === 'home' ? [] : FIRST)
  const [processing, setProcessing] = useState(false)
  const [feedback, setFeedback] = useState<Record<number, 'like' | 'dislike' | null>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [underTopbar, setUnderTopbar] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  const [dockHeight, setDockHeight] = useState(140)

  const scroller = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const dock = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const toastTimer = useRef<number | undefined>(undefined)
  const blurTimer = useRef<number | undefined>(undefined)
  const lastPrompt = useRef('')

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      window.clearTimeout(toastTimer.current)
      window.clearTimeout(blurTimer.current)
    },
    [],
  )

  /* The composer floats over the conversation and Large grows with its slots
     and text, so the reserve at the end of the conversation follows its
     measured height rather than a fixed number. */
  useEffect(() => {
    const el = dock.current
    if (!el) return
    const observer = new ResizeObserver(() => setDockHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Small is the resting composer. It opens into Large the moment the field
     takes focus (the keyboard is up), and stays Large while there is
     something Large alone can show. */
  const hasContent = value.length > 0 || tags.length > 0 || attachments.length > 0 || !!banner
  const size = sizeMode === 'auto' ? (hasContent || keyboard ? 'large' : 'small') : sizeMode
  const state = stateMode === 'auto' ? (scrolled ? 'scroll' : 'default') : stateMode

  /* Small and Large are different elements, so the caret is carried across
     when the composer opens up — on the focusing tap or mid-word. */
  const typed = useRef(false)
  const type = (next: string) => {
    typed.current = true
    setValue(next)
  }
  const previousSize = useRef(size)
  useEffect(() => {
    if (previousSize.current !== size && (typed.current || keyboard)) {
      const el = input.current
      el?.focus({ preventScroll: true })
      el?.setSelectionRange(el.value.length, el.value.length)
    }
    typed.current = false
    previousSize.current = size
  }, [size, value, keyboard])

  /* Each overlay reads its own edge: the Composer is in Scroll while there is
     conversation below it, the Topbar while there is conversation above. */
  function measure(el: HTMLElement) {
    setScrolled(el.scrollHeight - el.scrollTop - el.clientHeight > 1)
    setUnderTopbar(el.scrollTop > 0)
  }

  // Keep the newest message in view, which is where a chat lives. Instant:
  // a smooth jump is cancelled by the next layout change.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'instant' })
    measure(el)
  }, [turns, processing, dockHeight, keyboard])

  const say = (message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1600)
  }

  const run = (prompt: string) => {
    lastPrompt.current = prompt
    setBanner(null)
    setProcessing(true)
    timer.current = window.setTimeout(() => {
      setProcessing(false)
      if (failNext) {
        setBanner('error')
        setFailNext(false)
        return
      }
      setTurns((t) => [...t, { id: Date.now(), from: 'aura', ...REPLY }])
    }, 2400)
  }

  const dismissKeyboard = () => {
    /* Explicit: the field is removed (Stop only) while it still has focus,
       and the browser fires no blur for a removed element. */
    window.clearTimeout(blurTimer.current)
    setKeyboard(false)
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  const send = () => {
    const prompt = value.trim()
    if (!prompt) return
    dismissKeyboard()
    setTurns((t) => [...t, { id: Date.now(), from: 'user', text: prompt }])
    setValue('')
    setTags([])
    setAttachments([])
    run(prompt)
  }

  /* A user message that did not come from the composer — the Form's
     answers. Same path as send: it lands as a user bubble and Aura replies. */
  const post = (text: string) => {
    dismissKeyboard()
    setTurns((t) => [...t, { id: Date.now(), from: 'user', text }])
    run(text)
  }

  const stop = () => {
    window.clearTimeout(timer.current)
    setProcessing(false)
  }

  /* The keyboard follows focus in the field: open on focus, closed when focus
     leaves the composer. Deferred, because opening into Large moves focus
     between two elements and for a moment it is on neither. */
  const onDockFocus = (event: FocusEvent) => {
    window.clearTimeout(blurTimer.current)
    if (event.target.matches('input, textarea')) setKeyboard(true)
  }
  const onDockBlur = () => {
    window.clearTimeout(blurTimer.current)
    blurTimer.current = window.setTimeout(() => {
      const active = document.activeElement
      if (!active || !dock.current?.contains(active)) setKeyboard(false)
    }, 80)
  }

  const addAttachment = () =>
    setAttachments((list) => {
      const next = SAMPLE_ATTACHMENTS.find((a) => !list.some((b) => b.id === a.id))
      return next ? [...list, next] : list
    })

  return {
    // controls a page may expose
    sizeMode, setSizeMode, stateMode, setStateMode, voice, setVoice,
    failNext, setFailNext, banner, setBanner, tags, setTags, attachments, setAttachments,
    auraParts, setAuraParts,
    // screen state
    value, type, turns, processing, feedback, setFeedback, toast, say,
    size, state, underTopbar, keyboard, dockHeight,
    scroller, input, dock, measure, run, send, post, stop, onDockFocus, onDockBlur, addAttachment,
    lastPrompt,
  }
}

export type ChatScreen = ReturnType<typeof useChatScreen>
