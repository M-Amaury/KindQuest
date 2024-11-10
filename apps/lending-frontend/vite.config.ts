import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
      stream: 'stream-browserify',
      events: 'events',
      assert: 'assert',
    },
  },
  define: {
    'process.env': {},
    global: {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['buffer', 'process', 'util', 'stream', 'events', 'assert'],
    },
  }
})
