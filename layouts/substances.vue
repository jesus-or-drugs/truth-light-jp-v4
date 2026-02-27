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
  // const appConfig = useAppConfig()
  // const site = appConfig.truthlight.site


</script>