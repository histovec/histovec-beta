import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

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
    svgLoader(
    {
      defaultImport: 'component',
      multipass: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@Api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@Assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@Components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@Constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@Utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@Views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@Stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@Services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
})
