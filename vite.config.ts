import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vike(), tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
