<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

definePageMeta({ layout: 'default' })

const route = useRoute()
const path = computed(() => withoutTrailingSlash(route.path) || '/')

const { data: page } = await useAsyncData(
  () => `docs:${path.value}`,
  () => queryCollection('docs').path(path.value).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: `Page not found: ${path.value}` })
}

// v3標準: seo は useSeoMeta と組み合わせる想定 :contentReference[oaicite:3]{index=3}
useSeoMeta({
  title: () => page.value?.seo?.title ?? page.value?.title,
  description: () => page.value?.seo?.description ?? page.value?.description,
})

// seo.meta / seo.link みたいな「配列系」は useHead 側に流す
useHead({
  meta: () => page.value?.seo?.meta ?? [],
  link: () => page.value?.seo?.link ?? [],
})
</script>

<template>
  <main class="prose">
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>