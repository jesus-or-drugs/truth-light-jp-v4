<template>
  <!-- Substancesページ用ヘッダー -->
  <header 
   v-if="variant === `substances`"
   class="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur">
    <div class="relative mx-auto px-10 py-4 flex flex-row items-center justify-between">
      <div><LayoutHeaderLogo :subtitle="subtitle" :variant="variant" /></div>
      <div><LayoutHeaderNav :variant="variant" /></div>
      <div class=""><LayoutHeaderSocialLink /></div>
    </div>

    <div
      v-show="open"
      class="fixed inset-0 z-40 bg-black/20 md:hidden"
      @click="close"
      aria-hidden="true"
    ></div>
  </header>

  <!-- その他ヘッダー -->
  <header 
   v-else
   class="sticky top-0 z-50 border-b border-white/10 bg-slate-900/70 backdrop-blur">
    <div class="relative mx-auto px-6 py-4 flex flex-row max-w-6xl items-center justify-between">

      <div class="static"><LayoutHeaderLogo :subtitle="subtitle" /></div>
      <div><LayoutHeaderNav :variant="variant" /></div>
      <div><LayoutHeaderSocialLink /></div>
      
    </div>

    <div
      v-show="open"
      class="fixed inset-0 z-40 bg-black/20 md:hidden"
      @click="close"
      aria-hidden="true"
    ></div>
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
const variant = computed(() => props.variant ?? "default")


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

const route = useRoute();

</script>
