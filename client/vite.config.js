import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config: React plugin for JSX, Tailwind plugin for styling.
// We don't use a dev proxy here - axiosClient.js points directly at
// the API URL from our .env file, whether that's localhost or Render.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
