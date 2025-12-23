<template>
  <header class="bg-background/80 bg-slate-900 sticky top-0 z-40 backdrop-blur-lg border-b-4 border-teal-400">
    <div
      class="relative flex flex-row h-20 justify-between items-center gap-2 px-4 md:px-20"
      :class="{
        'container': appConfig.truthlight.main.padded,
      }"
    >
      <LayoutHeaderLogo />
      <LayoutHeaderNav />
      <LayoutHeaderToc />
    </div>
  </header>
</template>

<script setup lang="ts">

const appConfig = useAppConfig();

const route = useRoute();
const baseRouteName = computed(() => useRouteBaseName()(route));
</script>
