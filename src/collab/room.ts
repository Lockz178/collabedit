/**
 * Room resolution. The room id lives in the URL hash (e.g. #room=abc123) so a
 * room is shareable simply by copying the link — no server-side routing needed.
 * If no room is present we mint a short random id and write it back to the hash.
 */

const PREFIX = 'room='

/** URL-safe short id, ~7 chars. Collision risk is negligible for a demo. */
function generateRoomId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function resolveRoomId(): string {
  const hash = window.location.hash.replace(/^#/, '')
  const params = new URLSearchParams(hash)
  const existing = params.get('room')
  if (existing && /^[a-z0-9]{4,}$/i.test(existing)) {
    return existing
  }
  const fresh = generateRoomId()
  params.set('room', fresh)
  window.location.hash = params.toString()
  return fresh
}

export function roomShareUrl(roomId: string): string {
  const url = new URL(window.location.href)
  url.hash = `${PREFIX}${roomId}`
  return url.toString()
}
