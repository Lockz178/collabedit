/**
 * Local user identity — the name and color that other peers see attached to
 * your cursor and presence avatar. Persisted to localStorage so you keep the
 * same identity across reloads.
 */

const STORAGE_KEY = 'collabedit:identity'

export interface Identity {
  name: string
  color: string
}

/** A curated palette of distinct, legible cursor colors. */
export const USER_COLORS = [
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // amber
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
] as const

const ADJECTIVES = [
  'Swift', 'Bright', 'Calm', 'Bold', 'Lucid', 'Keen', 'Brave', 'Quiet',
  'Witty', 'Clever', 'Mellow', 'Nimble', 'Sunny', 'Cosmic', 'Gentle',
]

const ANIMALS = [
  'Otter', 'Falcon', 'Fox', 'Heron', 'Lynx', 'Panda', 'Koala', 'Raven',
  'Tiger', 'Dolphin', 'Wolf', 'Badger', 'Sparrow', 'Bison', 'Gecko',
]

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Generate a friendly random display name like "Swift Otter". */
export function randomName(): string {
  return `${pick(ADJECTIVES)} ${pick(ANIMALS)}`
}

export function randomColor(): string {
  return pick(USER_COLORS)
}

export function loadIdentity(): Identity {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Identity>
      if (parsed.name && parsed.color) {
        return { name: parsed.name, color: parsed.color }
      }
    }
  } catch {
    // ignore malformed storage
  }
  const fresh: Identity = { name: randomName(), color: randomColor() }
  saveIdentity(fresh)
  return fresh
}

export function saveIdentity(identity: Identity): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
  } catch {
    // ignore quota / private-mode errors
  }
}
