<script setup lang="ts">
const props = defineProps<{
  substanceName?: string
}>()

const substanceName = props.substanceName ?? '薬物'
</script>

<template>
<div class="yumekawa-manga flex flex-row items-end justify-center w-full">
  <div class="flex flex-row items-center justify-center w-[70%] max-w-[520px]">
    <div class="flex flex-col flex-1 min-h-16 rounded-lg bg-[#FF9B51] px-3 py-2 items-center justify-center">
      <p class="m-0 text-white">{{ substanceName }}が止めれなくて困っていませんか？</p>
      <p class="m-0 text-white"><NuxtLink to="/readings/recovery/get-help" class="text-white">→→ {{ substanceName }}依存症からの回復方法について知る ←←</NuxtLink></p>
    </div>

    <div class="flex-none">
      <img
        src="/yumekawa-manga/fukidashi-right-h128px.png"
        alt="吹き出し"
        class="h-16 w-auto"
      />
    </div>
  </div>

  <div class="flex-none">
    <img
      src="/yumekawa-manga/yumekawa-ai-02-128px.png"
      alt="夢可愛アイ"
      class="w-16 h-16"
    />
  </div>
</div></template>