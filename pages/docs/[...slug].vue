<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

const route = useRoute()
const path = withoutTrailingSlash(route.path) || '/'

const { data: page } = await useAsyncData(path, () =>
  queryCollection('docs').path(path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: `Page not found: ${path}` })
}
</script>

<template>
  <main class="prose prose-invert max-w-none">
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>