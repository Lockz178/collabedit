/**
 * Lightweight inline SVG icon set (stroke-based, 24x24 viewbox).
 * Inlining avoids an icon-library dependency and keeps the bundle tiny.
 */
import type { SVGProps } from 'react'

type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element

const base = (
  children: React.ReactNode,
): Icon => {
  return (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export const BoldIcon = base(
  <path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" />,
)
export const ItalicIcon = base(
  <>
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </>,
)
export const UnderlineIcon = base(
  <>
    <path d="M6 3v7a6 6 0 0 0 12 0V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </>,
)
export const StrikeIcon = base(
  <>
    <line x1="4" y1="12" x2="20" y2="12" />
    <path d="M16 6.5C16 5 14.5 4 12 4 9 4 7.5 5.5 7.5 7.2c0 1.3.8 2.2 2.5 2.8" />
    <path d="M8.5 16c.4 2 2 3 4 3 2.8 0 4.2-1.4 4.2-3" />
  </>,
)
export const CodeIcon = base(
  <>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </>,
)
export const H1Icon = base(
  <>
    <path d="M4 6v12M12 6v12M4 12h8" />
    <path d="M17 10l3-1.5V18" />
  </>,
)
export const H2Icon = base(
  <>
    <path d="M4 6v12M11 6v12M4 12h7" />
    <path d="M16 9a2 2 0 1 1 3.7 1c-.5 1-3.7 3-3.7 5h4" />
  </>,
)
export const H3Icon = base(
  <>
    <path d="M4 6v12M11 6v12M4 12h7" />
    <path d="M16 8.5A1.8 1.8 0 1 1 18 11a1.8 1.8 0 1 1-2 2.5" />
  </>,
)
export const BulletListIcon = base(
  <>
    <line x1="9" y1="6" x2="20" y2="6" />
    <line x1="9" y1="12" x2="20" y2="12" />
    <line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4.5" cy="6" r="1.3" fill="currentColor" />
    <circle cx="4.5" cy="12" r="1.3" fill="currentColor" />
    <circle cx="4.5" cy="18" r="1.3" fill="currentColor" />
  </>,
)
export const OrderedListIcon = base(
  <>
    <line x1="10" y1="6" x2="20" y2="6" />
    <line x1="10" y1="12" x2="20" y2="12" />
    <line x1="10" y1="18" x2="20" y2="18" />
    <path d="M4 5l1-.5V9M3.5 9h2.5" strokeWidth={1.6} />
    <path d="M3.5 14.5c0-1 2-1 2 0s-2 1.2-2 2.5h2" strokeWidth={1.6} />
  </>,
)
export const TaskListIcon = base(
  <>
    <rect x="3" y="5" width="6" height="6" rx="1.5" />
    <path d="M4.5 8l1.2 1.2L8 7" strokeWidth={1.6} />
    <rect x="3" y="14" width="6" height="6" rx="1.5" />
    <line x1="12" y1="8" x2="20" y2="8" />
    <line x1="12" y1="17" x2="20" y2="17" />
  </>,
)
export const QuoteIcon = base(
  <path d="M7 7H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a2 2 0 0 1-2 2H4M17 7h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a2 2 0 0 1-2 2h0" />,
)
export const CodeBlockIcon = base(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <polyline points="9 9 7 12 9 15" strokeWidth={1.6} />
    <polyline points="15 9 17 12 15 15" strokeWidth={1.6} />
  </>,
)
export const LinkIcon = base(
  <>
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
  </>,
)
export const DividerIcon = base(<line x1="4" y1="12" x2="20" y2="12" />)
export const UndoIcon = base(
  <>
    <path d="M3 7v6h6" />
    <path d="M3 13a9 9 0 1 0 3-7L3 9" />
  </>,
)
export const RedoIcon = base(
  <>
    <path d="M21 7v6h-6" />
    <path d="M21 13a9 9 0 1 1-3-7l3 3" />
  </>,
)
export const ShareIcon = base(
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" />
    <line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
  </>,
)
export const SunIcon = base(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
)
export const MoonIcon = base(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />)
export const CopyIcon = base(
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
)
export const CheckIcon = base(<polyline points="20 6 9 17 4 12" />)
export const UserIcon = base(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </>,
)
export const PlusIcon = base(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>,
)
