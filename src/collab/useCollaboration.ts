/**
 * The collaboration engine.
 *
 * This hook owns the lifecycle of a single shared document:
 *   - a Yjs document (the CRDT that merges every peer's edits conflict-free)
 *   - a WebRTC provider (peer-to-peer transport; browsers talk directly)
 *   - an IndexedDB provider (local persistence → offline editing + instant load)
 *   - awareness (ephemeral presence: who's here, names, colors, cursors)
 *
 * Nothing here is server-backed. The only server involved is a tiny public
 * "signaling" server whose sole job is to introduce peers to each other; once
 * connected, document data flows directly between browsers.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'
import type { Awareness } from 'y-protocols/awareness'
import type { Identity } from './identity'

/** Public signaling servers. They only broker WebRTC handshakes — they never
 * see your document content. Multiple are listed for redundancy. */
const SIGNALING_SERVERS = [
  'wss://signaling.yjs.dev',
  'wss://y-webrtc-signaling-eu.herokuapp.com',
  'wss://y-webrtc-signaling-us.herokuapp.com',
]

export interface PeerPresence {
  clientId: number
  name: string
  color: string
  isSelf: boolean
}

export type ConnectionStatus = 'connecting' | 'connected' | 'offline'

export interface Collaboration {
  ydoc: Y.Doc
  provider: WebrtcProvider | null
  awareness: Awareness | null
  peers: PeerPresence[]
  status: ConnectionStatus
  /** True once the local IndexedDB cache has been read into the doc. */
  synced: boolean
}

export function useCollaboration(roomId: string, identity: Identity): Collaboration {
  // One Y.Doc per room id, stable across re-renders.
  const ydoc = useMemo(() => new Y.Doc(), [roomId])

  const [provider, setProvider] = useState<WebrtcProvider | null>(null)
  const [awareness, setAwareness] = useState<Awareness | null>(null)
  const [peers, setPeers] = useState<PeerPresence[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [synced, setSynced] = useState(false)

  // Keep the latest identity available to effects without re-running them.
  const identityRef = useRef(identity)
  identityRef.current = identity

  useEffect(() => {
    let cancelled = false

    // Local-first persistence: load any cached version of this doc immediately.
    const persistence = new IndexeddbPersistence(`collabedit-${roomId}`, ydoc)
    persistence.once('synced', () => {
      if (!cancelled) setSynced(true)
    })

    // Peer-to-peer transport.
    const webrtc = new WebrtcProvider(`collabedit-${roomId}`, ydoc, {
      signaling: SIGNALING_SERVERS,
    })

    const aw = webrtc.awareness

    // Publish our identity to the room.
    aw.setLocalStateField('user', {
      name: identityRef.current.name,
      color: identityRef.current.color,
    })

    const computePeers = () => {
      const states = aw.getStates()
      const list: PeerPresence[] = []
      states.forEach((state, clientId) => {
        const user = (state as { user?: { name: string; color: string } }).user
        if (!user) return
        list.push({
          clientId,
          name: user.name,
          color: user.color,
          isSelf: clientId === aw.clientID,
        })
      })
      // Self first, then by clientId for stable ordering.
      list.sort((a, b) => {
        if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1
        return a.clientId - b.clientId
      })
      setPeers(list)
    }

    const updateStatus = () => {
      // "connected" means at least one other peer is in the room.
      const others = aw.getStates().size - 1
      if (!navigator.onLine) {
        setStatus('offline')
      } else if (others > 0) {
        setStatus('connected')
      } else {
        setStatus('connecting')
      }
    }

    aw.on('change', computePeers)
    aw.on('change', updateStatus)
    webrtc.on('peers', updateStatus)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    computePeers()
    updateStatus()

    setProvider(webrtc)
    setAwareness(aw)

    return () => {
      cancelled = true
      aw.off('change', computePeers)
      aw.off('change', updateStatus)
      webrtc.off('peers', updateStatus)
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
      webrtc.destroy()
      persistence.destroy()
      ydoc.destroy()
    }
  }, [roomId, ydoc])

  // Push identity changes (name / color edits) to awareness live.
  useEffect(() => {
    if (!awareness) return
    awareness.setLocalStateField('user', {
      name: identity.name,
      color: identity.color,
    })
  }, [awareness, identity.name, identity.color])

  return { ydoc, provider, awareness, peers, status, synced }
}
