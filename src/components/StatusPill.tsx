import type { ConnectionStatus } from '../collab/useCollaboration'

const LABELS: Record<ConnectionStatus, string> = {
  connected: 'Live',
  connecting: 'Waiting for peers',
  offline: 'Offline',
}

export default function StatusPill({ status }: { status: ConnectionStatus }) {
  return (
    <span
      className={`status-pill status-pill--${status}`}
      title={
        status === 'connected'
          ? 'Connected peer-to-peer with other editors'
          : status === 'offline'
            ? 'No network — edits are saved locally and will sync when you reconnect'
            : 'Waiting for another peer to join this room'
      }
    >
      <span className="status-pill__dot" />
      {LABELS[status]}
    </span>
  )
}
