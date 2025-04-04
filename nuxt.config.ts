// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: { head: { title: 'Revite' } },
  compatibilityDate: '2025-04-03',
  css: ['./app/app.css'],
  devtools: { enabled: false },
  fonts: { provider: 'local' },
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@pinia/nuxt'],
})
