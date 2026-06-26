import { useEffect, useMemo, useState } from 'react'
import { EditorContent } from '@tiptap/react'
import { useCollaboration } from './collab/useCollaboration'
import { useDocEditor } from './collab/useDocEditor'
import { resolveRoomId, startNewDocument } from './collab/room'
import { loadIdentity, saveIdentity, type Identity } from './collab/identity'
import { useTheme } from './lib/useTheme'
import { useToast } from './lib/useToast'
import { SunIcon, MoonIcon, CheckIcon, PlusIcon } from './lib/icons'
import Toolbar from './components/Toolbar'
import BubbleToolbar from './components/BubbleToolbar'
import PresenceBar from './components/PresenceBar'
import SharePopover from './components/SharePopover'
import IdentityPopover from './components/IdentityPopover'
import ExportMenu from './components/ExportMenu'
import DocTitle from './components/DocTitle'
import StatusBar from './components/StatusBar'
import ShortcutsModal from './components/ShortcutsModal'

export default function App() {
  const roomId = useMemo(() => resolveRoomId(), [])
  const [identity, setIdentity] = useState<Identity>(() => loadIdentity())
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { message, show } = useToast()

  const { ydoc, provider, peers, status, synced } = useCollaboration(roomId, identity)
  const editor = useDocEditor({ ydoc, provider, identity })

  const updateIdentity = (next: Identity) => {
    setIdentity(next)
    saveIdentity(next)
  }

  // Press "?" anywhere outside an editable field to open the shortcuts sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement as HTMLElement | null
      const typing =
        el && (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
      if (typing) return
      e.preventDefault()
      setShortcutsOpen(true)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <img className="header__brand-logo" src="/favicon.svg" alt="" />
          <span className="header__brand-name">CollabEdit</span>
          <span className="header__brand-tag">peer-to-peer</span>
        </div>

        <div className="header__spacer" />

        <PresenceBar peers={peers} />

        <div className="header__actions">
          <button
            type="button"
            className="btn"
            onClick={startNewDocument}
            title="Start a new empty document"
          >
            <PlusIcon />
            <span className="btn__label-hide-sm">New</span>
          </button>
          <ExportMenu editor={editor} ydoc={ydoc} roomId={roomId} onExported={show} />
          <button
            type="button"
            className="btn btn--icon"
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <IdentityPopover identity={identity} onChange={updateIdentity} />
          <SharePopover roomId={roomId} onCopied={() => show('Link copied to clipboard')} />
        </div>
      </header>

      <main className="app__body">
        <div className="doc">
          <div className="doc__paper">
            <DocTitle ydoc={ydoc} />
            <Toolbar editor={editor} />
            <BubbleToolbar editor={editor} />
            <div className="editor-scroll">
              <EditorContent editor={editor} />
            </div>
          </div>
          <StatusBar
            editor={editor}
            status={status}
            roomId={roomId}
            synced={synced}
            onShowShortcuts={() => setShortcutsOpen(true)}
          />
        </div>
      </main>

      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {message && (
        <div className="toast" role="status">
          <CheckIcon style={{ width: 16, height: 16 }} />
          {message}
        </div>
      )}
    </div>
  )
}
