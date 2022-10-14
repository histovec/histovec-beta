import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import vue from '@vitejs/plugin-vue'

dotenv.config()

// Seules les variables VITE_* seront exposées (via un .env)
// Accessibles via import.meta.env.VITE_*
export default defineConfig({
  base: `/${process.env.VITE_TITLE}/`,
  server: {
    port: process.env.VITE_PORT,
    host: '0.0.0.0', // Très important si vite tourne dans un docker
    proxy: {
      [`^/${process.env.VITE_TITLE}/api/v1/`]: {
        target: `http://localhost:${process.env.BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: process.env.VITE_SOURCE_MAP === 'true' ? true : 'hidden',
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
