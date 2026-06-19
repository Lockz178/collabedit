import { useCallback, useRef, useState } from 'react'

/** Minimal transient toast: show(message) displays it for ~2s. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((msg: string) => {
    setMessage(msg)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(null), 2000)
  }, [])

  return { message, show }
}
