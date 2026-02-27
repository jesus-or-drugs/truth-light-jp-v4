<template>
<div class="min-h-screen text-slate-100 antialiased">
  <main>
    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-6 pb-10 pt-16">
      <div class="grid gap-8 md:grid-cols-12">
        <div class="md:col-span-7">
          <p class="text-xs font-semibold tracking-[0.2em] text-cyan-300/90">
            このページは工事中なので使えないです。
          </p>

          <h1 class="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            すべての人に
            <span class="text-slate-300">薬物に対する正しい情報と回復への道を提供します。</span>
          </h1>

          <p class="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
            新規精神活性物質(NPS)のファクトシート・規制情報
          </p>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <label class="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:w-[28rem]">
              <svg class="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input
                class="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                placeholder="Search substances (e.g., MDPV, 4F-MPH, α-PVP)…"
                type="search"
              />
            </label>

            <div class="flex gap-2">
              <a
                href="/substances"
                class="inline-flex items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 to-violet-400/10 px-4 py-3 text-sm font-medium text-white hover:from-cyan-300/25 hover:to-violet-400/15"
              >
                Browse categories
              </a>
              <a
                href="/start"
                class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 hover:bg-white/10"
              >
                Start here
              </a>
            </div>
          </div>

          <p class="mt-3 text-xs text-slate-400">
            Examples: <span class="text-slate-300">MDMB-4en-PINACA</span>, <span class="text-slate-300">1cP-LSD</span>, <span class="text-slate-300">3-MMC</span>
          </p>
        </div>

        <!-- Side panel -->
        <aside class="md:col-span-5">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold">Today</p>
                <p class="mt-1 text-sm text-slate-300">
                  Latest additions & edits.
                </p>
              </div>
              <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                v0.alpha
              </span>
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

    <!-- Quick entry -->
    <section class="mx-auto max-w-6xl px-6 pb-14">
      <div class="grid gap-4 md:grid-cols-4">
        <a href="/categories" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm font-semibold">Browse by category</p>
          <p class="mt-2 text-sm text-slate-300">Stimulants, Psychedelics, Dissociatives…</p>
        </a>

        <a href="/tags/risk" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm font-semibold">Browse by risk</p>
          <p class="mt-2 text-sm text-slate-300">Overdose, dependence, neurotoxicity tags.</p>
        </a>

        <a href="/legal" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm font-semibold">Legal status (JP)</p>
          <p class="mt-2 text-sm text-slate-300">Understand classification and updates.</p>
        </a>

        <a href="/start" class="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p class="text-sm font-semibold">Start here</p>
          <p class="mt-2 text-sm text-slate-300">If you’re new, begin with essentials.</p>
        </a>
      </div>
    </section>

    <!-- Trending + Updated -->
    <section class="mx-auto max-w-6xl px-6 pb-16">
      <div class="grid gap-6 md:grid-cols-12">
        <div class="md:col-span-7">
          <div class="flex items-end justify-between">
            <h2 class="text-lg font-semibold">Trending</h2>
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
          <h2 class="text-lg font-semibold">Recently updated</h2>

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
        <h3 class="text-sm font-semibold">Important note</h3>
        <p class="mt-2 text-sm text-slate-300">
          Truth Light is for education and harm reduction. We do not provide purchasing information.
          If you or someone is in immediate danger, contact local emergency services.
        </p>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/10">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <p class="text-sm font-semibold">Truth Light</p>
          <p class="mt-2 text-sm text-slate-400">
            Evidence-informed substance knowledge base and harm reduction resources.
          </p>
        </div>

        <div class="text-sm text-slate-300">
          <p class="font-semibold text-slate-100">Links</p>
          <div class="mt-2 space-y-2">
            <a class="block hover:text-white" href="/about">About</a>
            <a class="block hover:text-white" href="/terms">Terms</a>
            <a class="block hover:text-white" href="/disclaimer">Disclaimer</a>
          </div>
        </div>

        <div class="text-sm text-slate-300">
          <p class="font-semibold text-slate-100">Transparency</p>
          <div class="mt-2 space-y-2">
            <a class="block hover:text-white" href="/sources">Data sources</a>
            <a class="block hover:text-white" href="/updates">Update policy</a>
            <a class="block hover:text-white" href="/contact">Contact</a>
          </div>
        </div>
      </div>

      <p class="mt-10 text-xs text-slate-500">
        © <span id="year"></span> Truth Light. All rights reserved.
      </p>
    </div>
  </footer>


</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" })

const appConfig = useAppConfig()
useHead({
  titleTemplate: null,
})
useSeoMeta({
  title: appConfig.truthlight?.site?.name ?? `Truth Light`,
  description: appConfig.truthlight?.site?.description ?? ``,
})

</script>