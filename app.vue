<template>
  <div class="relative bg-[#EAEFEF] text-[#25343F] custom-font-normal">
    <LayoutHeader />

    <main class="min-h-[100dvh]">
      <NuxtPage :key="route.fullPath" />
    </main>

    <LayoutFooter />

    <ChatbotFloatingIcon />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const siteName = appConfig.truthlight?.site?.name ?? ``
const topPageName = appConfig.truthlight?.site?.topPageName ?? ``

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${siteName}` : topPageName
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/icon/favicon.ico' },
    { rel: `preconnect`, href: `https://fonts.googleapis.com`},
    { rel: `preconnect`, href: `https://fonts.gstatic.com`, crossorigin:`anonymous`},
    { rel: `stylesheet`, href: `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Outfit:wght@100..900&display=swap`}
  ],
})
</script>
