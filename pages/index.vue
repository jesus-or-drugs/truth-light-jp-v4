<template>
  <div class="prose">
    <h1>テストメッセージ</h1>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

useSeoMeta({
  title: `${appConfig.truthlight.site.name ?? '404'}`,
  ogTitle: appConfig.truthlight.site.name,
  description: appConfig.truthlight.site.name,
  ogDescription: appConfig.truthlight.site.name,
  ogImage: appConfig.truthlight.site.ogImage,
  twitterCard: 'summary_large_image'
});
</script>
