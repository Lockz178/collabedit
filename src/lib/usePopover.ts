import { useEffect, useRef, useState } from 'react'

/**
 * Small popover controller: tracks open state and closes the menu on an
 * outside click or the Escape key. Returns a ref to attach to the anchor
 * element that wraps both the trigger and the floating panel.
 */
export function usePopover<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<T>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return { open, setOpen, anchorRef, toggle: () => setOpen((o) => !o) }
}
