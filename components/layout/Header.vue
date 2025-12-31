<template>

  <!-- デフォルトページ用ヘッダー -->
  <header v-if="props.variant === `default`" class="flex item-center bg-background/80 bg-slate-900 sticky z-40 backdrop-blur-lg border-teal-400 h-20 border-b-4">
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
  
  <!-- Substancesページ用ヘッダー -->
  <header v-else-if="props.variant === `substances`"
  class="shrink-0 flex item-center bg-slate-800 z-40 border-teal-600 h-14 border-b">
    <div
      class="w-full relative flex flex-row justify-between items-center gap-2 px-4 md:px-6 my-auto"
    >
      <div class="w-full shrink-0"><LayoutHeaderLogo :subtitle="subtitle" :variant="props.variant" /></div>
      <div><LayoutHeaderNav :variant="props.variant" /></div>
      <div><LayoutHeaderToc /></div>
    </div>
  </header>
  <header v-else="props.variant === `legal`" class="flex item-center bg-background/80 bg-slate-900 sticky z-40 backdrop-blur-lg border-teal-400 h-20 border-b-4">
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
    return "向精神薬データベース(β)"
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
