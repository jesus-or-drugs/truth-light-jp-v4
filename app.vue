<template>
  <div class="relative bg-[#EAEFEF] text-[#25343F] custom-font-normal">
    <LayoutHeader />

    <main class="min-h-[calc(100dvh-4rem)]">
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
})
</script>
