import { useState } from 'react'
import { roomShareUrl } from '../collab/room'
import { usePopover } from '../lib/usePopover'
import { ShareIcon, CopyIcon, CheckIcon } from '../lib/icons'

interface SharePopoverProps {
  roomId: string
  onCopied: () => void
}

export default function SharePopover({ roomId, onCopied }: SharePopoverProps) {
  const { open, anchorRef, toggle } = usePopover()
  const [copied, setCopied] = useState(false)
  const url = roomShareUrl(roomId)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for browsers without clipboard permissions.
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    onCopied()
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="popover-anchor" ref={anchorRef}>
      <button
        type="button"
        className="btn btn--primary"
        onClick={toggle}
        aria-expanded={open}
      >
        <ShareIcon />
        Share
      </button>

      {open && (
        <div className="popover" role="dialog" aria-label="Share document">
          <p className="popover__title">Invite people to collaborate</p>
          <span className="field-label">Room link</span>
          <div className="share-row">
            <input className="text-input" readOnly value={url} onFocus={(e) => e.target.select()} />
            <button
              type="button"
              className="btn"
              onClick={copy}
              title="Copy link"
              style={{ flexShrink: 0 }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <p className="share-hint">
            Anyone with this link edits the same document live — changes sync
            peer-to-peer through your browser. No account, no server.
          </p>
        </div>
      )}
    </div>
  )
}
