import { type Editor } from '@tiptap/react'

/**
 * Prompt for a URL and apply (or clear) a link on the current selection.
 * Shared by the main toolbar and the floating bubble toolbar.
 */
export function promptForLink(editor: Editor | null): void {
  if (!editor) return
  const previous = editor.getAttributes('link').href as string | undefined
  const url = window.prompt('Link URL', previous ?? 'https://')
  if (url === null) return
  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
