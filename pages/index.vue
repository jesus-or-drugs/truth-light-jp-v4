<template>
    <!-- Hero -->
    <section class="text-slate-100 bg-[#25343F]">
      <div class="mx-auto max-w-6xl px-6 py-16 grid gap-8 md:grid-cols-12">

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

    <!-- Harm Reduction-->
    <section class="flex flex-row items-start justify-end gap-4 max-w-6xl mx-auto mt-12 mb-12">
      <div class="w-1/4 flex-none">
        <h2 class="mb-8 custom-font-bold text-4xl">Harm Reduction</h2>
        <h3 class="mb-16 text-base text-slate-500">薬物使用に関するリスクと薬物使用したときの危害軽減法</h3>
        <div class="flex flex-row items-start justify-center">        
          <div class="h-10 flex items-baseline gap-2">
            <!-- 左ボタン -->
            <button
              type="button"
              class="hidden md:flex items-baseline z-30 h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('left', harmReductionCarouselRef)"
            >
              <img src="/ui/angle-small-left.png" class="h-10 w-10" alt="左にカルーセルを移動" />
            </button>
            <!-- 右ボタン -->
            <button
              type="button"
              class="hidden md:flex items-baseline z-30 h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('right', harmReductionCarouselRef)"
            >
              <img src="/ui/angle-small-right.png" class="h-10 w-10" alt="右にカルーセルを移動" />
            </button>
          </div>
        </div>

      </div>

      <div class="flex-initial w-3/4 relative mx-auto">
        <!-- 表示領域 -->
        <div
          ref="harmReductionCarouselRef"
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
      </div>
    </section>

    <!-- Recovery-->
    <section class="flex flex-row items-start justify-end gap-4 mx-auto max-w-6xl pb-14">
      <div class="w-1/4 flex-none">
        <h2 class="mb-8 custom-font-bold text-4xl">Recovery</h2>
        <h3 class="mb-16 text-base text-slate-500">薬物依存症からの回復・成長</h3>
        <div class="flex flex-row items-start justify-center">        
          <div class="h-10 flex items-baseline gap-2">
            <!-- 左ボタン -->
            <button
              type="button"
              class="hidden md:flex items-baseline z-30 h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('left', recoveryCarouselRef)"
            >
              <img src="/ui/angle-small-left.png" class="h-10 w-10" alt="左にカルーセルを移動" />
            </button>
            <!-- 右ボタン -->
            <button
              type="button"
              class="hidden md:flex items-baseline z-30 h-10 w-10 bg-white/90 hover:bg-[#FF9B51] hover:text-white"
              @click="scrollCarousel('right', recoveryCarouselRef)"
            >
              <img src="/ui/angle-small-right.png" class="h-10 w-10" alt="右にカルーセルを移動" />
            </button>
          </div>
        </div>
      </div>
      <div class="flex-initial w-3/4 relative mx-auto">
        <!-- 表示領域 -->
        <div
          ref="recoveryCarouselRef"
          class="mx-4 md:mx-0 no-scrollbar overflow-x-auto scroll-smooth"
        >
          <div
            class="flex flex-row gap-4"
          >
            <NuxtLink
              v-for="recoveryContent in recoveryFeeds"
              :key="recoveryContent.path"
              :to="recoveryContent.path"
              class="group block mb-8 shrink-0 basis-[calc(100%-3rem)] md:basis-[calc((100%-2rem)/3)] no-underline"
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
                  <h2 class="custom-font-bold mb-2">{{ recoveryContent.title }}</h2>
                  <p class="text-slate-500 text-s5">{{ recoveryContent.description }}</p>
                </div>
              </div>
              
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Truth Lightの基本理念 -->
    <section class="page-sections mx-auto max-w-6xl">
      <div class="w-[1152px] h-auto mb-8 px-48 py-16 bg-[#2e4454] rounded-3xl">
        <h2 class="mb-16 text-4xl text-slate-100 custom-font-black text-center">Truth Lightの基本理念</h2>

        <h3 class="mb-4 text-2xl text-slate-100 custom-font-black text-center">Mission</h3>
        <p>ダメ。ゼッタイ。を超えて薬物を乱用する人は必ずいることを認め
        その人たちと共存して生きていく世の中で変えていきます。
        違法流通や入手方法には関与せず、薬物の基本的情報や文化・歴史などのアーカイブ
        またハームリダクションと薬物教育のための公共的コミュニティを設立する。</p>

        <h3 class="mb-4 text-2xl text-slate-100 custom-font-black text-center">Vision</h3>
        <p>誰もアクセス可能な日本での精神活性物質のデータベースを運用していく。
        回復したアディクトのパーソナルストーリーなどで希望のバトンを渡していく
        キリスト教系教会、ダルク、ナルコティクス・アノニマスなど外部団体とも横の繋がりを構築していく。</p>

        <h3 class="mb-4 text-2xl text-slate-100 custom-font-black text-center">Value</h3>
        <p>
          Truth Lightでは依存症という疾患に対して様々な分野からメスを入れます。それが以下の5つのValuesです。<br />          
          神学的<br />
          社会学的<br />
          文化学<br />
          脳科学的<br />
          心理学的<br />
          薬理学的
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