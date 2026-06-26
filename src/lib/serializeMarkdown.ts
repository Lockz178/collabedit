/**
 * A compact Markdown serializer for the editor's ProseMirror/Tiptap JSON.
 *
 * Tiptap doesn't ship a Markdown serializer, so we walk the document tree
 * ourselves. It covers every node and mark this editor can produce; anything
 * unrecognized falls back to its plain text so export never throws.
 */

interface JSONMark {
  type: string
  attrs?: Record<string, unknown>
}

interface JSONNode {
  type?: string
  attrs?: Record<string, unknown>
  content?: JSONNode[]
  marks?: JSONMark[]
  text?: string
}

/** Wrap inline text with the markdown syntax for each active mark. */
function applyMarks(text: string, marks: JSONMark[] = []): string {
  let out = text
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        out = `**${out}**`
        break
      case 'italic':
        out = `*${out}*`
        break
      case 'strike':
        out = `~~${out}~~`
        break
      case 'code':
        out = `\`${out}\``
        break
      case 'underline':
        out = `<u>${out}</u>`
        break
      case 'highlight':
        out = `==${out}==`
        break
      case 'link': {
        const href = (mark.attrs?.href as string) ?? ''
        out = `[${out}](${href})`
        break
      }
    }
  }
  return out
}

/** Serialize an array of inline nodes (text + hardBreaks) to a single line. */
function inline(nodes: JSONNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === 'hardBreak') return '  \n'
      if (node.type === 'text') return applyMarks(node.text ?? '', node.marks)
      return inline(node.content)
    })
    .join('')
}

function listItems(node: JSONNode, ordered: boolean, depth: number): string {
  const indent = '  '.repeat(depth)
  return (node.content ?? [])
    .map((item, i) => {
      const marker = ordered ? `${i + 1}.` : '-'
      const body = (item.content ?? [])
        .map((child) => block(child, depth + 1).trimEnd())
        .join('\n')
      // Indent continuation lines so nested blocks stay under the bullet.
      const lines = body.split('\n')
      const [first, ...rest] = lines
      const restIndented = rest.map((l) => (l ? `${indent}  ${l}` : l)).join('\n')
      return `${indent}${marker} ${first}${restIndented ? '\n' + restIndented : ''}`
    })
    .join('\n')
}

function taskItems(node: JSONNode, depth: number): string {
  const indent = '  '.repeat(depth)
  return (node.content ?? [])
    .map((item) => {
      const checked = item.attrs?.checked ? 'x' : ' '
      const body = (item.content ?? []).map((c) => inline(c.content)).join(' ')
      return `${indent}- [${checked}] ${body}`
    })
    .join('\n')
}

function block(node: JSONNode, depth = 0): string {
  switch (node.type) {
    case 'paragraph':
      return inline(node.content) + '\n'
    case 'heading': {
      const level = (node.attrs?.level as number) ?? 1
      return `${'#'.repeat(level)} ${inline(node.content)}\n`
    }
    case 'bulletList':
      return listItems(node, false, depth) + '\n'
    case 'orderedList':
      return listItems(node, true, depth) + '\n'
    case 'taskList':
      return taskItems(node, depth) + '\n'
    case 'blockquote':
      return (
        (node.content ?? [])
          .map((c) => block(c, depth).trimEnd())
          .join('\n')
          .split('\n')
          .map((l) => `> ${l}`)
          .join('\n') + '\n'
      )
    case 'codeBlock': {
      const lang = (node.attrs?.language as string) ?? ''
      const code = (node.content ?? []).map((c) => c.text ?? '').join('')
      return `\`\`\`${lang}\n${code}\n\`\`\`\n`
    }
    case 'horizontalRule':
      return '---\n'
    default:
      return inline(node.content) + '\n'
  }
}

/** Convert a full editor document (getJSON) plus an optional title to Markdown. */
export function docToMarkdown(doc: JSONNode, title?: string): string {
  const body = (doc.content ?? [])
    .map((node) => block(node))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  const heading = title?.trim() ? `# ${title.trim()}\n\n` : ''
  return `${heading}${body}\n`
}
