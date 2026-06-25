<template>
  <main
    id="__nuxtContent"
  >
    <div class="mb-12 w-[100%] h-[250px] bg-[#25343F]">
      <div class="flex flex-col items-center justify-center mx-auto max-w-6xl h-[100%]">
        <h1 class="custom-font-bold text-4xl tracking-wider text-[#EAEFEF] text-center">
          {{ page?.title ?? '' }}
        </h1>
        <p></p>
      </div>
    </div>
    
    <div
      class="prose
      mx-auto max-w-6xl px-4
      md:flex md:flex-row-reverse md:gap-6"
    >
      <!-- TOC -->
      <aside
        v-if="page?.body?.toc?.links?.length"
        class="w-full flex-none
          md:sticky md:w-1/4"
        aria-label="Table of contents"
      >
        <nav class="rounded-lg border p-4">
          <p class="mb-3 text-sm font-semibold">目次</p>

          <ul class="space-y-2 text-sm">
            <li v-for="link in page.body.toc.links" :key="link.id">
              <a :href="`#${link.id}`" class="block hover:underline">
                {{ link.text }}
              </a>

              <ul
                v-if="link.children?.length"
                class="mt-2 ml-4 space-y-1"
              >
                <li v-for="child in link.children" :key="child.id">
                  <a :href="`#${child.id}`" class="block hover:underline">
                    {{ child.text }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main text -->
      <article
        class="flex-initial w-full
          md:w-3/4"
      >
        <ContentRenderer v-if="page" :value="page" />  
      </article>
    </div>

  </main>
</template>

<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

const appConfig = useAppConfig()

const route = useRoute()
const path = computed(() => withoutTrailingSlash(route.path) || '/')

const { data: page } = await useAsyncData(
  () => `readings:${path.value}`,
  () => queryCollection('readings').path(path.value).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: `Page not found: ${path.value}` })
}

type HeadMetaItem = {
  name?: string
  property?: string
  content?: string
  [key: string]: string | undefined
}

type HeadLinkItem = {
  rel?: string
  href?: string
  [key: string]: string | undefined
}

const headMeta = computed<HeadMetaItem[]>(() => {
  return (page.value?.seo?.meta ?? []) as HeadMetaItem[]
})

const headLink = computed<HeadLinkItem[]>(() => {
  return (page.value?.seo?.link ?? []) as HeadLinkItem[]
})

const siteUrl = appConfig.truthlight.site.url
const defaultOgImage = appConfig.truthlight.site.ogImage
const ogImage = computed(() => {
  return page.value?.ogImage
    ? new URL(page.value.ogImage, siteUrl).toString()
    : new URL(defaultOgImage, siteUrl).toString()
})

// v3標準: seo は useSeoMeta と組み合わせる想定 :contentReference[oaicite:3]{index=3}
useSeoMeta({
  title: () => page.value?.seo?.title ?? page.value?.title,
  ogTitle: () => page.value?.seo?.title ?? page.value?.title,
  description: () => page.value?.seo?.description ?? page.value?.description,
  ogDescription: () => page.value?.seo?.description ?? page.value?.description,
  ogImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => page.value?.seo?.title ?? page.value?.title,
  twitterDescription: () => page.value?.seo?.description ?? page.value?.description,
  twitterImage: () => ogImage.value,
})

// seo.meta / seo.link みたいな「配列系」は useHead 側に流す
useHead(() => ({
  meta: headMeta.value,
  link: headLink.value,
}))
</script>