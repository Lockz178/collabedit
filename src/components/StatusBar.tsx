import { type Editor, useEditorState } from '@tiptap/react'
import type { ConnectionStatus } from '../collab/useCollaboration'
import { KeyboardIcon } from '../lib/icons'
import StatusPill from './StatusPill'

interface StatusBarProps {
  editor: Editor | null
  status: ConnectionStatus
  roomId: string
  synced: boolean
  onShowShortcuts: () => void
}

const WORDS_PER_MINUTE = 200

function readingTime(words: number): string {
  if (words === 0) return '—'
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  return `${minutes} min read`
}

export default function StatusBar({
  editor,
  status,
  roomId,
  synced,
  onShowShortcuts,
}: StatusBarProps) {
  // Subscribe to character/word counts reactively.
  const counts = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return { words: 0, chars: 0 }
      const storage = e.storage.characterCount as
        | { words: () => number; characters: () => number }
        | undefined
      return {
        words: storage?.words() ?? 0,
        chars: storage?.characters() ?? 0,
      }
    },
  }) ?? { words: 0, chars: 0 }

  return (
    <div className="statusbar">
      <span className="statusbar__item">
        <strong>{counts.words.toLocaleString()}</strong> words
      </span>
      <span className="statusbar__item statusbar__item--hide-sm">
        <strong>{counts.chars.toLocaleString()}</strong> characters
      </span>
      <span className="statusbar__item statusbar__item--hide-sm" title="Estimated at 200 words/min">
        {readingTime(counts.words)}
      </span>
      <span className="statusbar__item statusbar__item--hide-sm" title="The room id is in your URL">
        room <strong>{roomId}</strong>
      </span>

      <span className="statusbar__spacer" />

      <button
        type="button"
        className="statusbar__btn"
        onClick={onShowShortcuts}
        title="Keyboard shortcuts"
      >
        <KeyboardIcon />
        <span className="statusbar__item--hide-sm">Shortcuts</span>
      </button>
      <span className="statusbar__item" title="Saved locally in your browser via IndexedDB">
        {synced ? 'Saved locally' : 'Loading…'}
      </span>
      <StatusPill status={status} />
    </div>
  )
}
