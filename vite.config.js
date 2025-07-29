import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server URL
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  // This ensures that the /api path is correctly handled in production as well
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // This helps with client-side routing in production
  base: '/',
})
