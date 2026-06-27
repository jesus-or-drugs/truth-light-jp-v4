<template>
    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-6 pb-16 pt-16">
      <div class="grid gap-8 md:grid-cols-12">

        <!-- Mission -->
        <div class="md:col-span-8">
          <h1 class="mt-3 text-6xl custom-font-bold tracking-tight leading-[1.25]">
            Truth Lightは薬物依存の<br /><span class="text-[#FF9B51]">ハームリダクション</span>から<br /><span class="text-[#FF9B51]">リカバリー</span>まで正しい情報を提供します。
          </h1>
        </div>

        <!-- Side panel -->
        <aside class="md:col-span-4">
          <div class="p-5 rounded-2xl border border-[#BFC9D1]/25 bg-gradient-to-b from-[#EAEFEF] to-[#BFC9D1]/50">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm custom-font-bold">ニュース</p>
                <p class="mt-1 text-sm text-slate-300">
                  最新の法律改正・サイト情報更新
                </p>
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <a href="/updates" class="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <p class="text-sm font-medium">Recently updated</p>
                <p class="mt-1 text-xs text-slate-400">See change log and data sources.</p>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- BASICS-->
    <section class="mx-auto max-w-6xl px-6 pb-14">
      <h2 class="mb-8 mt-2 pl-2 pb-2 border-b-2 border-[#25343F] custom-font-bold text-4xl">BASICS</h2>
      <div
        class="relative mx-auto"
      >
        <!-- 左ボタン -->
        <button
          type="button"
          class="hidden md:flex items-center justify-center absolute -left-12 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 shadow-md hover:bg-[#FF9B51] hover:text-white"
          @click="scrollCarousel('left')"
        >
          <img src="/ui/angle-small-left.png" class="h-10 w-10" alt="左にカルーセルを移動" />
        </button>

        <!-- 表示領域 -->
        <div
          ref="carouselRef"
          class="mx-4 md:mx-0 no-scrollbar overflow-x-auto scroll-smooth"
        >
          <div
            class="flex flex-row gap-4"
          >
            <NuxtLink
              v-for="basicsContent in basicsFeeds"
              :key="basicsContent.path"
              :to="basicsContent.path"
              class="group block mb-8 shrink-0 basis-[calc(100%-3rem)] md:basis-[calc((100%-2rem)/3)] no-underline"
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
          class="hidden md:flex items-center justify-center absolute -right-12 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 shadow-md hover:bg-[#FF9B51] hover:text-white"
          @click="scrollCarousel('right')"
        >
          <img src="/ui/angle-small-right.png" class="h-10 w-10" alt="右にカルーセルを移動" />
        </button>
      </div>
    </section>

    <!-- Trending + Updated -->
    <section class="mx-auto max-w-6xl px-6 pb-14">
      <div class="grid gap-6 md:grid-cols-12">
        <div class="md:col-span-7">
            <h2 class="flex items-end justify-between mb-8 mt-2 pl-2 pb-2 border-b-2 border-[#25343F] custom-font-bold text-4xl "><span>TRENDING</span><a class="text-sm text-slate-300 hover:text-white" href="/substances">View all</a></h2>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <!-- Card item -->
            <a href="/substances/mdpv" class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium">MDPV</p>
                <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">stimulant</span>
              </div>
              <p class="mt-2 text-xs text-slate-400">High risk: compulsive redosing, agitation, paranoia.</p>
            </a>
          </div>
          
        </div>

        <div class="md:col-span-5">
          <h2 class="mb-8 mt-2 pl-2 pb-2 border-b-2 border-[#25343F] custom-font-bold text-4xl">NEWS</h2>

          <div class="mt-4 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/5">

            <ContentNoteFeed />

          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="mx-auto max-w-6xl px-6 pb-16">
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <h3 class="text-sm custom-font-bold">Important note</h3>
        <p class="mt-2 text-sm text-slate-300">
          Truth Lightの情報は純粋に教育目的や危害軽減のためであり、あらゆる乱用性薬物の使用を推奨するものではありません。<br />
          また生命に関わる緊急事態においては緊急搬送や病院の受診を強くお勧めいたします。
        </p>
      </div>
    </section>
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
import ContentNoteFeed from '~/components/content/ContentNoteFeed.vue'

definePageMeta({ layout: "default" })

const appConfig = useAppConfig()

useSeoMeta({
  title: appConfig.truthlight?.site?.name ?? '',
  ogTitle: appConfig.truthlight?.site?.topPageName ?? '',
  description: appConfig.truthlight?.site?.topPageDescription ?? '',
  ogDescription: appConfig.truthlight?.site?.topPageDescription ?? '',
  ogImage: appConfig.truthlight?.site?.ogImage ?? '',
  twitterCard: 'summary_large_image',
})

const { data: basicsFeeds } = await useAsyncData('basics-feeds', async () => {
  const contents = await queryCollection('readings')
    .order('updatedAt', 'DESC')
    .all()

  console.log('Contentsの中身！：', contents)

  return contents.filter((content) =>
    content.path.startsWith('/readings/basics')
  )
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