// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  nitro: {
    preset: 'static',
    output: {
      dir: '.output',
      publicDir: '.output'
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/content'
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
          
          { src: '/fonts/NaturalMono-Regular.ttf', type: 'font/ttf' },
          { src: '/fonts/CONSOLA.TTF', type: 'font/ttf' }
        ],
        weight: '400',
        style: 'normal'
      }
    }
  }
})