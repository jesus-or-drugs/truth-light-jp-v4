<template>

  <!-- デフォルトページ用ヘッダー -->
  <header 
   v-if="variant === `default`"
   class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
    <div class="mx-auto flex flex-row max-w-6xl items-center justify-between px-6 py-4 relative">

      <!-- タイトル -->
      <div>
        <LayoutHeaderLogo :subtitle="subtitle" />
      </div>

      <div><LayoutHeaderNav :variant="props.variant" /></div>
      <div><LayoutHeaderToc /></div>


      <!-- <div class="flex items-center gap-2">
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
      </div> -->
    </div>

    <div
      v-show="open"
      class="fixed inset-0 z-40 bg-black/20 md:hidden"
      @click="close"
      aria-hidden="true"
    ></div>
  </header>

  <!-- Substancesページ用ヘッダー -->
  <header 
   v-else-if="variant === `substances`"
   class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
    <div class="mx-auto flex flex-row items-center justify-between px-6 py-4 relative">
      <!-- <a href="/" class="flex items-center gap-3">
        <span class="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-300 to-violet-400"></span>
        <span class="text-sm font-semibold tracking-wide">Truth Light</span>
      </a> -->

      <!-- タイトル -->
      <div><LayoutHeaderLogo :subtitle="subtitle" :variant="props.variant" /></div>

      <!-- md以上: 横並びナビ -->
      <nav class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
        <a class="hover:text-white" href="/substances">NPSデータベース(α版)</a>
        <a class="hover:text-white" href="/info">Purpose</a>
        <a class="hover:text-white" href="/info/legal">法規制</a>
        <!-- <a class="hover:text-white" href="/articles">Articles</a> -->
      </nav>

      <!-- md未満: メニューボタン -->
      <button
        class="md:hidden inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
        @click="toggle"
        :aria-expanded="open"
        aria-controls="mobile-menu"
      >
        <span class="font-medium">Menu</span>
        <span aria-hidden="true">{{ open ? "✕" : "☰" }}</span>
      </button>

      <!-- ここが肝: absoluteで“浮く”メニュー -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0"
        enter-to-class="opacity-100 translate-y-0 max-h-[70vh]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-[70vh]"
        leave-to-class="opacity-0 -translate-y-2 max-h-0"
      >
        <div
          v-show="open"
          id="mobile-menu"
          class="md:hidden absolute left-0 right-0 top-full border-t bg-slate-700/95 backdrop-blur shadow-lg overflow-hidden"
          @click.stop
        >
          <div class="px-4 py-3 flex flex-col gap-3">
            <NuxtLink to="/substances" class="py-2" @click="close">Substances</NuxtLink>
            <NuxtLink to="/about" class="py-2" @click="close">About</NuxtLink>
            <NuxtLink to="/terms" class="py-2" @click="close">Terms</NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- <div><LayoutHeaderNav :variant="props.variant" /></div> -->
      <div><LayoutHeaderToc /></div>


      <!-- <div class="flex items-center gap-2">
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
      </div> -->
    </div>

    <div
      v-show="open"
      class="fixed inset-0 z-40 bg-black/20 md:hidden"
      @click="close"
      aria-hidden="true"
    ></div>
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
import { ref } from "vue"
const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

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
