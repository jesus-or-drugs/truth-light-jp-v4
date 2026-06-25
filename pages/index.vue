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
          <div class="rounded-2xl border border-[#BFC9D1]/50 bg-[#DCE3E8] bg-gradient-to-b from-white/20 to-[#DCE3E8]  p-5">
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

              <a href="/legal" class="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <p class="text-sm font-medium">Legal status (Japan)</p>
                <p class="mt-1 text-xs text-slate-400">Scheduled substances, narcotics, psychotropics…</p>
              </a>

              <a href="/harm-reduction" class="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <p class="text-sm font-medium">Harm reduction basics</p>
                <p class="mt-1 text-xs text-slate-400">Overdose response, interactions, red flags.</p>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- News-->
    <section class="mx-auto max-w-6xl px-6 pb-14">
      <h2 class="custom-font-bold text-4xl">BASICS</h2>
      <div class="grid gap-4 md:grid-cols-4">
        <a href="/categories" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm custom-font-bold">Browse by category</p>
          <p class="mt-2 text-sm text-slate-300">Stimulants, Psychedelics, Dissociatives…</p>
        </a>

        <a href="/tags/risk" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm custom-font-bold">Browse by risk</p>
          <p class="mt-2 text-sm text-slate-300">Overdose, dependence, neurotoxicity tags.</p>
        </a>

        <a href="/legal" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm custom-font-bold">Legal status (JP)</p>
          <p class="mt-2 text-sm text-slate-300">Understand classification and updates.</p>
        </a>

        <a href="/start" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm custom-font-bold">Start here</p>
          <p class="mt-2 text-sm text-slate-300">If you’re new, begin with essentials.</p>
        </a>
      </div>
    </section>

    <!-- Trending + Updated -->
    <section class="mx-auto max-w-6xl px-6 pb-14">
      <div class="grid gap-6 md:grid-cols-12">
        <div class="md:col-span-7">
          <div class="flex items-end justify-between">
            <h2 class="custom-font-bold text-4xl">TRENDING</h2>
            <a class="text-sm text-slate-300 hover:text-white" href="/substances">View all</a>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <!-- Card item -->
            <a href="/substances/mdpv" class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium">MDPV</p>
                <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">stimulant</span>
              </div>
              <p class="mt-2 text-xs text-slate-400">High risk: compulsive redosing, agitation, paranoia.</p>
            </a>

            <a href="/substances/alphapvp" class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium">α-PVP</p>
                <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">stimulant</span>
              </div>
              <p class="mt-2 text-xs text-slate-400">High risk: overstimulation, psychosis, hyperthermia.</p>
            </a>

            <a href="/substances/mdmb-4en-pinaca" class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium">MDMB-4en-PINACA</p>
                <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">cannabinoid</span>
              </div>
              <p class="mt-2 text-xs text-slate-400">Severe adverse events reported with synthetic cannabinoids.</p>
            </a>

            <a href="/substances/1cp-lsd" class="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium">1cP-LSD</p>
                <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">psychedelic</span>
              </div>
              <p class="mt-2 text-xs text-slate-400">Set/setting, dose uncertainty, contraindications.</p>
            </a>
          </div>
        </div>

        <div class="md:col-span-5">
          <h2 class="custom-font-bold text-4xl">NEWS</h2>

          <div class="mt-4 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/5">
            <a href="/substances/4f-mph" class="block p-4 hover:bg-white/10">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium">4F-MPH</p>
                <p class="text-xs text-slate-400">Jan 12</p>
              </div>
              <p class="mt-1 text-xs text-slate-400">Added pharmacology notes + sources.</p>
            </a>

            <a href="/legal" class="block p-4 hover:bg-white/10">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium">Legal (JP)</p>
                <p class="text-xs text-slate-400">Jan 10</p>
              </div>
              <p class="mt-1 text-xs text-slate-400">Scheduled substances list refreshed.</p>
            </a>

            <a href="/harm-reduction/interactions" class="block p-4 hover:bg-white/10">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium">Interactions</p>
                <p class="text-xs text-slate-400">Jan 8</p>
              </div>
              <p class="mt-1 text-xs text-slate-400">New section: depressants + respiratory risk.</p>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="mx-auto max-w-6xl px-6 pb-16">
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <h3 class="text-sm custom-font-bold">Important note</h3>
        <p class="mt-2 text-sm text-slate-300">
          Truth Light is for education and harm reduction. We do not provide purchasing information.
          If you or someone is in immediate danger, contact local emergency services.
        </p>
      </div>
    </section>
</template>

<script setup lang="ts">
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

</script>