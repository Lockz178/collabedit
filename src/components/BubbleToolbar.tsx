import { BubbleMenu, type Editor } from '@tiptap/react'
import { promptForLink } from '../lib/editorActions'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikeIcon,
  CodeIcon,
  HighlightIcon,
  LinkIcon,
} from '../lib/icons'

interface BubbleToolbarProps {
  editor: Editor | null
}

/**
 * A floating formatting menu that appears above the current text selection —
 * the quick inline actions, without travelling to the top toolbar.
 */
export default function BubbleToolbar({ editor }: BubbleToolbarProps) {
  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 120, maxWidth: 'none' }}
      // Don't pop up over empty selections, code blocks, or images.
      shouldShow={({ editor: e, from, to }) =>
        from !== to && !e.isActive('codeBlock')
      }
    >
      <div className="bubble" role="toolbar" aria-label="Selection formatting">
        <button
          type="button"
          className={`bubble__btn${editor.isActive('bold') ? ' bubble__btn--active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          aria-label="Bold"
        >
          <BoldIcon />
        </button>
        <button
          type="button"
          className={`bubble__btn${editor.isActive('italic') ? ' bubble__btn--active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          aria-label="Italic"
        >
          <ItalicIcon />
        </button>
        <button
          type="button"
          className={`bubble__btn${editor.isActive('underline') ? ' bubble__btn--active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
          aria-label="Underline"
        >
          <UnderlineIcon />
        </button>
        <button
          type="button"
          className={`bubble__btn${editor.isActive('strike') ? ' bubble__btn--active' : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          aria-label="Strikethrough"
        >
          <StrikeIcon />
        </button>
        <button
          type="button"
          className={`bubble__btn${editor.isActive('highlight') ? ' bubble__btn--active' : ''}`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
          aria-label="Highlight"
        >
          <HighlightIcon />
        </button>
        <button
          type="button"
          className={`bubble__btn${editor.isActive('code') ? ' bubble__btn--active' : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline code"
          aria-label="Inline code"
        >
          <CodeIcon />
        </button>
        <span className="bubble__divider" aria-hidden />
        <button
          type="button"
          className={`bubble__btn${editor.isActive('link') ? ' bubble__btn--active' : ''}`}
          onClick={() => promptForLink(editor)}
          title="Link"
          aria-label="Link"
        >
          <LinkIcon />
        </button>
      </div>
    </BubbleMenu>
  )
}
