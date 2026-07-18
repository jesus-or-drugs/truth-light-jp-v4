<template>
    <!-- Hero -->
    <section class="mb-12 text-slate-100 bg-[#25343F]">
      <div
        class="mx-auto max-w-6xl px-6 py-16 grid gap-8
          md:grid-cols-12"
      >
        <!-- Mission -->
        <div class="md:col-span-8">
          <h1 class="mt-3 text-xl text-center md:text-left md:text-6xl custom-font-bold tracking-tight leading-snug">
            Truth Lightは薬物依存の<br />
            <strong class="text-[#FF9B51]">ハームリダクション</strong>から<br />
            <strong class="text-[#FF9B51]">リカバリー</strong>まで正しい情報を提供します。
          </h1>
        </div>
      </div>
    </section>

    <!-- Harm Reduction-->
    <section class="flex flex-col gap-4 max-w-6xl mx-auto mb-12
       md:flex-row md:items-start md:justify-end"
    >
      <div
        class="px-4
          md:w-1/4 md:flex-none md:px-0"
      >
        <h2
          class="custom-font-bold text-lg
            md:mb-8 md:text-4xl"
        >
          Harm Reduction
        </h2>
        <h3
          class="text-sm text-slate-500
            md:mb-16 md:text-base"
        >
          薬物使用に関するリスクと薬物使用したときの危害軽減法
        </h3>

        <div
          class="hidden
            md:flex md:flex-row md:items-start md:justify-center"
        >
          <div class="flex items-baseline gap-2">
            <!-- 左ボタン -->
            <button
              type="button"
              class="rounded-md h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('left', harmReductionCarouselRef)"
            >
              <img src="/ui/angle-small-left.png" class="h-10 w-10" alt="左にカルーセルを移動" />
            </button>
            <!-- 右ボタン -->
            <button
              type="button"
              class="rounded-md h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('right', harmReductionCarouselRef)"
            >
              <img src="/ui/angle-small-right.png" class="h-10 w-10" alt="右にカルーセルを移動" />
            </button>
          </div>
        </div>

      </div>

      <div
        class="px-4
          md:flex-initial md:w-3/4 md:px-0">
        <!-- 表示領域 -->
        <div
          ref="harmReductionCarouselRef"
          class="no-scrollbar overflow-x-auto scroll-smooth"
        >
          <div
            class="flex flex-row gap-4"
          >
            <NuxtLink
              v-for="basicsContent in basicsFeeds"
              :key="basicsContent.path"
              :to="basicsContent.path"
              class="group block mb-8 shrink-0 basis-[calc(100%-2rem)] no-underline
                md:basis-[calc((100%-2rem)/3)]"
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
                  <h2 class="mb-2 custom-font-bold text-xs md:text-sm">{{ basicsContent.title }}</h2>
                  <p class="text-slate-500 text-xs md:text-sm">{{ basicsContent.description }}</p>
                </div>
              </div>

            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Recovery-->
    <section class="flex flex-col gap-4 max-w-6xl mx-auto mb-12
       md:flex-row md:items-start md:justify-end"
    >
      <div
        class="px-4
          md:w-1/4 md:flex-none md:px-0"
      >
        <h2
          class="custom-font-bold text-lg
            md:mb-8 md:text-4xl"
        >
          Recovery
        </h2>
        <h3
          class="text-sm text-slate-500
            md:mb-16 md:text-base"
        >
          薬物依存症からの回復・成長
        </h3>

        <div
          class="hidden
            md:flex md:flex-row md:items-start md:justify-center"
        >
          <div class="flex items-baseline gap-2">
            <!-- 左ボタン -->
            <button
              type="button"
              class="rounded-md h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('left', recoveryCarouselRef)"
            >
              <img src="/ui/angle-small-left.png" class="h-10 w-10" alt="左にカルーセルを移動" />
            </button>
            <!-- 右ボタン -->
            <button
              type="button"
              class="rounded-md h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('right', recoveryCarouselRef)"
            >
              <img src="/ui/angle-small-right.png" class="h-10 w-10" alt="右にカルーセルを移動" />
            </button>
          </div>
        </div>
      </div>

      <div
        class="px-4
          md:flex-initial md:w-3/4 md:px-0">
        <!-- 表示領域 -->
        <div
          ref="recoveryCarouselRef"
          class="no-scrollbar overflow-x-auto scroll-smooth"
        >
          <div
            class="flex flex-row gap-4"
          >
            <NuxtLink
              v-for="recoveryContent in recoveryFeeds"
              :key="recoveryContent.path"
              :to="recoveryContent.path"
              class="group block mb-8 shrink-0 basis-[calc(100%-2rem)] no-underline
                md:basis-[calc((100%-2rem)/3)]"
            >

              <div class="overflow-hidden border border-[#BFC9D1]/70 rounded-md">
                <div class="overflow-hidden">
                  <img
                    :src="recoveryContent.ogImage"  
                    :alt="recoveryContent.title"
                    class="transition-transform duration-300 ease-out group-hover:scale-125"
                  />
                </div>
                <div class="p-4">
                  <h2 class="mb-2 custom-font-bold text-xs md:text-sm">{{ recoveryContent.title }}</h2>
                  <p class="text-slate-500 text-xs md:text-sm">{{ recoveryContent.description }}</p>
                </div>
              </div>
              
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Truth Lightの基本理念 -->
    <section class="page-sections mx-auto mb-12 px-4 max-w-6xl md:px-0">
      <div class="w-full h-auto p-4 md:p-12 bg-[#2e4454] rounded-3xl">
        <h2 class="mb-12 text-4xl text-slate-100 custom-font-black text-center">Truth Lightの基本理念</h2>

        <h3 class="mb-4 text-2xl text-slate-100 custom-font-black text-center">Mission</h3>
        <p>ダメ。ゼッタイ。を超えて薬物を乱用する人は必ずいることを認め
        その人たちと共存して生きていく世の中で変えていきます。
        違法流通や入手方法には関与せず、薬物の基本的情報や文化・歴史などのアーカイブ
        またハームリダクションと薬物教育のための公共的コミュニティを設立する。</p>

        <h3 class="mb-4 text-2xl text-slate-100 custom-font-black text-center">Vision</h3>
        <p>
        1. 誰もアクセス可能な日本での規制物質のデータベースを運用していく。<br />
        2. 重要度が高い物質については専門の記事を執筆する。<br />
        3. 海外のハームリダクション系サイト(Erowid, Bluelightsなど)と関係性を築き上げていく。<br />
        4. 回復したアディクトのパーソナルストーリーなどで希望のバトンを渡していく<br />
        5. キリスト教系教会、ダルク、ナルコティクス・アノニマスなど外部団体とも横の繋がりを構築していく。<br />
        6. アディクトの卓越したセンスを活かした生き直しを実現できる場所を創る。</p>

        <h3 class="mb-4 text-2xl text-slate-100 custom-font-black text-center">Value</h3>
        <p>
          Truth Lightでは薬物について以下の5つのValuesを記録していきます。<br />
        </p>
        <p class="flex justify-between">
          <strong>薬理</strong>
          <strong>リスク</strong>
          <strong>歴史</strong>
          <strong>文化</strong>
          <strong>回復</strong>
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

  return contents.filter((content) =>
    content.path.startsWith('/readings/basics')
  )
})

const { data: recoveryFeeds } = await useAsyncData('recovery-feeds', async() => {
  const contents = await queryCollection('readings')
    .order('updatedAt', 'DESC')
    .all()

  return contents.filter((content) =>
    content.path.startsWith('/readings/recovery')
  )
})

const harmReductionCarouselRef = ref<HTMLElement | null>(null)
const recoveryCarouselRef = ref<HTMLElement | null>(null)

const scrollCarousel = (direction: 'left' | 'right', eleRef: HTMLElement | null) => {
  console.log('eleRef.valueの内容' + eleRef)

  if (!eleRef) return

  eleRef.scrollBy({
    left: direction === 'right' ? 360 : -360,
    behavior: 'smooth',
  })
}
</script>