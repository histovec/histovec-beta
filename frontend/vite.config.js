import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// Seules les variables VITE_* seront exposées (via un .env)
// Accessibles via import.meta.env.VITE_*

export default defineConfig({
  base: `/${process.env.VITE_TITLE}/`,
  server: {
    port: process.env.VITE_PORT,
    host: '0.0.0.0', // Très important si vite tourne dans un docker
    proxy: {
      [`^/${process.env.VITE_TITLE}/api/v1/`]: {
        target: `http://localhost:${process.env.API_PORT}`,
        changeOrigin: true
      },
    },
  },
  build: {
    sourcemap: process.env.VITE_SOURCE_MAP === 'true' ? true : 'hidden',
  },
  plugins: [
    createVuePlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
