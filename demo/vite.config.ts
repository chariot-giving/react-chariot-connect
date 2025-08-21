import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      // Force Vite to use the freshly built local ESM output of the package
      'react-chariot-connect': resolve(fileURLToPath(new URL('../dist/esm/index.js', import.meta.url))),
    },
  },
  optimizeDeps: {
    exclude: ['react-chariot-connect'],
  },
})


