import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build works from any folder (GitHub Pages, Netlify, a USB stick)
export default defineConfig({
  plugins: [react()],
  base: './',
})
