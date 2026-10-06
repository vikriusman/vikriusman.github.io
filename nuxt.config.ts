import yaml from '@rollup/plugin-yaml';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' }
      ],
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Vikri Usman Rizky' },
        { property: 'og:image', content: 'https://vikriusman.github.io/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Vikri Usman Rizky, DevOps & Cloud Engineer' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://vikriusman.github.io/og-image.png' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Vikri Usman Rizky',
            jobTitle: 'DevOps & Cloud Engineer',
            description: 'Freelance DevOps and cloud engineer specializing in cloud infrastructure, CI/CD automation, and system reliability.',
            url: 'https://vikriusman.github.io',
            sameAs: [
              'https://github.com/vikriusman',
              'https://www.linkedin.com/in/vikri-usman-rizky'
            ],
            knowsAbout: ['DevOps', 'CI/CD', 'Kubernetes', 'Google Cloud Platform', 'Microsoft Azure', 'Cloud Infrastructure', 'Site Reliability']
          })
        },
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-TSV3VPZHT9',
          async: true
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TSV3VPZHT9');`
        }
      ]
    }
  },

  vite: {
    plugins: [yaml()]
  },

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
    '@nuxt/ui'
  ],
  css: ['~/assets/css/styles.css'],
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