<template>
  <div
  class="h-[100dvh] flex flex-col overflow-hidden">
    <LayoutHeader variant="substances" />

    <main class="flex-1 min-h-0 overflow-hidden">
      <slot />
    </main>
    
    <LayoutFooter variant="substances" />
  </div>
</template>

<script setup lang="ts">
  const appConfig = useAppConfig()
</script>