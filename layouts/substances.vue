<template>
  <div class="min-h-[100dvh] flex flex-col">
    <LayoutHeader variant="substances" class="shrink-0" />

    <!-- ここがキモ：高さ固定しない、スクロールを許可 -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <LayoutFooter variant="substances" class="shrink-0" />
  </div>
</template>

<script setup lang="ts">
  const appConfig = useAppConfig()
  const site = appConfig.truthlight.site

  useHead({
    title: `NPSデータベース(α版) - ${site.name}`,
    link: [
      { rel: `preconnect`, href: `https://fonts.googleapis.com`},
      { rel: `preconnect`, href: `https://fonts.gstatic.com`, crossorigin:`anonymous`},
      { rel: `stylesheet`, href: `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Outfit:wght@100..900&display=swap`}
    ],
  })

</script>