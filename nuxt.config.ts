export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
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
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxt/content'
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  site: {
    url: 'https://www.truth-light.jp',
    name: 'Truth Light',
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
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