/**
 * Builds the Tiptap editor and binds it to the shared Yjs document.
 *
 * The key wiring:
 *   - StarterKit's built-in history is DISABLED, because the Collaboration
 *     extension supplies its own CRDT-aware undo manager. Running both would
 *     corrupt undo across peers.
 *   - Collaboration binds the ProseMirror doc to a Y.XmlFragment so every
 *     keystroke becomes a CRDT operation that merges conflict-free.
 *   - CollaborationCursor renders remote peers' carets + name labels using
 *     the same awareness channel as the presence bar.
 */

import { useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import type { WebrtcProvider } from 'y-webrtc'
import type * as Y from 'yjs'
import type { Identity } from './identity'

interface UseDocEditorArgs {
  ydoc: Y.Doc
  provider: WebrtcProvider | null
  identity: Identity
}

export function useDocEditor({ ydoc, provider, identity }: UseDocEditorArgs): Editor | null {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          // Collaboration brings its own history; disable the default one.
          history: false,
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
        }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Placeholder.configure({
          placeholder: 'Start writing — or share the link and write together…',
        }),
        CharacterCount,
        Collaboration.configure({ document: ydoc }),
        ...(provider
          ? [
              CollaborationCursor.configure({
                provider,
                user: { name: identity.name, color: identity.color },
              }),
            ]
          : []),
      ],
      editorProps: {
        attributes: {
          class: 'ProseMirror',
          spellcheck: 'true',
          'aria-label': 'Document body',
        },
      },
    },
    // Rebuild the editor when the provider becomes available so the cursor
    // extension attaches once peer transport exists.
    [ydoc, provider],
  )

  return editor
}
