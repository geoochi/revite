import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: { outDir: 'dist' },
  resolve: { alias: { '@': '/src' } },
  plugins: [
    tailwindcss(),
    Vue({ include: [/\.vue$/] }),
    Pages({ extensions: ['vue'] }),
    Components({ extensions: ['vue'], include: [/\.vue$/] }),
  ],
})
