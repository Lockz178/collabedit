import { type Editor, useEditorState } from '@tiptap/react'
import type { ConnectionStatus } from '../collab/useCollaboration'
import StatusPill from './StatusPill'

interface StatusBarProps {
  editor: Editor | null
  status: ConnectionStatus
  roomId: string
  synced: boolean
}

export default function StatusBar({ editor, status, roomId, synced }: StatusBarProps) {
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
      <span className="statusbar__item">
        <strong>{counts.chars.toLocaleString()}</strong> characters
      </span>
      <span className="statusbar__item" title="The room id is in your URL">
        room <strong>{roomId}</strong>
      </span>

      <span className="statusbar__spacer" />

      <span className="statusbar__item" title="Saved locally in your browser via IndexedDB">
        {synced ? 'Saved locally' : 'Loading…'}
      </span>
      <StatusPill status={status} />
    </div>
  )
}
