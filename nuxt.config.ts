export default defineNuxtConfig({
  site: {
    url: 'https://www.truth-light.jp',
    name: 'Truth Light',
    description: 'Truth Lightは「日本版Erowid」を目指し、薬物に対する正しい情報と依存症からの回復の道を提供します。',
    defaultLocale: 'ja',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/icon/favicon.ico' },
      ],
      script: process.env.NODE_ENV === 'production'
        ? [
            {
              src: 'https://www.googletagmanager.com/gtag/js?id=G-2W5X248N5S',
              async: true
            },
            {
              innerHTML: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-2W5X248N5S');
              `
            }
        ]
        : [],
    },
  },
  css: [
    '~/assets/css/tailwind.css',
  ],
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  fonts: {
    families: [
      {
        name: 'Noto Sans JP',
        provider: 'google',
        weights: [400, 700, 900],
        styles: ['normal'],
      },
    ],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },  
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxt/content'
  ],
  nitro: {
    routeRules: {
      "/ketcher/**": {
        headers: {
          "Content-Security-Policy": "frame-ancestors 'self';",
          "X-Frame-Options": "SAMEORIGIN",
        },
      },
    },
  },
  runtimeConfig: {
    openaiApiKey: '',
    public: {
      maintenanceMode: false,
    },
  },
  experimental: {
    appManifest: false,
  },
})