import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'],
  server: {
    proxy: {
      // GST proxy (real API keys on server): run `npm run gst-proxy` in another terminal
      '/api/gst': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true
      }
    }
  }
})
