<template>
  <div class="bg-slate-800 text-white">
    <LayoutHeader />
    <div class="min-h-screen">
      <slot />
    </div>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
  const appConfig = useAppConfig()
  const site = appConfig.truthlight.site

  useHead({
    title: `${site.name} - ${site.description}`
  })
</script>