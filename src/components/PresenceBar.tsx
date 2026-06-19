import type { PeerPresence } from '../collab/useCollaboration'

interface PresenceBarProps {
  peers: PeerPresence[]
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const MAX_VISIBLE = 5

export default function PresenceBar({ peers }: PresenceBarProps) {
  const visible = peers.slice(0, MAX_VISIBLE)
  const overflow = peers.length - visible.length

  return (
    <div className="presence" aria-label={`${peers.length} people here`}>
      <div className="presence__list">
        {visible.map((peer) => (
          <div
            key={peer.clientId}
            className="presence__avatar"
            style={{ background: peer.color }}
          >
            {initials(peer.name)}
            <span className="presence__tooltip">
              {peer.name}
              {peer.isSelf ? ' (you)' : ''}
            </span>
          </div>
        ))}
        {overflow > 0 && (
          <div className="presence__avatar presence__avatar--more">
            +{overflow}
          </div>
        )}
      </div>
      <span className="presence__count">
        {peers.length === 1 ? 'Just you' : `${peers.length} editing`}
      </span>
    </div>
  )
}
