<template>
  <main>

    <section class="mx-auto max-w-6xl px-6 pb-10 pt-16">
      <div class="mb-16">
        <h1 class="mb-8 text-3xl md:text-5xl custom-font-bold tracking-tight text-center">
          日本版Erowidを目指して。
        </h1>
        <h2 class="w-[60%] mx-auto text-lg md:text-xl text-[#25343F]/70 tracking-tight leading-12 text-center text-balance leading-50">
          Truth Lightはあらゆる精神活性物質の作用・副作用・危険性<br>そして薬物依存症からの回復の方法まで正しい情報を提供します。
        </h2>
      </div>
    </section>

    <section>
      <p class="mb-8 text-center text-3xl tracking-widest custom-font-bold">Basics</p>

      <div
        class="relative mx-auto max-w-[66rem]"
      >
        <!-- 左ボタン -->
        <button
          type="button"
          class="absolute -left-12 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-[#FF9B51] hover:text-white"
          @click="scrollCarousel('left')"
        >
          <img src="/ui/angle-small-left.png" class="h-10 w-10" alt="左にカルーセルを移動" />
        </button>

        <!-- 表示領域 -->
        <div
          ref="carouselRef"
          class="no-scrollbar overflow-x-auto scroll-smooth"
        >
          <div
            class="flex flex-row gap-4"
          >
            <NuxtLink
              v-for="basicsContent in basicsFeeds"
              :key="basicsContent.path"
              :to="basicsContent.path"
              class="group block mb-8 shrink-0 basis-[calc((100%-2rem)/3)]"
            >

              <div class="overflow-hidden border border-[#BFC9D1]/70 rounded-md">
                <div class="overflow-hidden">
                  <img
                    :src="basicsContent.ogImage"  
                    :alt="basicsContent.title"
                    class="transition-transform duration-300 ease-out group-hover:scale-125"
                  />
                </div>
                <div class="p-4">
                  <h2 class="custom-font-bold mb-2">{{ basicsContent.title }}</h2>
                  <p class="text-slate-500 text-s5">{{ basicsContent.description }}</p>
                </div>
              </div>

            </NuxtLink>
          </div>
        </div>
        <!-- 右ボタン -->
        <button
          type="button"
          class="absolute -right-12 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-[#FF9B51] hover:text-white"
          @click="scrollCarousel('right')"
        >
          <img src="/ui/angle-small-right.png" class="h-10 w-10" alt="右にカルーセルを移動" />
        </button>
      </div>

    </section>

  </main>

</template>

<style lang="css" scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

<script setup lang="ts">
import ContentKetcherFrame from '~/components/content/ContentKetcherFrame.vue'

definePageMeta({ layout: "default" })

const appConfig = useAppConfig()
const topPageDescription = appConfig.truthlight?.site?.topPageDescription ?? ``

useSeoMeta({
  description: topPageDescription,
  ogDescription: topPageDescription,
})

const route = useRoute()

const { data: basicsFeeds } = await useAsyncData('basics-feeds', () => {
  return queryCollection('docs')
    .where('path', 'LIKE', '/docs/basics/%')
    .where('path', '<>', '/docs/basics')
    .select('title', 'description', 'path', 'createdAt', 'updatedAt', 'ogImage')
    .order('updatedAt', 'DESC')
    .all()
})

const carouselRef = ref<HTMLElement | null>(null)

const scrollCarousel = (direction: 'left' | 'right') => {
  if (!carouselRef.value) return

  carouselRef.value.scrollBy({
    left: direction === 'right' ? 360 : -360,
    behavior: 'smooth',
  })
}

</script>