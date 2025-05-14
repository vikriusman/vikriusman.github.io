// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui'
  ],
  css: [ '~/assets/css/styles.css'],
  ui: {
    theme: {
      colors: [
        'indigo',
        'zinc',
      ]
    }
  },

  font: {
    provider: 'local',
    families: {
      MyFont: {
        sources: [
          
          { src: '/fonts/NaturalMono-Regular.ttf', type: 'font/ttf' }
        ],
        weight: '400',
        style: 'normal'
      }
    }
  }
})