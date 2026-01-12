<template>

  <!-- デフォルトページ用ヘッダー -->
  <header 
   v-if="variant === `default`"
  class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <!-- <a href="/" class="flex items-center gap-3">
        <span class="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-300 to-violet-400"></span>
        <span class="text-sm font-semibold tracking-wide">Truth Light</span>
      </a> -->

      <div><LayoutHeaderLogo :subtitle="subtitle" /></div>
      <div><LayoutHeaderNav :variant="props.variant" /></div>
      <div><LayoutHeaderToc /></div>

      <!-- <nav class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
        <a class="hover:text-white" href="/substances">Substances</a>
        <a class="hover:text-white" href="/harm-reduction">Harm Reduction</a>
        <a class="hover:text-white" href="/legal">Legal (JP)</a>
        <a class="hover:text-white" href="/articles">Articles</a>
      </nav> -->

      <div class="flex items-center gap-2">
        <a
          href="/about"
          class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          About
        </a>
        <a
          href="/substances"
          class="rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-violet-400/10 px-3 py-2 text-sm text-white hover:from-cyan-300/20 hover:to-violet-400/15"
        >
          Browse
        </a>
      </div>
    </div>
  </header>
  
  <!-- Substancesページ用ヘッダー -->
  <header v-else-if="props.variant === `substances`"
  class="w-full shrink-0 flex items-center bg-slate-800 z-40 border-teal-600 h-14 border-b">
    <div
      class="w-full relative flex flex-row justify-between items-center gap-2 px-4 md:px-6"
    >
      <div class="shrink"><LayoutHeaderLogo :subtitle="subtitle" :variant="props.variant" /></div>
      <div><LayoutHeaderNav :variant="props.variant" /></div>
      <div class="shrink-0"><LayoutHeaderToc /></div>
    </div>
  </header>

  <!-- 規制情報ページ用ヘッダー -->
  <header v-else="props.variant === `legal`" class="flex item-center bg-background/80 bg-slate-900 sticky z-40 backdrop-blur-lg border-teal-400 h-20 border-b">
    <div
      class="relative flex flex-row justify-between items-center gap-2 px-4 md:px-20 my-auto"
      :class="{
        'container': appConfig.truthlight.main.padded,
      }"
    >
      <div><LayoutHeaderLogo :subtitle="subtitle" /></div>
      <div><LayoutHeaderNav :variant="props.variant" /></div>
      <div><LayoutHeaderToc /></div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: "default" | "substances" | "legal",
}>()

console.log(`props.defaultの内容：${props.variant}`)

const headerClass = computed(() => {
  const base = "flex item-center bg-background/80 bg-slate-900 sticky z-40 backdrop-blur-lg border-teal-400"
  const variableClass =
    props.variant === "default"
    ? "h-20 border-b-4"
    : props.variant === "substances"
      ? "h-14 border-b"
      :props.variant === "legal"
        ? "h-20 border-b-4"
        : "h-20 border-b-4"
  return [base, variableClass].join(" ")
})

const subtitle = computed(() => {
  if (props.variant === "default") {
    return ""
  } else if (props.variant === "substances") {
    return "NPSデータベース(α版)"
  } else if (props.variant === "legal") {
    return ""
  } else {
    return ""
  }
})

const appConfig = useAppConfig();

const variant = computed(() => props.variant ?? "default")

const route = useRoute();

</script>
