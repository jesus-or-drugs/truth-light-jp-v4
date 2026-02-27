// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/sitemap', '@nuxt/content'],
  css: ["~/assets/css/tailwind.css"],

  site: {
    url: 'https://www.truth-light.jp', // ←本番ドメイン
    name: 'Truth Light',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  content: {
    documentDriven: true,
    contentHead: true,
  },

  nitro: {
    routeRules: {
      // ketcher配下だけ、iframe許可（同一オリジン前提）
      "/ketcher/**": {
        headers: {
          // CSPでframe-ancestorsを self に（これが一番効くことが多い）
          "Content-Security-Policy": "frame-ancestors 'self';",
          // もしどこかで DENY を付けてたら上書き（SAMEORIGINなら親が同一オリジンでOK）
          "X-Frame-Options": "SAMEORIGIN",
        },
      },
    },
  },
})