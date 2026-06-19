import { type Editor } from '@tiptap/react'
import { useCallback } from 'react'
import {
  BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon, CodeIcon,
  H1Icon, H2Icon, H3Icon, BulletListIcon, OrderedListIcon, TaskListIcon,
  QuoteIcon, CodeBlockIcon, LinkIcon, DividerIcon, UndoIcon, RedoIcon,
} from '../lib/icons'

interface ToolbarProps {
  editor: Editor | null
}

interface BtnProps {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function TBtn({ onClick, active, disabled, title, children }: BtnProps) {
  return (
    <button
      type="button"
      className={`tbtn${active ? ' tbtn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

const Divider = () => <span className="toolbar__divider" aria-hidden />

export default function Toolbar({ editor }: ToolbarProps) {
  const setLink = useCallback(() => {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return <div className="toolbar" aria-hidden />
  }

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <div className="toolbar__group">
        <TBtn
          title="Undo (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <UndoIcon />
        </TBtn>
        <TBtn
          title="Redo (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <RedoIcon />
        </TBtn>
      </div>

      <Divider />

      <div className="toolbar__group">
        <TBtn
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <H1Icon />
        </TBtn>
        <TBtn
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <H2Icon />
        </TBtn>
        <TBtn
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <H3Icon />
        </TBtn>
      </div>

      <Divider />

      <div className="toolbar__group">
        <TBtn
          title="Bold (Ctrl+B)"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </TBtn>
        <TBtn
          title="Italic (Ctrl+I)"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </TBtn>
        <TBtn
          title="Underline (Ctrl+U)"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </TBtn>
        <TBtn
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikeIcon />
        </TBtn>
        <TBtn
          title="Inline code"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon />
        </TBtn>
      </div>

      <Divider />

      <div className="toolbar__group">
        <TBtn
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletListIcon />
        </TBtn>
        <TBtn
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <OrderedListIcon />
        </TBtn>
        <TBtn
          title="Task list"
          active={editor.isActive('taskList')}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <TaskListIcon />
        </TBtn>
      </div>

      <Divider />

      <div className="toolbar__group">
        <TBtn
          title="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </TBtn>
        <TBtn
          title="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeBlockIcon />
        </TBtn>
        <TBtn title="Link" active={editor.isActive('link')} onClick={setLink}>
          <LinkIcon />
        </TBtn>
        <TBtn
          title="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <DividerIcon />
        </TBtn>
      </div>
    </div>
  )
}
