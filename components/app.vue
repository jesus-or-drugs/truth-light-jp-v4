<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <LayoutBanner v-if="config.banner.enable" />
  <LayoutHeader />
  <div>
    <aside>
      <LayoutAside :is-mobile="false" />
    </aside>
  </div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import Toaster from 'shadcn-docs-nuxt/components/ui/toast/Toaster.vue';

const { page } = useContent();
const config = useConfig();
const route = useRoute();
const { themeClass, radius, setClassTheme } = useThemes();

const baseRouteName = computed(() => useRouteBaseName()(route));

useSeoMeta({
  description: config.value.site.description,
  ogDescription: config.value.site.description,
  twitterCard: 'summary_large_image',
});

useHead({
  bodyAttrs: {
    class: themeClass.value,
    style: `--radius: ${radius.value}rem;`,
  },
});

onMounted(() => {
  setClassTheme();
});
</script>