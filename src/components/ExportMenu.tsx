import { type Editor } from '@tiptap/react'
import type * as Y from 'yjs'
import { usePopover } from '../lib/usePopover'
import { docToMarkdown } from '../lib/serializeMarkdown'
import {
  DownloadIcon,
  MarkdownIcon,
  CodeBracketsIcon,
  FileTextIcon,
  CopyIcon,
} from '../lib/icons'

interface ExportMenuProps {
  editor: Editor | null
  ydoc: Y.Doc
  roomId: string
  onExported: (message: string) => void
}

function docTitle(ydoc: Y.Doc): string {
  return ((ydoc.getMap('meta').get('title') as string) ?? '').trim()
}

function slug(title: string, roomId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `collabedit-${roomId}`
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function htmlDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title || 'Untitled document'}</title>
</head>
<body>
${title ? `<h1>${title}</h1>\n` : ''}${body}
</body>
</html>
`
}

export default function ExportMenu({ editor, ydoc, roomId, onExported }: ExportMenuProps) {
  const { open, setOpen, anchorRef, toggle } = usePopover()

  const run = (action: () => void) => {
    action()
    setOpen(false)
  }

  const copyMarkdown = async () => {
    if (!editor) return
    const md = docToMarkdown(editor.getJSON(), docTitle(ydoc))
    try {
      await navigator.clipboard.writeText(md)
    } catch {
      /* clipboard may be unavailable; the download options still work */
    }
    onExported('Markdown copied to clipboard')
  }

  const exportMarkdown = () => {
    if (!editor) return
    const title = docTitle(ydoc)
    download(`${slug(title, roomId)}.md`, docToMarkdown(editor.getJSON(), title), 'text/markdown')
    onExported('Downloaded Markdown')
  }

  const exportHtml = () => {
    if (!editor) return
    const title = docTitle(ydoc)
    download(`${slug(title, roomId)}.html`, htmlDocument(title, editor.getHTML()), 'text/html')
    onExported('Downloaded HTML')
  }

  const exportText = () => {
    if (!editor) return
    const title = docTitle(ydoc)
    const body = editor.getText()
    download(`${slug(title, roomId)}.txt`, title ? `${title}\n\n${body}` : body, 'text/plain')
    onExported('Downloaded plain text')
  }

  return (
    <div className="popover-anchor" ref={anchorRef}>
      <button
        type="button"
        className="btn btn--icon"
        onClick={toggle}
        title="Export document"
        aria-label="Export document"
        aria-expanded={open}
        disabled={!editor}
      >
        <DownloadIcon />
      </button>

      {open && (
        <div className="popover popover--menu" role="menu" aria-label="Export options">
          <p className="popover__title">Export document</p>
          <button type="button" className="menu-item" role="menuitem" onClick={() => run(copyMarkdown)}>
            <CopyIcon />
            <span className="menu-item__text">
              Copy as Markdown
              <span className="menu-item__hint">Paste anywhere</span>
            </span>
          </button>
          <button type="button" className="menu-item" role="menuitem" onClick={() => run(exportMarkdown)}>
            <MarkdownIcon />
            <span className="menu-item__text">
              Download <code>.md</code>
              <span className="menu-item__hint">Markdown file</span>
            </span>
          </button>
          <button type="button" className="menu-item" role="menuitem" onClick={() => run(exportHtml)}>
            <CodeBracketsIcon />
            <span className="menu-item__text">
              Download <code>.html</code>
              <span className="menu-item__hint">Styled HTML</span>
            </span>
          </button>
          <button type="button" className="menu-item" role="menuitem" onClick={() => run(exportText)}>
            <FileTextIcon />
            <span className="menu-item__text">
              Download <code>.txt</code>
              <span className="menu-item__hint">Plain text</span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
