/**
 * Collaborative document title. Stored in a Yjs map ("meta" → "title") so it
 * syncs alongside the body. To avoid the caret jumping while a remote peer
 * types, we only pull remote values into the input when it isn't focused.
 */
import { useEffect, useRef, useState } from 'react'
import type * as Y from 'yjs'

interface DocTitleProps {
  ydoc: Y.Doc
}

export default function DocTitle({ ydoc }: DocTitleProps) {
  const meta = ydoc.getMap('meta')
  const [value, setValue] = useState<string>((meta.get('title') as string) ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const update = () => {
      const remote = (meta.get('title') as string) ?? ''
      // Don't clobber what the local user is actively typing.
      if (document.activeElement !== inputRef.current) {
        setValue(remote)
      }
    }
    update()
    meta.observe(update)
    return () => meta.unobserve(update)
  }, [meta])

  const onChange = (next: string) => {
    setValue(next)
    meta.set('title', next)
  }

  return (
    <input
      ref={inputRef}
      className="doc__title-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Untitled document"
      aria-label="Document title"
      spellCheck={false}
    />
  )
}
