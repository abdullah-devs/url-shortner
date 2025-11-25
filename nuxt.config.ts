// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@': '/',
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/ui', '@nuxt/eslint', '@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'Outfit' }
    ]
  },
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    turso: {
      databaseUrl: "",
      authToken: "",
    },
      jwtSecret: ""
  },
})