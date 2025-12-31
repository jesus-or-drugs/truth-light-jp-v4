<template>
  <LayoutHeader />
  <div class="min-h-screen">
    <slot />
  </div>
  <LayoutFooter />
</template>

<script setup lang="ts">
  const appConfig = useAppConfig()
</script>