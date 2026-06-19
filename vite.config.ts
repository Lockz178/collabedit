import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // The editor vendor chunk (Tiptap + ProseMirror + Yjs) is inherently
    // ~700 kB; that's expected for a full collaborative rich-text engine.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Keep the interdependent editor + CRDT stack (Tiptap, ProseMirror,
        // Yjs and providers all reference each other) in a single cacheable
        // vendor chunk, separate from the small app shell. Splitting them
        // further produces circular chunks with unsafe init order.
        manualChunks(id) {
          if (
            /node_modules\/(yjs|y-webrtc|y-indexeddb|y-protocols|y-prosemirror|lib0|@tiptap|prosemirror-)/.test(
              id,
            )
          ) {
            return 'editor'
          }
        },
      },
    },
  },
})
