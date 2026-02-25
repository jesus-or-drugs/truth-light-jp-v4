<template>
  <div class="bg-slate-800 text-slate-100 custom-font-normal">
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
    title: `${site.name} - ${site.description}`,
    link: [
      { rel: `preconnect`, href: `https://fonts.googleapis.com`},
      { rel: `preconnect`, href: `https://fonts.gstatic.com`, crossorigin:`anonymous`},
      { rel: `stylesheet`, href: `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Outfit:wght@100..900&display=swap`}
    ],
  })

</script>