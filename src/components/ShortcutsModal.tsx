import { useEffect } from 'react'
import { CloseIcon } from '../lib/icons'

interface ShortcutsModalProps {
  open: boolean
  onClose: () => void
}

const GROUPS: { title: string; items: [string[], string][] }[] = [
  {
    title: 'Formatting',
    items: [
      [['Ctrl', 'B'], 'Bold'],
      [['Ctrl', 'I'], 'Italic'],
      [['Ctrl', 'U'], 'Underline'],
      [['Ctrl', 'Shift', 'S'], 'Strikethrough'],
      [['Ctrl', 'E'], 'Inline code'],
      [['Ctrl', 'K'], 'Add link'],
    ],
  },
  {
    title: 'Blocks',
    items: [
      [['Ctrl', 'Alt', '1'], 'Heading 1'],
      [['Ctrl', 'Alt', '2'], 'Heading 2'],
      [['Ctrl', 'Alt', '3'], 'Heading 3'],
      [['Ctrl', 'Shift', '7'], 'Numbered list'],
      [['Ctrl', 'Shift', '8'], 'Bullet list'],
      [['Ctrl', 'Shift', 'B'], 'Quote'],
    ],
  },
  {
    title: 'History',
    items: [
      [['Ctrl', 'Z'], 'Undo'],
      [['Ctrl', 'Y'], 'Redo'],
    ],
  },
  {
    title: 'Markdown shortcuts',
    items: [
      [['#', '␣'], 'Heading'],
      [['-', '␣'], 'Bullet list'],
      [['1.', '␣'], 'Numbered list'],
      [['>', '␣'], 'Quote'],
      [['```'], 'Code block'],
    ],
  },
]

export default function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">Keyboard shortcuts</h2>
          <button
            type="button"
            className="btn btn--icon btn--ghost"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="modal__body shortcuts-grid">
          {GROUPS.map((group) => (
            <section key={group.title} className="shortcuts-group">
              <h3 className="shortcuts-group__title">{group.title}</h3>
              <ul className="shortcuts-list">
                {group.items.map(([keys, label]) => (
                  <li key={label} className="shortcuts-row">
                    <span className="shortcuts-row__label">{label}</span>
                    <span className="shortcuts-row__keys">
                      {keys.map((k, i) => (
                        <kbd key={i} className="kbd">
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="modal__footer">
          On macOS use <kbd className="kbd">⌘</kbd> in place of <kbd className="kbd">Ctrl</kbd>.
        </p>
      </div>
    </div>
  )
}
