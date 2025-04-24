import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@testing-library/jest-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      external: ['@testing-library/jest-dom'],
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: ["cred-ability.local", "localhost", "192.168.1.115"],
  }
})
