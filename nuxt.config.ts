// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['./app/app.css'],
  compatibilityDate: '2025-04-03',
  devtools: { enabled: false },
  fonts: { provider: 'local' },
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@pinia/nuxt'],
})
